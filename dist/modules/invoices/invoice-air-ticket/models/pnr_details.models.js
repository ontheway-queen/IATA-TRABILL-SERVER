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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class PnrDetailsModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getIataVendorId = () => __awaiter(this, void 0, void 0, function* () {
            const [vendor_id] = yield this.query()
                .select('vendor_id')
                .from('trabill_vendors')
                .where('vendor_type', 'IATA')
                .andWhere('vendor_org_agency', this.org_agency)
                .andWhereNot('vendor_is_deleted', 1);
            if (vendor_id) {
                return 'vendor-' + (vendor_id === null || vendor_id === void 0 ? void 0 : vendor_id.vendor_id);
            }
            return null;
        });
    }
    getOtaInfo(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('ota_api_url', 'ota_token')
                .from('trabill_agency_ota_info')
                .whereNot('ota_is_deleted', 1)
                .andWhere('ota_org_id', agency_id);
            if (data) {
                return data;
            }
            throw new customError_1.default('PNR details not found!', 404, 'Not authorized!');
        });
    }
    airportIdByCode(airportCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('airline_id')
                .from('trabill_airports')
                .whereNot('airline_is_deleted', 1)
                .andWhere('airline_iata_code', airportCode);
            return data === null || data === void 0 ? void 0 : data.airline_id;
        });
    }
    airlineIdByCode(airlineCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('airline_id')
                .from('trabill_airlines')
                .whereNot('airline_is_deleted', 1)
                .andWhere('airline_code', airlineCode);
            return data === null || data === void 0 ? void 0 : data.airline_id;
        });
    }
    getEmployeeByCreationSign(sign) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('employee_id')
                .from('trabill_employees')
                .where('employee_creation_sign', sign);
            return data === null || data === void 0 ? void 0 : data.employee_id;
        });
    }
    getClTransData(transId, isClient) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            if (isClient) {
                let [cTrans] = yield this.query()
                    .select('ctrxn_voucher as voucher', 'ctrxn_airticket_no as ticket_no', 'ctrxn_route as route', 'ctrxn_pnr as pnr')
                    .from('trxn.client_trxn')
                    .where('ctrxn_id', transId);
                data = cTrans;
            }
            else {
                let [comTrans] = yield this.query()
                    .select('comtrxn_voucher_no as voucher', 'comtrxn_airticket_no as ticket_no', 'comtrxn_route as route', 'comtrxn_pnr as pnr')
                    .from('trxn.comb_trxn')
                    .where('comtrxn_id', transId);
                data = comTrans;
            }
            return data;
        });
    }
    getPreviousInvoices(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_invoices')
                .select('invoice_no', 'invoice_sub_total', 'invoice_total_profit', 'invoice_total_vendor_price', 'invoice_sales_date')
                .where('invoice_id', invoice_id)
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            });
            return data;
        });
    }
}
exports.default = PnrDetailsModels;
//# sourceMappingURL=pnr_details.models.js.map