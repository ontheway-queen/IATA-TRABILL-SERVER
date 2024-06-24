import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import InvoiceHelpers, {
  getClientOrCombId,
  InvoiceClientAndVendorValidate,
  isNotEmpty,
} from '../../../../../common/helpers/invoice.helpers';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IHotelInfoDB,
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { IOtherBillingInfoDb } from '../../../invoice_other/types/invoiceOther.interface';

import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IInvoiceUmmrahReq,
  IUmmrahPassenger,
} from '../../Type/invoiceUmmrah.Interfaces';

class EditInvoiceUmmrah extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceUmmrah = async (req: Request) => {
    const {
      billing_information,
      invoice_combclient_id,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_created_by,
      invoice_note,
      invoice_discount,
      invoice_haji_group_id,
      hotel_information,
      passenget_info,
      invoice_service_charge,
      invoice_client_previous_due,
      invoice_vat,
      invoice_agent_com_amount,
      invoice_agent_id,
      invoice_no,
      invoice_reference,
    } = req.body as IInvoiceUmmrahReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    // CLIENT AND COMBINED CLIENT

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.InvoiceUmmarhModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { prevCtrxnId, prevClChargeTransId } =
        await common_conn.getPreviousInvoices(invoice_id);

      const ctrxn_pnr =
        passenget_info[0] &&
        passenget_info.map((item) => item.ticket_pnr).join(', ');

      const tickets_no = passenget_info
        .map((item) => item.ticket_no)
        .join(', ');

      const routes =
        passenget_info &&
        passenget_info.map((item) => item.ticket_route as number[]);
      const flattenedRoutes = ([] as number[]).concat(...routes);

      let ctrxn_route;
      if (flattenedRoutes.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      let note = '';

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );

      if (productsIds.length) {
        note = await common_conn.getProductsName(productsIds);
      }

      // CLIENT TRANSACTIONS
      const utils = new InvoiceUtils(req.body, common_conn);
      const clientTransId = await utils.updateClientTrans(trxns, {
        prevClChargeTransId,
        prevCtrxnId,
        invoice_no,
        ctrxn_pnr,
        ctrxn_route,
        note,
        ticket_no: tickets_no,
        tr_type: 15,
        dis_tr_type: 16,
      });

