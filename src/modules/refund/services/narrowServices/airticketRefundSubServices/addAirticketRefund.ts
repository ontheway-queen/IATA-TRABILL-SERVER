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
import { getPaymentType } from '../../../../../common/utils/libraries/lib';
import { IOnlineTrxnCharge } from '../../../../accounts/types/account.interfaces';
import {
  IAirTicketRefund,
  IAirTicketRefundReqBody,
  IAirticketClientRefund,
  IVendorRefundInfo,
} from '../../../types/refund.interfaces';

class AddAirTicketRefund extends AbstractServices {
  constructor() {
    super();
  }

  public addAirTicketRefund = async (req: Request) => {
    const {
      client_refund_info,
      vendor_refund_info,
      invoice_id,
      comb_client,
      created_by,
      date,
      note,
    } = req.body as IAirTicketRefundReqBody;

    const totalVReturnAmount = vendor_refund_info.reduce(
      (total, item) => total + Number(item.vrefund_return_amount || 0),
      0
    );

    const crefund_profit =
      totalVReturnAmount -
      Number(client_refund_info.crefund_return_amount || 0);

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const voucher_number = generateVoucherNumber(7, 'AR-REF');

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { invoice_payment } = await conn.getInvoiceDuePayment(invoice_id);

      const {
        crefund_charge_amount,
        crefund_payment_type,
        crefund_total_amount,
        payment_method,
        crefund_return_amount,
        crefund_account_id,
        trxn_charge_amount,
        crefund_note,
      } = client_refund_info;

      // get air ticket info
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
            item.airticket_id,
            item.invoice_category_id
          );

