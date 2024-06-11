import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import {
  IAcTrxnUpdate,
  IVTrxn,
  IVTrxnUpdate,
} from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAddVendorPayReqBody,
  IUpdateVendorPayment,
  IVpayChackDetails,
} from '../../types/vendor.interfaces';
import { IInvoiceVendorPayment } from '../../types/vendorPayment.interface';
import { getPaymentType } from '../../../../common/utils/libraries/lib';

class EditVendorPayment extends AbstractServices {
  constructor() {
    super();
  }

  public editVendorPayment = async (req: Request) => {
    const vpay_id = Number(req.params.id);
    const {
      account_id,
      created_by,
      cheque_no,
      has_refer_passport,
      note,
      payment_method_id,
      payment_amount,
      vpay_creadit_card_no,
      payment_date,
      vpay_receipt,
      vpaypass_passport_id,
      vpcheque_withdraw_date,
      vpcheque_bank_name,
      online_charge,
      vendor_ait,
      invoice_id,
      com_vendor,
      specific_inv_vendors,
      payment_by,
    } = req.body as IAddVendorPayReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      // previous transactions
      const { invoice_vendor_pay, vendor_pay_data } =
        await conn.getPreviousPaymentAmount(vpay_id);

      await conn.deleteInvoiceVendorPaymentPermanent(vpay_id, created_by);

      const {
        prevAccTrxnId,
        prevPayMethod,
        prevVendorTrxn,
        vpay_payment_to,
        vouchar_no,
        online_charge_id: prev_online_charge_id,
      } = vendor_pay_data;

      //  current transaction and update data

      const totalPayment = Number(payment_amount) + (vendor_ait | 0);

      let online_charge_id: number | null = null;
      if ([3, 5, 2].includes(payment_method_id) && online_charge) {
        const { vendor_id, combined_id } = separateCombClientToId(com_vendor);

        if (prev_online_charge_id) {
          await conn.updateOnlineTrxnCharge(
            { charge_amount: online_charge, charge_purpose: 'Vendor Payment' },
            prev_online_charge_id
          );
        } else {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_to_acc_id: account_id,
            charge_from_vendor_id: vendor_id as number,
            charge_from_vcombined_id: combined_id as number,
            charge_amount: online_charge,
            charge_purpose: 'Vendor Payment',
            charge_note: note,
          };

          online_charge_id = await conn.insertOnlineTrxnCharge(
            online_charge_trxn
          );
        }
      } else if (
        ![3, 5, 2].includes(payment_method_id) &&
        [3, 5, 2].includes(prevPayMethod) &&
        prev_online_charge_id
      ) {
        await conn.deleteOnlineTrxnCharge(prev_online_charge_id);
      }

      const paymentData: IUpdateVendorPayment = {
        vpay_invoice_id: invoice_id,
        vpay_account_id: account_id,
        created_by,
        has_refer_passport,
        note,
        payment_amount,
        vpay_creadit_card_no,
        payment_date,
        payment_method_id,
        vpay_receipt_no: vpay_receipt,
        online_charge,
        vendor_ait,
        vpay_payment_to,
        online_charge_id,
        vpay_payment_by: payment_by,
      };

      const { combined_id } = separateCombClientToId(com_vendor);

      const accPayType = getPaymentType(payment_method_id);

      if (
        ![4, 5].includes(prevPayMethod) &&
        ![4, 5].includes(payment_method_id)
      ) {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: totalPayment,
          acctrxn_created_at: payment_date,
          acctrxn_created_by: created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 1,
          acctrxn_particular_type: 'Vendor payment',
          acctrxn_pay_type: accPayType,
          trxn_id: prevAccTrxnId,
        };

