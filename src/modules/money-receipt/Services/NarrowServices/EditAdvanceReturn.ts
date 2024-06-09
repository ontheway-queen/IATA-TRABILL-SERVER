import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import {
  IAcTrxn,
  IClTrxnUpdate,
} from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAdvanceReturnUpdate,
  IAdvrChequesDB,
  IMoneyReceiptAdvanceReturn,
} from '../../Type/MoneyReceipt.Interfaces';

class EditAdvanceReturn extends AbstractServices {
  constructor() {
    super();
  }

  public editAdvanceReturn = async (req: Request) => {
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

    const advr_id = req.params.id;

    const { client_id, combined_id } = separateCombClientToId(advr_combclient);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);
      // =============== @ GET PREVIOUS RETURN INFO @ ======================

      const previous_billing = await conn.getPrevAdvrIfo(advr_id);

      const { prevPayType, advr_ctrxn_id, advr_actransaction_id } =
        previous_billing;

      await trxns.deleteAccTrxn(advr_actransaction_id);

      let acc_trxn_id;
      let client_trxn_id;

      // TYPE 4 = CHEQUE
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
          acctrxn_voucher: previous_billing.advr_vouchar_no,
          acctrxn_amount: advr_amount,
          acctrxn_created_at: advr_payment_date,
          acctrxn_created_by: advr_created_by,
          acctrxn_note: advr_note,
          acctrxn_particular_id: 32,
          acctrxn_particular_type: 'Advance return',
          acctrxn_pay_type: accPayType,
        };

        acc_trxn_id = await new Trxns(req, trx).AccTrxnInsert(AccTrxnBody);
        const clTrxnBody: IClTrxnUpdate = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: advr_amount,
          ctrxn_cl: advr_combclient,
          ctrxn_voucher: previous_billing.advr_vouchar_no,
          ctrxn_particular_id: 33,
          ctrxn_created_at: advr_payment_date,
          ctrxn_note: advr_note,
          ctrxn_particular_type: 'Advance return',
          ctrxn_trxn_id: advr_ctrxn_id,
          ctrxn_pay_type: accPayType,
        };

        await trxns.clTrxnUpdate(clTrxnBody);
      }

      if (prevPayType === 4) {
        await conn.deletePrevAdvrCheques(advr_id, advr_created_by);
      }

      let advr_trxn_charge_id: number | null = null;
      if (advr_payment_type === 3 && advr_trxn_charge) {
        if (previous_billing.advr_trxn_charge_id) {
          await vendor_conn.updateOnlineTrxnCharge(
            {
              charge_amount: advr_trxn_charge,
              charge_purpose: 'Advance Return',
              charge_note: advr_note,
            },
            previous_billing.advr_trxn_charge_id
          );
        } else {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_to_acc_id: advr_account_id,
            charge_from_client_id: client_id as number,
            charge_from_ccombined_id: combined_id as number,
            charge_amount: advr_trxn_charge,
            charge_purpose: 'Money receipt advance return',
            charge_note: advr_note,
          };

          advr_trxn_charge_id = await vendor_conn.insertOnlineTrxnCharge(
            online_charge_trxn
          );
        }
      } else if (
        advr_payment_type !== 3 &&
        prevPayType === 3 &&
        previous_billing.advr_trxn_charge_id
      ) {
        vendor_conn.deleteOnlineTrxnCharge(
          previous_billing.advr_trxn_charge_id
        );
      }

      // ================ @ ADVANCE RETURN @ ========================
      const advanceReturnData: IAdvanceReturnUpdate = {
        advr_account_id,
        advr_actransaction_id: acc_trxn_id,
        advr_amount,
        advr_client_id: client_id,
        advr_combined_id: combined_id,
        advr_vouchar_no: previous_billing.advr_vouchar_no,
        advr_updated_by: advr_created_by,
        advr_ctrxn_id: client_trxn_id,
        advr_note,
        advr_payment_date,
        advr_trxn_charge,
        advr_trxn_charge_id,
        advr_trxn_no,
        advr_payment_type,
      };

      await conn.updateAdvanceReturn(advanceReturnData, advr_id);

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

      await this.insertAudit(
        req,
        'delete',
        `Advance return has been updated ${advr_amount}/-`,
        advr_created_by,
        'MONEY_RECEIPT_ADVANCE_RETURN'
      );
      return {
        success: true,
        data: 'Advance return has been updated',
      };
    });
  };
}

export default EditAdvanceReturn;
