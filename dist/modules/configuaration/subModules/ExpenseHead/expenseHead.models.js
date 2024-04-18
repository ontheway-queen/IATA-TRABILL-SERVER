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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
class ExpenseHeadModel extends abstract_models_1.default {
    createExpenseHead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenseHead = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { head_org_agency: this.org_agency }))
                .into('trabill_expense_head');
            return expenseHead[0];
        });
    }
    editExpenseHead(data, head_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_expense_head')
                .update(data)
                .where('head_id', head_id);
        });
    }
    viewExpenseHeads(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_expense_head')
                .select('head_id', 'head_create_date', 'head_name', 'head_org_agency as agency_id')
                .where('head_status', 1)
                .andWhere('head_org_agency', this.org_agency)
                .andWhereNot('head_is_deleted', 1)
                .orderBy('head_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_expense_head')
                .where('head_status', 1)
                .andWhereNot('head_is_deleted', 1)
                .andWhere('head_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getAllExpenseHeads() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_expense_head')
                .select('head_id', 'head_create_date', 'head_name', 'head_org_agency as agency_id')
                .where('head_status', 1)
                .andWhereNot('head_is_deleted', 1)
                .andWhere('head_org_agency', this.org_agency)
                .orderBy('head_name');
            const by_default = yield this.query()
                .from('trabill_expense_head')
                .select('head_id', 'head_create_date', 'head_name', 'head_org_agency as agency_id')
                .where('head_status', 1)
                .andWhereNot('head_is_deleted', 1)
                .andWhere('head_org_agency', null)
                .orderBy('head_name');
            return [...by_clients, ...by_default];
        });
    }
    deleteExpenseHead(head_id, head_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_expense_head')
                .update({ head_status: 0, head_is_deleted: 1, head_deleted_by })
                .where('head_id', head_id);
        });
    }
}
exports.default = ExpenseHeadModel;
//# sourceMappingURL=expenseHead.models.js.map