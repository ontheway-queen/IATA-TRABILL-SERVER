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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const config_1 = __importDefault(require("../../../config/config"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
class SmsServices extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * create sms
         */
        this.createSms = (req) => __awaiter(this, void 0, void 0, function* () {
            const smsInfoArr = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.smsModel(req, trx);
                const transformedData = smsInfoArr.map(({ client_id, client_category_id, text_type, message, client_mobile, created_by, date, }) => {
                    const { client_id: inv_client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client_id);
                    const smsInfo = {
                        sms_client_catrgory_id: client_category_id,
                        sms_client_id: inv_client_id,
                        sms_combine_id: combined_id,
                        sms_client_mobile: client_mobile,
                        sms_text_type: text_type,
                        sms_client_message: message,
                        sms_date: date,
                        sms_created_by: created_by,
                    };
                    return smsInfo;
                });
                const phoneNoString = smsInfoArr
                    .map((obj) => obj.client_mobile)
                    .join(',');
                const message = smsInfoArr[0].message;
                const { org_sms_api_key, org_sms_client_id } = yield conn.getSmsApiAndClientID();
                const smsId = yield conn.createSmsArr(transformedData);
                lib_1.default.sendSms(phoneNoString, message, org_sms_api_key, org_sms_client_id);
                const smsLogInfoArray = smsInfoArr.map(({ client_id, client_mobile, message }) => {
                    const { client_id: inv_client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client_id);
                    const smslogInfo = {
                        smslog_for: 'OTHERS',
                        smslog_mobile: client_mobile,
                        smslog_client_id: inv_client_id !== 0 ? inv_client_id : null,
                        smslog_combine_id: combined_id !== 0 ? combined_id : null,
                        smslog_content: message,
                        smslog_delivery_status: 'DELIVERED',
                    };
                    return smslogInfo;
                });
                yield conn.smsLogArr(smsLogInfoArray);
                // insert audit
                yield this.insertAudit(req, 'update', `SEND A MESSAGE, MESSAGE ${message}`, smsInfoArr[0].created_by, 'SMS');
                return {
                    success: true,
                    message,
                    data: smsId,
                };
            }));
        });
        this.getSms = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.smsModel(req);
            const data = yield conn.getSms(String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countSmsDataRow();
            return { success: true, count, data };
        });
        this.getSmsBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.smsModel(req);
            const { org_sms_api_key, org_sms_client_id } = yield conn.getSmsApiAndClientID();
            const otpUrl = config_1.default.OTP_URL;
            if (org_sms_api_key && org_sms_client_id && otpUrl) {
                const url = `${otpUrl}Balance?ApiKey=${org_sms_api_key}&ClientId=${org_sms_client_id}`;
                const data = yield axios_1.default.get(url);
                return { success: true, data };
            }
            return {
                success: true,
                message: "You don't have api key or client id",
                status: 404,
            };
        });
    }
}
exports.default = SmsServices;
//# sourceMappingURL=sms.services.js.map