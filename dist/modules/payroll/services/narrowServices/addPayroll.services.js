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
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class CreatePayroll extends abstract_services_1.default {
    constructor() {
        super();
        this.createPayrollServices = (req) => __awaiter(this, void 0, void 0, function* () {
            const imageList = req.imgUrl;
            const imageUrlObj = Object.assign({}, ...imageList);
            const { payroll_employee_id, payroll_account_id, payroll_pay_type, payroll_salary, payroll_deductions, payroll_mobile_bill, payroll_transection_no, payroll_transection_charge, payroll_food_bill, payroll_bonus, payroll_commission, payroll_fastival_bonus, payroll_ta, payroll_advance, payroll_net_amount, payroll_date, payroll_note, payroll_cheque_no, cheque_withdraw_date, payroll_bank_name, payroll_created_by, payroll_accommodation, payroll_attendance, payroll_health, payroll_incentive, payroll_provident, gross_salary, daily_salary, payroll_profit_share, payment_month, payroll_other1, payroll_other2, payroll_other3, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.payrollModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const payroll_vouchar_no = (0, invoice_helpers_1.generateVoucherNumber)(7, 'PR');
                let payroll_charge_id = null;
                if (payroll_pay_type === 3 && payroll_transection_charge) {
                    const online_charge_trxn = {
                        charge_from_acc_id: payroll_account_id,
                        charge_amount: payroll_transection_charge,
                        charge_purpose: `Payroll`,
                        charge_note: payroll_note,
                    };
                    payroll_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                // common for payroll
                const payrollData = Object.assign({ payment_month,
                    gross_salary,
                    daily_salary,
                    payroll_profit_share,
                    payroll_vouchar_no,
                    payroll_employee_id,
                    payroll_account_id,
                    payroll_pay_type,
                    payroll_salary,
                    payroll_mobile_bill,
                    payroll_transection_no,
                    payroll_transection_charge,
                    payroll_charge_id,
                    payroll_food_bill,
                    payroll_bonus,
                    payroll_commission,
                    payroll_fastival_bonus,
                    payroll_ta,
                    payroll_advance,
                    payroll_net_amount,
                    payroll_date,
                    payroll_note,
                    payroll_created_by,
                    payroll_accommodation,
                    payroll_attendance,
                    payroll_health,
                    payroll_incentive,
                    payroll_provident,
                    payroll_other1,
                    payroll_other2,
                    payroll_other3 }, imageUrlObj);
                let payroll_id = 0;
                if (payroll_pay_type !== 4 && payroll_account_id) {
                    let accPayType;
                    if (payroll_pay_type === 1) {
                        accPayType = 'CASH';
                    }
                    else if (payroll_pay_type === 2) {
                        accPayType = 'BANK';
                    }
                    else if (payroll_pay_type === 3) {
                        accPayType = 'MOBILE BANKING';
                    }
                    else {
                        accPayType = 'CASH';
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: payroll_account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: payroll_vouchar_no,
                        acctrxn_amount: payroll_net_amount,
                        acctrxn_created_at: payroll_date,
                        acctrxn_created_by: payroll_created_by,
                        acctrxn_note: payroll_note,
                        acctrxn_particular_id: 59,
                        acctrxn_particular_type: 'Payroll create',
                        acctrxn_pay_type: accPayType,
                    };
                    const payroll_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    // INSERT PAYROLL DATA
                    payroll_id = yield conn.createPayroll(Object.assign(Object.assign({}, payrollData), { payroll_acctrxn_id }));
                }
                else if (payroll_pay_type == 4) {
                    payroll_id = yield conn.createPayroll(payrollData);
                    const payrollChequeInfo = {
                        pcheque_payroll_id: payroll_id,
                        pcheque_amount: payroll_net_amount,
                        pcheque_number: payroll_cheque_no,
                        pcheque_bank_name: payroll_bank_name,
                        pcheque_withdraw_date: cheque_withdraw_date,
                        pcheque_status: 'PENDING',
                    };
                    yield conn.insertPayrollCheque(payrollChequeInfo);
                }
                const deductions = JSON.parse(payroll_deductions);
                if (payroll_deductions.length) {
                    const deductionInfo = [];
                    for (const deduction of deductions) {
                        const { pd_amount, pd_reason } = deduction;
                        deductionInfo.push({
                            pd_payroll_id: +payroll_id,
                            pd_amount,
                            pd_reason,
                        });
                    }
                    if (deductionInfo.length)
                        yield conn.createPayrollDeductions(deductionInfo);
                }
                yield this.insertAudit(req, 'create', `Payroll has been created ${payroll_net_amount}/-`, payroll_created_by, 'PAYROLL');
                return {
                    success: true,
                    message: 'Payroll created successfuly',
                    data: payroll_id,
                };
            }));
        });
    }
}
exports.default = CreatePayroll;
//# sourceMappingURL=addPayroll.services.js.map