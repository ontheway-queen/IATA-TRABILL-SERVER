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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const lib_1 = require("../../../../../common/utils/libraries/lib");
class VoidInvoice extends abstract_services_1.default {
    constructor() {
        super();
        // VOID INVOICES
        this.voidInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const body = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const conn = this.models.invoiceAirticketModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const previousInv = yield conn.getInvoiceData(invoice_id);
                const content = `VOID TKT FARE BDT ${body.void_amount}/- \nCHARGE BDT ${body.client_charge || 0}/-`;
                const ticket_nos = body.invoice_vendors
                    .map((item) => item.airticket_ticket_no)
                    .join(',');
                // CLIENT TRANSACTION
                const clientNetTotalTrans = {
                    ctrxn_type: 'CREDIT',
                    ctrxn_amount: body.void_amount,
                    ctrxn_cl: body.comb_client,
                    ctrxn_voucher: body.invoice_no,
                    ctrxn_particular_id: 56,
                    ctrxn_created_at: body.invoice_void_date,
                    ctrxn_note: content,
                    ctrxn_airticket_no: ticket_nos,
                };
                yield trxns.clTrxnInsert(clientNetTotalTrans);
                let void_charge_ctrxn_id = null;
                if (body.client_charge) {
                    const voidChargeClTrans = {
                        ctrxn_type: 'DEBIT',
                        ctrxn_amount: body.client_charge,
                        ctrxn_cl: body.comb_client,
                        ctrxn_voucher: body.invoice_no,
                        ctrxn_particular_id: 59,
                        ctrxn_created_at: body.invoice_void_date,
                        ctrxn_note: '',
                        ctrxn_airticket_no: ticket_nos,
                    };
                    void_charge_ctrxn_id = yield trxns.clTrxnInsert(voidChargeClTrans);
                }
                // Initialize a result object
                const reducedData = {};
                let return_vendor_price = 0;
                // Process each ticket
                for (const ticket of body.invoice_vendors) {
                    const vendorId = ticket.comb_vendor;
                    if (!reducedData[vendorId]) {
                        reducedData[vendorId] = {
                            comb_vendor: vendorId,
                            vendor_charge: 0,
                            cost_price: 0,
                            airticket_ticket_no: [],
                        };
                    }
                    reducedData[vendorId].vendor_charge += ticket.vendor_charge;
                    reducedData[vendorId].cost_price += ticket.cost_price;
                    reducedData[vendorId].airticket_ticket_no.push(ticket.airticket_ticket_no);
                    if (body.cate_id === 1) {
                        yield conn.voidAirticketItems(ticket.airticket_id, invoice_id, req.user_id);
                    }
                    else if (body.cate_id === 2) {
                    }
                    else if (body.cate_id === 3) {
                    }
                    else if (body.cate_id === 5) {
                    }
                    return_vendor_price += (0, lib_1.numRound)(ticket.cost_price);
                }
                // Convert lists to comma-separated strings
                for (const vendorId in reducedData) {
                    reducedData[vendorId].airticket_ticket_no =
                        reducedData[vendorId].airticket_ticket_no.join(', ');
                }
                // Convert the object to an array
                const resultArray = Object.values(reducedData);
                //   VENDOR TRANSACTIONS
                for (const item of resultArray) {
                    const { vendor_id } = (0, common_helper_1.separateCombClientToId)(item.comb_vendor);
                    const vendorPurchaseVoidTrans = {
                        comb_vendor: item.comb_vendor,
                        vtrxn_amount: item.cost_price,
                        vtrxn_created_at: body.invoice_void_date,
                        vtrxn_note: `BDT ${item.cost_price}/- \nCHARGE BDT ${item.vendor_charge}/-`,
                        vtrxn_particular_id: 56,
                        vtrxn_type: vendor_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: req.user_id,
                        vtrxn_voucher: body.invoice_no,
                        vtrxn_airticket_no: item.airticket_ticket_no,
                    };
                    yield trxns.VTrxnInsert(vendorPurchaseVoidTrans);
                    if (item.vendor_charge) {
                        const vendorVoidCharge = {
                            comb_vendor: item.comb_vendor,
                            vtrxn_amount: item.vendor_charge,
                            vtrxn_created_at: body.invoice_void_date,
                            vtrxn_note: ``,
                            vtrxn_particular_id: 59,
                            vtrxn_type: vendor_id ? 'DEBIT' : 'CREDIT',
                            vtrxn_user_id: req.user_id,
                            vtrxn_airticket_no: item.airticket_ticket_no,
                            vtrxn_voucher: body.invoice_no,
                        };
                        yield trxns.VTrxnInsert(vendorVoidCharge);
                    }
                }
                // UPDATED VOID INFORMATION
                const invInfo = {
                    invoice_id,
                    invoice_void_charge: (0, lib_1.numRound)(previousInv.invoice_void_charge) +
                        (0, lib_1.numRound)(body.client_charge),
                    invoice_void_ctrxn_id: void_charge_ctrxn_id,
                    invoice_void_date: body.invoice_void_date,
                    invoice_sub_total: (0, lib_1.numRound)(previousInv.invoice_sub_total) - body.net_total,
                    invoice_discount: (0, lib_1.numRound)(previousInv.invoice_discount) - (0, lib_1.numRound)(body.void_discount),
                    invoice_net_total: (0, lib_1.numRound)(previousInv.invoice_net_total) -
                        (0, lib_1.numRound)(body.void_discount),
                    invoice_total_vendor_price: (0, lib_1.numRound)(previousInv.invoice_total_vendor_price) -
                        return_vendor_price,
                    invoice_total_profit: (0, lib_1.numRound)(previousInv.invoice_total_profit) -
                        (body.net_total - return_vendor_price),
                    invoice_is_void: 1,
                };
                yield common_conn.updateIsVoid(invInfo);
                yield this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');
                return { success: true, message: content };
            }));
        });
    }
}
exports.default = VoidInvoice;
//# sourceMappingURL=void_invoice.js.map