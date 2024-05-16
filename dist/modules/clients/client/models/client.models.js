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
const common_helper_1 = require("../../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class ClientModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // UPDATE CLIENT OPENING BALANCE TRXN ID
        this.updateClientOpeningTransactions = (client_opening_client_trxn_id, clientId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ client_opening_client_trxn_id })
                .into('trabill_clients')
                .where('client_id', clientId);
        });
        // SELECT CLIENT LAST BALANCE
        this.selectClientLBalance = (comb_client) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const balance = (yield this.query()
                .select('combine_lbalance AS last_balance')
                .from('trabill_combined_clients')
                .where('combine_id', combined_id)
                .unionAll([
                this.db
                    .select('client_lbalance AS last_balance')
                    .from('trabill_clients')
                    .where('client_id', client_id),
            ]));
            if (balance.length) {
                return Number(balance[0].last_balance);
            }
            else {
                throw new customError_1.default('Please provide a valid client Id', 400, 'Invalid client Id');
            }
        });
        this.getClientCompany = (client_id) => __awaiter(this, void 0, void 0, function* () {
            const [{ company_id }] = yield this.db('trabill_client_company_information')
                .select('company_id')
                .where('company_client_id', client_id)
                .andWhereNot('company_is_deleted', 1);
            return company_id;
        });
        this.getClLastBalanceById = (clientId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const client = (yield this.query()
                .select('client_lbalance')
                .from('trabill_clients')
                .where('client_id', clientId));
            if (!client.length) {
                throw new customError_1.default('Please provide valid client id', 400, 'Invalid client id');
            }
            const client_total_invoice = yield this.query()
                .from('trabill_invoices')
                .select(this.db.raw('sum(invoice_net_total) as client_total'))
                .where('invoice_client_id', clientId)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1);
            const client_total = Number((_a = client_total_invoice[0]) === null || _a === void 0 ? void 0 : _a.client_total);
            const client_pay_invoice = yield this.query()
                .from('trabill_invoice_client_payments')
                .select(this.db.raw('sum(invclientpayment_amount) as total_pay'))
                .where('invclientpayment_client_id', clientId)
                .andWhereNot('invclientpayment_is_deleted', 1);
            const client_pay = Number((_b = client_pay_invoice[0]) === null || _b === void 0 ? void 0 : _b.total_pay);
            return {
                client_invoice_total: client_total,
                client_prev_due: client_total - client_pay,
                client_last_balance: Number(client[0].client_lbalance),
            };
        });
        this.getClientOpeningTrxnInfo = (clientId) => __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .select('client_opening_client_trxn_id')
                .from('trabill_clients')
                .where('client_id', clientId);
            return Number(client[0].client_opening_client_trxn_id);
        });
    }
    // INSERT CLIENT
    insertClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query().insert(data).into('trabill_clients');
            return id;
        });
    }
    // GET SINGLE CLIENT BY CLIENT ID
    getSingleClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [client] = yield this.query()
                .select('client_id', 'client_address', 'client_category_id', 'client_credit_limit', 'client_email', 'client_source', 'client_gender', 'client_mobile', 'client_name', 'client_trade_license', 'client_type', 'client_org_agency', 'client_entry_id', 'client_created_by', 'client_designation', 'client_lbalance', 'client_created_date', 'client_activity_status', 'category_title', 'client_walking_customer')
                .from('trabill_clients')
                .leftJoin('trabill_client_categories', {
                category_id: 'client_category_id',
            })
                .where('client_id', id);
            if (!client) {
                throw new customError_1.default('Found no client with this ID', 400, 'Bad request');
            }
            return client;
        });
    }
    // UPDATE  CLIENT
    updateClient(client_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .into('trabill_clients')
                .update(data)
                .where('client_id', client_id);
            if (client) {
                return client;
            }
            else {
                throw new customError_1.default(`You can't edit this client`, 400, `Bad request`);
            }
        });
    }
    updateClientStatus(client_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .into('trabill_clients')
                .update('client_activity_status', status == 'active' ? 1 : 0)
                .where('client_id', client_id)
                .andWhere('client_org_agency', this.org_agency);
            return client;
        });
    }
    getClientInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('client_type', this.db.raw(`COALESCE(client_name, company_name) as client_name`), 'client_email', 'company_email', this.db.raw('COALESCE(client_mobile, company_contact_no) as client_mobile'), 'client_address')
                .from('trabill_clients')
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'client_id',
            })
                .where('client_id', id);
            return data[0];
        });
    }
    getAllClients(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const clients = yield this.query()
                .select('*')
                .from('view_all_clients')
                .where((builder) => {
                builder.where('client_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_clients.client_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_clients.mobile', 'LIKE', `%${search}%`)
                            .andWhereRaw(`LOWER(view_all_clients.client_entry_id) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                });
            })
                .andWhere('client_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number);
            return clients;
        });
    }
    viewAllClient(search) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const clients = yield this.query()
                .select('client_id', 'client_name', 'client_last_balance as last_balance', 'category_prefix', 'mobile', 'client_walking_customer', 'client_activity_status')
                .from(`${this.database}.view_all_clients`)
                .modify((event) => {
                if (search && search !== 'all') {
                    event
                        .where('client_org_agency', this.org_agency)
                        .andWhere('client_activity_status', 1)
                        .andWhere(this.db.raw('LOWER(client_name)'), 'LIKE', `%${search}%`)
                        .orWhere(this.db.raw('LOWER(mobile)'), 'LIKE', `%${search}%`);
                }
            })
                .andWhere('client_org_agency', this.org_agency)
                .andWhere('client_activity_status', 1)
                .limit(20);
            return clients;
        });
    }
    countClientDataRow(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_all_clients')
                .andWhere((builder) => {
                builder.where('client_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_clients.client_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_clients.mobile', 'LIKE', `%${search}%`)
                            .orWhere('view_all_clients.email', 'LIKE', `%${search}%`);
                    }
                });
            })
                .andWhere('client_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getClientExcelData() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield this.query()
                .select('trabill_clients.client_id', 'trabill_clients.client_name', 'client_source', 'trabill_clients.client_email as email', 'trabill_clients.client_mobile as mobile', 'trabill_clients.client_lbalance as client_last_balance', 'trabill_clients.client_activity_status', this.db.raw("concat(user_first_name, ' ', user_last_name) AS created_by"))
                .from('trabill_clients')
                .join('trabill_users', 'trabill_users.user_id', 'trabill_clients.client_created_by')
                .leftJoin('trabill_client_categories', 'trabill_clients.client_category_id', 'trabill_client_categories.category_id')
                .where('client_org_agency', this.org_agency)
                .andWhereNot('client_is_deleted', 1)
                .orderBy('client_created_date', 'desc');
            return clients;
        });
    }
    getTraxn(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ total }] = yield this.query()
                .from(`${this.trxn}.client_trxn`)
                .count('* as total')
                .where('ctrxn_cl_id', client_id)
                .andWhere('ctrxn_agency_id', this.org_agency)
                .andWhereNot('ctrxn_particular_id', 11)
                .andWhereNot('ctrxn_is_delete', 1);
            return total;
        });
    }
    deleteClient(client_id, delete_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw("call deleteAccountByType('CLIENT', ?, ?);", [
                delete_by,
                client_id,
            ]);
        });
    }
    getClientName(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .from('trabill_clients')
                .select('client_name')
                .where('client_id', client_id);
            return client[0];
        });
    }
    clientAllInvoices(client_id, combined_id, page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('v_all_inv')
                .modify((e) => {
                if (client_id) {
                    e.where('invoice_client_id', client_id);
                }
                else if (combined_id) {
                    e.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
            const [total] = yield this.query()
                .count('* as count')
                .from('trabill_invoices')
                .modify((e) => {
                if (client_id) {
                    e.where('invoice_client_id', client_id);
                }
                else if (combined_id) {
                    e.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1);
            return { data, count: total.count };
        });
    }
    clientMoneyReceipts(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('receipt_id', 'receipt_vouchar_no', 'receipt_payment_date', 'receipt_total_amount', 'receipt_note')
                .from('trabill_money_receipts')
                .where('receipt_payment_status', 'SUCCESS')
                .andWhere('receipt_client_id', client_id)
                .andWhereNot('receipt_has_deleted', 1)
                .andWhere('receipt_org_agency', this.org_agency);
            return data;
        });
    }
    clientAllQuotations(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('quotation_id', 'quotation_no', 'quotation_note', 'quotation_create_date', 'quotation_discount_total', 'quotation_net_total')
                .from('trabill_quotations')
                .leftJoin('trabill_clients', {
                client_id: 'quotation_client_id',
            })
                .where('quotation_client_id', client_id)
                .distinct()
                .where('quotation_is_deleted', 0)
                .andWhere('quotations_org_agency', this.org_agency);
            return data;
        });
    }
    clientAirticketRefund(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('crefund_client_id', 'atrefund_id', 'invoice_no', 'atrefund_date', 'crefund_return_amount', 'crefund_payment_type')
                .from('trabill_airticket_refunds')
                .leftJoin('trabill_invoices', { invoice_client_id: 'atrefund_client_id' })
                .leftJoin('trabill_airticket_client_refunds', {
                crefund_refund_id: 'atrefund_id',
            })
                .where('crefund_client_id', client_id)
                .andWhereNot('atrefund_is_deleted', 1);
            return data;
        });
    }
    clientOtherRefund(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('refund_client_id', 'refund_vouchar_number', 'crefund_return_amount as refund_net_total', 'crefund_charge_amount', 'crefund_payment_type as refund_payment_type')
                .from('trabill_other_refunds')
                .leftJoin('trabill_other_refunds_to_clients', {
                crefund_refund_id: 'refund_id',
            })
                .where('refund_client_id', client_id)
                .andWhereNot('refund_is_deleted', 1)
                .andWhere('refund_org_agency', this.org_agency);
            return data;
        });
    }
    clientTourRefund(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('crefund_client_id', 'refund_vouchar_number', 'crefund_total_amount as refund_total', 'crefund_payment_type as payment_type', 'crefund_charge_amount as charge_amount')
                .from('trabill_tour_refunds')
                .leftJoin('trabill_tour_refunds_to_clients', { crefund_id: 'refund_id' })
                .where('crefund_client_id', client_id)
                .andWhereNot('refund_is_deleted', 1)
                .andWhere('refund_org_agency', this.org_agency);
            return data;
        });
    }
    clientAllPassport(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('passport_id', 'passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire')
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_client_id', client_id)
                .andWhere('passport_org_agency', this.org_agency);
            return data;
        });
    }
    getAllClientsAndCombined(search) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const querySearch = `%${search}%`;
            const clients = yield this.query()
                .select('client_id', 'client_entry_id', 'client_name', 'client_mobile', this.db.raw('"client" as client_type'), 'client_walking_customer')
                .from('trabill.trabill_clients')
                .where('client_org_agency', this.org_agency)
                .andWhereNot('client_is_deleted', 1)
                .andWhere((builder) => {
                builder.where('client_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .whereRaw('LOWER(client_name) LIKE ?', [querySearch])
                            .orWhereRaw('LOWER(client_mobile) LIKE ? ', [querySearch]);
                    }
                    else {
                        event.limit(30);
                    }
                });
            })
                .unionAll([
                this.db
                    .select('combine_id', 'combine_entry_id', 'combine_name', 'combine_mobile', this.db.raw('"combined" as client_type'), this.db.raw('0 as client_walking_customer'))
                    .from('trabill.trabill_combined_clients')
                    .where('combine_org_agency', this.org_agency)
                    .andWhereNot('combine_is_deleted', 1)
                    .andWhere((builder) => {
                    builder
                        .where('combine_org_agency', this.org_agency)
                        .modify((event) => {
                        if (search && search !== 'all') {
                            event
                                .whereRaw('LOWER(combine_name) LIKE ?', [querySearch])
                                .orWhereRaw('LOWER(combine_mobile) LIKE ? ', [querySearch]);
                        }
                        else {
                            event.limit(30);
                        }
                    });
                }),
            ])
                .orderBy('client_name')
                .limit(30);
            return clients;
        });
    }
    getClientCombinedIncentiveIncome(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('incentive_id', this.db.raw('coalesce(client_name, combine_name) as client_name'), this.db.raw(`coalesce(combine_company_name, 'company_name') as company_name`), 'incentive_vouchar_no', 'account_name', 'incentive_adjust_bill', 'incentive_amount', 'trxntype_name as transaction_type', 'incentive_created_date', 'incentive_note', this.db.raw(`concat(user_first_name,' ',user_last_name) as created_by`), 'incentive_is_deleted')
                .from('trabill_incentive_income_details')
                .leftJoin('trabill_accounts', {
                'trabill_accounts.account_id': 'incentive_account_id',
            })
                .leftJoin('trabill_clients', { client_id: 'incentive_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'incentive_combine_id',
            })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'incentive_trnxtype_id',
            })
                .leftJoin('trabill_users', { user_id: 'incentive_created_by' })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'client_id',
            })
                .where('incentive_org_agency', this.org_agency)
                .andWhere('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'COMB_CLIENT')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('count(*) as row_count'))
                .from('trabill_incentive_income_details')
                .where('incentive_org_agency', this.org_agency)
                .andWhere('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'COMB_CLIENT');
            return { count: row_count, data };
        });
    }
    getSingleClientCombinedIncentiveIncome(incentive_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .select('incentive_id', this.db.raw('coalesce(client_name, combine_name) as client_name'), this.db.raw('CASE WHEN incentive_client_id IS NOT NULL THEN CONCAT("client-",incentive_client_id) ELSE CONCAT("combined-",incentive_combine_id) END AS comb_client'), 'incentive_account_id', 'account_name', 'account_branch_name', 'incentive_adjust_bill', 'incentive_amount', 'incentive_note', this.db.raw(`concat(user_first_name,' ',user_last_name) as created_by`), 'incentive_is_deleted', 'incentive_trnxtype_id as type_id', 'trxntype_name', 'incentive_account_category_id', this.db.raw(`CASE WHEN incentive_account_category_id = 1 THEN 'Cash' WHEN incentive_account_category_id = 2 THEN 'Bank' WHEN incentive_account_category_id = 3 THEN 'Mobile Banking' WHEN incentive_account_category_id = 4 THEN 'Cheque' ELSE NULL END AS transaction_type`), 'incentive_created_date')
                .from('trabill_incentive_income_details')
                .leftJoin('trabill_accounts', {
                'trabill_accounts.account_id': 'incentive_account_id',
            })
                .leftJoin('trabill_clients', { client_id: 'incentive_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'incentive_combine_id',
            })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'incentive_trnxtype_id',
            })
                .leftJoin('trabill_users', { user_id: 'incentive_created_by' })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'client_id',
            })
                .andWhere('incentive_id', incentive_id);
            return client;
        });
    }
    getCombClientMobile(client_id, combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('client_category_id as category_id', 'client_mobile as mobile')
                .from('trabill_clients')
                .where('client_id', client_id)
                .unionAll([
                this.db
                    .select('combine_category_id as category_id', 'combine_mobile as mobile')
                    .from('trabill_combined_clients')
                    .where('combine_id', combine_id),
            ]);
            return data;
        });
    }
}
exports.default = ClientModel;
//# sourceMappingURL=client.models.js.map