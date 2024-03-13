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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class PayrollModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.viewEmployeeCommission = (employee_id, month) => __awaiter(this, void 0, void 0, function* () {
            month = (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            const [{ employee_commission }] = yield this.query()
                .select('employee_commission')
                .from('trabill_employees')
                .where({ employee_id });
            if (!employee_commission && employee_commission <= 0) {
                return { net_total: 0 };
            }
            const [data] = yield this.query()
                .select(this.db.raw(`CAST(SUM(total_profit) / employee_commission AS DECIMAL(15,2))  AS net_total`))
                .from('view_employee_commission')
                .andWhere('invoice_sales_man_id', employee_id)
                .andWhereRaw(`DATE_FORMAT(sales_date, '%Y-%m') = ?`, [month])
                .groupBy('invoice_sales_man_id');
            if (data) {
                return data;
            }
            return { net_total: 0 };
        });
    }
    createPayroll(payrollInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .insert(Object.assign(Object.assign({}, payrollInfo), { payroll_org_agency: this.org_agency }))
                .into('trabill_payroll');
            return data[0];
        });
    }
    createPayrollDeductions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_payroll_deductions');
            return id;
        });
    }
    payrollImagesUrl(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [urlList] = yield this.query()
                .select('payroll_image_url')
                .from('trabill_payroll')
                .where('payroll_id', id);
            return urlList;
        });
    }
    updatePayroll(payroll_id, payroll) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_payroll')
                .update(payroll)
                .where('payroll_id', payroll_id);
            return data;
        });
    }
    getPayroll(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('payroll_id', 'payroll_vouchar_no', 'employee_full_name', 'payroll_account_id', 'account_name', 'payment_month', this.db.raw('IFNULL(pcheque_status, account_name) AS bank_account_name'), this.db.raw('CASE WHEN payroll_pay_type = 4 THEN "Cheque" WHEN payroll_pay_type = 1 THEN "Cash" WHEN payroll_pay_type = 2 THEN "Bank" WHEN payroll_pay_type = 3 THEN "Mobile banking"  ELSE NULL END AS payroll_pay_method'), 'payroll_salary', 'pcheque_bank_name', 'payroll_attendance', 'gross_salary', 'designation_name', 'payroll_net_amount', 'payroll_date', 'payroll_image_url')
                .from('trabill_payroll')
                .leftJoin('trabill_accounts', { account_id: 'payroll_account_id' })
                .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
                .leftJoin('trabill_accounts_type', { acctype_id: 'payroll_pay_type' })
                .leftJoin('trabill_designations', {
                designation_id: 'employee_designation_id',
            })
                .leftJoin('trabill_payroll_cheque_details', {
                pcheque_payroll_id: 'payroll_id',
            })
                .where('payroll_id_deleted', 0)
                .modify((event) => {
                event
                    .andWhere(function () {
                    if (search) {
                        this.andWhereRaw('LOWER(payroll_vouchar_no) LIKE ?', [
                            `%${search}%`,
                        ]).orWhereRaw('LOWER(employee_full_name) LIKE ?', [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(payroll_date ,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                })
                    .andWhere('payroll_org_agency', this.org_agency);
            })
                .andWhere('payroll_org_agency', this.org_agency)
                .orderBy('payroll_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_payroll')
                .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
                .where('payroll_id_deleted', 0)
                .modify((event) => {
                event
                    .andWhere(function () {
                    if (search) {
                        this.andWhereRaw('LOWER(payroll_vouchar_no) LIKE ?', [
                            `%${search}%`,
                        ]).orWhereRaw('LOWER(employee_full_name) LIKE ?', [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(payroll_date ,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                })
                    .andWhere('payroll_org_agency', this.org_agency);
            })
                .andWhere('payroll_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getPayrollById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('payroll_id', 'gross_salary', 'daily_salary', 'payroll_profit_share', 'payroll_vouchar_no', 'payroll_employee_id', 'employee_full_name', 'designation_name', 'employee_email', 'employee_mobile', 'employee_address', 'payroll_account_id', this.db.raw('IFNULL(account_name, pcheque_status) AS account_name'), 'pcheque_bank_name', 'payroll_pay_type', this.db.raw('CASE WHEN payroll_pay_type = 4 THEN "Cheque" WHEN payroll_pay_type = 1 THEN "Cash" WHEN payroll_pay_type = 2 THEN "Bank" WHEN payroll_pay_type = 3 THEN "Mobile banking"  ELSE NULL END AS payroll_pay_method'), 'pcheque_withdraw_date as cheque_withdraw_date', 'payroll_salary', 'payroll_mobile_bill', 'payroll_transection_no', 'payroll_transection_charge', 'payroll_food_bill', 'payroll_bonus', 'payroll_commission', 'payroll_fastival_bonus', 'payroll_ta', 'payroll_advance', 'payroll_accommodation', 'payroll_attendance', 'payroll_health', 'payroll_incentive', 'payroll_provident', 'payroll_net_amount', 'payroll_note', 'payroll_image_url', 'payroll_date', 'pcheque_number', 'payroll_other1', 'payroll_other2', 'payroll_other3')
                .from('trabill_payroll')
                .leftJoin('trabill_accounts', { account_id: 'payroll_account_id' })
                .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
                .leftJoin('trabill_accounts_type', { acctype_id: 'payroll_pay_type' })
                .leftJoin('trabill_designations', {
                designation_id: 'employee_designation_id',
            })
                .leftJoin('trabill_payroll_cheque_details', {
                pcheque_payroll_id: 'payroll_id',
            })
                .whereNot('payroll_id_deleted', 1)
                .andWhere('payroll_id', id);
            if (data.length) {
                return data[0];
            }
            else {
                return {};
            }
        });
    }
    getPayrollDeductions(payroll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .select('pd_id', 'pd_amount', 'pd_reason', this.db.raw(`0 AS is_deleted`))
                .from('trabill_payroll_deductions')
                .whereNot('pd_is_deleted', 1)
                .andWhere('pd_payroll_id', payroll_id));
            if (!data.length) {
                const info = (yield this.query()
                    .select(this.db.raw(`NULL AS pd_id`), 'payroll_deductions AS pd_amount', 'payroll_deduction_reason AS pd_reason')
                    .from('trabill_payroll')
                    .where({ payroll_id }));
                if (info.length)
                    return info;
            }
            return data;
        });
    }
    updatePayrollDeduction(data, pd_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_payroll_deductions')
                .where({ pd_id });
        });
    }
    deletePayrollDeduction(pd_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ pd_is_deleted: 1 })
                .into('trabill_payroll_deductions')
                .where({ pd_id });
        });
    }
    deleteAllPayrollDeductions(pd_payroll_id, pd_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ pd_is_deleted: 1, pd_deleted_by })
                .into('trabill_payroll_deductions')
                .where({ pd_payroll_id });
        });
    }
    // get previous transection balance
    getPrevTransectionAmount(payroll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('payroll_net_amount', 'payroll_account_id', 'payroll_pay_type', 'payroll_acctrxn_id', 'payroll_charge_id')
                .from('trabill_payroll')
                .where('payroll_id', payroll_id));
            if (data) {
                const { payroll_net_amount, payroll_account_id, payroll_pay_type, payroll_acctrxn_id, payroll_charge_id, } = data;
                return {
                    previous_net_balance: Number(payroll_net_amount),
                    prev_payroll_account_id: Number(payroll_account_id),
                    prev_pay_type: Number(payroll_pay_type),
                    prev_acctrxn_id: Number(payroll_acctrxn_id),
                    prev_payroll_charge_id: Number(payroll_charge_id),
                };
            }
            else {
                throw new customError_1.default("Can't find any payroll with this Id", 400, 'Bad request');
            }
        });
    }
    deletePrevPayrollCheque(payroll_id, pcheque_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ pcheque_is_deleted: 1, pcheque_deleted_by })
                .into('trabill_payroll_cheque_details')
                .where('pcheque_payroll_id', payroll_id);
        });
    }
    deletePayroll(id, payroll_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_payroll')
                .update({ payroll_id_deleted: 1, payroll_deleted_by })
                .where('payroll_id', id);
            return data;
        });
    }
    insertPayrollCheque(payroll_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(payroll_data)
                .into('trabill_payroll_cheque_details');
        });
    }
}
exports.default = PayrollModel;
//# sourceMappingURL=payroll.models.js.map