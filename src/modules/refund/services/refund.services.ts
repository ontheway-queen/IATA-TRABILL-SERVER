import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import AddAirTicketRefund from './narrowServices/airticketRefundSubServices/addAirticketRefund';
import DeleteAirTicketRefund from './narrowServices/airticketRefundSubServices/deleteAirticketRefund.services';
import AddOtherRefund from './narrowServices/otherRefundSubServices/addOtherRefund';
import DeleteOtherRefund from './narrowServices/otherRefundSubServices/deleteOtherRefund';
import AddPersialRefundServices from './narrowServices/persialRefundSubServices/addPersialRefund.services';
import DeletePersialRefund from './narrowServices/persialRefundSubServices/deletePersialRefund.services';
import AddTourPackRefund from './narrowServices/tourPackRefundSubServices/addTourPackRefund';
import DeleteTourPackRefund from './narrowServices/tourPackRefundSubServices/deleteTourPackRefund';

class RefundServices extends AbstractServices {
  constructor() {
    super();
  }

  public getTicketNo = async (req: Request) => {
    const { id } = req.params;

    const conn = this.models.refundModel(req);

    const data = await conn.getAllTicketNoClient(id);

    return { success: true, data };
  };

  public airTicketInfos = async (req: Request) => {
    const { ticket_no, invoice_id } = req.body as {
      ticket_no: (string | number)[];
      invoice_id: number;
    };

    console.log({ body: req.body });

    const conn = this.models.refundModel(req);

    const data = await conn.airTicketInfos(ticket_no, invoice_id);

    return { success: true, data };
  };

  public getAllAirTicketRefund = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const { page, size, search, from_date, to_date } = req.query as {
        page: string;
        size: string;
        search: string;
        from_date: string;
        to_date: string;
      };

      const data = await conn.getAllAirticketRefund(
        Number(page) || 1,
        Number(size) || 20,
        search,
        from_date,
        to_date
      );

      const count = await conn.countAitRefDataRow(search, from_date, to_date);

