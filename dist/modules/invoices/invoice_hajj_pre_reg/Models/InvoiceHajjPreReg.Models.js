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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class InvoiceHajjPreModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.insertHajiInfo = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_haji_informations')
                .insert(Object.assign(Object.assign({}, insertedData), { trabill_org_agency: this.org_agency }));
            return id[0];
        });
        this.updateHajiInfo = (data, hajiinfo_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.db('trabill_haji_informations')
                .update(data)
                .where('hajiinfo_id', hajiinfo_id);
        });
        this.insertHajiPreReg = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .insert(Object.assign(Object.assign({}, insertedData), { haji_info_org_agency: this.org_agency }));
            return id[0];
        });
        this.updateHajiPreReg = (insertedData, haji_info_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_hajj_pre_reg_haji_infos')
                .update(insertedData)
                .where('haji_info_haji_id', haji_info_id);
        });
        this.insertHajiBillingInfo = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .insert(insertedData);
        });
        this.updateHajiBillingInfo = (insertedData, billing_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(insertedData)
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .where('billing_id', billing_id);
        });
        this.getPreRegBillingInfo = (billing_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('trabill_invoice_hajj_pre_reg_billing_infos')
                .select('billing_vtrxn_id as prevTrxnId', this.db.raw(`CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-', billing_vendor_id) ELSE CONCAT('combined-', billing_combined_id) END AS prevComvendor`), 'billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', this.db.raw(`billing_cost_price * billing_quantity  as prev_cost_price`))
                .where('billing_id', billing_id);
            return data;
        });
        // @GET
        this.getPreRegistrationReports = (year) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('hajiinfo_name', 'hajiinfo_tracking_number', 'haji_info_vouchar_no', 'invoice_haji_group_id')
                .join('trabill_haji_informations', { hajiinfo_id: 'haji_info_haji_id' })
                .join('trabill_invoices', { haji_info_invoice_id: 'invoice_id' })
                .where('haji_info_reg_year', year)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .andWhere('haji_info_org_agency', this.org_agency);
            return data;
        });
        this.getHajiGroupName = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_haji_group')
                .select('group_type', 'group_name')
                .where('group_id', id);
            return data[0];
        });
        this.getPreviousHajiInfo = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('haji_info_id as haji_pre_id', 'haji_info_haji_id as haji_info_id')
                .where('haji_info_invoice_id', invoice_id)
                .andWhereNot('haji_info_info_is_deleted', 1);
            return data;
        });
        // ====================== INVOICE HAJI PRE REGISTRATION
        this.getPreHajiInfo = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('hajiinfo_id', 'hajiinfo_name', 'hajiinfo_mobile', 'hajiinfo_dob', 'hajiinfo_tracking_number', 'hajiinfo_nid', 'hajiinfo_serial', 'hajiinfo_gender', 'haji_info_reg_year', 'haji_info_possible_year', 'haji_info_maharam', 'haji_info_vouchar_no')
                .where('haji_info_invoice_id', invoice_id)
                .andWhere('haji_info_org_agency', this.org_agency)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .join('trabill_haji_informations', { hajiinfo_id: 'haji_info_haji_id' });
            return data;
        });
        this.getInvoiceHajjPreInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invoice_client_id', 'invoice_net_total', 'invoice_no', 'invoice_sales_date', 'invoice_sales_man_id', 'invoice_sub_total', 'invoice_note', 'invoice_agent_id', 'invoice_haji_group_id', 'invoice_vat', 'invoice_service_charge', 'invoice_discount', 'invoice_agent_com_amount')
                .from('trabill_invoices')
                .leftJoin('trabill_invoices_extra_amounts', {
                invoice_id: 'extra_amount_invoice_id',
            })
                .where('invoice_id', invoiceId);
            return data[0];
        });
        this.getHajiInfoByTrackingNo = (tracking_no) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('hajiinfo_name', 'hajiinfo_mobile', 'haji_info_haji_id as haji_id', 'haji_info_maharam', 'hajiinfo_dob', 'hajiinfo_tracking_number', 'haji_info_vouchar_no', 'hajiinfo_nid', 'hajiinfo_serial', 'hajiinfo_gender', 'maharam_name', 'haji_info_status')
                .leftJoin('trabill_maharams', { maharam_id: 'haji_info_maharam' })
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .where('hajiinfo_tracking_number', tracking_no)
                .andWhere('haji_info_org_agency', this.org_agency)
                .andWhere('haji_info_status', 'approved')
                .andWhereNot('haji_info_info_is_deleted', 1);
            return data;
        });
        this.getHajiIdByTrackingNo = (tracking_no) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('haji_info_haji_id ', 'haji_info_invoice_id')
                .where('hajiinfo_tracking_number', tracking_no)
                .andWhere('haji_info_org_agency', this.org_agency)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .join('trabill_haji_informations', { hajiinfo_id: 'haji_info_haji_id' });
            return data[0];
        });
        this.getHajiInformationForHajjiManagement = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .select('hajiinfo_name', 'hajiinfo_mobile', 'hajiinfo_dob', 'haji_info_maharam', 'hajiinfo_tracking_number', 'haji_info_vouchar_no', 'hajiinfo_nid', 'hajiinfo_serial', 'hajiinfo_gender', 'maharam_name', 'haji_info_status')
                .andWhere('haji_info_org_agency', this.org_agency)
                .leftJoin('trabill_maharams', { maharam_id: 'haji_info_maharam' })
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .andWhere('haji_info_status', 'approved')
                .andWhereNot('haji_info_info_is_deleted', 1)
                .orderBy('haji_info_haji_id', 'desc');
            return data;
        });
        this.getHajiBillingInfos = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .select(this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'product_name', 'pax_name', 'billing_description', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit')
                .where('billing_invoice_id', invoice_id)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_combined_clients as tcc', {
                combine_id: 'billing_combined_id',
            })
                .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_products', { product_id: 'billing_product_id' });
        });
        this.getHajiBillingInfo = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_pre_reg_billing_infos')
                .select('billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), 'billing_vtrxn_id as prevTrxnId')
                .where('billing_invoice_id', invoice_id)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_products', { billing_product_id: 'product_id' });
            return data;
        });
        this.getForEditBillingInfo = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .select('billing_id', this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"), 'billing_product_id', 'billing_combined_id', 'pax_name', 'billing_description', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit')
                .where('billing_invoice_id', invoice_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getAllTrackingAndSerialNo = (checkingType, value) => __awaiter(this, void 0, void 0, function* () {
            const haji_info = yield this.query()
                .select('hajiinfo_tracking_number as tracking_no', 'hajiinfo_serial as serial_no')
                .from('trabill_haji_informations')
                .where('trabill_org_agency', this.org_agency)
                .andWhereNot('hajiinfo_is_deleted', 1);
            const ummrah_haji_info = yield this.query()
                .select('passenger_tracking_number as tracking_no')
                .from('trabill_invoice_umrah_passenger_info')
                .leftJoin('trabill_invoices', { invoice_id: 'passenger_invoice_id' })
                .where('invoice_org_agency', this.org_agency)
                .andWhereNot('passenger_is_deleted', 1)
                .groupBy('passenger_id');
            if (checkingType === 'tracking') {
                const tracking_no = [...haji_info, ...ummrah_haji_info].map((item) => item.tracking_no);
                return tracking_no.includes(value);
            }
            else {
                const serial_no = haji_info.map((item) => item.serial_no);
                return serial_no.includes(value);
            }
        });
        this.deletePrevHajiInfo = (haji_info_id, hajiinfo_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_haji_informations')
                .update({ hajiinfo_is_deleted: 1, hajiinfo_deleted_by })
                .where('hajiinfo_id', haji_info_id);
            return id;
        });
        this.deleteHajiBillingInfo = (invoice_id, billing_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .update({ billing_is_deleted: 1, billing_info_deleted_by })
                .where('billing_invoice_id', invoice_id);
            return id;
        });
        this.deleteInvoiceHajiPreReg = (invoice_id, haji_info_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .update({ haji_info_info_is_deleted: 1, haji_info_info_deleted_by })
                .where('haji_info_invoice_id', invoice_id);
            return id;
        });
        this.restoreInvoiceHajiPreReg = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({
                haji_info_info_is_deleted: 0,
                haji_info_info_deleted_by: null,
            })
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .where('haji_info_invoice_id', invoice_id);
        });
        this.deleteHajiPreRegInfo = (haji_id, haji_info_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .update({ haji_info_info_is_deleted: 1, haji_info_info_deleted_by })
                .where('haji_info_haji_id', haji_id);
            return id;
        });
        this.deleteSingleHajiPreReg = (billing_id, billing_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_invoice_hajj_pre_reg_billing_infos')
                .update({ billing_is_deleted: 1, billing_info_deleted_by })
                .where('billing_id', billing_id);
        });
    }
    updateHajjiInfoStatus(invoice_id, haji_info_status, updated_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({
                haji_info_status,
                haji_info_updated_by: updated_by,
            })
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .where('haji_info_invoice_id', invoice_id)
                .andWhereNot('haji_info_info_is_deleted', 1);
            if (!data) {
                throw new customError_1.default('Please provide valid hajji invoice id', 400, 'Bad request');
            }
            return data;
        });
    }
    getAllHajiPreRegInfos(page, size, month) {
        return __awaiter(this, void 0, void 0, function* () {
            if (month) {
                month = (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            }
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_net_total as net_total', 'invoice_total_vendor_price', 'invoice_total_profit', this.db.raw(`sum(coalesce(CAST(invclientpayment_amount AS DECIMAL(10, 2)), 0)) as invclientpayment_amount`), this.db.raw(`GROUP_CONCAT(receipt_vouchar_no) as money_receipt_num`), this.db.raw(`coalesce(client_name, combine_name)   AS client_name`), this.db.raw(`coalesce(client_mobile, combine_mobile) AS mobile`), 'invoice_reissue_client_type', 'invoice_sales_date as invoice_date', 'invoice_category_id', 'client_id', 'invoice_is_refund', 'haji_info_id', 'haji_info_status', 'haji_info_possible_year', 'haji_info_created_date')
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_hajj_pre_reg_haji_infos', {
                haji_info_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_clients', {
                client_id: 'invoice_client_id',
            })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .leftJoin('trabill_invoice_client_payments', {
                invclientpayment_invoice_id: 'invoice_id',
            })
                .leftJoin(this.db.raw(`trabill_money_receipts ON trabill_money_receipts.receipt_id = invclientpayment_moneyreceipt_id AND receipt_has_deleted = 0`))
                .where('invoice_category_id', 30)
                .modify((event) => {
                if (month) {
                    event.andWhereILike('invoice_sales_date', `%${month}%`);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .where(function () {
                this.where('trabill_invoice_hajj_pre_reg_haji_infos.haji_info_status', '<>', 'approved').orWhereNull('trabill_invoice_hajj_pre_reg_haji_infos.haji_info_status');
            })
                .orderBy('invoice_id', 'desc')
                .groupBy('invoice_id', 'invoice_no', 'invoice_net_total', 'invoice_total_vendor_price', 'invoice_total_profit', 'invoice_reissue_client_type', 'invoice_sales_date', 'invoice_category_id', 'client_id', 'invoice_is_refund', 'haji_info_id', 'haji_info_status', 'haji_info_possible_year', 'haji_info_created_date', 'client_name', 'mobile')
                .limit(size)
                .offset(page_number);
            return data;
        });
    }
    countAllHajiPreRegInfosDataRow(month) {
        return __awaiter(this, void 0, void 0, function* () {
            if (month) {
                month = (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            }
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_hajj_pre_reg_haji_infos', {
                haji_info_invoice_id: 'invoice_id',
            })
                .where('invoice_category_id', 30)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .where(function () {
                this.where('trabill_invoice_hajj_pre_reg_haji_infos.haji_info_status', '<>', 'approved').orWhereNull('trabill_invoice_hajj_pre_reg_haji_infos.haji_info_status');
            })
                .modify((event) => {
                if (month) {
                    event.andWhereILike('invoice_sales_date', `%${month}%`);
                }
            });
            return row_count;
        });
    }
    cancelHajjPreRegHajiInfo(tracking_no, invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ haji_info_is_cancel: 1 })
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .where('hajiinfo_tracking_number', tracking_no)
                .andWhere('haji_info_invoice_id', invoice_id);
        });
    }
}
exports.default = InvoiceHajjPreModels;
//# sourceMappingURL=InvoiceHajjPreReg.Models.js.map