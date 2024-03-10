import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import AddExistingClient from './narrowServices/addInvoiceExistingReissue';
import AddReissueAirticket from './narrowServices/addInvoiceReissue';
import DeleteReissue from './narrowServices/deleteInvoiceReissue';
import EditExistingCl from './narrowServices/editInvoiceExistingReissue';
import EditReissueAirticket from './narrowServices/editInvoiceReissue';
import ReissueRefundService from './narrowServices/reisseuRefund.service';

class ReissueAirticket extends AbstractServices {
  constructor() {
    super();
  }

  public getAllInvoices = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.CommonInvoiceModel(req);

    const data = await conn.getAllInvoices(
      3,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Airticket Reissue',
      ...data,
    };
  };

  // VIEW INVOICE REISSUE
  public viewInvoiceReissue = async (req: Request) => {
    const invoice_id = req.params.invoice_id;

    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.reissueAirticket(req);

    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);

    const refunds = await this.models
      .refundModel(req)
      .getAirticketRefundItems(invoice_id);

    const pax_details = await common_conn.getInvoiceAirTicketPaxDetails(
      invoice_id
    );
    const airticket_information = await conn.getReissueAirticketInfo(
      invoice_id
    );

    const flights = await conn.getFlightDetails(invoice_id);

    return {
      success: true,
      data: {
        ...invoice,
        refunds,
        airticket_information,
        flights,
        pax_details,
      },
    };
  };

  public getExistingClientAirticket = async (req: Request) => {
    const client = req.params.client_id;

    const conn = this.models.reissueAirticket(req);

    const data1 = await conn.getExistingClientAirticket(
      client,
      'trabill_invoice'
    );
    const data2 = await conn.getExistingClientAirticket(
      client,
      'trabill_invoice_noncom'
    );

    const data = [...data1, ...data2];

    return {
      success: true,
      data: data,
    };
  };

  public getDataForEdit = async (req: Request) => {
    const invoice_id = req.params.invoice_id;
    const conn = this.models.reissueAirticket(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice_info = await conn.getInvoiceReissueData(invoice_id);

    const airticketPrerequire = await common_conn.getAirticketPrerequire(
      invoice_id
    );

    if (invoice_info.invoice_reissue_client_type === 'EXISTING') {
      const {
        airticket_comvendor,
        airticket_profit,
        airticket_journey_date,
        airticket_return_date,
        airticket_purchase_price,
        airticket_client_price,
        airticket_ticket_no,
        airticket_classes,
      } = await conn.getExistingClTicketInfo(invoice_id);

      const {
        invoice_combclient_id,
        invoice_sales_man_id,
        invoice_sales_date,
        invoice_no,
        invoice_net_total,
        invoice_sub_total,
        invoice_note,
      } = invoice_info;

      const data = {
        invoice_combclient_id,
        airticket_comvendor,
        invoice_sales_man_id,
        invoice_sales_date,
        airticket_profit,
        invoice_no,
        airticket_journey_date,
        airticket_return_date,
        airticket_vendor_charge: airticket_purchase_price,
        airticket_client_charge: airticket_client_price,
        airticket_service_charge:
          Number(invoice_net_total) - Number(invoice_sub_total),
        invoice_note,
        airticket_ticket_no,
        airticket_classes,
      };

      return {
        success: true,
        data,
      };
    }

    const ticketInfo = await conn.getReissueAirticketsForEdit(invoice_id);

    return {
      success: true,
      data: {
        invoice_info: { ...invoice_info, ...airticketPrerequire },
        ticketInfo,
      },
    };
  };

  public getReissueTicketInfo = async (req: Request) => {
    const invoice_id = req.params.invoice_id;
    const conn = this.models.reissueAirticket(req);

    const data = await conn.getReissueTicketInfo(invoice_id);

    return {
      success: true,
      data,
    };
  };

  // ============= narrow services ==============
  public addReissueAirticket = new AddReissueAirticket().addReissueAirticket;
  public addExistingClient = new AddExistingClient().addExistingClient;
  public editReissueAirticket = new EditReissueAirticket().editReissueInvoice;
  public editExistingCl = new EditExistingCl().editExistingCl;
  public deleteReissue = new DeleteReissue().deleteReissue;
  public voidReissue = new DeleteReissue().voidReissue;
  public reissueRefund = new ReissueRefundService().reissueRefund;
  public getReissueRefundInfo = new ReissueRefundService().getReissueRefundInfo;
}

export default ReissueAirticket;
