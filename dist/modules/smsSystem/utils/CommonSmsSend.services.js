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
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
const config_1 = __importDefault(require("../../../config/config"));
class CommonSmsSendServices extends abstract_services_1.default {
    constructor() {
        super(...arguments);
        this.sendSms = (req, common_invoices, trx) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_client_id, invoice_combined_id, invoice_created_by, invoice_sales_date, invoice_message, invoice_id, receipt_id, } = common_invoices;
            return yield this.models.db.transaction(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const sms_conn = this.models.smsModel(req, trx);
                const client_conn = this.models.clientModel(req, trx);
                const app_config_conn = this.models.configModel.appConfig(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const config_info = yield app_config_conn.getAppConfig();
                if (!config_info || (config_info === null || config_info === void 0 ? void 0 : config_info.tac_auto_sms) !== 1) {
                    return;
                }
                let message = '';
                if (invoice_id) {
                    const { invoice_no, org_owner_full_name, client_name, invoice_net_total, org_currency, invoice_sales_date, } = yield common_conn.getSmsInvoiceInfo(invoice_id);
                    message = `Dear Customer,
An invoice has been created on ${org_owner_full_name} Amount: ${invoice_net_total} ${org_currency.toUpperCase()} Invoice No: ${invoice_no} Please Contact With Us If You Have Any Query About This.
Thanks For Business With Us! ${(0, dayjs_1.default)(invoice_sales_date).format('DD-MM-YYYY')}`;
                }
                if (receipt_id) {
                    const { receipt_total_amount, org_owner_full_name, org_currency, client_last_balance, client_name, receipt_payment_date, } = yield common_conn.getSmsReceiptInfo(receipt_id);
                    message = `Dear Customer,
Money Receipt has been Created on ${client_name} The Amount Is ${receipt_total_amount} ${org_currency.toUpperCase()} Last Balance ${client_last_balance} ${org_currency.toUpperCase()}.
Thanks For Being With Us! ${(0, dayjs_1.default)(receipt_payment_date).format('DD-MM-YYYY')}`;
                }
                const { category_id, mobile } = yield client_conn.getCombClientMobile(invoice_client_id, invoice_combined_id);
                const regx = /^(\+?880)\d{10}$/;
                if (regx.test(mobile)) {
                    const { org_sms_api_key, org_sms_client_id } = yield sms_conn.getSmsApiAndClientID();
                    const otpUrl = config_1.default.OTP_URL;
                    if (org_sms_api_key && org_sms_client_id && otpUrl) {
                        const url = `${otpUrl}Balance?ApiKey=${org_sms_api_key}&ClientId=${org_sms_client_id}`;
                        const data = yield axios_1.default.get(url);
                        if (Number((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.Data[0]) === null || _b === void 0 ? void 0 : _b.Credits) === null || _c === void 0 ? void 0 : _c.replace('BDT', '')) > 1) {
                            const smsInfo = {
                                sms_client_catrgory_id: category_id,
                                sms_client_id: invoice_client_id,
                                sms_combine_id: invoice_combined_id,
                                sms_client_mobile: mobile,
                                sms_text_type: 'TEXT',
                                sms_client_message: invoice_message || message,
                                sms_date: invoice_sales_date,
                                sms_created_by: invoice_created_by,
                            };
                            yield sms_conn.createSms(smsInfo);
                            lib_1.default.sendSms(String(mobile), invoice_message || message, org_sms_api_key, org_sms_client_id);
                            const smslogInfo = {
                                smslog_for: 'OTHERS',
                                smslog_mobile: 108,
                                smslog_client_id: invoice_client_id,
                                smslog_combine_id: invoice_combined_id,
                                smslog_content: invoice_message || message,
                                smslog_delivery_status: 'DELIVERED',
                            };
                            yield sms_conn.smsLog(smslogInfo);
                        }
                    }
                }
            }));
        });
    }
}
exports.default = CommonSmsSendServices;
//# sourceMappingURL=CommonSmsSend.services.js.map