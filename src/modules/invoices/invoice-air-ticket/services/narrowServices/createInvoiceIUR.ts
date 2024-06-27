import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import {
  IAirTicketDb,
  IAirticketRoutes,
  IFlightDetailsDb,
  IInvoiceIURReqBody,
  InvoiceAirticketPreType,
} from '../../types/invoiceAirticket.interface';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { isNotEmpty } from '../../../../../common/helpers/invoice.helpers';

class createInvoiceIUR extends AbstractServices {
  constructor() {
    super();
  }

  // TODO if in future need have agent and money receipt info then add agent transaction and common invoice money receipt

  public create = async (req: Request) => {
    const { ticketInfo, creation_sign, issue_date } =
      req.body as IInvoiceIURReqBody;

    const { user_id } = req;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const invoice_no = await this.generateVoucher(req, 'AIT');

      const employee_id = await conn.getEmployeeBySign(creation_sign);

      let invoice_total_profit = 0;
      let invoice_total_vendor_price = 0;
      let invoice_net_total = 0;
      let invoice_sub_total = 0;

      for (const { ticket_details } of ticketInfo) {
        invoice_total_profit += ticket_details.airticket_profit;
        invoice_total_vendor_price += ticket_details.airticket_purchase_price;
        invoice_sub_total += ticket_details.airticket_client_price;
      }

      const invoiceData: IInvoiceInfoDb = {
        invoice_category_id: 1,
        invoice_client_id: null,
        invoice_combined_id: null,
        invoice_cltrxn_id: null,
        invoice_net_total,
        invoice_no: invoice_no,
        invoice_sales_date: issue_date,
        invoice_sales_man_id: employee_id,
        invoice_sub_total,
        invoice_note: null,
        invoice_created_by: user_id,
        invoice_total_vendor_price,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoiceData);

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat: 0,
        invoice_service_charge: 0,
        invoice_discount: 0,
        invoice_agent_id: 0,
        invoice_agent_com_amount: 0,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      const invoicePreData: InvoiceAirticketPreType = {
        airticket_invoice_id: invoice_id,
        invoice_show_discount: 0,
        invoice_show_passport_details: 0,
        invoice_show_prev_due: 0,
        invoice_show_unit: 0,
      };

      await common_conn.insertInvoicePreData(invoicePreData);

      for (const ticket of ticketInfo) {
        const {
          flight_details,
          pax_passports,
          ticket_details,
          taxes_commission,
          total_taxes_commission,
        } = ticket;

        let airticket_vendor_combine_id = null;
        let airticket_vendor_id = null;

        const {
          airticket_ticket_no,
          airticket_gross_fare,
          airticket_base_fare,
          airticket_commission_percent,
          airticket_commission_percent_total,
          airticket_client_price,
          airticket_classes,
          airticket_pnr,
          airticket_issue_date,
          airticket_journey_date,
          airticket_return_date,
          airline_name,
          airticket_ait,
          airticket_segment,
          airticket_bd_charge,
          airticket_xt_charge,
          airticket_ut_charge,
          airticket_es_charge,
          airticket_e5_charge,
          airticket_tax,
          airticket_ait_from,
          airticket_discount_type,
          airticket_discount_total,
          airticket_extra_fee,
          airticket_other_bonus_total,
          airticket_other_bonus_type,
          airticket_other_expense,
          airticket_vat,
          airticket_purchase_price,
          airticket_profit,
          airticket_net_commssion,
          airticket_tax1,
          airticket_g4_charge,
          airticket_p7_charge,
          airticket_p8_charge,
          airticket_r9_charge,
          airticket_ow_charge,
          airticket_pz_charge,
          airticket_qa_charge,
        } = ticket_details;

        const airline_id = await conn.getAirlineByCode(airline_name);

        const invoiceAirticketItems: IAirTicketDb = {
          airticket_purchase_price,
          airticket_client_id: null,
          airticket_combined_id: null,
          airticket_invoice_id: invoice_id,
          airticket_sales_date: issue_date,
          airticket_vendor_id,
          airticket_vendor_combine_id,
          airticket_vtrxn_id: null,
          airticket_ticket_no,
          airticket_total_taxes_commission: total_taxes_commission,
          airticket_airline_id: airline_id,
          airticket_ait,
          airticket_ait_from,
          airticket_base_fare,
          airticket_bd_charge,
          airticket_classes,
          airticket_client_price,
          airticket_commission_percent,
          airticket_commission_percent_total,
          airticket_discount_total,
          airticket_discount_type,
          airticket_ticket_type: 'NEW TKT',
          airticket_gross_fare,
          airticket_tax,
          airticket_extra_fee,
          airticket_other_bonus_total,
          airticket_other_bonus_type,
          airticket_other_expense,
          airticket_vat,
          airticket_profit,
          airticket_journey_date,
          airticket_return_date,
          airticket_gds_id: 'Sabre',
          airticket_issue_date,
          airticket_segment,
          airticket_net_commssion,
          airticket_pnr,
          airticket_es_charge,
          airticket_ut_charge,
          airticket_xt_charge,
          airticket_tax1,
          airticket_g4_charge,
          airticket_e5_charge,
          airticket_p7_charge,
          airticket_p8_charge,
          airticket_r9_charge,
          airticket_ow_charge,
          airticket_pz_charge,
          airticket_qa_charge,
        };
        const airticket_id = await conn.insertInvoiceAirticketItem(
          invoiceAirticketItems
        );

        // INSERT PAX PASSPORT INFO
        if (pax_passports && pax_passports?.length) {
          for (const passport of pax_passports) {
            if (passport.passport_id) {
              await common_conn.insertInvoiceAirticketPax(
                invoice_id,
                airticket_id,
                passport.passport_id
              );
            } else if (passport?.passport_name) {
              await common_conn.insertInvoiceAirticketPaxName(
                invoice_id,
                airticket_id,
                passport?.passport_name,
                passport.passport_person_type,
                passport.passport_mobile_no,
                passport.passport_email
              );
            }
          }
        }

        // airticket routes insert
        if (ticket_details.airticket_routes) {
          const routes = ticket_details.airticket_routes.split(' - ');

          const airticketRoutes: IAirticketRoutes[] = [];

          for (const route of routes) {
            const route_id = await conn.getRouteByIataCode(route);

            const routeInfo: IAirticketRoutes = {
              airoute_invoice_id: invoice_id,
              airoute_airticket_id: airticket_id,
              airoute_route_sector_id: route_id,
            };

            airticketRoutes.push(routeInfo);
          }

          if (airticketRoutes.length)
            await common_conn.insertAirticketRoute(airticketRoutes);
        }

        // flight details
        if (flight_details && isNotEmpty(flight_details[0])) {
          const flightsDetails: IFlightDetailsDb[] = [];

          for (const flight of flight_details) {
            const {
              fltdetails_airline,
              fltdetails_arrival_time,
              fltdetails_departure_time,
              fltdetails_flight_no,
              fltdetails_fly_date,
              fltdetails_from_airport,
              fltdetails_to_airport,
            } = flight;

            const from_id = await conn.getRouteByIataCode(
              fltdetails_from_airport
            );
            const to_id = await conn.getRouteByIataCode(fltdetails_to_airport);

            const airline_id = await conn.getAirlineByCode(fltdetails_airline);

            const flightInfo: IFlightDetailsDb = {
              fltdetails_from_airport_id: from_id,
              fltdetails_to_airport_id: to_id,
              fltdetails_airline_id: airline_id,
              fltdetails_flight_no,
              fltdetails_fly_date,
              fltdetails_departure_time,
              fltdetails_arrival_time,
              fltdetails_airticket_id: airticket_id,
              fltdetails_invoice_id: invoice_id,
            };

            flightsDetails.push(flightInfo);
          }

          if (flightsDetails && flightsDetails.length)
            await conn.insertAirTicketFlightDetails(flightsDetails);
        }

        // TAXES COMMISSION
        if (taxes_commission && isNotEmpty(taxes_commission[0])) {
          const taxesCommission = taxes_commission?.map((item) => {
            return {
              ...item,
              airline_airticket_id: airticket_id,
              airline_invoice_id: invoice_id,
            };
          });

          await conn.insertAirTicketAirlineCommissions(taxesCommission);
        }
      }

      const content = `INV AIR TICKET ADDED, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;

      // invoice history
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: content,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'create',
        'Invoice IUR created',
        req.user_id,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Create Invoice IUR Successfully',
      };
    });
  };
}
export default createInvoiceIUR;
