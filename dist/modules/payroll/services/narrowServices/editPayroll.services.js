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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class EditPayroll extends abstract_services_1.default {
    constructor() {
        super();
        this.editPayrollServices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { payroll_employee_id, payroll_account_id, payroll_pay_type, payroll_salary, payroll_deductions, payroll_mobile_bill, payroll_food_bill, payroll_bonus, payroll_commission, payroll_fastival_bonus, payroll_ta, payroll_advance, payroll_net_amount, payroll_date, payroll_note, payroll_cheque_no, payroll_bank_name, cheque_withdraw_date, payroll_updated_by, payroll_accommodation, payroll_attendance, payroll_health, payroll_incentive, payroll_provident, payroll_transection_charge, gross_salary, daily_salary, payroll_profit_share, payroll_other1, payroll_other2, payroll_other3, payment_month, } = req.body;
            const payrollId = req.params.id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.payrollModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const files = req.files;
                let { previous_net_balance, prev_pay_type, prev_acctrxn_id, prev_payroll_charge_id, } = yield conn.getPrevTransectionAmount(payrollId);
                if (files[0].filename) {
                    const data = yield conn.payrollImagesUrl(payrollId);
                    (data === null || data === void 0 ? void 0 : data.payroll_image_url) &&
                        (yield this.manageFile.deleteFromCloud([data === null || data === void 0 ? void 0 : data.payroll_image_url]));
                }
                const payrollData = {
                    payroll_employee_id,
                    payroll_account_id,
                    payroll_pay_type,
                    payment_month,
                    gross_salary,
                    daily_salary,
                    payroll_profit_share: payroll_profit_share || 0,
                    payroll_salary: payroll_salary || 0,
                    payroll_mobile_bill: payroll_mobile_bill || 0,
                    payroll_food_bill: payroll_food_bill || 0,
                    payroll_bonus: payroll_bonus || 0,
                    payroll_commission: payroll_commission || 0,
                    payroll_fastival_bonus: payroll_fastival_bonus || 0,
                    payroll_ta: payroll_ta || 0,
                    payroll_advance: payroll_advance || 0,
                    payroll_accommodation: payroll_accommodation || 0,
                    payroll_attendance: payroll_attendance || 0,
                    payroll_health: payroll_health || 0,
                    payroll_incentive: payroll_incentive || 0,
                    payroll_provident: payroll_provident || 0,
                    payroll_other1: payroll_other1 || 0,
                    payroll_other2: payroll_other2 || 0,
                    payroll_other3: payroll_other3 || 0,
                    payroll_net_amount,
                    payroll_date,
                    payroll_note,
                    payroll_updated_by,
                    payroll_image_url: files[0].filename,
                };
                let payroll_acctrxn_id;
                if (payroll_pay_type !== 4) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: payroll_account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_amount: payroll_net_amount,
                        acctrxn_created_at: payroll_date,
                        acctrxn_created_by: payroll_updated_by,
                        acctrxn_note: payroll_note,
                        acctrxn_particular_id: 60,
                        acctrxn_particular_type: 'payroll ',
                        acctrxn_pay_type: 'CASH',
                        trxn_id: prev_acctrxn_id,
                    };
                    payroll_acctrxn_id = yield trxns.AccTrxnUpdate(AccTrxnBody);
                }
                else {
                    if (prev_pay_type !== 4) {
                        yield trxns.deleteAccTrxn(prev_acctrxn_id);
                    }
                }
                if (payroll_pay_type == 4) {
                    if (prev_pay_type === 4) {
                        yield conn.deletePrevPayrollCheque(payrollId, payroll_updated_by);
                    }
                    const chequeInfo = {
                        pcheque_payroll_id: Number(payrollId),
                        pcheque_amount: payroll_net_amount,
                        pcheque_number: payroll_cheque_no,
                        pcheque_bank_name: payroll_bank_name,
                        pcheque_withdraw_date: cheque_withdraw_date,
                        pcheque_status: 'PENDING',
                    };
                    yield conn.insertPayrollCheque(chequeInfo);
                }
                let payroll_charge_id = null;
                if (payroll_pay_type === 3 && payroll_transection_charge) {
                    if (prev_payroll_charge_id) {
                        yield vendor_conn.updateOnlineTrxnCharge({
                            charge_amount: payroll_transection_charge,
                            charge_purpose: 'Payroll',
                            charge_note: payroll_note,
                        }, prev_payroll_charge_id);
                    }
                    else {
                        const online_charge_trxn = {
                            charge_from_acc_id: payroll_account_id,
                            charge_amount: payroll_transection_charge,
                            charge_purpose: `Payroll`,
                            charge_note: payroll_note,
                        };
                        payroll_charge_id = yield vendor_conn.insertOnlineTrxnCharge(online_charge_trxn);
                    }
                }
                else if (prev_pay_type === 3 &&
                    payroll_pay_type !== 3 &&
                    prev_payroll_charge_id) {
                    yield vendor_conn.deleteOnlineTrxnCharge(prev_payroll_charge_id);
                }
                const deductions = JSON.parse(payroll_deductions);
                if (payroll_deductions.length) {
                    const deductionInfo = [];
                    for (const deduction of deductions) {
                        const { pd_amount, pd_reason, pd_id, is_deleted } = deduction;
                        if (is_deleted && is_deleted === 1) {
                            yield conn.deletePayrollDeduction(pd_id);
                        }
                        else {
                            if (pd_id) {
                                yield conn.updatePayrollDeduction({ pd_amount, pd_reason }, pd_id);
                            }
                            else {
                                deductionInfo.push({
                                    pd_payroll_id: +payrollId,
                                    pd_amount,
                                    pd_reason,
                                });
                            }
                        }
                    }
                    if (deductionInfo.length)
                        yield conn.createPayrollDeductions(deductionInfo);
                }
                const payrollNewData = Object.assign(Object.assign({}, payrollData), { payroll_acctrxn_id,
                    payroll_charge_id });
                yield conn.updatePayroll(payrollId, payrollNewData);
                yield this.insertAudit(req, 'update', `UPDATED PAYROLL, SALARY BDT ${previous_net_balance}/- TO ${payroll_net_amount}/-`, payroll_updated_by, 'PAYROLL');
                return {
                    success: true,
                    message: 'Payroll updated successfully',
                };
            }));
        });
    }
}
exports.default = EditPayroll;
//# sourceMappingURL=editPayroll.services.js.map