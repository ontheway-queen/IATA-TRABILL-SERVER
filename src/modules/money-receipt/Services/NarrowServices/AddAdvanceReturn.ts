import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import {
  IAcTrxn,
  IClTrxnBody,
} from '../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../common/utils/errors/customError';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAdvanceReturnDB,
  IAdvrChequesDB,
  IMoneyReceiptAdvanceReturn,
} from '../../Type/MoneyReceipt.Interfaces';

class AddAdvanceReturn extends AbstractServices {
  constructor() {
    super();
  }

  public addAdvanceReturn = async (req: Request) => {
    const {
      cheque_number,
      cheque_withdraw_date,
      cheque_bank_name,
      advr_account_id,
      advr_amount,
      advr_combclient,
      advr_created_by,
      advr_note,
      advr_payment_date,
      advr_payment_type,
      advr_trxn_no,
      advr_trxn_charge,
    } = req.body as IMoneyReceiptAdvanceReturn;

    const { client_id, combined_id } = separateCombClientToId(advr_combclient);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const conn_cl = this.models.clientModel(req, trx);
      const conn_acc = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);
      const voucher_no = await this.generateVoucher(req, 'ADR');

      const cl_last_balance = await conn_cl.selectClientLBalance(
        advr_combclient
      );

      const acc_last_balance = await conn_acc.getAccountLastBalance(
        advr_account_id
      );

      if (cl_last_balance < advr_amount) {
        throw new CustomError(
          'If the client does not have an advance, how can you provide one?',
          400,
          'client does not have an advance'
        );
      }

      if (acc_last_balance < advr_amount) {
        throw new CustomError(
          'Insufficient account balance.',
          400,
          'Insufficient balance'
        );
      }

      let acc_trxn_id;
      let client_trxn_id;

      if (advr_payment_type !== 4) {
        let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
        if (advr_payment_type === 1) {
          accPayType = 'CASH';
        } else if (advr_payment_type === 2) {
          accPayType = 'BANK';
        } else if (advr_payment_type === 3) {
          accPayType = 'MOBILE BANKING';
        } else {
          accPayType = 'CASH';
        }

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: advr_account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: voucher_no,
          acctrxn_amount: advr_amount,
          acctrxn_created_at: advr_payment_date,
          acctrxn_created_by: advr_created_by,
          acctrxn_note: advr_note,
          acctrxn_particular_id: 118,
          acctrxn_particular_type: 'Money Receipt',
          acctrxn_pay_type: accPayType,
        };

        acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: advr_amount,
          ctrxn_cl: advr_combclient,
          ctrxn_voucher: voucher_no,
          ctrxn_particular_id: 118,
          ctrxn_created_at: advr_payment_date,
          ctrxn_note: advr_note,
          ctrxn_particular_type: 'Money Receipt',
          ctrxn_pay_type: accPayType,
        };

        client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      let advr_trxn_charge_id: number | null = null;
      if (advr_payment_type === 3 && advr_trxn_charge) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_to_acc_id: advr_account_id,
          charge_from_client_id: client_id as number,
          charge_from_ccombined_id: combined_id as number,
          charge_amount: advr_trxn_charge,
          charge_purpose: 'Money Receipt Advance Return',
          charge_note: advr_note,
        };

        advr_trxn_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      // ================ @ ADVANCE RETURN @ ========================

      const advanceReturnData: IAdvanceReturnDB = {
        advr_account_id,
        advr_actransaction_id: acc_trxn_id as number,
        advr_amount,
        advr_client_id: client_id,
        advr_combined_id: combined_id,
        advr_created_by,
        advr_ctrxn_id: client_trxn_id as number,
        advr_note,
        advr_payment_date,
        advr_trxn_no,
        advr_trxn_charge,
        advr_trxn_charge_id,
        advr_payment_type,
        advr_vouchar_no: voucher_no,
      };
      const advr_id = await conn.insertAdvanceReturn(advanceReturnData);

      // ================ @ ADVANCE RETURN CHEQUE @ ========================
      if (advr_payment_type === 4) {
        const advrChequeData: IAdvrChequesDB = {
          cheque_advr_id: advr_id,
          cheque_bank_name,
          cheque_number,
          cheque_status: 'PENDING',
          cheque_withdraw_date,
        };
        await conn.insertAdvrCheque(advrChequeData);
      }

      await this.updateVoucher(req, 'ADR');

      const message = `Advance has been return ${advr_amount}/-`;

      await this.insertAudit(
        req,
        'create',
        message,
        advr_created_by,
        'MONEY_RECEIPT_ADVANCE_RETURN'
      );

      return {
        success: true,
        message,
        data: {
          advr_id,
        },
      };
    });
  };
}

export default AddAdvanceReturn;
