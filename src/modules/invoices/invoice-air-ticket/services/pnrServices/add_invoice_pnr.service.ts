// KBWTST
// AGVKZZ - VOID

import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { addAdvanceMr } from '../../../../../common/helpers/invoice.helpers';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import {
  IPassportDb,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import CustomError from '../../../../../common/utils/errors/customError';
import { numRound } from '../../../../../common/utils/libraries/lib';
import { capitalize } from '../../../../../common/utils/libraries/pnr_lib';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IAirTicketDb,
  IFlightDetailsDb,
} from '../../types/invoiceAirticket.interface';
import {
  IPnrDetails,
  IPnrInvoiceBody,
} from '../../types/pnr_invoice.interfaces';
import PnrDetailsService from './pnr_details.service';

class AddInvoiceWithPnr extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceWithPnr = async (req: Request) => {
    const {
      invoice_combclient_id,
      invoice_walking_customer_name,
      invoice_discount,
      invoice_service_charge,
      invoice_pnr,
    } = req.body as IPnrInvoiceBody;

    const getPnrDetails = new PnrDetailsService();

    const pnrData = await getPnrDetails.pnrDetails(req, invoice_pnr);

    if (!pnrData.success) {
      return pnrData;
    }

    const pnrResponse = pnrData.data as IPnrDetails;