        await trxns.AccTrxnUpdate(AccTrxnBody);
      } else {
        if (![4, 5].includes(prevPayMethod)) {
          await trxns.deleteAccTrxn(prevAccTrxnId);
        }
        if (![4, 5].includes(payment_method_id)) {
          const VTrxnBody: IVTrxn = {
            comb_vendor: com_vendor,
            vtrxn_amount: payment_amount,
            vtrxn_created_at: payment_date,
            vtrxn_note: note,
            vtrxn_particular_id: 1,
            vtrxn_particular_type: 'vendor payment',
            vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: vouchar_no,
            vtrxn_pay_type: accPayType,
          };

          paymentData.vpay_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
        }
      }

      if (vpay_payment_to === 'VENDOR') {
        const VTrxnUpdateBody: IVTrxnUpdate = {
          comb_vendor: com_vendor,
          vtrxn_amount: payment_amount,
          vtrxn_created_at: payment_date,
          vtrxn_note: note,
          vtrxn_particular_id: 1,
          vtrxn_particular_type: 'vendor payment',
          vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
          vtrxn_user_id: created_by,
          vtrxn_voucher: vouchar_no,
          trxn_id: prevVendorTrxn,
        };

        await trxns.VTrxnUpdate(VTrxnUpdateBody);
      } else if (vpay_payment_to === 'INVOICE') {
        for (const item of invoice_vendor_pay) {
          const { prevInvCombVendor, prevInvTrxnId } = item;

          await trxns.deleteVTrxn(prevInvTrxnId, prevInvCombVendor);
        }
        // delete previous invoice vendor payment
        await conn.deleteInvoiceVendorPaymentPermanent(vpay_id, created_by);

        for (const item of specific_inv_vendors) {
          const {
            comb_vendor_specific_invoice,
            specific_inv_amount: purchase_price,
          } = item;

          const { vendor_id, combined_id } = separateCombClientToId(
            comb_vendor_specific_invoice
          );

          let vtrxn_id = null;

          if ([1, 2, 3].includes(prevPayMethod)) {
            const VTrxnBody: IVTrxn = {
              comb_vendor: comb_vendor_specific_invoice,
              vtrxn_amount: purchase_price,
              vtrxn_created_at: payment_date,
              vtrxn_note: note,
              vtrxn_particular_id: 1,
              vtrxn_particular_type: 'vendor payment',
              vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: vouchar_no,
            };

            vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
          } else if (prevPayMethod === 4) {
            const vpayChackDetails: IVpayChackDetails = {
              vpcheque_amount: purchase_price,
              vpcheque_cheque_no: cheque_no,
              vpcheque_receipt_no: vpay_receipt,
              vpcheque_vendor_id: vendor_id,
              vpcheque_combined_id: combined_id,
              vpcheque_vpay_id: vpay_id,
              vpcheque_withdraw_date:
                vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
              vpcheque_bank_name: vpcheque_bank_name,
            };

            await conn.insertVendorPaymentCheque(vpayChackDetails);
          }

          const invVendorPaymentData: IInvoiceVendorPayment = {
            invendorpay_vpay_id: vpay_id,
            invendorpay_vendor_id: vendor_id,
            invendorpay_combined_id: combined_id,
            invendorpay_vtrxn_id: vtrxn_id as number,
            invendorpay_invoice_id: invoice_id,
            invendorpay_amount: purchase_price,
            invendorpay_created_by: created_by,
          };

          await conn.insertInvoiceVendorPayment(invVendorPaymentData);
        }
      }

      if (has_refer_passport === 'YES') {
        const paymentPassportData = {
          vpaypass_vpay_id: vpay_id,
          vpaypass_passport_id,
        };

        await conn.updateVendorPaymentPassport(paymentPassportData);
      }

      await conn.updateVendorPayment(paymentData, vpay_id);

      const message = `UPDATED VENDOR PAY, VOUCHER ${vouchar_no}, BDT ${payment_amount}/-`;
      await this.insertAudit(
        req,
        'update',
        message,
        created_by,
        'VENDOR_PAYMENT'
      );

      return { success: true, message };
    });
  };
}

export default EditVendorPayment;
