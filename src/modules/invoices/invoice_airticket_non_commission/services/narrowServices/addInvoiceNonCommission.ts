import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  addAdvanceMr,
  getClientOrCombId,
  isEmpty,
  isNotEmpty,
  MoneyReceiptAmountIsValid,
  ValidateClientAndVendor,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';

import moment from 'moment';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { InvoiceAirticketPreType } from '../../../invoice-air-ticket/types/invoiceAirticket.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  INonComTicketDetailsDb,
  InvoiceNonComReq,
} from '../../types/invoiceNonCommission.interface';

class AddInvoiceNonCommission extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceNonCommission = async (req: Request) => {
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
      invoice_walking_customer_name,
      invoice_reference,
    } = invoice_info;

    let total_profit = 0;

    for (const { ticket_details } of ticketInfo) {
      const vendor = ticket_details.airticket_comvendor;
      total_profit += ticket_details.airticket_profit;

      await ValidateClientAndVendor(invoice_combclient_id, vendor as string);
    }

    // VALIDATE CLIENT AND VENDOR
    for (const ticket of ticketInfo) {
      const vendor = ticket.ticket_details.airticket_comvendor;

      await ValidateClientAndVendor(invoice_combclient_id, vendor as string);
    }

    // VALIDATE MONEY RECEIPT AMOUNT
    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceNonCommission(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);
      const utils = new InvoiceUtils(invoice_info, common_conn);

      const trxns = new Trxns(req, trx);

      const invoice_no = await this.generateVoucher(req, 'ANC');

      const invoice_client_previous_due =
        await combined_conn.getClientLastBalanceById(
          invoice_client_id as number,
          invoice_combined_id as number
        );

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

      const clientTransId = await utils.clientTrans(
        trxns,
        invoice_no,
        ctrxn_pnr as string,
        ctrxn_route as string,
        ticket_no
      );

      const invoiceData: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_category_id: 2,
        invoice_client_id,
        invoice_net_total,
        invoice_no: invoice_no as string,
        invoice_combined_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_note,
        invoice_created_by,
        invoice_client_previous_due,
        invoice_total_profit,
        invoice_total_vendor_price,
        invoice_walking_customer_name,
        invoice_reference,
      };
      const invoice_id = await common_conn.insertInvoicesInfo(invoiceData);

      // ADVANCE MR
      if (isEmpty(req.body.money_receipt)) {
        await addAdvanceMr(
          common_conn,
          invoice_id,
          invoice_client_id,
          invoice_combined_id,
          invoice_net_total
        );
      }

      // AGENT TRANSACTION
      await InvoiceHelpers.invoiceAgentTransactions(
        this.models.agentProfileModel(req, trx),
        req.agency_id,
        invoice_agent_id,
        invoice_id,
        invoice_no,
        invoice_created_by,
        invoice_agent_com_amount,
        'CREATE',
        92,
        'AIR TICKET NON COMMISSION'
      );

      const invoice_extra_ammount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_agent_com_amount,
        invoice_agent_id,
        invoice_discount,
        invoice_service_charge,
        invoice_vat,
      };
      await common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);

      const invoicePreData: InvoiceAirticketPreType = {
        invoice_show_discount,
        airticket_invoice_id: invoice_id,
        invoice_show_passport_details: invoice_show_passport_details || 0,
        invoice_show_prev_due: invoice_show_prev_due || 0,
      };

      await common_conn.insertInvoicePreData(invoicePreData);

      // invoice air ticket items

      for (const ticket of ticketInfo) {
        const { flight_details, pax_passports, ticket_details } = ticket;

        const {
          airticket_purchase_price,
          airticket_comvendor,
          airticket_route_or_sector,
          airticket_ticket_no,
          airticket_pnr,
          ...restAirticketItem
        } = ticket_details;

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
          ticket_details.airticket_route_or_sector.length > 0
        ) {
          vtrxn_route = await common_conn.getRoutesInfo(
            ticket_details.airticket_route_or_sector
          );
        }

        const vtrxn_pax = pax_passports
          .map((item) => item.passport_name)
          .join(',');

        // VENDOR TRANSACTIONS
        const VTrxnBody: IVTrxn = {
          comb_vendor: airticket_comvendor,
          vtrxn_amount: airticket_purchase_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 147,
          vtrxn_particular_type: 'NON COMM AIR TICKET PURCHASE',
          vtrxn_pax,
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

        const airticket_id = await conn.insertInvoiceNonCommissionItems(
          invoiceNonComAirticketItems
        );

        // INSERT PAX PASSPORT INFO
        if (pax_passports.length) {
          for (const passport of pax_passports) {
            if (passport.passport_id) {
              await common_conn.insertInvoiceAirticketPax(
                invoice_id,
                airticket_id,
                passport.passport_id
              );
            } else if (passport.passport_name) {
              await common_conn.insertInvoiceAirticketPaxName(
                invoice_id,
                airticket_id,
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
                airoute_airticket_id: airticket_id,
                airoute_route_sector_id,
              };
            }
          );

          await common_conn.insertAirticketRoute(airticketRoutes);
        }

        if (isNotEmpty(flight_details[0])) {
          const flightsDetails = flight_details?.map((item) => {
            return {
              ...item,
              fltdetails_airticket_id: airticket_id,
              fltdetails_invoice_id: invoice_id,
            };
          });

          await conn.insertInvoiceNonComeFlightDetails(flightsDetails);
        }
      }

      const content = `INV NON COMM ADDED, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: content,
      };

      await common_conn.insertInvoiceHistory(history_data);

      // MONEY RECEIPT
      const moneyReceiptInvoice: ICommonMoneyReceiptInvoiceData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id,
      };
      await new CommonAddMoneyReceipt().commonAddMoneyReceipt(
        req,
        moneyReceiptInvoice,
        trx
      );

      await this.updateVoucher(req, 'ANC');

      const smsInvoiceDate: smsInvoiceData = {
        invoice_client_id: invoice_client_id as number,
        invoice_combined_id: invoice_combined_id as number,
        invoice_sales_date,
        invoice_created_by,
        invoice_id,
      };

      await new CommonSmsSendServices().sendSms(req, smsInvoiceDate, trx);

      await this.insertAudit(
        req,
        'create',
        content,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        content,
        data: invoice_id,
      };
    });
  };
}

export default AddInvoiceNonCommission;