      return {
        success: true,
        message: 'All air ticket refund',
        count: count.row_count,
        data,
      };
    });
  };

  // need to change
  public getRefundDescription = async (req: Request) => {
    const { refund_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const data = await conn.getAirticketVendorRefund(refund_id);

      return { success: true, data };
    });
  };

  // need to change
  public singleATRefund = async (req: Request) => {
    const { refund_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);

      const items = await conn.getAirticketRefundById(refund_id);

      const refund_info = await conn.viewAirticketVendorRefund(refund_id);

      return { success: true, data: { ...items, refund_info } };
    });
  };

  public invoiceOtherByClient = async (req: Request) => {
    const { client_id } = req.params;

    const { client_id: clientId, combined_id } =
      separateCombClientToId(client_id);

    const conn = this.models.refundModel(req);

    const data = await conn.getInvoiceOtherByClient(
      clientId as number,
      combined_id as number
    );

    return { success: true, data };
  };

  public getBillingInfo = async (req: Request) => {
    const { invoice_id } = req.params;

    const conn = this.models.refundModel(req);

    const category_id = await conn.getCategoryId(invoice_id);

    const data = await conn.getBillingInfo(invoice_id, category_id);

    return {
      success: true,
      data: { billing_info: data, invoice_category_id: category_id },
    };
  };

  public getRefundInfoVendor = async (req: Request) => {
    const { vendor_id } = req.params;

    const conn = this.models.refundModel(req);

    const data = await conn.getVendorInfo(vendor_id);

    return { success: true, data };
  };

  public getAllRefunds = async (req: Request) => {
    return this.models.db.transaction(async (trx) => {
      const { trash, page, size, search, from_date, to_date } = req.query as {
        trash: string;
        page: string;
        size: string;
        search: string;
        from_date: string;
        to_date: string;
      };

      const data = [];

      const conn = this.models.refundModel(req, trx);

      const items = await conn.getAllOtherRefund(
        Number(page) || 1,
        Number(size) || 20,
        search,
        from_date,
        to_date
      );

      for (const item of items) {
        const vendor_info = await conn.getAllOtherRefundVendor(item.refund_id);

        data.push({ ...item, vendor_info });
      }

      const count = await conn.countOtrRefDataRow(search, from_date, to_date);

      return {
        success: true,
        message: 'All Other Refunds',
        count: count.row_count,
        data,
      };
    });
  };

  public singleOtherRefund = async (req: Request) => {
    const { refund_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);

      const client_refund_info = await conn.getRefundOtherClient(refund_id);

      const vendor_refund_info = await conn.getRefundOtherVendor(refund_id);

      return {
        success: true,
        data: { client_refund_info, vendor_refund_info },
      };
    });
  };

  public invoiceOtherByVendor = async (req: Request) => {
    const { vendor_id } = req.params;

    const conn = this.models.refundModel(req);

    const data = await conn.getInvoiceOtherByVendor(vendor_id);

    return { success: true, data };
  };

  getTourInvoice = async (req: Request) => {
    const comb_client = req.params.client;
    const conn = this.models.refundModel(req);

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const data = await conn.getTourInvoice(client_id, combined_id);

    return { success: true, data };
  };

  public getAllTourPackRefund = async (req: Request) => {
    const { trash, page, size, search, from_date, to_date } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.refundModel(req);

    const data = await conn.getAllTourPackRefund(
      Number(trash) || 0,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    const count = await conn.countTurRefDataRow(
      Number(trash) || 0,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Tour Refunds',
      count: count.row_count,
      data,
    };
  };

  public viewTourForEdit = async (req: Request) => {
    const { refund_id } = req.params;

    let data = [];

    const conn = this.models.refundModel(req);

    const items = await conn.viewTourForEdit(refund_id);

    for (const item of items) {
      const vendor_info = await conn.getAllTourRefundVendor(item.refund_id);

      data.push({ ...item, vendor_info });
    }

    return {
      success: true,
      data,
    };
  };

  public getPersialRefundTickets = async (req: Request) => {
    const { comb_client } = req.params as { comb_client: string };

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const conn = this.models.refundModel(req);

    const data = await conn.getPersialRefundTickets(client_id, combined_id);

    console.log({ client_id, combined_id, data });

    return { success: true, data };
  };

  public getPersialRefundTicketsByInvoice = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };

    const conn = this.models.refundModel(req);

    const data = await conn.getPersialRefundTicketsByInvoice(invoice_id);

    return { success: true, data };
  };

  public getPersialRefund = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.refundModel(req);

    const data = await conn.getPersialRefund(
      Number(page || 1),
      Number(size || 20),
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getSinglePersialRefund = async (req: Request) => {
    const { refund_id } = req.params;

    const conn = this.models.refundModel(req);

    const data = await conn.getSinglePersialRefund(refund_id);

    return { success: true, data };
  };

  public getPertialAirticketInfo = async (req: Request) => {
    const { airticket_id, invoice_id } = req.body as {
      airticket_id: number;
      invoice_id: number;
    };

    const conn = this.models.refundModel(req);

    const data = await conn.getPertialAirticketInfo(airticket_id, invoice_id);

    return { success: true, data };
  };

  public addAirTicketRefund = new AddAirTicketRefund().addAirTicketRefund;
  public deleteAirticketRefund = new DeleteAirTicketRefund().delete;

  public addOtherRefund = new AddOtherRefund().add;
  public deleteOtherRefund = new DeleteOtherRefund().deleteOtherRefund;

  public addTourPackRefund = new AddTourPackRefund().add;
  public delteTourPackRefund = new DeleteTourPackRefund().delete;

  public addPersialRefund = new AddPersialRefundServices().add;
  public deletePersialRefund = new DeletePersialRefund().delete;
}

export default RefundServices;