    if (!pnrResponse.invoice_sales_man_id) {
      throw new CustomError(
        'SALES_MAIN_NOT_FOUND',
        404,
        'Sales man not found with pnr creation sign:' +
          pnrResponse.creation_sign
      );
    }

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const pass_conn = this.models.passportModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);
      const trxns = new Trxns(req, trx);

      const invoice_note = 'THE INVOICE IS GENERATED AUTOMATICALLY.';

      // common invoice assets
      const invoice_no = await this.generateVoucher(req, 'AIT');
      const route_name = pnrResponse?.ticket_details[0].route_sectors.join(',');
      const { client_id, combined_id } = separateCombClientToId(
        invoice_combclient_id
      );

      const ticket_no = pnrResponse.ticket_details
        .map((item) => item.airticket_ticket_no)
        .join(',');

      const cl_preset_balance = await combined_conn.getClientLastBalanceById(
        client_id as number,
        combined_id as number
      );

      let invoice_sub_total = 0;
      let invoice_total_profit = 0;
      let invoice_total_vendor_price = 0;

      pnrResponse.ticket_details.forEach((item) => {
        invoice_sub_total += numRound(item.airticket_gross_fare);
        invoice_total_profit += numRound(item.airticket_profit);
        invoice_total_vendor_price += numRound(item.airticket_purchase_price);
      });

      const invoice_net_total =
        invoice_sub_total -
        numRound(invoice_discount) +
        numRound(invoice_service_charge);

      // client transaction
      const invoice_info = {
        invoice_net_total,
        invoice_note,
        invoice_sales_date: pnrResponse.invoice_sales_date,
        invoice_combclient_id,
        invoice_discount,
      };

      const utils = new InvoiceUtils(invoice_info, common_conn);
      const clientTransId = await utils.clientTrans(trxns, {
        ctrxn_pnr: invoice_pnr,
        ctrxn_route: route_name,
        extra_particular: 'Add Invoice Air Ticket(PNR)',
        invoice_no,
        ticket_no,
      });

      // invoice information
      const invoiceData: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_category_id: 1,
        invoice_client_id: client_id,
        invoice_combined_id: combined_id,
        invoice_net_total,
        invoice_no: invoice_no as string,
        invoice_sales_date: pnrResponse.invoice_sales_date,
        invoice_sales_man_id: pnrResponse.invoice_sales_man_id,
        invoice_sub_total,
        invoice_note,
        invoice_created_by: req.user_id,
        invoice_client_previous_due: cl_preset_balance,
        invoice_walking_customer_name,
        invoice_total_profit,
        invoice_total_vendor_price,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoiceData);

      // ADVANCE MR
      if (cl_preset_balance > 0) {
        await addAdvanceMr(
          common_conn,
          invoice_id,
          client_id,
          combined_id,
          invoice_net_total,
          cl_preset_balance
        );
      }

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_service_charge,
        invoice_discount,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      // await common_conn.insertInvoicePreData(invoicePreData);

      // ticket information
      for (const [index, ticket] of pnrResponse.ticket_details.entries()) {
        // vendor transaction
        const vtrxn_pax = ticket?.pax_passports
          .map((item) => item.passport_name)
          .join(',');

        const VTrxnBody: IVTrxn = {
          comb_vendor: ticket.airticket_comvendor,
          vtrxn_amount: ticket.airticket_purchase_price,
          vtrxn_created_at: pnrResponse.invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 146,
          vtrxn_particular_type: 'INV AIR TICKET PURCHASE',
          vtrxn_type: 'DEBIT',
          vtrxn_user_id: req.user_id,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: invoice_pnr,
          vtrxn_route: route_name,
          vtrxn_pax,
          vtrxn_airticket_no: ticket.airticket_ticket_no,
        };

        const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const { combined_id, vendor_id } = separateCombClientToId(
          ticket.airticket_comvendor
        );

        const invoiceAirticketItems = {
          airticket_purchase_price: ticket.airticket_purchase_price,
          airticket_client_id: client_id,
          airticket_combined_id: combined_id,
          airticket_invoice_id: invoice_id,
          airticket_sales_date: pnrResponse.invoice_sales_date,
          airticket_vendor_id: vendor_id,
          airticket_vendor_combine_id: combined_id,
          airticket_vtrxn_id,
          airticket_ticket_no: ticket.airticket_ticket_no,
          airticket_total_taxes_commission: 0,
          airticket_airline_id: ticket.airticket_airline_id,
          airticket_ait: ticket.airticket_ait,
          airticket_ait_from: 'Profit',
          airticket_base_fare: ticket.airticket_base_fare,
          airticket_profit: ticket.airticket_profit,
          airticket_classes: ticket.airticket_classes,
          airticket_client_price: ticket.airticket_client_price,
          airticket_ticket_type: 'NEW TKT',
          airticket_gross_fare: ticket.airticket_gross_fare,
          airticket_commission_percent: ticket.airticket_commission_percent,
          airticket_commission_percent_total:
            ticket.airticket_commission_percent_total,
          airticket_tax: ticket.airticket_tax,
          airticket_discount_type: 'amount',
          airticket_journey_date: ticket.airticket_journey_date,
          airticket_pnr: invoice_pnr,
          airticket_gds_id: 'Sabre',
          airticket_issue_date: ticket.airticket_issue_date,
          airticket_segment: ticket.airticket_segment,
          airticket_net_commssion: ticket.airticket_net_commssion,
          airticket_bd_charge: ticket.BD,
          airticket_ut_charge: ticket.UT,
          airticket_e5_charge: ticket.E5,
        };
        const airticket_id = await conn.insertInvoiceAirticketItem(
          invoiceAirticketItems as IAirTicketDb
        );

        // INSERT PAX PASSPORT INFO
        if (ticket?.pax_passports) {
          for (const passport of ticket?.pax_passports) {
            const identityDocuments = passport?.identityDocuments;

            if (
              identityDocuments &&
              identityDocuments.documentType === 'PASSPORT'
            ) {
              let passport_id = await pass_conn.getPassIdByPassNo(
                identityDocuments.documentNumber
              );

              if (!passport_id) {
                const PassportData: IPassportDb = {
                  passport_person_type: capitalize(
                    passport.passport_person_type
                  ) as 'Infant' | 'Child' | 'Adult',
                  passport_passport_no: identityDocuments.documentNumber,
                  passport_name: passport?.passport_name,
                  passport_mobile_no: passport.passport_mobile_no,
                  passport_date_of_birth:
                    identityDocuments.birthDate &&
                    dayjs(identityDocuments.birthDate).format(
                      'YYYY-MM-DD HH:mm:ss.SSS'
                    ),
                  passport_date_of_expire:
                    identityDocuments.expiryDate &&
                    dayjs(identityDocuments.expiryDate).format(
                      'YYYY-MM-DD HH:mm:ss.SSS'
                    ),
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
        }

        // airticket routes insert
        const airticketRoutes = ticket.airticket_route_or_sector.map(
          (airoute_route_sector_id) => {
            return {
              airoute_invoice_id: invoice_id,
              airoute_airticket_id: airticket_id,
              airoute_route_sector_id,
            };
          }
        );

        await common_conn.insertAirticketRoute(airticketRoutes);

        // flight details
        // if (index === 0) {
        const flightsDetails: IFlightDetailsDb[] = ticket?.flight_details?.map(
          (item) => {
            return {
              ...item,
              fltdetails_airticket_id: airticket_id,
              fltdetails_invoice_id: invoice_id,
            };
          }
        );

        await conn.insertAirTicketFlightDetails(flightsDetails);
      }
      // }

      // invoice history
      const content = `INV AIR TICKET ADDED, VOUCHER ${invoice_no}, PNR ${invoice_pnr}, BDT ${invoice_net_total}/-`;

      // invoice history
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: content,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'AIT');

      // audit trail
      await this.insertAudit(req, 'create', content, req.user_id, 'INVOICES');

      // response
      return {
        success: true,
        message: 'Invoice airticket has been added',
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceWithPnr;
