import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { IInvoiceInfoDb } from '../../../../../common/types/Invoice.common.interface';
import {
  IPassportDb,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import { numRound } from '../../../../../common/utils/libraries/lib';
import { capitalize } from '../../../../../common/utils/libraries/pnr_lib';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import { IFlightDetailsDb } from '../../types/invoiceAirticket.interface';
import { IInvoiceIURBody } from '../../types/invoiceIUR.interfaces';

class createInvoiceIUR extends AbstractServices {
  constructor() {
    super();
  }

  public create = async (req: Request) => {
    const body = req.body as IInvoiceIURBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const pass_conn = this.models.passportModel(req, trx);
      const cl_conn = this.models.clientModel(req, trx);
      const pnr_conn = this.models.PnrDetailsModels(req, trx);
      const trxns = new Trxns(req, trx);

      const client_id = await cl_conn.getClByCateId(body.client_ref);

      const vendor_id = await pnr_conn.getIataVendor();

      const invoice_sales_man_id = await pnr_conn.getEmployeeByCreationSign(
        body.creation_sign
      );

      let invoice_sub_total = 0;
      let invoice_profit = 0;
      let invoice_total_vendor_price = 0;
      let invoice_note = 'IUR';
      let ticket_nos: string[] = [];
      let routes: string[] = [];
      let pnr: string[] = [];

      const ticketDetails = body.ticketInfo.map((item) => {
        const tkt = item.ticket_details;

        let totalCountryTax =
          numRound(tkt.airticket_bd_charge) +
          numRound(tkt.airticket_ut_charge) +
          numRound(tkt.airticket_e5_charge);

        let taxesCommission = 0;
        if (['TK', 'CZ'].includes(tkt.airline_name)) {
          taxesCommission = tkt.yq;
        } else if (['MH', 'AI'].includes(tkt.airline_name)) {
          taxesCommission = taxesCommission = tkt.yr;
        }

        const countryTaxAit = Number(totalCountryTax || 0) * 0.003;

        const airticket_ait = Math.round(tkt.airticket_ait - countryTaxAit);
        const airticket_net_commssion =
          tkt.airticket_commission_percent_total -
          airticket_ait +
          taxesCommission;

        const airticket_profit = airticket_net_commssion;

        const airticket_purchase_price =
          tkt.airticket_gross_fare - airticket_net_commssion;

        invoice_sub_total += tkt.airticket_client_price;
        invoice_profit += airticket_profit;
        invoice_total_vendor_price += airticket_purchase_price;

        ticket_nos.push(tkt.airticket_ticket_no);

        if (!routes.includes(tkt.airticket_routes)) {
          routes.push(tkt.airticket_routes);
        }
        if (!pnr.includes(tkt.airticket_pnr)) {
          pnr.push(tkt.airticket_pnr);
        }

        return {
          ...item,
          ticket_details: {
            ...tkt,
            airticket_ait,
            airticket_net_commssion,
            airticket_profit,
            airticket_purchase_price,
            airticket_tax: tkt.airticket_gross_fare - tkt.airticket_base_fare,
          },
        };
      });

      const invoice_info = {
        invoice_net_total: invoice_sub_total,
        invoice_sales_date: body.issue_date,
        invoice_combclient_id: 'client-' + client_id,
        invoice_discount: 0,
        invoice_note,
      };

      const utils = new InvoiceUtils(invoice_info, common_conn);

      const invoice_no = await this.generateVoucher(req, 'AIT');

      // client trans
      const clientTransId = await utils.clientTrans(trxns, {
        ctrxn_pnr: pnr.join(','),
        tr_type: 1,
        dis_tr_type: 2,
        ctrxn_route: routes.join(','),
        invoice_no,
        ticket_no: ticket_nos.join(','),
      });

      const invoiceData: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_category_id: 1,
        invoice_client_id: null,
        invoice_combined_id: null,
        invoice_cltrxn_id: null,
        invoice_net_total: invoice_sub_total,
        invoice_no: invoice_no,
        invoice_sales_date: body.issue_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_note: 'THIS IS A SOFTWARE GENERATED INVOICE COPY/IUR',
        invoice_created_by: req.user_id,
        invoice_total_vendor_price,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoiceData);

      for (const item of ticketDetails) {
        const { flight_details, pax_passports, ticket_details } = item;

        const { airline_name, airticket_routes, yq, yr, ...tkt_details } =
          ticket_details;

        const airline_id = await conn.getAirlineByCode(airline_name);

        const vtrxn_pax = pax_passports
          .map((item) => item.passport_name)
          .join(',');

        const VTrxnBody: IVTrxn = {
          comb_vendor: 'vendor-' + vendor_id,
          vtrxn_amount: tkt_details.airticket_purchase_price,
          vtrxn_created_at: body.issue_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 1,
          vtrxn_type: 'DEBIT',
          vtrxn_user_id: req.user_id,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: tkt_details.airticket_pnr,
          vtrxn_route: airticket_routes,
          vtrxn_pax,
          vtrxn_airticket_no: tkt_details.airticket_ticket_no,
        };

        const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const airTicketItem = {
          ...tkt_details,
          airticket_client_id: client_id,
          airticket_invoice_id: invoice_id,
          airticket_vendor_id: vendor_id,
          airticket_vtrxn_id,
          airticket_airline_id: airline_id,
          airticket_ait_from: 'PROFIT',
          airticket_ticket_type: 'IUR TKT',
          airticket_gds_id: 'Sabre',
        };

        const airticket_id = await conn.insertInvoiceAirticketItem(
          airTicketItem as any // ================================
        );

        // INSERT PAX PASSPORT INFO
        if (pax_passports) {
          for (const passport of pax_passports) {
            if (passport && passport?.passport_passport_no) {
              let passport_id = await pass_conn.getPassIdByPassNo(
                passport?.passport_passport_no
              );

              if (!passport_id) {
                const PassportData: IPassportDb = {
                  passport_person_type: capitalize(
                    passport.passport_person_type
                  ) as 'Infant' | 'Child' | 'Adult',
                  passport_passport_no: passport.passport_passport_no,
                  passport_name: passport?.passport_name,
                  passport_mobile_no: passport.passport_mobile_no,
                  passport_email: passport.passport_email,
                  passport_created_by: req.user_id,
                };

                passport_id = await pass_conn.addPassport(PassportData);
              }

              await common_conn.insertInvoiceAirticketPax(
                invoice_id,
                airticket_id,
                passport_id
              );
            } else {
              await common_conn.insertInvoiceAirticketPaxName(
                invoice_id,
                airticket_id,
                passport?.passport_name,
                capitalize(passport.passport_person_type),
                passport.passport_mobile_no,
                passport.passport_email
              );
            }
          }

          // flight details

          const flightsDetails: IFlightDetailsDb[] = [];

          for (const item of flight_details) {
            const fltdetails_airline_id = await pnr_conn.airlineIdByCode(
              item.fltdetails_airline
            );
            const fltdetails_from_airport_id = await pnr_conn.airportIdByCode(
              item.fltdetails_from_airport
            );
            const fltdetails_to_airport_id = await pnr_conn.airportIdByCode(
              item.fltdetails_to_airport
            );

            flightsDetails.push({
              fltdetails_from_airport_id,
              fltdetails_to_airport_id,
              fltdetails_airline_id,
              fltdetails_flight_no: item.fltdetails_flight_no,
              fltdetails_fly_date: item.fltdetails_fly_date,
              fltdetails_departure_time: item.fltdetails_departure_time,
              fltdetails_arrival_time: item.fltdetails_arrival_time,
              fltdetails_airticket_id: airticket_id,
              fltdetails_invoice_id: invoice_id,
            });
          }

          await conn.insertAirTicketFlightDetails(flightsDetails);
        }
      }

      const content = `IMPORT IUR, VOUCHER ${invoice_no}, BDT ${invoice_sub_total}/-`;

      // invoice history
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_sub_total,
        invoicelog_content: content,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(req, 'create', content, req.user_id, 'INVOICES');

      return {
        success: true,
        message: content,
        data: { invoice_id },
      };
    });
  };
}
export default createInvoiceIUR;
