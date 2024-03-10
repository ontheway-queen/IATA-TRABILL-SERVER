import { Request } from 'express';
import moment from 'moment';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  InvoiceClientAndVendorValidate,
  isNotEmpty,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import {
  IClTrxnUpdate,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IHotelInfoDB,
  InvoiceExtraAmount,
  ITicketInfo,
  ITransportInfo,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import {
  IOtherBillingInfoDb,
  IOtherInvoiceReq,
} from '../../types/invoiceOther.interface';

class EditInvoiceOther extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceOther = async (req: Request) => {
    const {
      invoice_net_total,
      invoice_combclient_id,
      invoice_created_by,
      invoice_note,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_vat,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_id,
      invoice_agent_com_amount,
      billing_information,
      hotel_information,
      ticketInfo,
      transport_information,
      passport_information,
      invoice_no,
      invoice_reference,
    } = req.body as IOtherInvoiceReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price, pax_name } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );


    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = getClientOrCombId(
      invoice_combclient_id
    );
    const invoice_id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceOtherModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );
      let productName = '';

      if (productsIds.length) {
        productName = await conn.getProductsName(productsIds);
      }

      let ctrxn_pax_name = null;

      if (passport_information && passport_information?.length) {
        if (passport_information[0].passport_id) {
          const passport_id = passport_information.map(
            (item) => item.passport_id
          );

          ctrxn_pax_name = await common_conn.getPassportName(
            passport_id as number[]
          );
        }
      }



      const { prevCtrxnId } = await common_conn.getPreviousInvoices(invoice_id);

      const ctrxn_ticket =
        ticketInfo &&
        ticketInfo?.length > 0 &&
        ticketInfo.map((item) => item.ticket_no).join(' ,');

      const ctrxn_pnr =
        ticketInfo &&
        ticketInfo?.length > 0 &&
        ticketInfo.map((item) => item.ticket_pnr).join(' ,');

      // journey date
      const journey_date =
        ticketInfo?.length &&
        ticketInfo?.map((item) => item?.ticket_journey_date).join(', ');

      let ctrxn_particular_type = 'Invoice Other';

      if (productName) {
        ctrxn_particular_type += `(${productName}).`;
      }

      if (journey_date) {
        ctrxn_particular_type +=
          ' \n Journey date: ' + moment(journey_date).format('DD MMM YYYY');
      }
      const clTrxnBody: IClTrxnUpdate = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 99,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type,
        ctrxn_pax: ctrxn_pax_name || pax_name,
        ctrxn_pnr: ctrxn_pnr as string,
        ctrxn_trxn_id: prevCtrxnId,
        ctrxn_airticket_no: ctrxn_ticket as string,
      };

      await trxns.clTrxnUpdate(clTrxnBody);

      // UPDATE INVOICE INFORMATION
      const invoieInfo: IUpdateInvoiceInfoDb = {
        invoice_client_id,
        invoice_combined_id,
        invoice_net_total,
        invoice_note,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_updated_by: invoice_created_by,
        invoice_reference,

        invoice_total_profit,
        invoice_total_vendor_price,
      };

      await common_conn.updateInvoiceInformation(invoice_id, invoieInfo);

      if (invoice_agent_id) {
        // AGENT TRANSACTION
        await InvoiceHelpers.invoiceAgentTransactions(
          this.models.agentProfileModel(req, trx),
          req.agency_id,
          invoice_agent_id,
          invoice_id,
          invoice_no,
          invoice_created_by,
          invoice_agent_com_amount,
          'UPDATE',
          99,
          'INVOICE OTHER '
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
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };

      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      // PASSPORT INFORMATION
      if (
        isNotEmpty(passport_information && passport_information[0]) &&
        passport_information?.length
      ) {
        for (const passportInfo of passport_information) {
          const { passport_id, is_deleted, other_pass_id } = passportInfo;

          if (is_deleted !== 1 && passport_id) {
            if (!other_pass_id) {
              await conn.insertOtherInvoicePass({
                other_pass_invoice_id: invoice_id,
                other_pass_passport_id: passport_id as number,
              });
            } else {
              await conn.updateOtherInvoicePass(
                {
                  other_pass_invoice_id: invoice_id,
                  other_pass_passport_id: passport_id as number,
                },
                other_pass_id
              );
            }
          } else {
            await conn.deleteSingleOtherPassport(
              other_pass_id as number,
              invoice_created_by
            );
          }
        }
      }

      //  TICKETS
      if (isNotEmpty(ticketInfo)) {
        const ticketDetails = [];
        for (const ticket of ticketInfo) {
          const {
            ticket_id,
            ticket_airline_id,
            ticket_journey_date,
            ticket_no,
            ticket_pnr,
            ticket_reference_no,
            ticket_return_date,
            ticket_is_deleted,
            ticket_route,
          } = ticket;

          const ticket_details: ITicketInfo = {
            ticket_invoice_id: invoice_id,
            ticket_airline_id,
            ticket_journey_date,
            ticket_no,
            ticket_pnr,
            ticket_reference_no,
            ticket_return_date,
            ticket_route,
          };

          if (ticket_is_deleted !== 1) {
            if (!ticket_id) {
              ticketDetails.push(ticket_details);
            } else {
              await conn.updateTicketInfo(ticket_details, ticket_id);
            }
          } else {
            await conn.deleteSingleTicket(
              ticket_id as number,
              invoice_created_by
            );
          }
        }
        if (ticketDetails?.length) {
          await conn.insertTicketInfo(ticketDetails);
        }
      }

      //  HOTEL INFORMATION
      if (isNotEmpty(hotel_information)) {
        for (const item of hotel_information) {
          const hotelId = item?.hotel_id;
          const hotelDetails: IHotelInfoDB = {
            hotel_invoice_id: invoice_id,
            hotel_name: item.hotel_name,
            hotel_reference_no: item.hotel_reference_no,
            hotel_room_type_id: item.hotel_room_type_id,
            hotel_check_in_date: item.hotel_check_in_date,
            hotel_check_out_date: item.hotel_check_out_date,
          };

          if (hotelId && item.is_deleted) {
            await conn.deleteSingleHotelInfo(hotelId, invoice_created_by);
          } else if (hotelId) {
            await conn.updatetHotelInfo(hotelDetails, hotelId);
          } else {
            await conn.insertHotelInfo(hotelDetails);
          }
        }
      }

      // NEW TRANSPORT INFORMATION
      if (isNotEmpty(transport_information)) {
        const transportDetails = [];
        for (const transport_info of transport_information) {
          const {
            transport_id,
            transport_reference_no,
            transport_type_id,
            transport_pickup_place,
            transport_pickup_time,
            transport_dropoff_place,
            transport_dropoff_time,
            transport_is_deleted,
          } = transport_info;

          const transport_details: ITransportInfo = {
            transport_type_id,
            transport_reference_no,
            transport_other_invoice_id: invoice_id,
            transport_pickup_time,
            transport_pickup_place,
            transport_dropoff_time,
            transport_dropoff_place,
          };
          if (transport_is_deleted !== 1) {
            if (!transport_id) {
              transportDetails.push(transport_details);
            } else {
              await conn.updateTransportInfo(transport_details, transport_id);
            }
          } else {
            await conn.deleteSingleTransportInfo(
              transport_id as number,
              invoice_created_by
            );
          }
        }

        if (transportDetails?.length) {
          await conn.insertTransportInfo(transportDetails);
        }
      }

      // BILLING INFO AND INVOICE COST DETAILS
      for (const billingInfo of billing_information) {
        const {
          billing_id,
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
          is_deleted,
        } = billingInfo;

        const billing_subtotal = billing_unit_price * billing_quantity;

        const billingInfoData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_quantity,
          billing_subtotal,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        };

        let VTrxnBody: IVTrxn | null = null;

        if (billing_comvendor && billing_cost_price) {
          const { combined_id, vendor_id } =
            separateCombClientToId(billing_comvendor);

          billingInfoData.billing_cost_price = billing_cost_price;
          billingInfoData.billing_combined_id = combined_id;
          billingInfoData.billing_vendor_id = vendor_id;

          const total_cost_price = billing_cost_price * billing_quantity;

          const productName = await common_conn.getProductById(
            billingInfo.billing_product_id
          );
          let vtrxn_particular_type = `Invoice other (${productName}). \n`;
          if (journey_date) {
            vtrxn_particular_type +=
              'Journey date: ' + moment(journey_date).format('DD MMM YYYY');
          }

          VTrxnBody = {
            comb_vendor: billing_comvendor,
            vtrxn_amount: total_cost_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: billing_description,
            vtrxn_particular_id: 150,
            vtrxn_particular_type,
            vtrxn_pax: pax_name,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_pnr: ctrxn_pnr as string,
          };
        }

        // BILLING IS NOR DELETED
        if (is_deleted !== 1) {
          // add new billing info
          if (!billing_id) {
            if (VTrxnBody) {
              billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(
                VTrxnBody
              );
            }
            await conn.insertBillingInfo(billingInfoData);
          }

          // update previous billing info
          else {
            const { prevTrxnId, prevComvendor } =
              await conn.getPreviousSingleBilling(billing_id as number);

            if (prevTrxnId && VTrxnBody) {
              await trxns.VTrxnUpdate({ ...VTrxnBody, trxn_id: prevTrxnId });
            } else if (prevTrxnId && !VTrxnBody) {
              billingInfoData.billing_vtrxn_id = null;
              billingInfoData.billing_combined_id = null;
              billingInfoData.billing_vendor_id = null;
              billingInfoData.billing_cost_price = 0;

              await trxns.deleteVTrxn(prevTrxnId, prevComvendor);
            } else if (VTrxnBody) {
              billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(
                VTrxnBody
              );
            }

            await conn.updateBillingInfo(billingInfoData, billing_id);
          }
        }

        // BILLING IS DELETED
        else {
          const previousBillingInfo = await conn.getPreviousBillingInfo(
            billing_id as number
          );

          await conn.deleteOtherSingleBillingInfo(
            billing_id as number,
            invoice_created_by
          );

          await trxns.deleteInvVTrxn(previousBillingInfo);
        }
      }

      // LOGS
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice other has been updated',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice other has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice other has been updated',
      };
    });
  };
}

export default EditInvoiceOther;
