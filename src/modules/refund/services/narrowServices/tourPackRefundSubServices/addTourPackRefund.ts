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
import { IOnlineTrxnCharge } from '../../../../accounts/types/account.interfaces';
import {
  IRefundTourClient,
  IRefundTourPack,
  IRefundTourVendor,
  ITourRefundReqBody,
} from '../../../types/refund.interfaces';

class AddTourPackRefund extends AbstractServices {
  constructor() {
    super();
  }

  public add = async (req: Request) => {
    const {
      comb_client,
      client_refund_info,
      created_by,
      invoice_id,
      note,
      date,
      invoice_category_id,
      itineraries,
    } = req.body as ITourRefundReqBody;

    const tour_vouchar_number = generateVoucherNumber(7, 'TOUR-REF');

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { invoice_payment } = await conn.getInvoiceDuePayment(invoice_id);

      const { ticket_no, ticket_pnr, airticket_route, pax_name } =
        await conn.view_tour_info_for_refund(invoice_id);

      const {
        payment_method,
        trxn_charge_amount,
        crefund_payment_type,
        crefund_account_id,
        crefund_return_amount,
        crefund_total_amount,
        crefund_charge_amount,
      } = client_refund_info;

      let refund_charge_id: number | null = null;
      if (payment_method === 3 && trxn_charge_amount) {
        const { client_id, combined_id } = separateCombClientToId(comb_client);

        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: crefund_account_id,
          charge_to_client_id: client_id as number,
          charge_to_combined_id: combined_id as number,
          charge_amount: trxn_charge_amount,
          charge_purpose: `Invoice Tour Refund Client`,
          charge_note: note,
        };
        refund_charge_id = await vendor_conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }
      const refundTourInfo: IRefundTourPack = {
        refund_invoice_id: invoice_id,
        refund_vouchar_number: tour_vouchar_number,
        refund_created_by: created_by,
        refund_note: note,
        refund_date: date,
        refund_charge_amount: trxn_charge_amount,
        refund_charge_id,
      };

      const refund_id = await conn.insertRefundTour(refundTourInfo);

      let crefund_ctrxnid = null;
      let crefund_charge_ctrxnid = null;
      let crefund_actransaction_id = null;

