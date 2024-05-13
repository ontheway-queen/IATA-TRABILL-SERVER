import Trxns from '../../../common/helpers/Trxns';
import {
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import CommonInvoiceModel from '../../../common/model/CommonInvoice.models';
import { InvoiceInfoType } from '../invoice-air-ticket/types/invoiceAirticket.interface';

export class InvoiceUtils {
  protected comm_conn: CommonInvoiceModel;
  protected invoice: InvoiceInfoType;

  constructor(invoice: InvoiceInfoType, comm_conn: CommonInvoiceModel) {
    this.comm_conn = comm_conn;
    this.invoice = invoice;
  }

  clientTrans = async (
    trxns: Trxns,
    value: {
      invoice_no: string;
      ctrxn_pnr?: string;
      ctrxn_route?: string;
      ticket_no?: string;
      extra_particular:
        | 'Air Ticket'
        | 'Air Ticket Non-Com'
        | 'Air Ticket Reissue'
        | 'Invoice Other'
        | 'Invoice Visa'
        | 'Tour Package'
        | 'Hajj'
        | 'Ummrah Package'
        | 'Hajj Pre Reg';
      note?: string;
      ctrxn_pax?: string;
    }
  ) => {
    const body = this.invoice;

    const base_fare =
      Number(body.invoice_net_total) + Number(body.invoice_discount || 0);

    const clTrxnBody: IClTrxnBody = {
      ctrxn_type: 'DEBIT',
      ctrxn_amount: base_fare,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: 90,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note || (value.note as string),
      ctrxn_particular_type: value.extra_particular + ' Fare',
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pax: value.ctrxn_pax,
    };

    const clDiscountTransBody: IClTrxnBody = {
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount || 0,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: 90,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type: value.extra_particular + ' Discount',
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pax: value.ctrxn_pax,
    };

    const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

    let invoice_discount_cltrxn_id = null;
    if (body.invoice_discount) {
      invoice_discount_cltrxn_id = await trxns.clTrxnInsert(
        clDiscountTransBody
      );
    }

    return { invoice_cltrxn_id, invoice_discount_cltrxn_id };
  };

  updateClientTrans = async (
    trxns: Trxns,
    value: {
      invoice_no: string;
      prevCtrxnId: number;
      prevClChargeTransId: number;
      ctrxn_pnr?: string;
      ticket_no?: string;
      extra_particular:
        | 'Air Ticket'
        | 'Air Ticket Non-Com'
        | 'Air Ticket Reissue'
        | 'Invoice Other'
        | 'Invoice Visa'
        | 'Tour Package'
        | 'Hajj'
        | 'Ummrah Package'
        | 'Hajj Pre Reg';
      note?: string;
      ctrxn_route?: string;
      ctrxn_pax?: string;
    }
  ) => {
    const body = this.invoice;

    const base_fare =
      Number(body.invoice_net_total) + Number(body.invoice_discount || 0);

    const clTrxnBody: IClTrxnUpdate = {
      ctrxn_trxn_id: value.prevCtrxnId,
      ctrxn_type: 'DEBIT',
      ctrxn_amount: base_fare,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: 91,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note || (value.note as string),
      ctrxn_particular_type: value.extra_particular + ' Fare',
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_pax: value.ctrxn_pax,
    };

    const clDiscountTransBody: IClTrxnUpdate = {
      ctrxn_trxn_id: value.prevClChargeTransId,
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: 91,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type: value.extra_particular + ' Discount',
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_pax: value.ctrxn_pax,
    };

    await trxns.clTrxnUpdate(clTrxnBody);

    let invoice_discount_cltrxn_id = value.prevClChargeTransId;

    if (value.prevClChargeTransId) {
      await trxns.clTrxnUpdate(clDiscountTransBody);
    } else if (body.invoice_discount) {
      invoice_discount_cltrxn_id = await trxns.clTrxnInsert({
        ...clDiscountTransBody,
      } as IClTrxnBody);
    }

    return { invoice_discount_cltrxn_id };
  };
}