          airtickerPnr = airtickerPnr.concat(airticket_pnr);
          airticketRoute = airticketRoute.concat(airticket_routes);
          passportName = passportName.concat(passport_name);
          airticketNo = airticketNo.concat(airticket_ticket_no);
        })
      );

      let atrefund_trxn_charge_id: number | null = null;

      // TRANSACTION CHARGE FOR MOBILE BANKING
      if (payment_method === 3 && trxn_charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: crefund_account_id,
          charge_to_client_id: client_id as number,
          charge_to_combined_id: combined_id as number,
          charge_amount: trxn_charge_amount,
          charge_purpose: `Invoice Air Ticket Refund Client`,
          charge_note: note,
        };

        atrefund_trxn_charge_id = await vendor_conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }

      const refundInfo: IAirTicketRefund = {
        atrefund_invoice_id: invoice_id,
        atrefund_client_id: client_id,
        atrefund_combined_id: combined_id,
        atrefund_created_by: created_by,
        atrefund_date: date,
        atrefund_vouchar_number: voucher_number,
        atrefund_trxn_charge: trxn_charge_amount,
        atrefund_trxn_charge_id,
        atrefund_note: note,
      };

      const refund_id = await conn.insertAirTicketRefund(refundInfo);

      // ============ client refund

      let crefund_ctrxnid = null;
      let crefund_charge_ctrxnid = null;
      let crefund_actransaction_id = null;

      if (crefund_payment_type === 'ADJUST') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: crefund_total_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: voucher_number,
          ctrxn_particular_id: 108,
          ctrxn_created_at: date,
          ctrxn_note: '',
          ctrxn_particular_type: 'AIR TICKET REFUND(ADJUST)',
          ctrxn_pnr: airtickerPnr.join(', '),
          ctrxn_airticket_no: airticketNo.join(', '),
          ctrxn_pax: passportName.join(', '),
          ctrxn_route: airticketRoute.join(', '),
        };
        crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);

        const clRefundChargeTrxnBody: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: crefund_charge_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: voucher_number,
          ctrxn_particular_id: 108,
          ctrxn_created_at: date,
          ctrxn_note: '',
          ctrxn_particular_type: 'AIR TICKET REFUND(CHARGE)',
          ctrxn_pnr: airtickerPnr.join(', '),
          ctrxn_airticket_no: airticketNo.join(', '),
          ctrxn_pax: passportName.join(', '),
          ctrxn_route: airticketRoute.join(', '),
        };
        crefund_charge_ctrxnid = await trxns.clTrxnInsert(
          clRefundChargeTrxnBody
        );
      }

      // MONEY RETURN
      else {
        if (payment_method !== 4) {
          let return_amount: number = 0;
          let client_adjust_amount: number = 0;

          // FULL PAYMENT OR FULL MONEY RECEIPT
          if (invoice_payment >= crefund_total_amount) {
            return_amount = crefund_return_amount;
          }

          // HAVE INVOICE DUE
          else if (invoice_payment < crefund_total_amount) {
            return_amount = invoice_payment - crefund_charge_amount;
            client_adjust_amount = crefund_total_amount - invoice_payment;
          }

          let accPayType = getPaymentType(payment_method);

          let clientRefundTrxnNote = `Net total : ${crefund_total_amount}/- 
          Money return : ${return_amount}/-
          Refund charge : ${crefund_charge_amount}/-`;

          if (client_adjust_amount) {
            clientRefundTrxnNote += `\nAdjust amount : ${client_adjust_amount}/-`;
          }

          if (return_amount > 0) {
            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: crefund_account_id,
              acctrxn_type: 'DEBIT',
              acctrxn_voucher: voucher_number,
              acctrxn_amount: return_amount,
              acctrxn_created_at: date,
              acctrxn_created_by: created_by,
              acctrxn_note: clientRefundTrxnNote || crefund_note,
              acctrxn_particular_id: 108,
              acctrxn_particular_type:
                'Air Ticket Refund to Client(MONEY RETURN)',
              acctrxn_pay_type: accPayType,
            };

            crefund_actransaction_id = await trxns.AccTrxnInsert(ACTrxnBody);
          }

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: client_adjust_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: voucher_number,
            ctrxn_particular_id: 108,
            ctrxn_created_at: date,
            ctrxn_note: clientRefundTrxnNote,
            ctrxn_particular_type: 'AIR TICKET REFUND',
            ctrxn_pnr: airtickerPnr.join(', '),
            ctrxn_airticket_no: airticketNo.join(', '),
            ctrxn_pax: passportName.join(', '),
            ctrxn_route: airticketRoute.join(', '),
            ctrxn_pay_type: accPayType,
          };

          crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);
        } else {
          // create here for cheque...
        }
      }

      const airticketClientRefund: IAirticketClientRefund = {
        crefund_charge_amount,
        crefund_date: date,
        crefund_payment_type,
        crefund_total_amount,
        crefund_client_id: client_id,
        crefund_combined_id: combined_id,
        crefund_ctrxnid,
        crefund_charge_ctrxnid,
        crefund_return_amount,
        crefund_actransaction_id,
        crefund_account_id,
        crefund_refund_id: refund_id,
        crefund_profit,
      };

      await conn.insertAirticketClientRefund(airticketClientRefund);

      // airticket vendor refund
      const airticketVendorRefunds: IVendorRefundInfo[] = [];

      for (const item of vendor_refund_info) {
        const {
          vrefund_account_id,
          airticket_id,
          airticket_combvendor,
          vrefund_total_amount,
          vrefund_charge_amount,
          vrefund_payment_type,
          vrefund_return_amount,
          invoice_category_id,
          payment_method,
          trxn_charge_amount,
          vrefund_note,
        } = item;

        const { vendor_id, combined_id } =
          separateCombClientToId(airticket_combvendor);

        const {
          airticket_pnr,
          airticket_routes,
          passport_name,
          airticket_ticket_no,
        } = await conn.getAitRefundInfo(
          item.airticket_id,
          item.invoice_category_id
        );

        let vrefund_vtrxn_id = null;
        let vrefund_charge_vtrxn_id = null;
        let vrefund_acctrxn_id = null;

        if (vrefund_payment_type === 'ADJUST') {
          let vendorRefundTrxnNote = `Net total : ${vrefund_total_amount}/- 
          Adjust amount : ${vrefund_return_amount}/-
          Refund charge : ${vrefund_charge_amount}/-`;

          const VTrxnBody: IVTrxn = {
            comb_vendor: airticket_combvendor,
            vtrxn_amount: vrefund_total_amount,
            vtrxn_created_at: date,
            vtrxn_note: vendorRefundTrxnNote,
            vtrxn_particular_id: 108,
            vtrxn_particular_type: 'AIR TICKET REFUND(ADJUST)',
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: voucher_number,
            vtrxn_airticket_no: airticket_ticket_no,
            vtrxn_pax: passport_name,
            vtrxn_pnr: airticket_pnr,
            vtrxn_route: airticket_routes,
          };

          vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

          const vRefundChargeTrxnBody: IVTrxn = {
            comb_vendor: airticket_combvendor,
            vtrxn_amount: vrefund_charge_amount,
            vtrxn_created_at: date,
            vtrxn_note: '', //vendorRefundTrxnNote,
            vtrxn_particular_id: 108,
            vtrxn_particular_type: 'AIR TICKET REFUND(CHARGE)',
            vtrxn_type: 'DEBIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: voucher_number,
            vtrxn_airticket_no: airticket_ticket_no,
            vtrxn_pax: passport_name,
            vtrxn_pnr: airticket_pnr,
            vtrxn_route: airticket_routes,
          };

          vrefund_charge_vtrxn_id = await trxns.VTrxnInsert(
            vRefundChargeTrxnBody
          );
        }

        // VENDOR MONEY RETURN
        else {
          if (payment_method !== 4) {
            const total_vendor_pay = await conn.getInvoiceVendorPaymentByVendor(
              invoice_id,
              vendor_id,
              combined_id
            );

            let vendor_return_amount: number = 0;
            let vendor_adjust_amount: number = 0;

            // FULL PAYMENT
            if (total_vendor_pay >= vrefund_total_amount) {
              vendor_return_amount = vrefund_return_amount;
            }

            // HAVE INVOICE DUE
            else if (total_vendor_pay < vrefund_total_amount) {
              vendor_return_amount = total_vendor_pay - vrefund_charge_amount;
              vendor_adjust_amount = vrefund_total_amount - total_vendor_pay;
            }

            let accPayType = getPaymentType(payment_method);

            let vendorRefundTrxnNote = `Net total : ${vrefund_total_amount}/- 
            Return amount : ${vrefund_return_amount}/-
            Refund charge : ${vrefund_charge_amount}/-`;

            if (vendor_adjust_amount) {
              vendorRefundTrxnNote += `\nAdjust amount : ${vendor_adjust_amount}/-`;
            }

            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: crefund_account_id,
              acctrxn_type: 'CREDIT',
              acctrxn_amount: vendor_return_amount,
              acctrxn_created_at: date,
              acctrxn_voucher: voucher_number,
              acctrxn_created_by: created_by,
              acctrxn_note: vendorRefundTrxnNote,
              acctrxn_particular_id: 108,
              acctrxn_particular_type:
                'Air Ticket Refund from Vendor(MONEY RETURN)',
              acctrxn_pay_type: accPayType,
            };

            vrefund_acctrxn_id = await trxns.AccTrxnInsert(ACTrxnBody);

            const VTrxnBody: IVTrxn = {
              comb_vendor: airticket_combvendor,
              vtrxn_amount: vendor_adjust_amount,
              vtrxn_created_at: date,
              vtrxn_note: vendorRefundTrxnNote,
              vtrxn_particular_id: 108,
              vtrxn_particular_type: 'AIR TICKET REFUND(MONEY RETURN)',
              vtrxn_type: 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: voucher_number,
              vtrxn_airticket_no: airticket_ticket_no,
              vtrxn_pax: passport_name,
              vtrxn_pnr: airticket_pnr,
              vtrxn_route: airticket_routes,
              vtrxn_pay_type: accPayType,
            };

            vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
          } else {
            // cheque create for vendor return amount...
          }
        }

        // update invoice is refund

        await conn.updateAirticketItemIsRefund(
          airticket_id,
          invoice_category_id,
          1
        );

        const airticketVendorRefund: IVendorRefundInfo = {
          vrefund_refund_id: refund_id,
          vrefund_airticket_id: airticket_id,
          vrefund_category_id: invoice_category_id,
          vrefund_charge_amount,
          vrefund_created_by: created_by,
          vrefund_date: date,
          vrefund_payment_type,
          vrefund_return_amount,
          vrefund_total_amount,
          vrefund_vendor_combined_id: combined_id,
          vrefund_vendor_id: vendor_id,
          vrefund_vtrxn_id,
          vrefund_charge_vtrxn_id,
          vrefund_account_id,
          vrefund_acctrxn_id,
          vrefund_tkt_cl_discount: item.adjust_client_discount,
        };

        airticketVendorRefunds.push(airticketVendorRefund);
      }

      await conn.updateInvoiceAirticketIsRefund(invoice_id, 1);

      if (airticketClientRefund) {
        await conn.insertVendorRefundInfo(airticketVendorRefunds);
      }

      // insert audit
      const audit_content = `REFUNDED AIR TICKET, VOUCHER ${voucher_number}, BDT ${crefund_total_amount}/-, RETURN BDT ${crefund_return_amount}/-`;

      await this.insertAudit(
        req,
        'create',
        audit_content,
        created_by,
        'REFUND'
      );
      return {
        success: true,
        message: audit_content,
        refund_id,
      };
    });
  };
}

export default AddAirTicketRefund;
