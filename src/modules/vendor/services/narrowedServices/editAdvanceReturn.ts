import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { IAcTrxn, IVTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAdvanceReturnCheque,
  IEditVendorAdvanceReturn,
  IVendorAdvanceReturn,
} from '../../types/vendor.interfaces';
class EditAdvanceReturn extends AbstractServices {
  constructor() {
    super();
  }

  public editAdvanceReturn = async (req: Request) => {
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
      const trxns = new Trxns(req, trx);

      const { vendor_id, combined_id } = separateCombClientToId(comb_vendor);

      const advr_id = Number(req.params.id);

      //   get previous account_id and return_amount
      const {
        prevVendorTrxnId,
        prevPayType,
        prevAccTrxnId,
        prev_voucher_no,
        prev_transaction_charge_id,
      } = await conn.getAdvancePrevAccId(advr_id as number);

      let advr_actransaction_id: number | null = null;
      let advr_vtrxn_id: number | null = null;

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
          acctrxn_voucher: prev_voucher_no,
          acctrxn_amount: Number(advance_amount),
          acctrxn_created_at: date,
          acctrxn_created_by: advr_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 33,
          acctrxn_particular_type: 'Vendor advance return',
          acctrxn_pay_type: accPayType,
        };

        // VENDOR TRANSACTIONS

        const VTrxnBody: IVTrxn = {
          comb_vendor: comb_vendor,
          vtrxn_amount: Number(advance_amount) - (transaction_charge || 0),
          vtrxn_created_at: date,
          vtrxn_note: note,
          vtrxn_particular_id: 33,
          vtrxn_particular_type: 'Vendor advance return',
          vtrxn_type: 'DEBIT',
          vtrxn_user_id: advr_created_by,
          vtrxn_voucher: prev_voucher_no,
          vtrxn_pay_type: accPayType,
        };

        if (prevPayType !== 4) {
          advr_actransaction_id = await trxns.AccTrxnUpdate({
            ...AccTrxnBody,
            trxn_id: prevAccTrxnId,
          });

          advr_vtrxn_id = await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: prevVendorTrxnId,
          });
        } else {
          advr_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);

          advr_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
        }
      }

      let transaction_charge_id = null;
      if (advr_payment_type === 3 && transaction_charge) {
        if (prev_transaction_charge_id) {
          await conn.updateOnlineTrxnCharge(
            {
              charge_amount: transaction_charge,
              charge_purpose: 'Vendor advance return',
            },
            prev_transaction_charge_id
          );
        } else {
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
      } else if (
        advr_payment_type !== 3 &&
        prevPayType === 3 &&
        prev_transaction_charge_id
      ) {
        await conn.deleteOnlineTrxnCharge(prev_transaction_charge_id);
      }

      const updatedAdvanceReturn: IEditVendorAdvanceReturn = {
        advr_actransaction_id,
        advr_amount: Number(advance_amount),
        advr_payment_date: date,
        advr_note: note,
        advr_payment_type,
        transaction_charge,
        transaction_charge_id,
        trans_no,
        advr_account_id: account_id,
        advr_updated_by: advr_created_by,
        advr_combined_id: combined_id,
        advr_vtrxn_id,
        advr_vendor_id: vendor_id,
      };

      const data = await conn.updateAdvanceReturn(
        updatedAdvanceReturn,
        advr_id
      );

      //  ======= advance return cheque data

      if (advr_payment_type === 4) {
        const updateAdvanceReturnData: IAdvanceReturnCheque = {
          cheque_advr_id: data,
          cheque_bank_name: bank_name,
          cheque_number: cheque_no,
          cheque_status: 'PENDING',
          cheque_return_note: note,
          cheque_vendor_id: vendor_id as number,
          cheque_deposit_date:
            vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
        };
        await conn.updateAdvanceReturnCheque(
          updateAdvanceReturnData,
          advr_id as number
        );
      }

      // insert audit

      const message = `UPDATED VENDOR ADVANCE RETURN, VOUCHER ${prev_voucher_no}, BDT ${advance_amount}/-`;

      await this.insertAudit(
        req,
        'update',
        message,
        advr_created_by,
        'VENDOR_ADVANCE_RETURN'
      );

      return {
        success: true,
        message: 'Advance return updated successfully',
      };
    });
  };
}

export default EditAdvanceReturn;
