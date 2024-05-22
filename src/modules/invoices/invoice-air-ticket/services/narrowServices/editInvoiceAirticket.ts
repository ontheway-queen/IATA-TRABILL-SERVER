import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  isNotEmpty,
  ValidateClientAndVendor,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IAirTicketDb,
  InvoiceAirticketPreType,
  InvoiceAirTicketReqType,
} from '../../types/invoiceAirticket.interface';

class EditInvoiceAirticket extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceAirTicket = async (req: Request) => {
    const { invoice_info, ticketInfo } = req.body as InvoiceAirTicketReqType;

    const {
      invoice_combclient_id,
      invoice_created_by,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_note,
      invoice_vat,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_id,
      invoice_agent_com_amount,
      invoice_show_discount,
      invoice_show_passport_details,
      invoice_show_prev_due,
      invoice_show_unit,
      invoice_no,
      invoice_walking_customer_name,
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

    const { invoice_client_id, invoice_combined_id } = getClientOrCombId(
      invoice_combclient_id
    );
    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
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
      if (flattenedRoutes?.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      // CLIENT TRANSACTIONS
      const clientTransId = await utils.updateClientTrans(trxns, {
        ctrxn_pnr: ctrxn_pnr as string,
        ctrxn_route: ctrxn_route as string,
        extra_particular: 'Air Ticket',
        invoice_no,
        prevClChargeTransId,
        prevCtrxnId,
        ticket_no,
      });

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
          91,
          'INVOICE AIR TICKET'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      // INVOICE INFORMATION UPDATE
      const invoice_information: IUpdateInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_note,
        invoice_combined_id,
        invoice_walking_customer_name,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price,
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
        airticket_invoice_id: invoice_id,
        invoice_show_discount,
        invoice_show_passport_details,
        invoice_show_prev_due,
        invoice_show_unit,
      };

      await common_conn.updateAirticketPreData(invoicePreData, invoice_id);

      // DELETE PREVIOUS TAXES COMMISSION
      await conn.deleteAirTicketAirlineCommissions(invoice_id);

      // air tickets
      for (const ticket of ticketInfo) {
        const {
          flight_details,
          pax_passports,
          ticket_details,
          taxes_commission,
          total_taxes_commission,
        } = ticket;

        const {
          airticket_id,
          is_deleted,
          airticket_comvendor,
          airticket_route_or_sector,
          airticket_purchase_price,
          airticket_ticket_no,
          airticket_pnr,
          ...restAirticketData
        } = ticket_details;

        let prevAirticket;
        let airticketId = airticket_id;

        if (airticket_id) {
          prevAirticket = await conn.getPreviousTicketItems(airticket_id);
        }

        // CHECK IS VENDOR OR COMBINED

        let airticket_vendor_combine_id = null;
        let airticket_vendor_id = null;

        if (airticket_comvendor) {
          const { combined_id, vendor_id } =
            separateCombClientToId(airticket_comvendor);

          airticket_vendor_combine_id = combined_id;
          airticket_vendor_id = vendor_id;
        }

        let vtrxn_route;
        if (
          ticket_details.airticket_route_or_sector &&
          ticket_details.airticket_route_or_sector?.length > 0
        ) {
          vtrxn_route = await common_conn.getRoutesInfo(
            ticket_details.airticket_route_or_sector
          );
        }

        const pax_names = pax_passports
          ?.filter((item) => item !== null)
          ?.filter((item) => item.is_deleted !== 1)
          ?.map((item2) => item2?.passport_name)
          ?.join(',');

        // VENDOR TRANSACTION
        const VTrxnBody: IVTrxn = {
          comb_vendor: airticket_comvendor,
          vtrxn_amount: airticket_purchase_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 146,
          vtrxn_particular_type: 'Invoice Airticket',
          vtrxn_pax: pax_names,
          vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: airticket_pnr,
          vtrxn_route: vtrxn_route,
          vtrxn_airticket_no: airticket_ticket_no,
        };

        const invoiceAirticketItems: IAirTicketDb = {
          ...restAirticketData,
          airticket_purchase_price,
          airticket_client_id: invoice_client_id,
          airticket_combined_id: invoice_combined_id,
          airticket_invoice_id: invoice_id,
          airticket_sales_date: invoice_sales_date,
          airticket_vendor_id,
          airticket_vendor_combine_id,
          airticket_ticket_no,
          airticket_pnr,
          airticket_total_taxes_commission: total_taxes_commission,
        };

        if (airticket_id && is_deleted && prevAirticket) {
          await common_conn.deleteAirticketRouteByTicketIdAndInvoice(
            invoice_id,
            airticket_id,
            invoice_created_by
          );

          await conn.deleteAirticketFlightsAndPaxByTicketId(
            airticket_id,
            invoice_created_by
          );

          await trxns.deleteVTrxn(
            prevAirticket?.airticket_vtrxn_id,
            prevAirticket?.comb_vendor
          );

          continue;
        } else if (airticket_id) {
          await common_conn.deleteAirticketRouteByTicketIdAndInvoice(
            invoice_id,
            airticket_id,
            invoice_created_by
          );

          await conn.updateInvoiceAirticketItem(
            invoiceAirticketItems,
            airticket_id
          );

          await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: prevAirticket?.airticket_vtrxn_id as number,
          });
        } else {
          const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

          airticketId = await conn.insertInvoiceAirticketItem({
            ...invoiceAirticketItems,
            airticket_vtrxn_id,
          });
        }

        // INSERT PAX PASSPORT INFO
        await common_conn.deletePreviousPax(invoice_id, airticketId);

        if (pax_passports?.length && pax_passports[0] && airticketId) {
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
            } else if (passport?.passport_name && passport.is_deleted !== 1) {
              await common_conn.insertInvoiceAirticketPaxName(
                invoice_id,
                airticketId,
                passport?.passport_name,
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
                airoute_airticket_id: airticketId,
                airoute_route_sector_id,
              };
            }
          );

          await common_conn.insertAirticketRoute(airticketRoutes);
        }

        // flight details
        if (flight_details?.length && flight_details[0]?.fltdetails_flight_no) {
          for (const item of flight_details) {
            const { fltdetails_id, is_deleted, ...restFlightsData } = item;

            const flightsData = {
              ...restFlightsData,
              fltdetails_airticket_id: airticketId as number,
              fltdetails_invoice_id: invoice_id,
            };

            if (fltdetails_id && is_deleted) {
              await conn.deleteAirticketFlightByFlightId(
                fltdetails_id,
                invoice_created_by
              );
            } else if (fltdetails_id) {
              await conn.updateAirticketFlightByFlightId(
                flightsData,
                fltdetails_id
              );
            } else {
              await conn.insertAirTicketFlightDetails(flightsData);
            }
          }
        }

        // TAXES COMMISSION
        if (
          taxes_commission &&
          isNotEmpty(taxes_commission[0]) &&
          airticketId
        ) {
          const taxesCommission = taxes_commission?.map((item) => {
            return {
              ...item,
              airline_airticket_id: airticketId as number,
              airline_invoice_id: invoice_id,
            };
          });

          await conn.insertAirTicketAirlineCommissions(taxesCommission);
        }
      }

      const content = `INV AIR TICKET UPDATED, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: `AIR TICKET UPDATED, BDT ${invoice_net_total}/-`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        content,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice airticket has been updated',
      };
    });
  };
}

export default EditInvoiceAirticket;
