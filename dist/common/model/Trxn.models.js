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
const moment_1 = __importDefault(require("moment"));
const abstract_models_1 = __importDefault(require("../../abstracts/abstract.models"));
class TrxnModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.deleteComTrxn = (trxn_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`CALL trxn.DeleteComTrxn(?)`, [trxn_id]);
        });
        this.getAccTrxn = (account_id) => __awaiter(this, void 0, void 0, function* () {
            const [ledgers] = yield this.query()
                .select('*')
                .from('trxn.v_acc_trxn')
                .where('acctrxn_ac_id', account_id)
                .andWhere('acctrxn_agency_id', this.org_agency);
            const [count] = (yield this.query()
                .count('* as total')
                .from('trxn.v_acc_trxn')
                .where('acctrxn_ac_id', account_id)
                .andWhere('acctrxn_agency_id', this.org_agency));
            return { ledgers, count: count.total };
        });
        this.insertAccTrxn = (data) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { acctrxn_agency_id: this.org_agency }))
                .into('trxn.acc_trxn');
            return id;
        });
        this.updateAccTrxn = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`CALL trxn.UpdateACTrxn(?,?,?,?,?,?,?,?,?)`, [
                data.p_trxn_id,
                data.p_ac_id,
                data.p_pay_type,
                data.p_particular_id,
                data.p_particular_type || null,
                data.p_type,
                data.p_amount || 0,
                data.p_note || null,
                data.p_created_at,
            ]);
        });
        this.deleteAccTrxn = (trxn_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`CALL trxn.DeleteACTrxn(?)`, [trxn_id]);
        });
    }
    insertVTrxn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, body), { vtrxn_agency_id: this.org_agency }))
                .into('trxn.vendor_trxn');
            return id;
        });
    }
    updateVTrxn(b) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('CALL trxn.UpdateVTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                b.p_trxn_id,
                b.vtrxn_v_id,
                b.vtrxn_airticket_no || '',
                b.vtrxn_pax || '',
                b.vtrxn_pnr || '',
                b.vtrxn_route || '',
                b.vtrxn_type,
                b.vtrxn_particular_type || '',
                b.vtrxn_amount,
                b.vtrxn_particular_id,
                b.vtrxn_note || '',
                b.vtrxn_created_at,
                b.vtrxn_pay_type || '',
            ]);
        });
    }
    deleteVTrxn(trxn_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('CALL trxn.DeleteVTrxn(?)', [trxn_id]);
        });
    }
    insertClTrxn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, body), { ctrxn_agency_id: this.org_agency }))
                .into(`trxn.client_trxn`);
            return id;
        });
    }
    updateClTrxn(b) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('CALL trxn.UpdateClTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                b.p_trxn_id,
                b.p_client_id,
                b.p_airticket_no || '',
                b.p_route || '',
                b.p_pax || '',
                b.p_pnr || '',
                b.p_type,
                b.p_amount,
                b.p_particular_id,
                b.p_particular_type || '',
                b.p_note || '',
                b.p_created_at,
                b.p_pay_type || '',
            ]);
        });
    }
    deleteClTrxn(trxn_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('CALL trxn.DeleteClTrxn(?)', [trxn_id]);
        });
    }
    getClTrans(client_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const ledgers = yield this.query()
                .select('*')
                .from('trxn.v_cl_trxn')
                .where('ctrxn_cl_id', client_id)
                .andWhere('ctrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(ctrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .limit(size)
                .offset(offset);
            const [count] = (yield this.query()
                .count('* as total')
                .from('trxn.v_cl_trxn')
                .where('ctrxn_cl_id', client_id)
                .andWhere('ctrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(ctrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]));
            return { ledgers, count: count.total };
        });
    }
    getVenTrxns(vendor_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const ledgers = yield this.query()
                .select('*')
                .from('trxn.v_ven_trxn')
                .where('vtrxn_v_id', vendor_id)
                .andWhere('vtrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(vtrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .offset(offset)
                .limit(size);
            const [count] = (yield this.query()
                .count('* as total')
                .from('trxn.v_ven_trxn')
                .where('vtrxn_v_id', vendor_id)
                .andWhere('vtrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(vtrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]));
            return { ledgers, count: count.total };
        });
    }
    getComTrxn(combine_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const data = yield this.query()
                .select('*')
                .from('trxn.v_com_trxn')
                .where('comtrxn_comb_id', combine_id)
                .andWhere('comtrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(comtrxn_create_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .offset(offset)
                .limit(size);
            const [count] = (yield this.query()
                .count('* as total')
                .from('trxn.v_com_trxn')
                .where('comtrxn_comb_id', combine_id)
                .andWhere('comtrxn_agency_id', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(comtrxn_create_at, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]));
            return { count: count.total, data };
        });
    }
    insertComTrxn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, body), { comtrxn_agency_id: this.org_agency }))
                .into('trxn.comb_trxn');
            return id;
        });
    }
    updateComTrxn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`CALL trxn.UpdateComTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                body.p_trxn_id,
                body.p_airticket_no || '',
                body.p_route || '',
                body.p_pnr || '',
                body.p_pax || '',
                body.p_type,
                body.p_comb_id,
                body.p_particular_id,
                body.p_particular_type || '',
                body.p_amount,
                body.p_note || '',
                body.p_create_at,
                body.p_pay_type || '',
            ]);
        });
    }
}
exports.default = TrxnModels;
//# sourceMappingURL=Trxn.models.js.map