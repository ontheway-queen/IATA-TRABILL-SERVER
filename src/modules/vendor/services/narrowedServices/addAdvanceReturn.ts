import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import { IAcTrxn, IVTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAddvanceReturn,
  IAdvanceReturnCheque,
  IVendorAdvanceReturn,
} from '../../types/vendor.interfaces';
class AddAdvanceReturn extends AbstractServices {
  constructor() {
    super();
  }

  public addAdvanceReturn = async (req: Request) => {
    const {
      advance_amount,
      account_id,
      bank_name,
      cheque_no,
      advr_created_by,
      date,
      note,
      comb_vendor,
      advr_payment_type,
      transaction_charge,
      trans_no,
      vpcheque_withdraw_date,
    } = req.body as IVendorAdvanceReturn;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);

      const { vendor_id, combined_id } = separateCombClientToId(comb_vendor);

      const advr_vouchar_no = generateVoucherNumber(4, 'ADVR');

      let advr_actransaction_id: number | null = null;

      let advr_vtrxn_id: number | null = null;

      // PAYMENT METHOD
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

      if (advr_payment_type !== 4) {
        // ACCOUNT TRANSACTIONS
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: advr_vouchar_no,
          acctrxn_amount: Number(advance_amount),
          acctrxn_created_at: date as string,
          acctrxn_created_by: advr_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 43,
          acctrxn_pay_type: accPayType,
        };

        advr_actransaction_id = await new Trxns(req, trx).AccTrxnInsert(
          AccTrxnBody
        );

        // VENDOR TRANSACTIONS
        const VTrxnBody: IVTrxn = {
          comb_vendor: comb_vendor,
          vtrxn_amount: Number(advance_amount) - (transaction_charge || 0),
          vtrxn_created_at: date,
          vtrxn_note: note,
          vtrxn_particular_id: 43,
          vtrxn_type: 'DEBIT',
          vtrxn_user_id: advr_created_by,
          vtrxn_voucher: advr_vouchar_no,
          vtrxn_pay_type: accPayType,
        };

        advr_vtrxn_id = await new Trxns(req, trx).VTrxnInsert(VTrxnBody);
      }

      let transaction_charge_id = null;
      if (advr_payment_type === 3 && transaction_charge) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_to_vendor_id: vendor_id as number,
          charge_to_vcombined_id: combined_id as number,
          charge_amount: transaction_charge,
          charge_purpose: 'Vendor advance return',
          charge_note: note,
        };

        transaction_charge_id = await conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }

      const advanceReturnData: IAddvanceReturn = {
        advr_vouchar_no: String(advr_vouchar_no),
        advr_vendor_id: vendor_id,
        advr_combined_id: combined_id,
        advr_vtrxn_id,
        advr_actransaction_id,
        advr_amount: Number(advance_amount),
        advr_payment_date: date,
        advr_note: note,
        advr_created_by,
        advr_payment_type,
        transaction_charge,
        transaction_charge_id,
        trans_no,
        advr_account_id: account_id,
      };

      const data = await conn.insertAdvanceReturn(advanceReturnData);

      //  ======= advance return cheque data

      if (advr_payment_type === 4) {
        const addAdvanceReturnChqueData: IAdvanceReturnCheque = {
          cheque_advr_id: data,
          cheque_bank_name: bank_name,
          cheque_number: cheque_no,
          cheque_return_note: note,
          cheque_vendor_id: vendor_id as number,
          cheque_status: 'PENDING',
          cheque_withdraw_date:
            vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
        };

        await conn.insetAdvanceReturnCheque(addAdvanceReturnChqueData);
      }

      // insert audit
      const message = `ADDED VENDOR ADVANCE RETURN, VOUCHER ${advr_vouchar_no}, BDT ${advance_amount}/-`;

      await this.insertAudit(
        req,
        'update',
        message,
        advr_created_by,
        'VENDOR_ADVANCE_RETURN'
      );

      return {
        success: true,
        message,
        data,
      };
    });
  };
}

export default AddAdvanceReturn;
