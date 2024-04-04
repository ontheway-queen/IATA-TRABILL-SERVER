import { Request } from 'express';
import moment from 'moment';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  ValidateClientAndVendor,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { InvoiceAirticketPreType } from '../../../invoice-air-ticket/types/invoiceAirticket.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  INonComTicketDetailsDb,
  InvoiceNonComReq,
} from '../../types/invoiceNonCommission.interface';

class EditInvoiceNonCommission extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceNonCommission = async (req: Request) => {
    const { invoice_info, ticketInfo, money_receipt } =
      req.body as InvoiceNonComReq;

    const {
      invoice_combclient_id,
      invoice_created_by,
      invoice_net_total,
      invoice_agent_com_amount,
      invoice_agent_id,
      invoice_discount,
      invoice_service_charge,
      invoice_vat,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_note,
      invoice_total_profit,
      invoice_total_vendor_price,
      invoice_show_passport_details,
      invoice_show_prev_due,
      invoice_show_discount,
      invoice_no,
      invoice_walking_customer_name,
      invoice_reference,
    } = invoice_info;

    // VALIDATE CLIENT AND VENDOR
    for (const ticket of ticketInfo) {
      const vendor = ticket.ticket_details.airticket_comvendor;

      await ValidateClientAndVendor(invoice_combclient_id, vendor as string);
    }

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceNonCommission(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const utils = new InvoiceUtils(invoice_info, common_conn);

      const trxns = new Trxns(req, trx);

      // CLIENT COMBINED TRANSACTIONS
      const { prevCtrxnId, prevClChargeTransId } =
        await common_conn.getPreviousInvoices(invoice_id);

      const ctrxn_pnr =
        ticketInfo &&
        ticketInfo.map((item) => item.ticket_details.airticket_pnr).join(', ');

      const ticket_no =
        ticketInfo[0] &&
        ticketInfo
          .map((item) => item.ticket_details.airticket_ticket_no)
          .join(', ');

      const routes =
        ticketInfo &&
        ticketInfo.map(
          (item) => item?.ticket_details?.airticket_route_or_sector
        );
      const flattenedRoutes = ([] as number[]).concat(...routes);

      let ctrxn_route;
      if (flattenedRoutes.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      await utils.updateClientTrans(
        trxns,
        prevCtrxnId,
        prevClChargeTransId,
        invoice_no,
        ctrxn_pnr as string,
        ctrxn_route as string,
        ticket_no
      );

      const prevBillingInfo = await conn.getPrevNonComVendor(invoice_id);

      await trxns.deleteInvVTrxn(prevBillingInfo);

      // AGENT TRANSACTIONS
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
          93,
          'AIR TICKET NON COMMISSION'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      const invoice_information: IUpdateInvoiceInfoDb = {
        invoice_client_id,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_note,
        invoice_combined_id,
        invoice_total_profit,
        invoice_total_vendor_price,
        invoice_walking_customer_name,
        invoice_reference,
      };

      await common_conn.updateInvoiceInformation(
        invoice_id,
        invoice_information
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      const invoicePreData: InvoiceAirticketPreType = {
        invoice_show_discount,
        airticket_invoice_id: invoice_id,
        invoice_show_passport_details: invoice_show_passport_details || 0,
        invoice_show_prev_due: invoice_show_prev_due || 0,
      };
      await common_conn.updateAirticketPreData(invoicePreData, invoice_id);

      // ====================== delete previous data
      await conn.deleteInvoiceNonComeFlightDetails(
        invoice_id,
        invoice_created_by
      );
      await conn.deleteNonComTicketItemAndPass(invoice_id, invoice_created_by);
      await common_conn.deleteAirticketRoute(invoice_id, invoice_created_by);

      // invoice air ticket items
      for (const ticket of ticketInfo) {
        const { flight_details, pax_passports, ticket_details } = ticket;

        const {
          airticket_id,
          airticket_purchase_price,
          airticket_comvendor,
          airticket_route_or_sector,
          airticket_ticket_no,
          airticket_pnr,
          ...restAirticketItem
        } = ticket_details;

        let airticketId = airticket_id;

        // CHECK IS VENDOR OR COMBINED

        let airticket_vendor_combine_id = null;
        let airticket_vendor_id = null;

        if (airticket_comvendor) {
          const { combined_id, vendor_id } =
            separateCombClientToId(airticket_comvendor);

          airticket_vendor_combine_id = combined_id;
          airticket_vendor_id = vendor_id;
        }

        const pax_names = pax_passports
          .filter((item) => item !== null)
          .filter((item) => item.is_deleted !== 1)
          .map((item2) => item2.passport_name)
          .join(',');

        let vtrxn_route;
        if (
          ticket_details.airticket_route_or_sector &&
          ticket_details.airticket_route_or_sector.length > 0
        ) {
          vtrxn_route = await common_conn.getRoutesInfo(
            ticket_details.airticket_route_or_sector
          );
        }

        let vtrxn_particular_type = 'Invoice non-commission cost. \n';

        if (restAirticketItem.airticket_journey_date) {
          const inputDate = new Date(restAirticketItem.airticket_journey_date);
          vtrxn_particular_type +=
            'Journey date: ' + moment(inputDate).format('DD MMM YYYY');
        }

        // VENDOR TRANSACTION
        const VTrxnBody: IVTrxn = {
          comb_vendor: airticket_comvendor,
          vtrxn_amount: airticket_purchase_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 147,
          vtrxn_particular_type,
          vtrxn_pax: pax_names,
          vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: airticket_pnr,
          vtrxn_route: vtrxn_route,
          vtrxn_airticket_no: airticket_ticket_no,
        };

        const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const invoiceNonComAirticketItems: INonComTicketDetailsDb = {
          ...restAirticketItem,
          airticket_purchase_price,
          airticket_client_id: invoice_client_id,
          airticket_combined_id: invoice_combined_id,
          airticket_invoice_id: invoice_id,
          airticket_sales_date: invoice_sales_date,
          airticket_vendor_id,
          airticket_vendor_combine_id,
          airticket_vtrxn_id,
          airticket_ticket_no,
          airticket_pnr,
        };

        airticketId = await conn.insertInvoiceNonCommissionItems(
          invoiceNonComAirticketItems
        );

        // INSERT PAX PASSPORT INFO
        await common_conn.deletePreviousPax(invoice_id, airticketId);

        if (pax_passports.length && pax_passports[0] && airticketId) {
          for (const passport of pax_passports) {
            if (passport.passport_id && passport.is_deleted) {
              await common_conn.deleteInvoiceAirTicketPax(
                invoice_id,
                airticketId,
                passport.passport_id
              );
            } else if (passport.passport_id) {
              await common_conn.insertPaxIfNotExist(
                invoice_id,
                airticketId,
                passport.passport_id
              );
            } else if (passport.passport_name && passport.is_deleted !== 1) {
              await common_conn.insertInvoiceAirticketPaxName(
                invoice_id,
                airticketId,
                passport.passport_name,
                passport.passport_person_type,
                passport.passport_mobile_no,
                passport.passport_email
              );
            }
          }
        }

        // airticket routes insert
        if (airticket_route_or_sector && airticket_route_or_sector.length) {
          const airticketRoutes = airticket_route_or_sector.map(
            (airoute_route_sector_id) => {
              return {
                airoute_invoice_id: invoice_id,
                airoute_airticket_id: airticketId,
                airoute_route_sector_id,
              };
            }
          );

          await common_conn.insertAirticketRoute(airticketRoutes);
        }

        // flight details
        if (
          flight_details[0] &&
          flight_details[0].fltdetails_flight_no &&
          airticketId
        ) {
          for (const item of flight_details) {
            const { fltdetails_id, is_deleted, ...restFlightsData } = item;

            const flightsData = {
              ...restFlightsData,
              fltdetails_airticket_id: airticketId as number,
              fltdetails_invoice_id: invoice_id,
            };

            if (fltdetails_id && is_deleted) {
              await conn.deleteInvoiceNonComeFlightDetails(
                fltdetails_id,
                invoice_created_by
              );
            } else if (fltdetails_id) {
              await conn.updateInvoiceNonComeFlightDetails(
                flightsData,
                fltdetails_id
              );
            } else {
              await conn.insertInvoiceNonComeFlightDetails(flightsData);
            }
          }
        }
      }

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice airticket non comission has been updated',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice airticket non commission has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice airticket non commission has been updated',
        invoice_id,
      };
    });
  };
}

export default EditInvoiceNonCommission;
