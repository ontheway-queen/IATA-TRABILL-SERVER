/*
Partial Refund create service
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/

import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { generateVoucherNumber } from '../../../../../common/helpers/invoice.helpers';
import {
  IAcTrxn,
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import {
  IPartialRefund,
  IPartialRefundReqBody,
  IPartialRefundVendorInfo,
} from '../../../types/refund.interfaces';

class AddPartialRefundServices extends AbstractServices {
  constructor() {
    super();
  }

  public add = async (req: Request) => {
    const {
      vendor_refund_info,
      invoice_id,
      comb_client,
      created_by,
      prfnd_account_id,
      prfnd_charge_amount,
      prfnd_return_amount,
      prfnd_profit_amount,
      prfnd_total_amount,
      date,
      note,
      prfnd_payment_type,
      prfnd_payment_method,
    } = req.body as IPartialRefundReqBody;

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const voucher_no = generateVoucherNumber(7, 'PRF');

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const trxns = new Trxns(req, trx);

      let client_trxn_id = null;
      let charge_trxn_id = null;
      let acc_trxn_id = null;

      const invoice_category_id = await conn.checkInvoiceIsPaid(invoice_id);
      const { invoice_payment } = await conn.getInvoiceDuePayment(invoice_id);

      let airtickerPnr: string[] = [];
      let airticketRoute: string[] = [];
      let passportName: string[] = [];
      let airticketNo: string[] = [];

      // Assuming vendor_refund_info is an array
      await Promise.all(
        vendor_refund_info.map(async (item) => {
          const {
            airticket_pnr,
            airticket_routes,
            passport_name,
            airticket_ticket_no,
          } = await conn.getAitRefundInfo(
            item.vprfnd_airticket_id,
            invoice_category_id
          );

          airtickerPnr = airtickerPnr.concat(airticket_pnr);
          airticketRoute = airticketRoute.concat(airticket_routes);
          passportName = passportName.concat(passport_name);
          airticketNo = airticketNo.concat(airticket_ticket_no);
        })
      );

      const clTrxnChargeBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: prfnd_charge_amount,
        ctrxn_cl: comb_client,
        ctrxn_voucher: voucher_no,
        ctrxn_particular_id: 163,
        ctrxn_created_at: date,
        ctrxn_note: note,
        ctrxn_particular_type: 'PARTIAL RFND(CHARGE)',
        ctrxn_airticket_no: airticketNo.join(', '),
        ctrxn_pax: passportName.join(', '),
        ctrxn_pnr: airtickerPnr.join(', '),
        ctrxn_route: airticketRoute.join(', '),
      };

      if (prfnd_payment_type === 'ADJUST') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: prfnd_total_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: voucher_no,
          ctrxn_particular_id: 162,
          ctrxn_created_at: date,
          ctrxn_note: note,
          ctrxn_particular_type: 'PARTIAL RFND',
          ctrxn_airticket_no: airticketNo.join(', '),
          ctrxn_pax: passportName.join(', '),
          ctrxn_pnr: airtickerPnr.join(', '),
          ctrxn_route: airticketRoute.join(', '),
        };

        if (prfnd_total_amount) {
          client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
        }

        if (prfnd_charge_amount) {
          charge_trxn_id = await trxns.clTrxnInsert(clTrxnChargeBody);
        }
      } else {
        if (prfnd_payment_method !== 4) {
          let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
          if (prfnd_payment_method === 1) {
            accPayType = 'CASH';
          } else if (prfnd_payment_method === 2) {
            accPayType = 'BANK';
          } else if (prfnd_payment_method === 3) {
            accPayType = 'MOBILE BANKING';
          } else {
            accPayType = 'CASH';
          }

          let return_amount: number = 0;
          if (invoice_payment >= prfnd_return_amount) {
            return_amount = prfnd_return_amount;
          } else if (invoice_payment < prfnd_return_amount) {
            return_amount = invoice_payment;
          }

          const AccTrxnBody: IAcTrxn = {
            acctrxn_ac_id: prfnd_account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_amount: return_amount,
            acctrxn_voucher: voucher_no,
            acctrxn_created_at: date,
            acctrxn_created_by: created_by,
            acctrxn_note: note,
            acctrxn_particular_id: 162,
            acctrxn_particular_type: 'PARTIAL RFND',
            acctrxn_pay_type: accPayType,
          };

          if (return_amount) {
            acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBody);
          }

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: prfnd_return_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: voucher_no,
            ctrxn_particular_id: 162,
            ctrxn_created_at: date,
            ctrxn_note: note,
            ctrxn_particular_type: 'PARTIAL RFND',
            ctrxn_airticket_no: airticketNo.join(', '),
            ctrxn_pax: passportName.join(', '),
            ctrxn_pnr: airtickerPnr.join(', '),
            ctrxn_route: airticketRoute.join(', '),
          };

          if (prfnd_return_amount) {
            client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
          }

          if (prfnd_charge_amount > 0) {
            charge_trxn_id = await trxns.clTrxnInsert(clTrxnChargeBody);
          }
        } else {
          // Here for cheque....
        }
      }

      const persialRefundInfo: IPartialRefund = {
        prfnd_invoice_id: invoice_id,
        prfnd_vouchar_number: voucher_no,
        prfnd_date: date,
        prfnd_client_id: client_id as number,
        prfnd_combine_id: combined_id as number,
        prfnd_trxn_id: client_trxn_id,
        prfnd_charge_trxn_id: charge_trxn_id,
        prfnd_account_id: prfnd_account_id,
        prfnd_actrxn_id: acc_trxn_id,
        prfnd_payment_type,
        prfnd_total_amount,
        prfnd_charge_amount,
        prfnd_return_amount,
        prfnd_profit_amount,
        prfnd_created_by: created_by,
        prfnd_payment_method,
        prfnd_note: note,
      };

      const refund_id = await conn.addPartialRefund(persialRefundInfo);

      // VENDOR REFUND INFO
      let persialVendorInfos: IPartialRefundVendorInfo[] = [];
      let vprfnd_trxn_id;
      let vprfnd_actrxn_id;
      for (const vendor_info of vendor_refund_info) {
        const {
          vprfnd_airticket_id,
          vprfnd_account_id,
          vprfnd_payment_type,
          comb_vendor,
          vprfnd_payment_method,
          vendor_refundable_amount,
          vprfnd_ait,
          vprfnd_base_fare_amount,
          vprfnd_penalties,
          vprfnd_remaining_tax,
          vprfnd_used_airticket_tax,
          vprfnd_used_base_fare,
          vprfnd_remaining_base_fare,
          vprfnd_tax,
          vprfnd_total_commission,
          vprfnd_ticket_no,
        } = vendor_info;

        const {
          airticket_pnr,
          airticket_routes,
          passport_name,
          airticket_ticket_no,
        } = await conn.getAitRefundInfo(
          vprfnd_airticket_id,
          invoice_category_id
        );

        const { combined_id, vendor_id } = separateCombClientToId(comb_vendor);

        if (vprfnd_payment_type === 'ADJUST') {
          const VTrxnBody: IVTrxn = {
            comb_vendor: comb_vendor,
            vtrxn_amount: vendor_refundable_amount,
            vtrxn_created_at: date,
            vtrxn_note: note,
            vtrxn_particular_id: 162,
            vtrxn_particular_type: 'PARTIAL RFND',
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: voucher_no,
            vtrxn_pnr: airticket_pnr,
            vtrxn_airticket_no: airticket_ticket_no,
            vtrxn_pax: passport_name,
            vtrxn_route: airticket_routes,
          };

          vprfnd_trxn_id = await trxns.VTrxnInsert(VTrxnBody);
        } else {
          // MONEY RETURN
          if (vprfnd_payment_method !== 4) {
            const total_vendor_pay = await conn.getInvoiceVendorPaymentByVendor(
              invoice_id,
              vendor_id,
              combined_id
            );

            let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
            if (vprfnd_payment_method === 1) {
              accPayType = 'CASH';
            } else if (vprfnd_payment_method === 2) {
              accPayType = 'BANK';
            } else if (vprfnd_payment_method === 3) {
              accPayType = 'MOBILE BANKING';
            } else {
              accPayType = 'CASH';
            }

            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: vprfnd_account_id,
              acctrxn_type: 'CREDIT',
              acctrxn_amount: vendor_refundable_amount,
              acctrxn_created_at: date,
              acctrxn_created_by: created_by,
              acctrxn_voucher: voucher_no,
              acctrxn_note: note,
              acctrxn_particular_id: 162,
              acctrxn_particular_type: 'PARTIAL RFND',
              acctrxn_pay_type: accPayType,
            };

            if (
              total_vendor_pay >= vendor_refundable_amount &&
              vendor_refundable_amount > 0
            ) {
              vprfnd_actrxn_id = await trxns.AccTrxnInsert(ACTrxnBody);
            }

            const VTrxnBody: IVTrxn = {
              comb_vendor: comb_vendor,
              vtrxn_amount: vendor_refundable_amount,
              vtrxn_created_at: date,
              vtrxn_note: note,
              vtrxn_particular_id: 162,
              vtrxn_particular_type: 'PARTIAL RFND',
              vtrxn_type: 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: voucher_no,
              vtrxn_pnr: airticket_pnr,
              vtrxn_airticket_no: airticket_ticket_no,
              vtrxn_pax: passport_name,
              vtrxn_route: airticket_routes,
            };

            if (vendor_refundable_amount) {
              vprfnd_trxn_id = await trxns.VTrxnInsert(VTrxnBody);
            }
          } else {
            // Here for cheque....
          }
        }

        await conn.updateAirticketItemIsRefund(
          vprfnd_airticket_id,
          invoice_category_id,
          1
        );

        const persialVendorInfo: IPartialRefundVendorInfo = {
          vprfnd_refund_id: refund_id,
          vprfnd_airticket_id,
          vprfnd_invoice_category_id: invoice_category_id,
          vprfnd_account_id: vprfnd_account_id,
          vprfnd_actrxn_id: vprfnd_actrxn_id as number,
          vprfnd_charge_amount: vprfnd_penalties,
          vprfnd_vendor_id: vendor_id as number,
          vprfnd_combine_id: combined_id as number,
          vprfnd_payment_type,
          vprfnd_trxn_id: vprfnd_trxn_id as number,
          vprfnd_payment_method,
          vprfnd_ait,
          vprfnd_base_fare: vprfnd_base_fare_amount,
          vprfnd_used_base_fare,
          vprfnd_remaining_base_fare,
          vprfnd_tax,
          vprfnd_total_commission,
          vprfnd_used_tax: vprfnd_used_airticket_tax,
          vprfnd_remaining_tax,
          vprfnd_return_amount: vendor_refundable_amount,
          vprfnd_total_amount: vprfnd_base_fare_amount,
          vprfnd_ticket_no,
        };

        persialVendorInfos.push(persialVendorInfo);
      }

      await conn.addPartialRefundVendorInfo(persialVendorInfos);

      await conn.updateInvoiceAirticketIsRefund(invoice_id, 1);

      const audit_content = `Partial refund has been created voucher no:${voucher_no}`;

      await this.insertAudit(
        req,
        'create',
        audit_content,
        created_by,
        'REFUND'
      );

      return {
        success: true,
        message: 'Partial Refund created successfully!',
        refund_id,
      };
    });
  };
}
export default AddPartialRefundServices;