      if (crefund_payment_type === 'ADJUST') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: crefund_total_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: tour_vouchar_number,
          ctrxn_particular_id: 112,
          ctrxn_created_at: date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Tour refund create',
          ctrxn_airticket_no: ticket_no,
          ctrxn_pax: pax_name,
          ctrxn_pnr: ticket_pnr,
          ctrxn_route: airticket_route,
        };

        if (crefund_total_amount) {
          crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);
        }

        const clTrxnChargeBody: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: crefund_charge_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: tour_vouchar_number,
          ctrxn_particular_id: 113,
          ctrxn_created_at: date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Tour refund create',
          ctrxn_airticket_no: ticket_no,
          ctrxn_pax: pax_name,
          ctrxn_pnr: ticket_pnr,
          ctrxn_route: airticket_route,
        };

        if (crefund_charge_amount) {
          crefund_charge_ctrxnid = await trxns.clTrxnInsert(clTrxnChargeBody);
        }
      } else {
        if (payment_method !== 4) {
          let return_amount: number = 0;
          if (invoice_payment >= crefund_return_amount) {
            return_amount = crefund_return_amount;
          } else if (invoice_payment < crefund_return_amount) {
            return_amount = invoice_payment;
          }

          let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
          if (payment_method === 1) {
            accPayType = 'CASH';
          } else if (payment_method === 2) {
            accPayType = 'BANK';
          } else if (payment_method === 3) {
            accPayType = 'MOBILE BANKING';
          } else {
            accPayType = 'CASH';
          }

          if (return_amount > 0) {
            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: crefund_account_id,
              acctrxn_type: 'DEBIT',
              acctrxn_amount: return_amount,
              acctrxn_created_at: date,
              acctrxn_voucher: tour_vouchar_number,
              acctrxn_created_by: created_by,
              acctrxn_note: note,
              acctrxn_particular_id: 112,
              acctrxn_particular_type: 'Tour refund create',
              acctrxn_pay_type: accPayType,
            };

            crefund_actransaction_id = await trxns.AccTrxnInsert(ACTrxnBody);
          }

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: return_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: tour_vouchar_number,
            ctrxn_particular_id: 112,
            ctrxn_created_at: date,
            ctrxn_note: note,
            ctrxn_particular_type: 'Tour refund create',
            ctrxn_airticket_no: ticket_no,
            ctrxn_pax: pax_name,
            ctrxn_pnr: ticket_pnr,
            ctrxn_route: airticket_route,
          };

          if (return_amount) {
            crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);
          }

          const clTrxnChargeBody: IClTrxnBody = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: crefund_charge_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: tour_vouchar_number,
            ctrxn_particular_id: 112,
            ctrxn_created_at: date,
            ctrxn_note: note,
            ctrxn_particular_type: 'Tour refund create',
            ctrxn_airticket_no: ticket_no,
            ctrxn_pax: pax_name,
            ctrxn_pnr: ticket_pnr,
            ctrxn_route: airticket_route,
          };

          if (crefund_charge_amount) {
            crefund_charge_ctrxnid = await trxns.clTrxnInsert(clTrxnChargeBody);
          }
        } else {
          // for cheque here...
        }
      }

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      const tourClientRefund: IRefundTourClient = {
        crefund_refund_id: refund_id,
        crefund_invoice_id: invoice_id,
        crefund_client_id: client_id as number,
        crefund_combined_id: combined_id as number,
        crefund_charge_amount,
        crefund_ctrxnid: crefund_ctrxnid as number,
        crefund_charge_ctrxnid: crefund_charge_ctrxnid as number,
        crefund_total_amount,
        crefund_return_amount: crefund_return_amount as number,
        crefund_vouchar_number: tour_vouchar_number,
        crefund_payment_type,
        crefund_moneyreturn_type: payment_method,
        crefund_account_id,
        crefund_actransaction_id: crefund_actransaction_id as number,
        crefund_date: date,
      };

      await conn.refundTourClient(tourClientRefund);

      // tour vendor refund

      const tourRefundVendorInfos: IRefundTourVendor[] = [];

      for (const itinerary of itineraries) {
        const name = itinerary[0];
        const items = itinerary[1];

        for (const item of items) {
          const {
            comb_vendor_id,
            vrefund_account_id,
            vrefund_payment_type,
            vrefund_return_amount,
            vrefund_total_amount,
            vrefund_charge_amount,
            vrefund_moneyreturn_type,
            trxn_charge_amount,
            date,
          } = item;

          await conn.updateAirticketItemIsRefund(invoice_id, 5, 1);

          const { vendor_id, combined_id } =
            separateCombClientToId(comb_vendor_id);

          let vrefund_vtrxn_id = null;
          let vrefund_charge_vtrxn_id = null;
          let vrefund_acctrxn_id = null;

          if (vrefund_payment_type === 'ADJUST') {
            const VTrxnBody: IVTrxn = {
              comb_vendor: comb_vendor_id,
              vtrxn_amount: vrefund_total_amount,
              vtrxn_created_at: date,
              vtrxn_note: note,
              vtrxn_particular_id: 112,
              vtrxn_particular_type: 'Tour refund Create',
              vtrxn_type: 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: tour_vouchar_number,
              vtrxn_airticket_no: ticket_no,
              vtrxn_pax: pax_name,
              vtrxn_pnr: ticket_pnr,
              vtrxn_route: airticket_route,
            };

            vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

            const VTrxnChargeBody: IVTrxn = {
              comb_vendor: comb_vendor_id,
              vtrxn_amount: vrefund_charge_amount,
              vtrxn_created_at: date,
              vtrxn_note: note,
              vtrxn_particular_id: 112,
              vtrxn_particular_type: 'Tour refund Create',
              vtrxn_type: 'DEBIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: tour_vouchar_number,
              vtrxn_airticket_no: ticket_no,
              vtrxn_pax: pax_name,
              vtrxn_pnr: ticket_pnr,
              vtrxn_route: airticket_route,
            };

            vrefund_charge_vtrxn_id = await trxns.VTrxnInsert(VTrxnChargeBody);
          } else {
            if (vrefund_moneyreturn_type !== 4) {
              const total_vendor_pay =
                await conn.getInvoiceVendorPaymentByVendor(
                  invoice_id,
                  vendor_id,
                  combined_id
                );

              let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
              if (vrefund_moneyreturn_type === 1) {
                accPayType = 'CASH';
              } else if (vrefund_moneyreturn_type === 2) {
                accPayType = 'BANK';
              } else if (vrefund_moneyreturn_type === 3) {
                accPayType = 'MOBILE BANKING';
              } else {
                accPayType = 'CASH';
              }

              const ACTrxnBody: IAcTrxn = {
                acctrxn_ac_id: vrefund_account_id,
                acctrxn_type: 'CREDIT',
                acctrxn_amount: vrefund_return_amount,
                acctrxn_created_at: date,
                acctrxn_voucher: tour_vouchar_number,
                acctrxn_created_by: created_by,
                acctrxn_note: note,
                acctrxn_particular_id: 112,
                acctrxn_particular_type: 'Tour refund create',
                acctrxn_pay_type: accPayType,
              };

              if (
                total_vendor_pay >= vrefund_return_amount &&
                vrefund_return_amount > 0
              ) {
                vrefund_acctrxn_id = await trxns.AccTrxnInsert(ACTrxnBody);
              }

              const VTrxnBody: IVTrxn = {
                comb_vendor: comb_vendor_id,
                vtrxn_amount: vrefund_return_amount,
                vtrxn_created_at: date,
                vtrxn_note: note,
                vtrxn_particular_id: 112,
                vtrxn_particular_type: 'Tour refund Create',
                vtrxn_type: 'CREDIT',
                vtrxn_user_id: created_by,
                vtrxn_voucher: tour_vouchar_number,
                vtrxn_airticket_no: ticket_no,
                vtrxn_pax: pax_name,
                vtrxn_pnr: ticket_pnr,
                vtrxn_route: airticket_route,
              };

              if (vrefund_return_amount) {
                vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
              }

              const VTrxnChargeBody: IVTrxn = {
                comb_vendor: comb_vendor_id,
                vtrxn_amount: vrefund_charge_amount,
                vtrxn_created_at: date,
                vtrxn_note: note,
                vtrxn_particular_id: 113,
                vtrxn_particular_type: 'Tour refund Create',
                vtrxn_type: 'DEBIT',
                vtrxn_user_id: created_by,
                vtrxn_voucher: tour_vouchar_number,
                vtrxn_airticket_no: ticket_no,
                vtrxn_pax: pax_name,
                vtrxn_pnr: ticket_pnr,
                vtrxn_route: airticket_route,
              };

              if (vrefund_charge_amount) {
                vrefund_charge_vtrxn_id = await trxns.VTrxnInsert(
                  VTrxnChargeBody
                );
              }
            } else {
              // FOR TOUR VENDOR REFUND CHEQUE....
            }
          }

          const tourVendorRefundInfos: IRefundTourVendor = {
            vrefund_refund_id: refund_id,
            vrefund_invoice_id: invoice_id,
            vrefund_vendor_id: vendor_id as number,
            vrefund_vendor_combined_id: combined_id as number,
            vrefund_trxn_type: name,
            vrefund_vtrxn_id: vrefund_vtrxn_id as number,
            vrefund_charge_vtrxn_id: vrefund_charge_vtrxn_id as number,
            vrefund_account_id,
            vrefund_acctrxn_id: vrefund_acctrxn_id as number,
            vrefund_total_amount,
            vrefund_charge_amount,
            vrefund_return_amount,
            vrefund_vouchar_number: tour_vouchar_number,
            vrefund_payment_type,
            vrefund_moneyreturn_type,
            vrefund_created_by: created_by,
          };

          tourRefundVendorInfos.push(tourVendorRefundInfos);
        }
      }

      if (tourRefundVendorInfos.length) {
        await conn.addTourVendor(tourRefundVendorInfos);
      }

      // END HERE

      // add tour itineraries
      await conn.updateInvoiceIsRefund(invoice_id, 1);

      // update vendor product is refund
      await conn.updateTourVendorsProductIsRefund(invoice_id, 1);

      const message = 'Tour refund created successfully';

      await this.insertAudit(req, 'create', message, created_by, 'REFUND');

      return {
        success: true,
        message,
        refund_id,
      };
    });
  };
}

export default AddTourPackRefund;
