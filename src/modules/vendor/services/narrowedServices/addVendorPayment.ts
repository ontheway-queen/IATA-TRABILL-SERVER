import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import { IAcTrxn, IVTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  IAddVendorPayReqBody,
  IAddVendorPayment,
  IVpayChackDetails,
} from '../../types/vendor.interfaces';
import { IInvoiceVendorPayment } from '../../types/vendorPayment.interface';
import { getPaymentType } from '../../../../common/utils/libraries/lib';

class AddVendorPayment extends AbstractServices {
  constructor() {
    super();
  }

  public addVendorPayment = async (req: Request) => {
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
      vpay_payment_to,
      specific_inv_vendors,
      com_vendor,
      payment_by,
    } = req.body as IAddVendorPayReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      let vpay_acctrxn_id: number | null = null;
      let online_charge_purpuse: string = 'Vendor payments';

      const vouchar_no = generateVoucherNumber(4, 'VP');

      const totalPayment =
        Number(payment_amount) + (vendor_ait | 0) + (online_charge | 0);

      // PAYMENT METHOD
      const accPayType = getPaymentType(payment_method_id);

      if (![4, 5].includes(payment_method_id)) {
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: totalPayment,
          acctrxn_created_at: payment_date as string,
          acctrxn_created_by: created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 1,
          acctrxn_particular_type: 'Vendor Payment',
          acctrxn_pay_type: accPayType,
        };

        vpay_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBody);
      }

      let online_charge_id = null;
      if ([3, 5, 2].includes(payment_method_id) && online_charge) {
        const { vendor_id, combined_id } = separateCombClientToId(com_vendor);

        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_to_acc_id: account_id,
          charge_from_vendor_id: vendor_id as number,
          charge_from_vcombined_id: combined_id as number,
          charge_amount: online_charge,
          charge_purpose: online_charge_purpuse,
          charge_note: note,
        };

        online_charge_id = await conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }

      const paymentData: IAddVendorPayment = {
        vpay_invoice_id: invoice_id,
        vpay_account_id: account_id,
        vpay_acctrxn_id,
        created_by,
        has_refer_passport,
        note,
        payment_amount,
        vpay_creadit_card_no,
        payment_date,
        payment_method_id,
        vouchar_no,
        vpay_receipt_no: vpay_receipt,
        online_charge,
        vendor_ait,
        vpay_payment_to,
        online_charge_id,
        vpay_payment_by: payment_by,
      };

      const { combined_id, vendor_id } = separateCombClientToId(com_vendor);

      (paymentData.vpay_vendor_id = vendor_id),
        (paymentData.vpay_combined_id = combined_id);

      if (
        vpay_payment_to === 'VENDOR' &&
        [1, 2, 3].includes(payment_method_id)
      ) {
        // VENDOR TRANSACTIONS
        const VTrxnBody: IVTrxn = {
          comb_vendor: com_vendor,
          vtrxn_amount: payment_amount,
          vtrxn_created_at: payment_date,
          vtrxn_note: note,
          vtrxn_particular_id: 1,
          vtrxn_particular_type: 'Vendor Payment',
          vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
          vtrxn_user_id: created_by,
          vtrxn_voucher: vouchar_no,
          vtrxn_pay_type: accPayType,
        };

        paymentData.vpay_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
      }

      const vpay_id = await conn.insertVendorPayment(paymentData);

      if (payment_method_id === 4) {
        const vpayChackDetails: IVpayChackDetails = {
          vpcheque_amount: payment_amount,
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

      online_charge_purpuse = 'Vendor payment to specific vendor';

      if (vpay_payment_to === 'INVOICE') {
        online_charge_purpuse = 'Vendor payment to specific invoice';
        for (const item of specific_inv_vendors) {
          const {
            comb_vendor_specific_invoice: comb_vendor,
            specific_inv_amount: purchase_price,
          } = item;

          const { vendor_id, combined_id } =
            separateCombClientToId(comb_vendor);

          let vtrxn_id;

          if ([1, 2, 3].includes(payment_method_id)) {
            // VENDOR TRANSACTIONS
            const VTrxnBody: IVTrxn = {
              comb_vendor,
              vtrxn_amount: purchase_price,
              vtrxn_created_at: payment_date,
              vtrxn_note: note,
              vtrxn_particular_id: 1,
              vtrxn_particular_type: 'Vendor Payment',
              vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: vouchar_no,
            };

            vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
          } else {
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

        await conn.insertVendorPaymentPassport(paymentPassportData);
      }

      // insert audit

      const message = `ADDED VENDOR PAY, VOUCHER ${vouchar_no}, BDT ${payment_amount}/-`;

      await this.insertAudit(
        req,
        'create',
        message,
        created_by,
        'VENDOR_PAYMENT'
      );

      return { success: true, message, vpay_id };
    });
  };
}

export default AddVendorPayment;
