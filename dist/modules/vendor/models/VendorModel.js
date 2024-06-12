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
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class VendorModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getVendorExcelReport = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_vendors')
                .select('vendor_name', 'vendor_email', 'vendor_mobile', this.db.raw("DATE_FORMAT(vendor_registration_date, '%Y-%c-%e') as date"), 'trabill_vendors.vendor_lbalance as present_balance', 'vendor_activity_status as status')
                .whereNot('vendor_is_deleted', 1)
                .andWhere('vendor_org_agency', this.org_agency);
            return data;
        });
        this.updateVendorOpeningTrxnId = (vendor_opening_trxn_id, vendor_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ vendor_opening_trxn_id })
                .into('trabill_vendors')
                .where('vendor_id', vendor_id);
        });
        this.getVendorOpeningTrxnId = (vendor_id) => __awaiter(this, void 0, void 0, function* () {
            const [vendor] = yield this.query()
                .select('vendor_opening_trxn_id')
                .from('trabill_vendors')
                .where('vendor_id', vendor_id);
            if (!vendor) {
                throw new customError_1.default('Please provide a valid vendor Id', 400, 'Bad request');
            }
            return Number(vendor.vendor_opening_trxn_id);
        });
        this.deleteAdvrCheque = (advr_id, cheque_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ cheque_is_deleted: 1, cheque_deleted_by })
                .into('trabill_vendor_advance_return_cheque_details')
                .where('cheque_advr_id', advr_id);
        });
        this.deleteInvoiceVendorPaymentPermanent = (vpay_id, invendorpay_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ invendorpay_isdeleted: 1, invendorpay_deleted_by })
                .into('trabill_invoice_vendor_payments')
                .where('invendorpay_vpay_id', vpay_id);
        });
        this.viewVendorPaymentDetails = (vpay_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_no', this.db.raw(`COALESCE(vendor_name,combine_name) AS vendor_name`), 'payment_amount', 'payment_date', 'invoice_net_total', 'invoice_sales_date')
                .from('trabill_vendor_payments')
                .leftJoin('trabill_invoices', { invoice_id: 'vpay_invoice_id' })
                .leftJoin('trabill_vendors', { vendor_id: 'vpay_vendor_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'vpay_combined_id' })
                .where({ vpay_id })
                .andWhere('vpay_is_deleted', 0);
        });
        this.getAllVendorsAndCombined = (search) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('view_vendor_and_combined')
                .select('vendor_id', 'vendor_name', 'vendor_created_date as created_date', 'vendor_mobile', 'type as vendor_type', 'vendor_lbalance', 'vproduct_commission_rate')
                .andWhere((build) => {
                build.where('vendor_org_agency', this.org_agency).modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw('LOWER(vendor_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(vendor_id) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(vendor_mobile) LIKE ?', [`%${search}%`]);
                    }
                    else {
                        event.limit(50);
                    }
                });
            })
                .andWhere('vendor_org_agency', this.org_agency)
                .andWhere('vendor_activity_status', 1)
                .orderBy('vendor_name');
        });
        this.getAllVendorsAndCombinedByProductId = (productId) => __awaiter(this, void 0, void 0, function* () {
            const vendors = yield this.query()
                .select('vendor_id', 'vendor_name', 'vendor_lbalance as vendor_lbalance', this.db.raw('"vendor" as vendor_type'), this.db.raw('COALESCE(vproduct_commission_rate, 0) AS commission_rate'))
                .from('trabill_vendor_products as vp')
                .leftJoin('trabill_vendors', { vendor_id: 'vproduct_vendor_id' })
                .where('vendor_org_agency', this.org_agency)
                .andWhereNot('vproduct_is_deleted', 1)
                .andWhere('trabill_vendors.vendor_activity_status', 1)
                .andWhere('vproduct_product_id', productId)
                .andWhereNot('vendor_is_deleted', 1)
                .union([
                this.query()
                    .select('combine_id as vendor_id', 'combine_name as vendor_name', 'combine_lbalance as vendor_lbalance', this.db.raw('"combined" as vendor_type'), 'cproduct_commission_rate as commission_rate')
                    .from('trabill_combine_products')
                    .leftJoin('trabill_combined_clients', {
                    combine_id: 'cproduct_combine_id',
                })
                    .where('combine_org_agency', this.org_agency)
                    .andWhere('trabill_combined_clients.combine_client_status', 1)
                    .andWhere('cproduct_product_id', productId)
                    .andWhereNot('combine_is_deleted', 1)
                    .andWhereNot('cproduct_is_deleted', 1),
            ])
                .groupBy('vendor_id', 'vendor_name', 'vendor_lbalance', 'commission_rate')
                .orderBy('vendor_name');
            return vendors;
        });
        this.getInvoiceByVendorId = (vendorId, combinedId) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .select('*')
                .from('view_all_invoices_billing')
                .where('vendor_id', vendorId)
                .andWhere('combined_id', combinedId);
            return invoices;
        });
    }
    getTraxn(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ total }] = yield this.query()
                .from(`${this.trxn}.vendor_trxn`)
                .count('* as total')
                .where('vtrxn_v_id', vendor_id)
                .andWhere('vtrxn_agency_id', this.org_agency)
                .andWhereNot('vtrxn_particular_id', 11)
                .andWhereNot('vtrxn_is_deleted', 1);
            return total;
        });
    }
    getAllVendors(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const data = yield this.query()
                .select('*')
                .from('view_all_vendors')
                .andWhere((builder) => {
                builder.where('vendor_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_vendors.vendor_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_vendors.vendor_mobile', 'LIKE', `%${search}%`)
                            .orWhere('view_all_vendors.vendor_email', 'LIKE', `%${search}%`);
                    }
                });
            })
                .andWhere('vendor_org_agency', this.org_agency)
                .limit(limit)
                .offset(offset);
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_all_vendors')
                .andWhere((builder) => {
                builder.where('vendor_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_vendors.vendor_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_vendors.vendor_mobile', 'LIKE', `%${search}%`)
                            .orWhere('view_all_vendors.vendor_email', 'LIKE', `%${search}%`);
                    }
                });
            })
                .andWhere('vendor_org_agency', this.org_agency);
            return { count: count.row_count, data };
        });
    }
    getVendorCommission(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commission_rate = yield this.query()
                .select('vproduct_commission_rate')
                .from('trabill_vendor_products')
                .where('vproduct_vendor_id', vendorId)
                .andWhere('vproduct_product_id', 106)
                .andWhereNot('vproduct_is_deleted', 1);
            return commission_rate[0];
        });
    }
    insertVendor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.query()
                .into('trabill_vendors')
                .insert(Object.assign(Object.assign({}, data), { vendor_org_agency: this.org_agency }));
            return vendor[0];
        });
    }
    insertVendorProducts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const VendorProducts = yield this.query()
                .into('trabill_vendor_products')
                .insert(data);
            return VendorProducts[0];
        });
    }
    updateVendorStatus(data, vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorStatus = yield this.query()
                .into('trabill_vendors')
                .update('vendor_activity_status', data)
                .where('vendor_id', vendor_id);
            return vendorStatus;
        });
    }
    updateVendor(data, vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.query()
                .into('trabill_vendors')
                .update(data)
                .where('vendor_id', vendor_id)
                .whereNot('vendor_is_deleted', 1);
            return vendor;
        });
    }
    formatVendorDetailForUpdate(vendor_id, vproduct_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_products')
                .update({ vproduct_is_deleted: 1, vproduct_deleted_by })
                .where('vproduct_vendor_id', vendor_id);
        });
    }
    getCountryCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_vendors')
                .count()
                .whereNot('vendor_is_deleted', 1);
            return data;
        });
    }
    getVendorById(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_vendors')
                .select('vendor_id', 'vendor_org_agency', 'vendor_name', 'vendor_opening_trxn_id', 'vendor_email', 'vendor_mobile', 'vendor_address', 'vendor_fixed_advance', 'vendor_lbalance', 'vendor_registration_date', 'vendor_b2b_categorised', 'vendor_credit_limit', 'user_full_name', 'vendor_bank_guarantee', 'vendor_start_date', 'vendor_end_date')
                .leftJoin('trabill.trabill_users', { user_id: 'vendor_created_by' })
                .where('vendor_id', vendor_id);
            return data;
        });
    }
    deleteVendor(vendor_id, delete_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw("call deleteAccountByType('VENDOR', ?, ?);", [
                delete_by,
                vendor_id,
            ]);
        });
    }
    getForEdit(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_vendors')
                .select('vendor_name', 'vendor_type', 'vendor_email', 'vendor_mobile', 'vendor_address', 'vendor_fixed_advance', 'trabill_vendors.vendor_credit_limit', 'vendor_registration_date', 'vendor_opening_trxn.vtrxn_amount AS vendor_opening_balance', this.db.raw(`CASE WHEN vendor_opening_trxn.vtrxn_type = 'DEBIT' THEN 'due' ELSE 'advance' END AS vendor_opening_balance_pay_type`), 'vendor_bank_guarantee', 'vendor_start_date', 'vendor_end_date')
                .leftJoin(`${this.trxn}.vendor_trxn as vendor_opening_trxn`, {
                'vendor_opening_trxn.vtrxn_id': 'trabill_vendors.vendor_opening_trxn_id',
            })
                .where('vendor_id', vendor_id);
            return data;
        });
    }
    getVendorProduct(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_vendor_products')
                .select('vproduct_product_id')
                .where('vproduct_vendor_id', vendor_id)
                .andWhereNot('vproduct_is_deleted', 1);
            return data;
        });
    }
    getVendorProductName(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .from('trabill_vendor_products')
                .select('product_name')
                .leftJoin('trabill.trabill_products', {
                product_id: 'vproduct_product_id',
            })
                .where('vproduct_vendor_id', vendor_id)
                .andWhereNot('vproduct_is_deleted', 1));
            return data;
        });
    }
    // ================================= advance returns
    insetAdvanceReturnCheque(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_advance_return_cheque_details')
                .insert(data);
        });
    }
    updateAdvanceReturnCheque(updatedData, advr_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_advance_return_cheque_details')
                .update(updatedData)
                .where('cheque_advr_id', advr_id);
        });
    }
    insertAdvanceReturn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const advr_id = yield this.query()
                .into('trabill_vendor_advance_return')
                .insert(Object.assign(Object.assign({}, data), { advr_org_agency: this.org_agency }));
            return advr_id[0];
        });
    }
    updateAdvanceReturn(updatedData, advr_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_vendor_advance_return')
                .update(updatedData)
                .where('advr_id', advr_id);
            return data;
        });
    }
    getAdvanceReturn(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_vendor_advance_return')
                .select('advr_id', 'advr_vouchar_no', this.db.raw('COALESCE(vendor.vendor_name, combined.combine_name) AS vendor_name'), 'advr_amount', 'advr_note', this.db.raw("DATE_FORMAT(trabill_vendor_advance_return.advr_payment_date, '%Y-%c-%e') as return_date"), this.db.raw('IFNULL(account_name, cheque_status) as cheque_status_or_account_name'), this.db.raw('CASE WHEN advr_payment_type = 4 THEN "Cheque" WHEN advr_payment_type = 1 THEN "Cash" WHEN advr_payment_type = 2 THEN "Bank" WHEN advr_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS advr_pay_type'), this.db.raw("concat(user_first_name, ' ', user_last_name) AS created_by"))
                .leftJoin('trabill_vendors as vendor', {
                'vendor.vendor_id': 'advr_vendor_id',
            })
                .leftJoin('trabill_combined_clients as combined', {
                'combined.combine_id': 'advr_combined_id',
            })
                .leftJoin('trabill_accounts', { account_id: 'advr_account_id' })
                .leftJoin('trabill_users', { user_id: 'advr_created_by' })
                .leftJoin('trabill_vendor_advance_return_cheque_details', {
                cheque_advr_id: 'advr_id',
            })
                .where('advr_org_agency', this.org_agency)
                .andWhere('advr_has_deleted', 0)
                .orderBy('advr_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_vendor_advance_return')
                .where('advr_org_agency', this.org_agency)
                .andWhere('advr_has_deleted', 0);
            return { count: row_count, data };
        });
    }
    deleteAdvanceReturn(id, deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_vendor_advance_return')
                .update({
                advr_has_deleted: 1,
                advr_deleted_by: deleted_by,
            })
                .where('advr_id', id);
            if (!data) {
                throw new customError_1.default('Please provide a valid id', 400, 'Bad request');
            }
        });
    }
    getAdvanceReturnDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw(`COALESCE(vendor_name, combine_name) as vendor_name`), 'advr_amount as advance_amount', 'advr_vouchar_no', this.db.raw("DATE_FORMAT(trabill_vendor_advance_return.advr_payment_date, '%e %M %Y') as return_date"), 'advr_note as return_note')
                .from('trabill_vendor_advance_return')
                .leftJoin('trabill_vendors', { vendor_id: 'advr_vendor_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'advr_combined_id' })
                .where('advr_id', id);
            return data[0];
        });
    }
    getAdvanceReturnForEdit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_vendor_advance_return')
                .select('advr_id', this.db.raw("CASE WHEN advr_vendor_id IS NOT NULL THEN CONCAT('vendor-',advr_vendor_id) ELSE CONCAT('combined-',advr_combined_id) END AS comb_vendor"), 'advr_amount', 'advr_note', 'advr_payment_type', 'advr_account_id', 'cheque_number', 'cheque_bank_name as bank_name', 'trans_no', 'transaction_charge', this.db.raw("DATE_FORMAT(trabill_vendor_advance_return.advr_payment_date, '%Y-%c-%e') as return_date"), this.db.raw("DATE_FORMAT(cheque_deposit_date, '%Y-%c-%e') as vpcheque_withdraw_date"))
                .where('advr_id', id)
                .leftJoin('trabill_vendor_advance_return_cheque_details', {
                cheque_advr_id: 'advr_id',
            });
            return data[0];
        });
    }
    getInvoiceBilling(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [invoice_category] = yield this.query()
                .select('invoice_category_id as id')
                .from('trabill_invoices')
                .where('invoice_id', invoiceId)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1);
            if (!invoice_category) {
                throw new customError_1.default('Please provide a valid invoice id', 400, 'Invalid id');
            }
            let vendor_billing;
            if ([1, 2, 3].includes(invoice_category.id)) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', airticket_vendor_id), concat('combined-', airticket_combined_id) ) AS comb_vendor"), this.db.raw('CAST(sum(airticket_purchase_price) AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_all_airticket_details')
                    .where('airticket_invoice_id', invoiceId)
                    .groupBy('airticket_vendor_id', 'airticket_combined_id');
            }
            else if (invoice_category.id === 4) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', tour_vendor_id), concat('combined-', tour_combined_id) ) AS comb_vendor"), this.db.raw('CAST(sum(total_cost) AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_tour_package_billing')
                    .where('tour_invoice_id', invoiceId)
                    .groupBy('tour_vendor_id', 'tour_combined_id');
            }
            else if (invoice_category.id !== 4) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', billing_vendor_id), concat('combined-', billing_combined_id) ) AS comb_vendor"), this.db.raw('CAST(sum(total_cost) AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_other_invoices_billing')
                    .where('billing_invoice_id', invoiceId)
                    .groupBy('billing_vendor_id', 'billing_combined_id');
            }
            return vendor_billing;
        });
    }
    getVendorInvoiceDue(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [invoice_category] = yield this.query()
                .select('invoice_category_id as id')
                .from('trabill_invoices')
                .where('invoice_id', invoiceId)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1);
            if (!invoice_category) {
                throw new customError_1.default('Please provide a valid invoice id', 400, 'Invalid id');
            }
            let vendor_billing;
            if ([1, 2, 3].includes(invoice_category.id)) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', airticket_vendor_id), concat('combined-', airticket_combined_id) ) AS comb_vendor"), this.db.raw('CAST(airticket_purchase_price AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_all_airticket_details')
                    .where('airticket_invoice_id', invoiceId);
            }
            else if (invoice_category.id === 4) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', tour_vendor_id), concat('combined-', tour_combined_id) ) AS comb_vendor"), this.db.raw('CAST(total_cost AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_tour_package_billing')
                    .where('tour_invoice_id', invoiceId);
            }
            else if (invoice_category.id !== 4) {
                vendor_billing = yield this.query()
                    .select(this.db.raw("coalesce( concat('vendor-', billing_vendor_id), concat('combined-', billing_combined_id) ) AS comb_vendor"), this.db.raw('CAST(total_cost AS DECIMAL(15,2)) AS purchase_price'))
                    .from('view_other_invoices_billing')
                    .where('billing_invoice_id', invoiceId);
            }
            let total_purchase_price = 0;
            if (vendor_billing) {
                for (const item of vendor_billing) {
                    total_purchase_price += Number(item.purchase_price);
                }
            }
            return total_purchase_price;
        });
    }
    insertOnlineTrxnCharge(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .into('trabill_online_trxn_charge')
                .insert(Object.assign(Object.assign({}, data), { charge_org_agency: this.org_agency }));
            return id;
        });
    }
    updateOnlineTrxnCharge(data, charge_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query()
                .update(data)
                .into('trabill_online_trxn_charge')
                .where({ charge_id });
        });
    }
    deleteOnlineTrxnCharge(charge_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ charge_is_deleted: 1 })
                .into('trabill_online_trxn_charge')
                .where({ charge_id });
        });
    }
    insertVendorPayment(vendorPayData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_vendor_payments')
                .insert(Object.assign(Object.assign({}, vendorPayData), { vpay_org_agency: this.org_agency }));
            return data[0];
        });
    }
    insertInvoiceVendorPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .into('trabill_invoice_vendor_payments')
                .insert(data);
            return id;
        });
    }
    insertVendorPaymentCheque(vpayChackDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_payments_cheques')
                .insert(vpayChackDetails);
        });
    }
    deleteVendorPaymentCheque(vpay_id, vpcheque_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_payments_cheques')
                .update({ vpcheque_is_deleted: 1, vpcheque_deleted_by })
                .where('vpcheque_vpay_id', vpay_id);
        });
    }
    updateVendorPayment(updatedData, vpay_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_vendor_payments')
                .update(updatedData)
                .where('vpay_id', vpay_id);
            return data;
        });
    }
    getVendorLastBalance(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .from('trabill_vendors')
                .select('vendor_lbalance')
                .where('vendor_id', vendor_id));
            if (!data.length) {
                throw new customError_1.default('Provide a valid vendor ID', 400, 'Invalid Vendor Id');
            }
            else {
                return Number(data[0].vendor_lbalance);
            }
        });
    }
    insertVendorPaymentPassport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().into('trabill_vendor_payments_passports').insert(data);
        });
    }
    deleteVendorPaymentPassport(vpaypass_vpay_id, vpaypass_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_payments_passports')
                .update({ vpaypass_passport_is_deleted: 1, vpaypass_deleted_by })
                .where('vpaypass_vpay_id', vpaypass_vpay_id);
        });
    }
    updateVendorPaymentPassport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_vendor_payments_passports')
                .update(data)
                .onConflict('vpaypass_vpay_id')
                .merge();
        });
    }
    getVendorPayments(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('vpay_id', 'vouchar_no', 'vpay_payment_to', 'user_full_name', this.db.raw(`COALESCE(v.vendor_name, c.combine_name) as vendor_name`), 'payment_amount', this.db.raw(`CASE WHEN account_name IS NOT NULL THEN account_name ELSE CONCAT('card-',vpay_creadit_card_no) END AS account_name`), 'vpay_creadit_card_no', 'online_charge', 'vendor_ait', 'payment_date', 'note')
                .from('trabill_vendor_payments')
                .leftJoin('trabill_accounts', { account_id: 'vpay_account_id' })
                .leftJoin('trabill_users', { user_id: 'created_by' })
                .leftJoin('trabill_vendors as v', { vendor_id: 'vpay_vendor_id' })
                .leftJoin('trabill_combined_clients as c', {
                combine_id: 'vpay_combined_id',
            })
                .andWhere('vpay_is_deleted', 0)
                .orderBy('vpay_id', 'desc')
                .andWhere((builder) => {
                builder.where('vpay_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('trabill_vendor_payments.vouchar_no', 'LIKE', `%${search}%`)
                            .orWhere('v.vendor_name', 'LIKE', `%${search}%`)
                            .orWhere('c.combine_name', 'LIKE', `%${search}%`);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('vpay_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number);
            return data;
        });
    }
    getVendorInvoicePayment(vpay_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invendorpay_vendor_id', 'invendorpay_combined_id', 'invendorpay_amount', this.db.raw(`COALESCE(vendor_name, combine_name) as invendorpay_vendor_name`), this.db.raw(`CASE WHEN invendorpay_vendor_id IS NOT NULL THEN CONCAT('vendor-', invendorpay_vendor_id) ELSE CONCAT('combined-',invendorpay_combined_id) END AS invendorpay_comb_vendor`))
                .from('trabill_invoice_vendor_payments')
                .leftJoin('trabill_vendors', { vendor_id: 'invendorpay_vendor_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invendorpay_combined_id',
            })
                .where('invendorpay_vpay_id', vpay_id)
                .andWhereNot('invendorpay_isdeleted', 1);
            return data;
        });
    }
    countVPaymentsDataRow(search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_vendor_payments')
                .leftJoin('trabill_vendors as v', { vendor_id: 'vpay_vendor_id' })
                .leftJoin('trabill_combined_clients as c', {
                combine_id: 'vpay_combined_id',
            })
                .where('vpay_is_deleted', 0)
                .andWhere((builder) => {
                builder.where('vpay_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('trabill_vendor_payments.vouchar_no', 'LIKE', `%${search}%`)
                            .orWhere('v.vendor_name', 'LIKE', `%${search}%`)
                            .orWhere('c.combine_name', 'LIKE', `%${search}%`);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('vpay_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getPreviousPaymentAmount(vpayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [vendor_pay_data] = (yield this.query()
                .from('trabill_vendor_payments')
                .select('payment_amount as previousPaymentAmount', 'vpay_invoice_id', 'vpay_account_id as prevAccountId', 'payment_method_id as prevPayMethod', 'vpay_acctrxn_id as prevAccTrxnId', 'vpay_payment_to', 'has_refer_passport', 'vouchar_no', this.db.raw("CASE WHEN vpay_vendor_id IS NOT NULL THEN CONCAT('vendor-',vpay_vendor_id) ELSE CONCAT('combined-',vpay_combined_id) END AS prevCombVendor"), 'vpay_vtrxn_id as prevVendorTrxn', 'online_charge_id')
                .where('vpay_id', vpayId));
            const invoice_vendor_pay = (yield this.query()
                .select(this.db.raw("CASE WHEN invendorpay_vendor_id IS NOT NULL THEN CONCAT('vendor-',invendorpay_vendor_id) ELSE CONCAT('combined-',invendorpay_combined_id) END AS prevInvCombVendor"), 'invendorpay_vtrxn_id as prevInvTrxnId', this.db.raw('CAST(invendorpay_amount AS DECIMAL(15,2)) AS prevPayAmount'))
                .from('trabill_invoice_vendor_payments')
                .where('invendorpay_vpay_id', vpayId)
                .andWhereNot('invendorpay_isdeleted', 1));
            return { vendor_pay_data, invoice_vendor_pay };
        });
    }
    getAdvancePrevAccId(advr_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .from('trabill_vendor_advance_return')
                .select('advr_account_id as prev_acc_id', 'advr_amount as prev_return_amount', this.db.raw("CASE WHEN advr_vendor_id IS NOT NULL THEN CONCAT('vendor-',advr_vendor_id) ELSE CONCAT('combined-',advr_combined_id) END AS prevCombVendor"), 'advr_vtrxn_id as prevVendorTrxnId', 'advr_payment_type as prevPayType', 'advr_actransaction_id AS prevAccTrxnId', 'advr_vouchar_no AS prev_voucher_no', 'transaction_charge_id AS prev_transaction_charge_id')
                .where('advr_id', advr_id));
            return data[0];
        });
    }
    deleteVendorPayment(vpayId, vpay_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_vendor_payments')
                .update({ vpay_is_deleted: 1, vpay_deleted_by })
                .where('vpay_id', vpayId);
            return data;
        });
    }
    getPaymentMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_accounts_type')
                .select('acctype_id', 'acctype_name')
                .whereNot('acctype_is_deleted', 1);
            return data;
        });
    }
    getVendorPayForEditById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [payments] = yield this.query()
                .from('trabill_vendor_payments')
                .select('vpay_payment_to', this.db.raw("CASE WHEN vpay_vendor_id IS NOT NULL THEN CONCAT('vendor-',vpay_vendor_id) ELSE CONCAT('combined-',vpay_combined_id) END AS com_vendor"), 'vpay_invoice_id', 'invoice_no', 'vpay_account_id as account_id', 'payment_method_id', 'has_refer_passport', 'vpcheque_cheque_no as cheque_no', 'vpaypass_passport_id', 'vpay_receipt_no as vpay_receipt', 'online_charge', 'vendor_ait', 'payment_amount', 'vpcheque_bank_name', this.db.raw("DATE_FORMAT(trabill_vendor_payments.payment_date, '%Y-%c-%e') as payment_date"), this.db.raw("DATE_FORMAT(vpcheque_withdraw_date, '%Y-%c-%e') as vpcheque_withdraw_date"), 'note', 'vpay_payment_by')
                .where('vpay_id', id)
                .andWhereNot('vpay_is_deleted', 1)
                .leftJoin('trabill_vendor_payments_cheques', {
                vpcheque_vpay_id: 'vpay_id',
            })
                .leftJoin('trabill_vendor_payments_passports', {
                vpaypass_vpay_id: 'vpay_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'vpay_invoice_id' });
            return payments;
        });
    }
    getInvoiceVendorInfo(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('v_inv_specific_payment')
                .where('invendorpay_vpay_id', invoiceId);
        });
    }
    getNonPaidVendorInvoice() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_category_id as cate_id')
                .from('trabill_invoices')
                .where('invoice_is_deleted', 0)
                .andWhere('invoice_is_refund', 0)
                .andWhere('invoice_org_agency', this.org_agency));
        });
    }
    getNonPaidVendorInvoiceForEdit() {
        return __awaiter(this, void 0, void 0, function* () {
            const invoices = (yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_net_total', 'invoice_category_id as cate_id')
                .from('trabill_invoices')
                .where('invoice_org_agency', this.org_agency)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1)
                .orderBy('invoice_id', 'desc'));
            let data = [];
            for (const invoice of invoices) {
                const [invoice_vpay] = yield this.query()
                    .select(this.db.raw('sum(invendorpay_amount) as total_pay_amount'))
                    .from('trabill_invoice_vendor_payments')
                    .whereNot('invendorpay_isdeleted', 1)
                    .andWhere('invendorpay_invoice_id', invoice.invoice_id);
                const invoice_due = Number(invoice.invoice_net_total) -
                    Number(invoice_vpay.total_pay_amount);
                data.push(Object.assign(Object.assign({}, invoice), { invoice_due, total_payment_amount: invoice_vpay.total_pay_amount
                        ? invoice_vpay.total_pay_amount
                        : 0 }));
            }
            return data;
        });
    }
    getSpecific_inv_vendors(advr_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendors = yield this.query()
                .select('vendor_pay.invendorpay_invoice_id', this.db.raw(`COALESCE(trabill_vendors.vendor_name, combine_name) AS vendor_name`), this.db.raw(`CASE WHEN vendor_pay.invendorpay_vendor_id IS NOT NULL THEN CONCAT('vendor-', vendor_pay.invendorpay_vendor_id) ELSE CONCAT('combined-',vendor_pay.invendorpay_combined_id) END AS comb_vendor_specific_invoice`), this.db.raw(`SUM(COALESCE(cost_price, 0)) AS specific_inv_amount`))
                .from('trabill_invoice_vendor_payments as vendor_pay')
                .leftJoin('trabill_vendors', { vendor_id: 'invendorpay_vendor_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'vendor_pay.invendorpay_combined_id',
            })
                .leftJoin('view_invoices_cost', {
                invoice_id: 'vendor_pay.invendorpay_invoice_id',
            })
                .where('vendor_pay.invendorpay_vpay_id', advr_id)
                .andWhere('vendor_pay.invendorpay_isdeleted', 0);
            return vendors;
        });
    }
    countAllInvoiceVendorPayedAmount(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ total_invoice_vpay_amount }] = yield this.query()
                .select(this.db.raw(`sum(invendorpay_amount) AS total_invoice_vpay_amount`))
                .from('trabill_invoice_vendor_payments')
                .where('invendorpay_invoice_id', invoice_id)
                .andWhere('invendorpay_isdeleted', 0);
            return total_invoice_vpay_amount;
        });
    }
    viewVendorPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('v_vendor_payment')
                .select('*')
                .where('vpay_id', id);
            return data[0];
        });
    }
    getVendorPaymentCheque() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_vendor_payments_cheques')
                .leftJoin('trabill_vendor_payments', { vpay_id: 'vpcheque_vpay_id' })
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpcheque_is_deleted', 1);
            return data;
        });
    }
    getVendorAdvrCheque(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_vendor_advance_return_cheque_details')
                .select('cheque_id', 'cheque_advr_id', 'vendor_name', 'cheque_number', 'cheque_withdraw_date', 'cheque_bank_name as cheque_bank', 'cheque_status', 'cheque_deposit_date', 'advr_amount')
                .leftJoin('trabill_vendors', { vendor_id: 'cheque_vendor_id' })
                .leftJoin('trabill_vendor_advance_return', { advr_id: 'cheque_advr_id' })
                .where('trabill_vendors.vendor_org_agency', this.org_agency)
                .andWhere('cheque_status', status)
                .andWhereNot('cheque_is_deleted', 1)
                .orderBy('cheque_id', 'desc');
            return data;
        });
    }
    allVendorPaymentChecque(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const cheques = yield this.query()
                .from('trabill_vendor_payments_cheques')
                .select('vpcheque_id as cheque_id', 'vendor_name', 'trabill_vendors.vendor_id', 'vpcheque_cheque_no as cheque_number', 'vpcheque_withdraw_date as cheque_withdraw_date', 'created_date as cheque_payment_date', 'vpcheque_amount as cheque_amount', 'vpcheque_bank_name as cheque_bank', 'vpcheque_status as cheque_status')
                .leftJoin('trabill_vendors', { vendor_id: 'vpcheque_vendor_id' })
                .leftJoin('trabill_vendor_payments', { vpay_id: 'vpcheque_vpay_id' })
                .where('vendor_org_agency', this.org_agency)
                .andWhere('vpcheque_status', status)
                .andWhereNot('vpcheque_is_deleted', 1)
                .orderBy('vpcheque_id', 'desc');
            return cheques;
        });
    }
    viewAllVendors(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('vendor_id', 'vendor_name', 'vendor_lbalance as amount')
                .from('trabill_vendors')
                .where('vendor_is_deleted', 0)
                .andWhere((builder) => {
                builder
                    .andWhere('vendor_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(vendor_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(vendor_mobile) LIKE ?`, [`%${search}%`]);
                    }
                    else {
                        event.orderBy('vendor_created_date', 'desc').limit(20);
                    }
                });
            })
                .andWhere('vendor_org_agency', this.org_agency)
                .andWhere('vendor_activity_status', 1)
                .orderBy('vendor_name');
        });
    }
    getInvoiceVendors(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoices_cost = yield this.query()
                .select('invoice_id', 'org_agency', 'vendor_id', 'combine_id', this.db.raw(`SUM(COALESCE(cost_price, 0)) AS cost_price`), this.db.raw(`SUM(COALESCE(due_amount, 0)) AS due_amount`), 'comb_vendor', 'vendor_name', 'invendorpay_invoice_id', 'payment_amount', 'create_date', 'sales_date')
                .from('view_invoices_cost')
                .where('invoice_id', invoice_id)
                .groupBy('vendor_id', 'combine_id');
            return invoices_cost;
        });
    }
}
exports.default = VendorModel;
//# sourceMappingURL=VendorModel.js.map