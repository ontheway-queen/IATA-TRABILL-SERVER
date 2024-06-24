"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUtils = void 0;
class InvoiceUtils {
    constructor(invoice, comm_conn) {
        this.clientTrans = (trxns, value) => __awaiter(this, void 0, void 0, function* () {
            const body = this.invoice;
            const base_fare = Number(body.invoice_net_total) + Number(body.invoice_discount || 0);
            const clTrxnBody = {
                ctrxn_type: 'DEBIT',
                ctrxn_amount: base_fare,
                ctrxn_cl: body.invoice_combclient_id,
                ctrxn_voucher: value.invoice_no,
                ctrxn_particular_id: value.tr_type,
                ctrxn_created_at: body.invoice_sales_date,
                ctrxn_note: body.invoice_note || value.note,
                ctrxn_pnr: value.ctrxn_pnr,
                ctrxn_route: value.ctrxn_route,
                ctrxn_airticket_no: value.ticket_no,
            };
            const clDiscountTransBody = {
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
            const invoice_cltrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
            let invoice_discount_cltrxn_id = null;
            if (body.invoice_discount) {
                invoice_discount_cltrxn_id = yield trxns.clTrxnInsert(clDiscountTransBody);
            }
            return { invoice_cltrxn_id, invoice_discount_cltrxn_id };
        });
        this.updateClientTrans = (trxns, value) => __awaiter(this, void 0, void 0, function* () {
            const body = this.invoice;
            const base_fare = Number(body.invoice_net_total) + Number(body.invoice_discount || 0);
            const clTrxnBody = {
                ctrxn_trxn_id: value.prevCtrxnId,
                ctrxn_type: 'DEBIT',
                ctrxn_amount: base_fare,
                ctrxn_cl: body.invoice_combclient_id,
                ctrxn_voucher: value.invoice_no,
                ctrxn_particular_id: value.tr_type,
                ctrxn_created_at: body.invoice_sales_date,
                ctrxn_note: body.invoice_note || value.note,
                ctrxn_airticket_no: value.ticket_no,
                ctrxn_pnr: value.ctrxn_pnr,
                ctrxn_route: value.ctrxn_route,
            };
            const clDiscountTransBody = {
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
            yield trxns.clTrxnUpdate(clTrxnBody);
            let invoice_discount_cltrxn_id = value.prevClChargeTransId;
            if (value.prevClChargeTransId) {
                yield trxns.clTrxnUpdate(clDiscountTransBody);
            }
            else if (body.invoice_discount) {
                invoice_discount_cltrxn_id = yield trxns.clTrxnInsert(Object.assign({}, clDiscountTransBody));
            }
            return { invoice_discount_cltrxn_id };
        });
        this.comm_conn = comm_conn;
        this.invoice = invoice;
    }
}
exports.InvoiceUtils = InvoiceUtils;
//# sourceMappingURL=invoice.utils.js.map