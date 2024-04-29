import Trxns from '../../../common/helpers/Trxns';
import {
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import CommonInvoiceModel from '../../../common/model/CommonInvoice.models';
import { idType } from '../../../common/types/common.types';
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
    invoice_no: string,
    ctrxn_pnr: string,
    ctrxn_route: string,
    ticket_no: string,
    extra_particular: string = ''
  ) => {
    const body = this.invoice;

    const base_fare =
      Number(body.invoice_net_total) + Number(body.invoice_discount || 0);

    const ctrxn_particular_type =
      'Invoice create(Gross fare)' + extra_particular || '-' + extra_particular;

    const clTrxnBody: IClTrxnBody = {
      ctrxn_type: 'DEBIT',
      ctrxn_amount: base_fare,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: invoice_no,
      ctrxn_particular_id: 90,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type,
      ctrxn_pnr,
      ctrxn_route,
      ctrxn_airticket_no: ticket_no,
    };

    const clDiscountTransBody: IClTrxnBody = {
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount || 0,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: invoice_no,
      ctrxn_particular_id: 90,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type,
      ctrxn_pnr,
      ctrxn_route,
      ctrxn_airticket_no: ticket_no,
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
    prevCtrxnId: idType,
    prevClChargeTransId: idType,
    invoice_no: string,
    ctrxn_pnr: string,
    ctrxn_route: string,
    ticket_no: string,
    extra_particular: string = ''
  ) => {
    const body = this.invoice;

    const base_fare =
      Number(body.invoice_net_total) + Number(body.invoice_discount || 0);

    const ctrxn_particular_type =
      'Invoices create(Gross fare)' + extra_particular
        ? '-' + extra_particular
        : '';

    const clTrxnBody: IClTrxnUpdate = {
      ctrxn_trxn_id: prevCtrxnId,
      ctrxn_type: 'DEBIT',
      ctrxn_amount: base_fare,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: invoice_no,
      ctrxn_particular_id: 91,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type,
      ctrxn_pnr,
      ctrxn_route,
      ctrxn_airticket_no: ticket_no,
    };

    const clDiscountTransBody: IClTrxnUpdate = {
      ctrxn_trxn_id: prevClChargeTransId,
      ctrxn_type: 'CREDIT',
      ctrxn_amount: body.invoice_discount,
      ctrxn_cl: body.invoice_combclient_id,
      ctrxn_voucher: invoice_no,
      ctrxn_particular_id: 91,
      ctrxn_created_at: body.invoice_sales_date,
      ctrxn_note: body.invoice_note,
      ctrxn_particular_type,
      ctrxn_pnr,
      ctrxn_route,
      ctrxn_airticket_no: ticket_no,
    };

    await trxns.clTrxnUpdate(clTrxnBody);

    let invoice_discount_cltrxn_id = prevClChargeTransId;

    if (prevClChargeTransId) {
      await trxns.clTrxnUpdate(clDiscountTransBody);
    } else if (body.invoice_discount) {
      invoice_discount_cltrxn_id = await trxns.clTrxnInsert({
        ...clDiscountTransBody,
      } as IClTrxnBody);
    }

    return { invoice_discount_cltrxn_id };
  };
}
