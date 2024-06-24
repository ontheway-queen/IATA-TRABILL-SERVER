import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../common/utils/errors/customError';
import {
  IBalanceTransfer,
  IBalanceTransferReqBody,
  IOnlineTrxnCharge,
} from '../../types/account.interfaces';

class AddBalanceTrasnfer extends AbstractServices {
  constructor() {
    super();
  }

  public addBTransfer = async (req: Request) => {
    const {
      transfer_from_id,
      transfer_to_id,
      transfer_amount,
      transfer_created_by,
      transfer_charge,
      transfer_date,
      transfer_note,
    } = req.body as IBalanceTransferReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const voucher_no = await this.generateVoucher(req, 'BT');

      let lastBalance_from = await conn.getAccountLastBalance(transfer_from_id);

      lastBalance_from = Number(lastBalance_from);

      if (lastBalance_from > 0 && lastBalance_from >= transfer_amount) {
        lastBalance_from = lastBalance_from - transfer_amount;

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: transfer_from_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: voucher_no,
          acctrxn_amount: transfer_amount,
          acctrxn_created_at: transfer_date as string,
          acctrxn_created_by: transfer_created_by,
          acctrxn_note: transfer_note,
          acctrxn_particular_id: 34,
          acctrxn_pay_type: 'CASH',
        };

        const from_acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        // Balance transfer Online transaction fee
        let btransfer_actransaction_id = null;

        if (transfer_charge) {
          const AccTrxnChargeBody: IAcTrxn = {
            acctrxn_ac_id: transfer_from_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: voucher_no,
            acctrxn_amount: transfer_charge,
            acctrxn_created_at: transfer_date as string,
            acctrxn_created_by: transfer_created_by,
            acctrxn_note: transfer_note,
            acctrxn_particular_id: 60,
            acctrxn_pay_type: 'CASH',
          };

          btransfer_actransaction_id = await trxns.AccTrxnInsert(
            AccTrxnChargeBody
          );
        }

        const AccTrxnBodyTo: IAcTrxn = {
          acctrxn_ac_id: transfer_to_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: voucher_no,
          acctrxn_amount: transfer_amount,
          acctrxn_created_at: transfer_date as string,
          acctrxn_created_by: transfer_created_by,
          acctrxn_note: transfer_note,
          acctrxn_particular_id: 34,
          acctrxn_pay_type: 'CASH',
        };

        const to_acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBodyTo);

        let btransfer_charge_id: number | null = null;
        if (transfer_charge && transfer_charge > 0) {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_from_acc_id: transfer_from_id,
            charge_to_acc_id: transfer_to_id,
            charge_amount: transfer_charge,
            charge_purpose: `Balance Transfer Account To Account`,
            charge_note: transfer_note as string,
          };

          btransfer_charge_id = await this.models
            .vendorModel(req, trx)
            .insertOnlineTrxnCharge(online_charge_trxn);
        }

        const balanceTInfo: IBalanceTransfer = {
          btransfer_from_account_id: transfer_from_id,
          btransfer_from_acc_trxn_id: from_acc_trxn_id,
          btransfer_to_account_id: transfer_to_id,
          btransfer_to_acc_trxn_id: to_acc_trxn_id,
          btransfer_vouchar_no: voucher_no,
          btransfer_amount: transfer_amount,
          btransfer_charge: transfer_charge,
          btransfer_charge_id,
          btransfer_created_by: transfer_created_by,
          btransfer_date: transfer_date as string,
          btransfer_note: transfer_note as string,
          btransfer_actransaction_id,
        };

        const data = await conn.addBalanceTransfer(balanceTInfo);

        await this.updateVoucher(req, 'BT');

        const message = `Account balance has been transfer ${transfer_amount}/-`;
        await this.insertAudit(
          req,
          'create',
          message,
          transfer_created_by,
          'ACCOUNTS'
        );

        return {
          success: true,
          message: 'Balance Transfer created successfully',
          data,
        };
      } else {
        throw new CustomError('Insufficient balance', 400, 'Bad request');
      }
    });
  };
}

export default AddBalanceTrasnfer;
