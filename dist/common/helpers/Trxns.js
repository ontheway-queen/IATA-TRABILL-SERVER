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
const abstract_services_1 = __importDefault(require("../../abstracts/abstract.services"));
const common_helper_1 = require("./common.helper");
class Trxns extends abstract_services_1.default {
    constructor(req, trx) {
        super();
        // client
        this.clTrxnInsert = (body) => __awaiter(this, void 0, void 0, function* () {
            const { ctrxn_amount, ctrxn_cl, ctrxn_created_at, ctrxn_note, ctrxn_particular_id, ctrxn_particular_type, ctrxn_pax, ctrxn_pnr, ctrxn_route, ctrxn_type, ctrxn_voucher, ctrxn_airticket_no, ctrxn_pay_type, } = body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(ctrxn_cl);
            let trxnId;
            if (client_id) {
                const clTrxnBody = {
                    ctrxn_amount,
                    ctrxn_cl_id: client_id,
                    ctrxn_created_at,
                    ctrxn_note,
                    ctrxn_particular_id,
                    ctrxn_particular_type,
                    ctrxn_pax,
                    ctrxn_pnr,
                    ctrxn_route,
                    ctrxn_type,
                    ctrxn_voucher,
                    ctrxn_airticket_no,
                    ctrxn_pay_type,
                    ctrxn_user_id: this.req.user_id,
                };
                trxnId = yield this.conn.insertClTrxn(clTrxnBody);
            }
            else {
                const comTrxnBody = {
                    comtrxn_voucher_no: ctrxn_voucher,
                    comtrxn_airticket_no: ctrxn_airticket_no,
                    comtrxn_route: ctrxn_route,
                    comtrxn_pnr: ctrxn_pnr,
                    comtrxn_pax: ctrxn_pax,
                    comtrxn_type: ctrxn_type,
                    comtrxn_comb_id: combined_id,
                    comtrxn_particular_id: ctrxn_particular_id,
                    comtrxn_particular_type: ctrxn_particular_type,
                    comtrxn_amount: ctrxn_amount,
                    comtrxn_note: ctrxn_note,
                    comtrxn_create_at: ctrxn_created_at,
                    comtrxn_user_id: this.req.user_id,
                    comtrxn_pay_type: ctrxn_pay_type,
                };
                trxnId = yield this.conn.insertComTrxn(comTrxnBody);
            }
            return trxnId;
        });
        // INSERT ACCOUNT TRANS
        this.AccTrxnInsert = (body) => __awaiter(this, void 0, void 0, function* () {
            const { acctrxn_ac_id, acctrxn_pay_type, acctrxn_particular_id, acctrxn_created_at, acctrxn_particular_type, acctrxn_type, acctrxn_amount, acctrxn_note, acctrxn_created_by, acctrxn_voucher, } = body;
            const accBody = {
                acctrxn_ac_id: acctrxn_ac_id,
                acctrxn_pay_type,
                acctrxn_particular_id,
                acctrxn_particular_type,
                acctrxn_voucher,
                acctrxn_type,
                acctrxn_amount,
                acctrxn_note,
                acctrxn_created_at,
                acctrxn_created_by,
            };
            const account_id = yield this.conn.insertAccTrxn(accBody);
            return account_id;
        });
        this.AccTrxnUpdate = (body) => __awaiter(this, void 0, void 0, function* () {
            const { acctrxn_ac_id, acctrxn_amount, acctrxn_created_at, acctrxn_note, acctrxn_particular_id, acctrxn_particular_type, acctrxn_pay_type, acctrxn_type, trxn_id, } = body;
            const acTrxnBody = {
                p_ac_id: acctrxn_ac_id,
                p_amount: acctrxn_amount,
                p_created_at: acctrxn_created_at,
                p_note: acctrxn_note,
                p_particular_id: acctrxn_particular_id,
                p_particular_type: acctrxn_particular_type,
                p_pay_type: acctrxn_pay_type,
                p_type: acctrxn_type,
                p_trxn_id: trxn_id,
            };
            yield this.conn.updateAccTrxn(acTrxnBody);
            return trxn_id;
        });
        this.deleteAccTrxn = (trxn_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.conn.deleteAccTrxn(trxn_id);
        });
        this.deleteClTrxn = (trxn_id, prevCombClient) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(prevCombClient);
            if (client_id) {
                yield this.conn.deleteClTrxn(trxn_id);
            }
            else if (combined_id) {
                yield this.conn.deleteComTrxn(trxn_id);
            }
        });
        this.clTrxnUpdate = (body) => __awaiter(this, void 0, void 0, function* () {
            const { ctrxn_amount, ctrxn_cl, ctrxn_created_at, ctrxn_note, ctrxn_particular_id, ctrxn_particular_type, ctrxn_pax, ctrxn_pnr, ctrxn_airticket_no, ctrxn_route, ctrxn_type, ctrxn_trxn_id, ctrxn_voucher, ctrxn_pay_type, } = body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(ctrxn_cl);
            if (client_id) {
                const clTrxnBody = {
                    p_trxn_id: ctrxn_trxn_id,
                    p_client_id: client_id,
                    p_note: ctrxn_note,
                    p_amount: ctrxn_amount,
                    p_particular_id: ctrxn_particular_id,
                    p_particular_type: ctrxn_particular_type,
                    p_pax: ctrxn_pax,
                    p_pnr: ctrxn_pnr,
                    p_created_at: ctrxn_created_at,
                    p_route: ctrxn_route,
                    p_type: ctrxn_type,
                    p_voucher: ctrxn_voucher,
                    p_airticket_no: ctrxn_airticket_no,
                    p_pay_type: ctrxn_pay_type,
                };
                yield this.conn.updateClTrxn(clTrxnBody);
            }
            else if (combined_id) {
                const comTrxnBody = {
                    p_trxn_id: ctrxn_trxn_id,
                    p_voucher_no: ctrxn_voucher,
                    p_type: ctrxn_type,
                    p_comb_id: combined_id,
                    p_particular_id: ctrxn_particular_id,
                    p_particular_type: ctrxn_particular_type,
                    p_amount: ctrxn_amount,
                    p_note: ctrxn_note,
                    p_create_at: ctrxn_created_at,
                    p_pax: ctrxn_pax,
                    p_airticket_no: ctrxn_airticket_no,
                    p_pnr: ctrxn_pnr,
                    p_route: ctrxn_route,
                    p_pay_type: ctrxn_pay_type,
                };
                yield this.conn.updateComTrxn(comTrxnBody);
            }
            return ctrxn_trxn_id;
        });
        // vendor
        this.VTrxnInsert = (body) => __awaiter(this, void 0, void 0, function* () {
            const { comb_vendor, vtrxn_voucher, vtrxn_pax, vtrxn_airticket_no, vtrxn_pnr, vtrxn_route, vtrxn_type, vtrxn_particular_type, vtrxn_amount, vtrxn_particular_id, vtrxn_note, vtrxn_user_id, vtrxn_created_at, vtrxn_pay_type, } = body;
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            let trxnId;
            if (vendor_id) {
                const VTrxnBody = {
                    vtrxn_voucher,
                    vtrxn_pax,
                    vtrxn_type,
                    vtrxn_particular_type,
                    vtrxn_amount,
                    vtrxn_particular_id,
                    vtrxn_note,
                    vtrxn_user_id,
                    vtrxn_created_at,
                    vtrxn_v_id: vendor_id,
                    vtrxn_airticket_no,
                    vtrxn_pnr,
                    vtrxn_route,
                    vtrxn_pay_type,
                };
                trxnId = yield this.conn.insertVTrxn(VTrxnBody);
            }
            else if (combined_id) {
                const comTrxnBody = {
                    comtrxn_voucher_no: vtrxn_voucher,
                    comtrxn_type: vtrxn_type,
                    comtrxn_comb_id: combined_id,
                    comtrxn_particular_id: vtrxn_particular_id,
                    comtrxn_particular_type: vtrxn_particular_type,
                    comtrxn_amount: vtrxn_amount,
                    comtrxn_note: vtrxn_note,
                    comtrxn_create_at: vtrxn_created_at,
                    comtrxn_user_id: vtrxn_user_id,
                    comtrxn_pax: vtrxn_pax,
                    comtrxn_pnr: vtrxn_pnr,
                    comtrxn_route: vtrxn_route,
                    comtrxn_airticket_no: vtrxn_airticket_no,
                    comtrxn_pay_type: vtrxn_pay_type,
                };
                trxnId = yield this.conn.insertComTrxn(comTrxnBody);
            }
            return trxnId;
        });
        this.VTrxnUpdate = (body) => __awaiter(this, void 0, void 0, function* () {
            const { comb_vendor, trxn_id, vtrxn_pax, vtrxn_type, vtrxn_particular_type, vtrxn_amount, vtrxn_particular_id, vtrxn_note, vtrxn_user_id, vtrxn_created_at, vtrxn_voucher, vtrxn_airticket_no, vtrxn_pnr, vtrxn_route, vtrxn_pay_type, } = body;
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            if (vendor_id) {
                const VTrxnBody = {
                    p_trxn_id: trxn_id,
                    vtrxn_v_id: vendor_id,
                    vtrxn_voucher,
                    vtrxn_airticket_no,
                    vtrxn_pax,
                    vtrxn_pnr,
                    vtrxn_route,
                    vtrxn_type,
                    vtrxn_particular_type,
                    vtrxn_amount,
                    vtrxn_particular_id,
                    vtrxn_note,
                    vtrxn_user_id,
                    vtrxn_created_at,
                    vtrxn_pay_type,
                };
                yield this.conn.updateVTrxn(VTrxnBody);
            }
            else if (combined_id) {
                const ComTrxnBody = {
                    p_trxn_id: trxn_id,
                    p_airticket_no: vtrxn_airticket_no,
                    p_voucher_no: vtrxn_voucher,
                    p_route: vtrxn_route,
                    p_pnr: vtrxn_pnr,
                    p_pax: vtrxn_pax,
                    p_type: vtrxn_type,
                    p_comb_id: combined_id,
                    p_particular_id: vtrxn_particular_id,
                    p_particular_type: vtrxn_particular_type,
                    p_amount: vtrxn_amount,
                    p_note: vtrxn_note,
                    p_create_at: vtrxn_created_at,
                    p_pay_type: vtrxn_pay_type,
                };
                yield this.conn.updateComTrxn(ComTrxnBody);
            }
            return trxn_id;
        });
        this.deleteVTrxn = (trxn_id, prevCombVendor) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(prevCombVendor);
            if (vendor_id && trxn_id) {
                yield this.conn.deleteVTrxn(trxn_id);
            }
            else if (combined_id && trxn_id) {
                yield this.conn.deleteComTrxn(trxn_id);
            }
        });
        this.deleteInvVTrxn = (billing) => __awaiter(this, void 0, void 0, function* () {
            for (const prevItem of billing) {
                const { combined_id, vendor_id, prevTrxnId } = prevItem;
                if (vendor_id && prevTrxnId) {
                    yield this.conn.deleteVTrxn(prevTrxnId);
                }
                else if (combined_id && prevTrxnId) {
                    yield this.conn.deleteComTrxn(prevTrxnId);
                }
            }
        });
        this.req = req;
        this.conn = this.models.trxnModels(req, trx);
    }
}
exports.default = Trxns;
//# sourceMappingURL=Trxns.js.map