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
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class InsertVisaBilling extends abstract_services_1.default {
    constructor() {
        super();
        this.insertVisaBilling = (req, commonVisaData, vtrxn_pax, trx) => __awaiter(this, void 0, void 0, function* () {
            const { passport_information, invoice_sales_date, billing_information, invoice_note, invoice_no, } = req.body;
            const { invoice_created_by, invoice_id } = commonVisaData;
            return yield this.models.db.transaction(() => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceVisaModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                for (const billing_info of billing_information) {
                    const { billing_id, billing_product_id, billing_visiting_country_id, billing_visa_type_id, billing_cost_price, billing_delivery_date, billing_profit, billing_quantity, billing_mofa_no, billing_okala_no, billing_visa_no, billing_status, billing_token, billing_unit_price, billing_comvendor, is_deleted, } = billing_info;
                    let billing_vtrxn_id = null;
                    const billing_subtotal = billing_unit_price * billing_quantity;
                    const billingInfo = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_remaining_quantity: billing_quantity,
                        billing_cost_price: Number(billing_cost_price || 0),
                        billing_delivery_date,
                        billing_mofa_no,
                        billing_okala_no,
                        billing_visa_no,
                        billing_product_id,
                        billing_profit,
                        billing_quantity,
                        billing_status,
                        billing_subtotal,
                        billing_token,
                        billing_unit_price,
                        billing_visa_type_id,
                        billing_visiting_country_id,
                    };
                    const billingExist = yield conn.billingIsExist(billing_id);
                    // IF VENDOR AND COST PRICE EXIST
                    if (billing_cost_price && billing_comvendor) {
                        const total_cost_price = billing_cost_price * billing_quantity;
                        const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                        billingInfo.billing_vendor_id = vendor_id;
                        billingInfo.billing_combined_id = combined_id;
                        const VTrxnBody = {
                            comb_vendor: billing_comvendor,
                            vtrxn_amount: total_cost_price,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: invoice_note,
                            vtrxn_particular_id: 149,
                            vtrxn_particular_type: 'Invoice visa update',
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_pax,
                        };
                        if (billing_status === 'Approved') {
                            if (billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevTrxnId) {
                                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevTrxnId }));
                                billing_vtrxn_id = billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevTrxnId;
                            }
                            else {
                                billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                            }
                        }
                    }
                    if (is_deleted !== 1) {
                        if (!billing_id) {
                            yield conn.insertVisaBilling(Object.assign(Object.assign({}, billingInfo), { billing_vtrxn_id }));
                        }
                        // IF UPDATE BILLING TRANSACTION
                        else if (billing_vtrxn_id && billing_id) {
                            yield conn.updateVisaBilling(Object.assign(Object.assign({}, billingInfo), { billing_vtrxn_id }), billing_id);
                        }
                        // IF UPDATE BILLING BUT REMOVE TRANSACTION/VENDOR
                        else if (!billing_vtrxn_id && billing_id) {
                            // delete previous vendor transaction
                            if ((billingExist === null || billingExist === void 0 ? void 0 : billingExist.billing_status) === 'Approved') {
                                yield trxns.deleteVTrxn(billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevTrxnId, billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevComvendor);
                            }
                            // billingInfo.billing_combined_id = null;
                            // billingInfo.billing_vendor_id = null;
                            // billingInfo.billing_vtrxn_id = null;
                            // billingInfo.billing_cost_price = 0;
                            // update billing information
                            yield conn.updateVisaBilling(billingInfo, billing_id);
                        }
                    }
                    // DELETE BILLING
                    else {
                        yield conn.deleteBillingSingleInfo(billing_id, invoice_created_by);
                        if ((billingExist === null || billingExist === void 0 ? void 0 : billingExist.billing_status) === 'Approved') {
                            yield trxns.deleteVTrxn(billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevTrxnId, billingExist === null || billingExist === void 0 ? void 0 : billingExist.prevComvendor);
                        }
                    }
                }
                if (passport_information.length && (0, invoice_helpers_1.isNotEmpty)(passport_information[0])) {
                    for (const passports_info of passport_information) {
                        const { passport_id, visapss_details_id, is_deleted } = passports_info;
                        const visaPassInfo = {
                            visapss_details_id,
                            visapss_details_invoice_id: invoice_id,
                            visapss_details_passport_id: passport_id,
                        };
                        if (is_deleted !== 1) {
                            if (!visapss_details_id) {
                                yield conn.insertVisaPassport(visaPassInfo);
                            }
                            else {
                                yield conn.updateVisaPassport(visaPassInfo, visapss_details_id);
                            }
                        }
                        else {
                            yield conn.deleteSignleVisaPassport(visapss_details_id, invoice_created_by);
                        }
                    }
                }
            }));
        });
    }
}
exports.default = InsertVisaBilling;
//# sourceMappingURL=InsertVisaBilling.js.map