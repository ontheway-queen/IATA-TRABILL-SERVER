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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const ClientToClientServices_1 = __importDefault(require("./NarrowServices/ClientToClientServices"));
const GroupToGroupServices_1 = __importDefault(require("./NarrowServices/GroupToGroupServices"));
const TransferInServices_1 = __importDefault(require("./NarrowServices/TransferInServices"));
const Trxns_1 = __importDefault(require("../../../common/helpers/Trxns"));
const dayjs_1 = __importDefault(require("dayjs"));
class HajjiManagementServices extends abstract_services_1.default {
    constructor() {
        super();
        // ===================================== client to client transaction ==================================
        this.deleteClientToClient = new ClientToClientServices_1.default()
            .deleteClientToClient;
        this.addClientToClient = new ClientToClientServices_1.default().addClientToClient;
        this.viewClientTransaction = new ClientToClientServices_1.default()
            .viewClientTransaction;
        this.updateClientToClient = new ClientToClientServices_1.default()
            .updateClientToClient;
        this.getDetailsClientToClient = new ClientToClientServices_1.default()
            .getDetailsClientToClient;
        this.getAllClientToClient = new ClientToClientServices_1.default()
            .getAllClientToClient;
        // ==================================== group transaction ===========================================
        this.addGroupToGroup = new GroupToGroupServices_1.default().addGroupToGroup;
        this.getAllGroupTransaction = new GroupToGroupServices_1.default()
            .getAllGroupTransaction;
        this.getDetailsGroupTransactioon = new GroupToGroupServices_1.default()
            .getDetailsGroupTransactioon;
        this.viewGroupTransfer = new GroupToGroupServices_1.default().viewGroupTransfer;
        this.updateGroupToGroup = new GroupToGroupServices_1.default().updateGroupToGroup;
        this.deleteGroupTransaction = new GroupToGroupServices_1.default()
            .deleteGroupTransaction;
        // ============================= transfer in =========================================
        this.addTransferIn = new TransferInServices_1.default().addTransferIn;
        this.updateTransferIn = new TransferInServices_1.default().updateTransferIn;
        this.deleteTransferIn = new TransferInServices_1.default().deleteTransferIn;
        this.getAllHajiTransfer = new TransferInServices_1.default().getAllHajiTransfer;
        this.getDataForEdit = new TransferInServices_1.default().getDataForEdit;
        // @Transfer Out
        this.addTransferOut = new TransferInServices_1.default().addTransferOut;
        this.updateTransferOut = new TransferInServices_1.default().updateTransferOut;
        // ================================ cancel pre registration ===========================
        this.createCancelPreReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cancel_created_by, cancel_total_charge, cancel_govt_charge, cancel_office_charge, tracking_no, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const conn = this.models.HajjiManagementModels(req, trx);
                const conn_pre_haji = this.models.invoiceHajjPre(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const cancel_id = yield conn.insertPreRegCancelList({
                    cancel_office_charge,
                    cancel_govt_charge,
                    cancel_total_charge,
                    cancel_created_by,
                });
                const trackingNoInfo = [];
                if (tracking_no.length)
                    try {
                        for (var _d = true, tracking_no_1 = __asyncValues(tracking_no), tracking_no_1_1; tracking_no_1_1 = yield tracking_no_1.next(), _a = tracking_no_1_1.done, !_a;) {
                            _c = tracking_no_1_1.value;
                            _d = false;
                            try {
                                const item = _c;
                                const info = yield conn_pre_haji.getHajiIdByTrackingNo(item);
                                const { comb_client, prevInvoiceNo } = yield common_conn.getPreviousInvoices(info.haji_info_invoice_id);
                                yield conn.updateHajjPreRegTrackingNoIsCancel(item, info.haji_info_invoice_id, 1);
                                const clTrxnBody = {
                                    ctrxn_type: 'DEBIT',
                                    ctrxn_amount: cancel_total_charge,
                                    ctrxn_cl: comb_client,
                                    ctrxn_voucher: prevInvoiceNo,
                                    ctrxn_particular_id: 44,
                                    ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                                    ctrxn_note: '',
                                    ctrxn_particular_type: 'Cancel pre reg',
                                    ctrxn_user_id: cancel_created_by,
                                };
                                const cancel_track_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                                const trackingNo = {
                                    cancel_track_client_id: client_id,
                                    cancel_track_combine_id: combined_id,
                                    cancel_track_trxn_id,
                                    cancel_track_tracking_no: item,
                                    cancel_track_cancel_id: cancel_id,
                                    cancel_track_invoice_id: info.haji_info_invoice_id,
                                };
                                trackingNoInfo.push(trackingNo);
                                yield conn.updateInvoiceHajjPreRegIsCancel(info.haji_info_invoice_id, 1);
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = tracking_no_1.return)) yield _b.call(tracking_no_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                if (trackingNoInfo.length)
                    yield conn.insertPreRegCancelTrackingNo(trackingNoInfo);
                yield this.insertAudit(req, 'create', 'Invoice hajj pre reg has been created', cancel_created_by, 'INVOICES');
                return { success: true, data: { cancel_id } };
            }));
        });
        /**
         *
         * @Get_invoice_hajj_tracking_no
         */
        this.getTrackingNoByClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.HajjiManagementModels(req);
            const combClient = req.params.comb_client;
            const { search } = req.query;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(combClient);
            const data = yield conn.getTrackingNoByClient(client_id, combined_id, search);
            return {
                success: true,
                message: 'Invoice hajj tracking no',
                data,
            };
        });
        /**
         *
         * @Get_invoice_hajj_tracking_no_by_group_id
         */
        this.getTrackingNoByGroup = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.HajjiManagementModels(req);
            const { group_id } = req.params;
            const { search: searchText } = req.query;
            const data = yield conn.getTrackingNoByGroup(group_id, searchText);
            return {
                success: true,
                message: 'Invoice hajj tracking no by group',
                data,
            };
        });
        /**
         *
         * @Get_invoice_hajj_tracking_no_by_group_id
         */
        this.getHajjPreReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.HajjiManagementModels(req);
            const { search } = req.query;
            const data = yield conn.getHajjPreReg(search);
            return { success: true, data };
        });
        this.getAllCancelPreReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models
                .HajjiManagementModels(req)
                .getAllCancelPreReg(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.deleteCancelPreReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const cancle_id = req.params.id;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const trxn = new Trxns_1.default(req, trx);
                const trackingInfo = yield conn.getCancleTrakingNoInfo(cancle_id);
                yield conn.deletePreRegCancleList(cancle_id, deleted_by);
                yield conn.deleteCancelPreReg(cancle_id, deleted_by);
                if (trackingInfo.length)
                    for (const info of trackingInfo) {
                        const { comb_client, trxn_id, invoice_id } = info;
                        yield conn.updateHajjPreRegTrackingNoIsCancel(info.tracking_no, invoice_id, 0);
                        if (trxn_id && comb_client)
                            yield trxn.deleteClTrxn(trxn_id, comb_client);
                        yield conn.updateInvoiceHajjPreRegIsCancel(invoice_id, 0);
                    }
                yield this.insertAudit(req, 'delete', 'Invoice hajj pre reg has been deleted', deleted_by, 'INVOICES');
                return {
                    success: true,
                    data: 'Cancle pre reg deleted successfully',
                };
            }));
        });
        this.getHajjiInfoByTrakingNo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { ticket_no } = req.body;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getHajjiInfoByTrakingNo(ticket_no);
            return { success: true, message: 'Get haji info by traking no', data };
        });
        this.getHajjTrackingList = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getHajjTrackingList(search);
            return { success: true, data };
        });
        this.createCancelHajjReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cl_govt_charge, cl_office_charge, cl_total_charge, created_by, tracking_no, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const hajj_conn = this.models.InvoiceHajjModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const cancel_id = yield conn.createHajjRegCancel({
                    cl_org_agency: +req.agency_id,
                    cl_total_charge,
                    cl_office_charge,
                    cl_govt_charge,
                    cl_created_by: created_by,
                });
                const trackingNoInfo = [];
                for (const item of tracking_no) {
                    const info = yield hajj_conn.getHajiInfoByTrackingNo(item);
                    yield conn.updateHajjHajiInfoIsCancel(item, info.invoice_id, 1);
                    const ctrxn_id = yield trxns.clTrxnInsert({
                        ctrxn_amount: cl_total_charge,
                        ctrxn_cl: info.comb_client,
                        ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                        ctrxn_note: '',
                        ctrxn_voucher: info.invoice_no,
                        ctrxn_particular_id: 152,
                        ctrxn_particular_type: 'Cancel Hajj Registration',
                        ctrxn_type: 'DEBIT',
                        ctrxn_user_id: created_by,
                    });
                    const trackingNo = {
                        clt_cl_id: cancel_id,
                        clt_client_id: info.invoice_client_id,
                        clt_combine_id: info.invoice_combined_id,
                        clt_invoice_id: info.invoice_id,
                        clt_tracking_no: item,
                        clt_trxn_id: ctrxn_id,
                    };
                    trackingNoInfo.push(trackingNo);
                    yield conn.updateInvoiceIsCancel(info.invoice_id, 1);
                }
                if (trackingNoInfo.length)
                    yield conn.createHajjRegCancelTrackingNo(trackingNoInfo);
                yield this.insertAudit(req, 'create', 'Cancel reg has been created', created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Create cancel hajj reg successful!',
                    data: cancel_id,
                };
            }));
        });
        this.deleteCancelHajjReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cancel_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const cancelInfo = yield conn.getCancelRegTrackingInfo(cancel_id);
                yield conn.deleteHajjRegCancelListTrackingNo(cancel_id, deleted_by);
                if (cancelInfo.length)
                    for (const cancel of cancelInfo) {
                        const { comb_client, clt_trxn_id, clt_invoice_id, clt_tracking_no } = cancel;
                        yield conn.updateHajjHajiInfoIsCancel(clt_tracking_no, clt_invoice_id, 0);
                        yield trxns.deleteClTrxn(clt_trxn_id, comb_client);
                        yield conn.updateInvoiceIsCancel(clt_invoice_id, 0);
                    }
                yield this.insertAudit(req, 'delete', 'Delete cancel hajj reg', deleted_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Cancel Hajj Reg Delete Successful!',
                };
            }));
        });
        this.getCancelHajjRegList = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getCancelHajjRegList(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getHajjHajiInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getHajjHajiInfo(search);
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = HajjiManagementServices;
//# sourceMappingURL=HajjiManagement.Services.js.map