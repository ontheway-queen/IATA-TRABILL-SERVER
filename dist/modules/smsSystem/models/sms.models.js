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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
class SmsModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getSmsApiAndClientID = () => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('org_sms_api_key', 'org_sms_client_id')
                .from('trabill_agency_organization_information')
                .where('org_id', this.org_agency);
            return data;
        });
    }
    createSms(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sms = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { sms_org_agency: this.org_agency }))
                .into('trabill_sending_sms');
            return sms[0];
        });
    }
    smsLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { smslog_org_agency: this.org_agency }))
                .into('trabill_sms_logs');
            return log[0];
        });
    }
    createSmsArr(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedValue = data.map((item) => {
                return Object.assign(Object.assign({}, item), { sms_org_agency: this.org_agency });
            });
            const sms = yield this.query()
                .insert(insertedValue)
                .into('trabill_sending_sms');
            return sms[0];
        });
    }
    smsLogArr(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertedValue = data.map((item) => {
                return Object.assign(Object.assign({}, item), { smslog_org_agency: this.org_agency });
            });
            const log = yield this.query()
                .insert(insertedValue)
                .into('trabill_sms_logs');
            return log[0];
        });
    }
    getSms(from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const sms = yield this.query()
                .select('smslog_create_date', 'client_name', 'smslog_for', 'smslog_client_id', 'smslog_mobile', 'smslog_content', 'smslog_delivery_status')
                .from('trabill_sms_logs')
                .leftJoin('trabill_clients', 'trabill_clients.client_id', 'trabill_sms_logs.smslog_client_id')
                .where('smslog_org_agency', this.org_agency)
                .andWhereNot('smslog_is_deleted', 1)
                .andWhereRaw('Date(smslog_create_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .orderBy('smslog_create_date', 'desc')
                .limit(size)
                .offset(page_number);
            return sms;
        });
    }
    countSmsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_sms_logs')
                .where('smslog_org_agency', this.org_agency)
                .andWhereNot('smslog_is_deleted', 1);
            return count.row_count;
        });
    }
}
exports.default = SmsModel;
//# sourceMappingURL=sms.models.js.map