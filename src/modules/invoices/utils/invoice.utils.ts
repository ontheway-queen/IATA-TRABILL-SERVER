import Trxns from '../../../common/helpers/Trxns';
import {
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import CommonInvoiceModel from '../../../common/model/CommonInvoice.models';

export class InvoiceUtils {
  protected comm_conn: CommonInvoiceModel;
  protected invoice: {
    invoice_net_total: number;
    invoice_note: string;
    invoice_sales_date: string;
    invoice_combclient_id: string;
    invoice_discount: number;
  };

  constructor(
    invoice: {
      invoice_net_total: number;
      invoice_note: string;
      invoice_sales_date: string;
      invoice_combclient_id: string;
      invoice_discount: number;
    },
    comm_conn: CommonInvoiceModel
  ) {
    this.comm_conn = comm_conn;
    this.invoice = invoice;
  }

  clientTrans = async (
    trxns: Trxns,
    value: {
      invoice_no: string;
      tr_type: number;
      dis_tr_type: number;
      ctrxn_pnr?: string;
      ctrxn_route?: string;
      ticket_no?: string;
      note?: string;
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
      ctrxn_particular_id: value.tr_type,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note || (value.note as string),
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_airticket_no: value.ticket_no,
    };

    const clDiscountTransBody: IClTrxnBody = {
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount || 0,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: value.dis_tr_type,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
      ctrxn_airticket_no: value.ticket_no,
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
      tr_type: number;
      dis_tr_type: number;
      prevCtrxnId: number;
      prevClChargeTransId: number;
      ctrxn_pnr?: string;
      ticket_no?: string;
      note?: string;
      ctrxn_route?: string;
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
      ctrxn_particular_id: value.tr_type,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note || (value.note as string),
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
    };

    const clDiscountTransBody: IClTrxnUpdate = {
      ctrxn_trxn_id: value.prevClChargeTransId,
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: value.invoice_no,
      ctrxn_particular_id: value.dis_tr_type,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_airticket_no: value.ticket_no,
      ctrxn_pnr: value.ctrxn_pnr,
      ctrxn_route: value.ctrxn_route,
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
