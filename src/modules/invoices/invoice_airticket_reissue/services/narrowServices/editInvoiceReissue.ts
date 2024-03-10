import { Request } from 'express';
import moment from 'moment';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  isNotEmpty,
  ValidateClientAndVendor,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import {
  IClTrxnUpdate,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { InvoiceAirticketPreType } from '../../../invoice-air-ticket/types/invoiceAirticket.interface';
import {
  InvoiceAirticketReissueReq,
  IReissueTicketDetailsDb,
} from '../../types/invoiceReissue.interface';

class EditReissueAirticket extends AbstractServices {
  constructor() {
    super();
  }

  public editReissueInvoice = async (req: Request) => {
    const { invoice_info, ticketInfo } = req.body as InvoiceAirticketReissueReq;

    const {
      invoice_combclient_id,
      invoice_created_by,
      invoice_net_total,
      invoice_vat,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_id,
      invoice_agent_com_amount,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_note,
      invoice_show_passport_details,
      invoice_show_prev_due,
      invoice_show_discount,
      invoice_no,
      invoice_reference,
    } = invoice_info;



    let invoice_total_profit = 0;
    let invoice_total_vendor_price = 0;

    for (const { ticket_details } of ticketInfo) {
      const vendor = ticket_details.airticket_comvendor;
      invoice_total_profit += ticket_details.airticket_profit;
      invoice_total_vendor_price += ticket_details.airticket_purchase_price;

      await ValidateClientAndVendor(invoice_combclient_id, vendor as string);
    }


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
      const conn = this.models.reissueAirticket(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const trxns = new Trxns(req, trx);

      const { prevCtrxnId } = await common_conn.getPreviousInvoices(invoice_id);

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
      if (flattenedRoutes) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      const paxPassports = ticketInfo
        .flatMap((item) => item.pax_passports)
        .filter((item) => item !== null)
        .filter((item2) => item2.is_deleted !== 1);

      let paxPassportName = paxPassports
        .map((item) => item.passport_name)
        .join(',');

      // journey date
      const journey_date =
        ticketInfo[0] &&
        ticketInfo
          .map((item) => item.ticket_details.airticket_journey_date)
          .join(', ');
      let ctrxn_particular_type = 'Air ticket reissue. \n';

      if (journey_date) {
        const inputDate = new Date(journey_date);
        ctrxn_particular_type +=
          'Journey date: ' + moment(inputDate).format('DD MMM YYYY');
      }

      const clTrxnBody: IClTrxnUpdate = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 91,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type,
        ctrxn_pnr,
        ctrxn_trxn_id: prevCtrxnId,
        ctrxn_route,
        ctrxn_airticket_no: ticket_no,
        ctrxn_pax: paxPassportName,
      };

      await trxns.clTrxnUpdate(clTrxnBody);

      // UPDATE INVOICE INFORMATION
      const invoice_information: IUpdateInvoiceInfoDb = {
        invoice_combined_id,
        invoice_client_id,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_note,
        invoice_updated_by: invoice_created_by,
        invoice_reference,

        invoice_total_profit,
        invoice_total_vendor_price,
      };

      common_conn.updateInvoiceInformation(invoice_id, invoice_information);

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
        invoice_show_passport_details,
        invoice_show_prev_due,
      };

      await common_conn.updateAirticketPreData(invoicePreData, invoice_id);

      // PREVIOUS VENDOR BILLINGS
      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await trxns.deleteInvVTrxn(previousVendorBilling);

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
          95,
          'AIR TICKET REISSUE'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      // DELETE PREVIOUS DATA
      await conn.deleteReissueTicketItems(invoice_id, invoice_created_by);

      // NON_COMMISSION_TICKETS
      for (const ticket of ticketInfo) {
        const { ticket_details, flight_details, pax_passports } = ticket;

        const {
          airticket_id,
          airticket_purchase_price,
          airticket_comvendor,
          airticket_route_or_sector,
          airticket_ticket_no,
          airticket_pnr,
          airticket_pax_name,
          ...restAirticketItems
        } = ticket_details;

        let airticketId = airticket_id;

        // CHECK IS VENDOR OR COMBINED

        const { combined_id, vendor_id } = separateCombClientToId(
          airticket_comvendor as string
        );

        let vtrxn_route;
        if (
          ticket_details.airticket_route_or_sector &&
          ticket_details.airticket_route_or_sector.length > 0
        ) {
          vtrxn_route = await common_conn.getRoutesInfo(
            ticket_details.airticket_route_or_sector
          );
        }

        const pax_names = pax_passports
          .filter((item) => item !== null)
          .filter((item) => item.is_deleted !== 1)
          .map((item2) => item2.passport_name)
          .join(',');

        const VTrxnBody: IVTrxn = {
          comb_vendor: airticket_comvendor,
          vtrxn_amount: airticket_purchase_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 148,
          vtrxn_particular_type: 'Invoice reissue',
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_airticket_no: airticket_ticket_no,
          vtrxn_route: vtrxn_route,
          vtrxn_pax: pax_names,
          vtrxn_pnr: airticket_pnr,
        };

        const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const invoiceNonComAirticketItems: IReissueTicketDetailsDb = {
          ...restAirticketItems,
          airticket_pnr,
          airticket_pax_name,
          airticket_purchase_price,
          airticket_client_id: invoice_client_id,
          airticket_combined_id: invoice_combined_id,
          airticket_invoice_id: invoice_id,
          airticket_sales_date: invoice_sales_date,
          airticket_vendor_id: vendor_id,
          airticket_vendor_combine_id: combined_id,
          airticket_vtrxn_id,
          airticket_ticket_no,
        };

        airticketId = await conn.insertReissueAirticketItems(
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
        if (isNotEmpty(airticket_route_or_sector)) {
          const airticketRoutes = airticket_route_or_sector.map(
            (airoute_route_sector_id) => {
              return {
                airoute_invoice_id: invoice_id,
                airoute_airticket_id: airticket_id,
                airoute_route_sector_id,
              };
            }
          );

          await common_conn.insertAirticketRoute(airticketRoutes);
        }

        if (isNotEmpty(flight_details[0]) && airticketId) {
          const flightsDetails = flight_details?.map((item) => {
            return {
              ...item,
              fltdetails_airticket_id: airticketId as number,
              fltdetails_invoice_id: invoice_id,
            };
          });
          await conn.insertReissueFlightDetails(flightsDetails);
        }
      }

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice airticket reissue has been updated',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice airticket reissue has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        data: 'Invoice airticket reissue updated successfully...',
      };
    });
  };
}

export default EditReissueAirticket;