      const invoice_information: IUpdateInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_combined_id,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_client_previous_due,
        invoice_haji_group_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_note,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price,
      };

      await common_conn.updateInvoiceInformation(
        invoice_id,
        invoice_information
      );

      // AGENT TRANSACTION
      if (invoice_agent_id) {
        await InvoiceHelpers.invoiceAgentTransactions(
          this.models.agentProfileModel(req, trx),
          req.agency_id,
          invoice_agent_id,
          invoice_id,
          invoice_no,
          invoice_created_by,
          invoice_agent_com_amount,
          'UPDATE',
          107,
          'INVOICE UMMRAH'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_discount,
        invoice_service_charge,
        invoice_agent_id,
        invoice_agent_com_amount,
      };

      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      // NEW BILLING INFO
      for (const item of billing_information) {
        const billingId = item?.billing_id;

        const billing_subtotal =
          item.billing_quantity * item.billing_unit_price;

        const billingData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: item.billing_quantity,
          billing_cost_price: item.billing_cost_price,
          billing_quantity: item.billing_quantity,
          billing_subtotal: billing_subtotal,
          billing_product_id: item.billing_product_id,
          billing_profit: item.billing_profit,
          billing_unit_price: item.billing_unit_price,
          pax_name: item.pax_name,
          billing_description: item.billing_description,
        };

        let VTrxnBody: IVTrxn | null = null;

        if (item.billing_comvendor && item.billing_cost_price) {
          const { combined_id, vendor_id } = separateCombClientToId(
            item.billing_comvendor
          );
          const billing_total_cost =
            item.billing_cost_price * item.billing_quantity;

          billingData.billing_vendor_id = vendor_id;
          billingData.billing_combined_id = combined_id;

          VTrxnBody = {
            comb_vendor: item.billing_comvendor,
            vtrxn_amount: billing_total_cost,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: item.billing_description,
            vtrxn_particular_id: 15,
            vtrxn_pax: item.pax_name,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_airticket_no: tickets_no,
            vtrxn_pnr: ctrxn_pnr,
            vtrxn_route: ctrxn_route,
          };
        }

        // DELETE BILLING INFO
        if (billingId) {
          const previousBilling = await conn.getUmrahBillingInfo(billingId);
          if (item.is_deleted) {
            await conn.deleteIUSingleBilling(billingId, invoice_created_by);

            await trxns.deleteInvVTrxn(previousBilling);
          } else if (VTrxnBody) {
            if (previousBilling[0]?.prevTrxnId) {
              await trxns.VTrxnUpdate({
                ...VTrxnBody,
                trxn_id: previousBilling[0]?.prevTrxnId,
              });

              billingData.billing_vtrxn_id = previousBilling[0]?.prevTrxnId;
            } else {
              billingData.billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
            }
          } else {
            await trxns.deleteInvVTrxn(previousBilling);

            billingData.billing_vendor_id = null;
            billingData.billing_combined_id = null;
            billingData.billing_vtrxn_id = null;
            billingData.billing_cost_price = 0;
          }

          await conn.updateIUBillingInfo(billingData, billingId);
        } else {
          if (VTrxnBody) {
            billingData.billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
          }

          await conn.insertIUBillingInfos(billingData);
        }
      }

      // ================== @PASSENGER_INFORMATION ==================

      if (isNotEmpty(passenget_info)) {
        for (const item of passenget_info) {
          const passengerId = item?.passenger_id;

          const ummrahPassengerData: IUmmrahPassenger = {
            passenger_invoice_id: invoice_id,
            passenger_passport_id: item.passenger_passport_id,
            passenger_tracking_number: item.passenger_tracking_number,
            ticket_pnr: item.ticket_pnr,
            ticket_airline_id: item.ticket_airline_id,
            ticket_no: item.ticket_no,
            ticket_reference_no: item.ticket_reference_no,
            ticket_journey_date: item.ticket_journey_date,
            ticket_return_date: item.ticket_return_date,
          };

          if (item.is_delete && passengerId) {
            await conn.deleteUmmrahPassenger(passengerId, invoice_created_by);
          } else if (passengerId) {
            await conn.deleteUmmrahPassengerRoutes(
              passengerId,
              invoice_created_by
            );

            await conn.updateUmmrahPassengerInfo(
              ummrahPassengerData,
              passengerId
            );

            const ummrahPassengerRoutes = item?.ticket_route?.map(
              (airportId) => {
                return {
                  iu_passenger_id: passengerId,
                  iu_airport_id: airportId,
                };
              }
            );

            if (ummrahPassengerRoutes) {
              await conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
            }
          } else {
            const passenger_id = await conn.insertUmmrahPassengerInfo(
              ummrahPassengerData
            );

            const ummrahPassengerRoutes = item?.ticket_route?.map((item) => {
              return { iu_passenger_id: passenger_id, iu_airport_id: item };
            });

            if (ummrahPassengerRoutes) {
              await conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
            }
          }
        }
      }

      if (isNotEmpty(hotel_information)) {
        for (const item of hotel_information) {
          const hotelId = item.hotel_id;

          const hotelInfo: IHotelInfoDB = {
            hotel_invoice_id: invoice_id,
            hotel_check_in_date: item.hotel_check_in_date,
            hotel_check_out_date: item.hotel_check_out_date,
            hotel_name: item.hotel_name,
            hotel_reference_no: item.hotel_reference_no,
            hotel_room_type_id: item.hotel_room_type_id,
          };

          if (hotelId && item.is_deleted) {
            await conn.deleteIUHotelInfo(hotelId, invoice_created_by);
          } else if (hotelId) {
            await conn.updateIUHotelInfo(hotelInfo, hotelId);
          } else {
            await conn.insertIUHotelInfos(hotelInfo);
          }
        }
      }

      // @Invoic History
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice ummrah has been updated',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice ummrah has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        data: 'Invoice Updated SuccessFully...',
      };
    });
  };
}

export default EditInvoiceUmmrah;
