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
class HajjiManagementModels extends abstract_models_1.default {
    constructor() {
        // ============================= @ client to client =====================================
        super(...arguments);
        this.getGroupToGroupTrackNo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('grouptr_number as ctrcknumber_number')
                .from('trabill_group_transfer_tracking_numbers')
                .where('grouptr_gtransfer_id', id);
            return data;
        });
        this.getHajiTransferForEdit = (id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('transfer_agent_id', 'agency_name', 'transfer_charge')
                .from('trabill_haji_transfer')
                .leftJoin('trabill_agency', { agency_id: 'transfer_agent_id' })
                .where('transfer_id', id);
            const haji_informations = yield this.query()
                .select(this.db.raw('CAST(transfertrack_tracking_no AS SIGNED) AS transfertrack_tracking_no'), 'transfertrack_passport_id', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_email', 'passport_nid_no', 'transfertrack_maharam_id', 'maharam_name')
                .from('trabill_haji_transfer_tracking_no')
                .leftJoin('trabill_passport_details', {
                passport_id: 'transfertrack_passport_id',
            })
                .leftJoin('trabill_maharams', { maharam_id: 'transfertrack_maharam_id' })
                .whereNot('transfertrack_is_deleted', 1)
                .andWhere('transfertrack_transfer_id', id);
            return Object.assign(Object.assign({}, data), { haji_informations });
        });
        this.getTotalhaji = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_haji_transfer_tracking_no')
                .select('transfertrack_tracking_no', 'transfertrack_passport_id', 'passport_name', 'passport_passport_no', 'transfertrack_maharam_id', 'maharam_name')
                .leftJoin('trabill_passport_details', {
                passport_id: 'transfertrack_passport_id',
            })
                .leftJoin('trabill_maharams', { maharam_id: 'transfertrack_maharam_id' })
                .where('transfertrack_transfer_id', id)
                .andWhere('transfertrack_is_deleted', 0);
            return data;
        });
        this.getAllCancelPreReg = (page, size) => __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .into('trabill_prereg_cancel_list')
                .select('cancel_id', this.db.raw(`GROUP_CONCAT(cancel_track_tracking_no SEPARATOR ', ') as cancel_track_tracking_no`), 'cancel_office_charge', 'cancel_govt_charge', 'cancel_total_charge', this.db.raw("DATE_FORMAT(cancel_create_date, '%d %b %Y') as date"))
                .join('trabill_prereg_cancel_tracking_no', {
                cancel_track_cancel_id: 'cancel_id',
            })
                .where('trabill_prereg_cancel_list.cancel_is_deleted', 0)
                .andWhere('cancel_org_agency', this.org_agency)
                .groupBy('cancel_id', 'cancel_office_charge', 'cancel_govt_charge', 'cancel_total_charge')
                .orderBy('cancel_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [count] = (yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_prereg_cancel_list')
                .where('trabill_prereg_cancel_list.cancel_is_deleted', 0)
                .andWhere('cancel_org_agency', this.org_agency));
            return { count: count.row_count, data };
        });
        this.deleteCancelPreReg = (cancle_id, cancel_track_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_prereg_cancel_tracking_no')
                .update({ cancel_track_is_deleted: 1, cancel_track_deleted_by })
                .where('cancel_track_cancel_id', cancle_id);
        });
        this.insertPreRegCancelList = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_prereg_cancel_list')
                .insert(Object.assign(Object.assign({}, insertedData), { cancel_org_agency: this.org_agency }));
            return data[0];
        });
        this.deletePreRegCancleList = (cancel_id, cancel_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ cancel_is_deleted: 1, cancel_deleted_by })
                .into('trabill_prereg_cancel_list')
                .where({ cancel_id });
        });
        this.insertPreRegCancelTrackingNo = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_prereg_cancel_tracking_no')
                .insert(insertedData);
            return data[0];
        });
    }
    insertClientToClient(insertedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_client_to_client_transfer')
                .insert(Object.assign(Object.assign({}, insertedData), { ctransfer_org_agency: this.org_agency }));
            return id[0];
        });
    }
    deleteClientToClient(id, ctransfer_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_client_to_client_transfer')
                .update({ ctransfer_is_deleted: 1, ctransfer_deleted_by })
                .where('ctransfer_id', id);
            return data;
        });
    }
    deleteClToClTransaction(id, ctrcknumber_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_c_to_c_transfer_tracking_numbers')
                .update({ ctrcknumber_is_deleted: 1, ctrcknumber_deleted_by })
                .where('ctrcknumber_ctransfer_id', id);
        });
    }
    insertClToClTransaction(insertedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_c_to_c_transfer_tracking_numbers')
                .insert(insertedData);
            return id[0];
        });
    }
    updateClientToClient(insertedData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_client_to_client_transfer')
                .update(insertedData)
                .where('ctransfer_id', id);
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't update client to client transfer`, 400, `Bad request`);
            }
        });
    }
    getTrackingNoByClient(clientId, combinedId, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('haji_info_vouchar_no', 'hajiinfo_tracking_number', 'hajiinfo_serial', 'passport_name', 'passport_mobile_no', 'passport_nid_no', 'passport_date_of_birth', 'hajiinfo_gender')
                .from('trabill_invoice_hajj_haji_infos')
                .leftJoin('trabill_passport_details', {
                passport_id: 'haji_info_passport_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .where('invoice_org_agency', this.org_agency)
                .andWhereNot('haji_info_is_deleted', 1)
                .andWhere((event) => {
                if (clientId) {
                    event.andWhere('invoice_client_id', clientId);
                }
                else {
                    event.andWhere('invoice_combined_id', combinedId);
                }
                if (searchTerm)
                    event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
                        searchTerm,
                    ]);
            });
            return data;
        });
    }
    getTrackingNoByGroup(group_id, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('passport_name', 'haji_info_vouchar_no', 'hajiinfo_gender', 'hajiinfo_serial', 'hajiinfo_tracking_number', 'passport_nid_no')
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_hajj_haji_infos', (event) => {
                return event
                    .on('haji_info_invoice_id', '=', 'invoice_id')
                    .andOn(this.db.raw('haji_info_is_deleted = 0'));
            })
                .leftJoin('trabill_passport_details', {
                passport_id: 'haji_info_passport_id',
            })
                .whereNot('invoice_is_deleted', 1)
                .andWhere('invoice_haji_group_id', group_id)
                .andWhere((event) => {
                if (searchTerm) {
                    event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
                        searchTerm,
                    ]);
                }
            })
                .whereNotNull('hajiinfo_tracking_number');
        });
    }
    getHajjPreReg(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const haji = yield this.query()
                .select('trabill_invoices.invoice_id', 'haji_info_haji_id', 'hajiinfo_tracking_number', 'hajiinfo_name', 'hajiinfo_mobile', 'hajiinfo_gender', 'hajiinfo_nid', 'hajiinfo_serial', 'haji_info_vouchar_no')
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .join('trabill_haji_informations as haji', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .where('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .andWhereNot('haji_info_is_cancel', 1)
                .andWhereNot('haji.hajiinfo_tracking_number', 'null')
                .modify((builder) => {
                if (searchTerm) {
                    builder.where('haji.hajiinfo_tracking_number', 'like', `%${searchTerm}%`);
                }
            });
            return haji;
        });
    }
    getAllClientToClient(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_client_to_client_transfer')
                .select('ctransfer_id', 'ctransfer_note', 'ctransfer_job_name', 'ctransfer_tracking_no', 'ctransfer_charge', this.db.raw('COALESCE(cl.client_name, cc.combine_name) AS transfer_from_name'), this.db.raw('COALESCE(ct.client_name, cct.combine_name) AS transfer_to_name'), this.db.raw("DATE_FORMAT(ctransfer_created_date , '%b %d %Y') as transfer_date"))
                .leftJoin('trabill_clients as cl', 'cl.client_id', 'ctransfer_client_from')
                .leftJoin('trabill_clients as ct', 'ct.client_id', 'ctransfer_client_to')
                .leftJoin('trabill_combined_clients as cc', 'cc.combine_id', 'ctransfer_combined_from')
                .leftJoin('trabill_combined_clients as cct', 'cct.combine_id', 'ctransfer_combined_to')
                .where('trabill_client_to_client_transfer.ctransfer_org_agency', this.org_agency)
                .andWhereNot('ctransfer_is_deleted', 1)
                .orderBy('ctransfer_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_client_to_client_transfer')
                .where('trabill_client_to_client_transfer.ctransfer_org_agency', this.org_agency)
                .andWhereNot('ctransfer_is_deleted', 1);
            return { count: row_count, data };
        });
    }
    getDetailsClientToClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_client_to_client_transfer')
                .select(this.db.raw("CASE WHEN ctransfer_client_from IS NOT NULL THEN CONCAT('client-',ctransfer_client_from) ELSE CONCAT('combined-',ctransfer_combined_from) END AS ctransfer_combclient_from"), this.db.raw("CASE WHEN ctransfer_client_to IS NOT NULL THEN CONCAT('client-',ctransfer_client_to) ELSE CONCAT('combined-',ctransfer_combined_from) END AS ctransfer_combclient_to"), 'ctransfer_note', 'ctransfer_job_name', 'ctransfer_tracking_no', 'ctransfer_created_by', 'ctransfer_charge')
                .where('ctransfer_id', id);
            const tracking_numbers = (yield this.query()
                .select('ctrcknumber_number', 'ctrcknumber_is_deleted')
                .from('trabill_c_to_c_transfer_tracking_numbers')
                .where('ctrcknumber_ctransfer_id', id)
                .andWhereNot('ctrcknumber_is_deleted', 1));
            const ctrcknumber_number = tracking_numbers.map((item) => {
                return item.ctrcknumber_number;
            });
            return Object.assign(Object.assign({}, data), { ctrcknumber_number });
        });
    }
    viewClientTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_client_to_client_transfer')
                .select('ctransfer_client_from', 'ctransfer_client_to', this.db.raw("DATE_FORMAT(ctransfer_created_date, '%Y-%c-%e') as transfer_date"), 'ctrcknumber_number', 'client_name as transfer_from', 'ctransfer_client_to')
                .where('ctransfer_id', id)
                .leftJoin('trabill_c_to_c_transfer_tracking_numbers', {
                ctrcknumber_ctransfer_id: 'ctransfer_id',
            })
                .leftJoin('trabill_clients', {
                client_id: 'ctransfer_client_from',
            });
            return data[0];
        });
    }
    // ========================= group to group ===============================
    insertGroupToGroup(insertedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_group_to_group_transfer')
                .insert(Object.assign(Object.assign({}, insertedData), { gtransfer_org_agency: this.org_agency }));
            return id[0];
        });
    }
    updateGroupToGroup(insertedData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_group_to_group_transfer')
                .update(insertedData)
                .where('gtransfer_id', id);
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't update group to group transer`, 400, `Bad request`);
            }
        });
    }
    getAllGroupToGroupTransfer(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_group_to_group_transfer')
                .select('gtransfer_id', 'gtransfer_from', 'gtransfer_to', 'gtransfer_note', 'gtransfer_job_name', 'gtransfer_tracking_no', 'from_group.group_name as gtransfer_from_name', 'to_group.group_name as gtransfer_to_name', this.db.raw('DATE_FORMAT(gtransfer_create_date,"%Y %b %e") AS transfer_date'))
                .where('is_deleted', 0)
                .andWhere('gtransfer_org_agency', this.org_agency)
                .orderBy('gtransfer_id', 'desc')
                .leftJoin('trabill_haji_group AS from_group', {
                'from_group.group_id': 'gtransfer_from',
            })
                .leftJoin('trabill_haji_group AS to_group', {
                'to_group.group_id': 'gtransfer_to',
            })
                .limit(size)
                .offset(page_number);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill_group_to_group_transfer')
                .where('is_deleted', 0)
                .andWhere('gtransfer_org_agency', this.org_agency));
            return { count, data };
        });
    }
    getHajiGroupName(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.query()
                .from('trabill_haji_group')
                .select('group_name')
                .where('group_id', group_id)
                .andWhereNot('group_is_deleted', 1)
                .whereNull('group_org_agency')
                .orWhere('group_org_agency', this.org_agency);
            return client[0];
        });
    }
    viewGroupTransfer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_group_to_group_transfer')
                .select(this.db.raw("DATE_FORMAT(gtransfer_create_date, '%Y %b %d') as transfer_date"), 'group_name as transfer_to_name', 'gtransfer_to')
                .where('gtransfer_id', id)
                .leftJoin('trabill_group_transfer_tracking_numbers', {
                grouptr_gtransfer_id: 'gtransfer_id',
            })
                .leftJoin('trabill_haji_group', {
                group_id: 'gtransfer_to',
            });
            return data[0];
        });
    }
    deleteGroupTransaction(id, gtransfer_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_group_to_group_transfer')
                .update({ is_deleted: 1, gtransfer_deleted_by })
                .where('gtransfer_id', id);
            return data;
        });
    }
    getDetailsGroupTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_group_to_group_transfer')
                .select('gtransfer_from', 'gtransfer_to', 'gtransfer_note', 'gtransfer_job_name', 'grouptr_number', 'gtransfer_tracking_no')
                .where('gtransfer_id', id)
                .leftJoin('trabill_group_transfer_tracking_numbers', {
                grouptr_gtransfer_id: 'gtransfer_id',
            });
            const tracking_number = (yield this.query()
                .select('grouptr_number')
                .from('trabill_group_transfer_tracking_numbers')
                .whereNot('is_deleted', 1)
                .andWhere('grouptr_gtransfer_id', id));
            const ctrcknumber_number = tracking_number.map((item) => {
                return item.grouptr_number;
            });
            return Object.assign(Object.assign({}, data), { ctrcknumber_number });
        });
    }
    deleteGroupTransTracking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_group_transfer_tracking_numbers')
                .update({ is_deleted: 1 })
                .where('grouptr_gtransfer_id', id);
        });
    }
    insertGroupTransactionTrackingNo(insertedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_group_transfer_tracking_numbers')
                .insert(insertedData);
            return id[0];
        });
    }
    insertHajiTransfer(inserteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_haji_transfer')
                .insert(Object.assign(Object.assign({}, inserteData), { transfer_org_agency: this.org_agency }));
            return data[0];
        });
    }
    insertHajiTransferTrackingNo(inserteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_haji_transfer_tracking_no')
                .insert(inserteData);
            return data[0];
        });
    }
    deleteHajiTransferTrackingNo(id, transfertrack_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_haji_transfer_tracking_no')
                .update({ transfertrack_is_deleted: 1, transfertrack_deleted_by })
                .where('transfertrack_transfer_id', id);
            return data;
        });
    }
    getAllHajiTransfer(transaction_type, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_haji_transfer')
                .select('transfer_id', 'agency_name', 'transfer_charge', this.db.raw("DATE_FORMAT(transfer_create_date, ' %d %b %Y') as transfer_date"))
                .where('transfer_type', transaction_type)
                .andWhere('is_deleted', 0)
                .join('trabill_agency', { agency_id: 'transfer_agent_id' })
                .andWhere('transfer_org_agency', this.org_agency)
                .orderBy('transfer_id', 'desc')
                .limit(size)
                .offset(page_number);
            return data;
        });
    }
    countHajTransDataRow(transaction_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_haji_transfer')
                .where('transfer_type', transaction_type)
                .andWhere('is_deleted', 0)
                .join('trabill_agency', { agency_id: 'transfer_agent_id' })
                .where('transfer_org_agency', this.org_agency);
            return count;
        });
    }
    updateHajiTransfer(inserteData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_haji_transfer')
                .update(inserteData)
                .where('transfer_id', id);
            return data;
        });
    }
    updateDeleteHajiTransfer(id, transfer_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_haji_transfer')
                .update({ is_deleted: 1, transfer_deleted_by })
                .where('transfer_id', id);
            return data;
        });
    }
    deleteHajiPreRegInvoice(id, invoice_has_deleted_by, is_deleted) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = this.query()
                .into('trabill_invoices')
                .update({ invoice_is_deleted: is_deleted, invoice_has_deleted_by })
                .where('invoice_id', id);
            if (!deleted) {
                throw new customError_1.default('Please provide a valid Id to delete a Invoice', 400, 'Invalid Invoice Id');
            }
        });
    }
    getHajjiInfoByTrakingNo(traking_no) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('haji.hajiinfo_name', 'haji.hajiinfo_serial', 'haji.hajiinfo_tracking_number', 'haji.hajiinfo_nid', 'haji.hajiinfo_mobile', 'haji.hajiinfo_gender', 'haji_info.haji_info_vouchar_no', 'maharam_name')
                .from('trabill_haji_informations as haji')
                .leftJoin('trabill_invoice_hajj_pre_reg_haji_infos as haji_info', {
                haji_info_haji_id: 'haji.hajiinfo_id',
            })
                .leftJoin('trabill_maharams', { maharam_id: 'haji.hajiinfo_id' })
                .where('trabill_org_agency', this.org_agency)
                .havingIn('haji.hajiinfo_tracking_number', traking_no);
            return data;
        });
    }
    getCancleTrakingNoInfo(cancel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.query()
                .select('cancel_track_client_id as client_id', 'cancel_track_combine_id as combine_id', 'cancel_track_trxn_id as trxn_id', 'cancel_track_tracking_no as tracking_no', this.db.raw(`COALESCE(concat('client-', cancel_track_client_id), concat('combined-', cancel_track_combine_id)) as comb_client`), 'cancel_track_invoice_id as invoice_id')
                .from('trabill_prereg_cancel_tracking_no')
                .where('cancel_track_cancel_id', cancel_id));
        });
    }
    getHajjTrackingList(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('haji_info_id', 'haji_info_vouchar_no', 'hajiinfo_tracking_number', 'hajiinfo_serial', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_email', 'passport_nid_no', 'hajiinfo_gender', 'haji_info_passport_id AS transfertrack_passport_id')
                .from('trabill_invoice_hajj_haji_infos')
                .leftJoin('trabill_passport_details', {
                passport_id: 'haji_info_passport_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .whereNot('haji_info_is_deleted', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere((event) => {
                if (search) {
                    event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
                        search,
                    ]);
                }
            })
                .whereNotNull('haji_info_vouchar_no');
        });
    }
    createHajjRegCancel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_hajj_reg_cancel_list');
            return id;
        });
    }
    deleteHajjRegCancelListTrackingNo(cancel_id, deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ cl_is_deleted: 1, cl_deleted_by: deleted_by })
                .into('trabill_hajj_reg_cancel_list')
                .where('cl_id', cancel_id);
            return yield this.query()
                .update({ clt_is_deleted: 1, clt_deleted_by: deleted_by })
                .into('trabill_hajj_reg_cancel_tracking_no')
                .where('clt_cl_id', cancel_id);
        });
    }
    createHajjRegCancelTrackingNo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_hajj_reg_cancel_tracking_no');
            return id;
        });
    }
    updateHajjHajiInfoIsCancel(tracking_no, invoice_id, is_cancel = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ hajinfo_is_cancel: is_cancel })
                .into('trabill_invoice_hajj_haji_infos')
                .where('hajiinfo_tracking_number', tracking_no)
                .andWhere('haji_info_invoice_id', invoice_id);
        });
    }
    updateInvoiceIsCancel(invoice_id, is_cancel) {
        return __awaiter(this, void 0, void 0, function* () {
            const haji = yield this.query()
                .select('hajiinfo_tracking_number')
                .from('trabill_invoice_hajj_haji_infos')
                .where('haji_info_invoice_id', invoice_id)
                .andWhereNot('haji_info_is_deleted', 1)
                .andWhereNot('hajinfo_is_cancel', is_cancel);
            yield this.query()
                .update({ invoice_is_cancel: !haji.length && is_cancel === 1 ? 1 : 0 })
                .into('trabill_invoices')
                .where({ invoice_id });
        });
    }
    updateHajjPreRegTrackingNoIsCancel(tracking_no, invoice_id, is_cancel = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ haji_info_is_cancel: is_cancel })
                .into('trabill_invoice_hajj_pre_reg_haji_infos')
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .where('haji_info_invoice_id', invoice_id)
                .andWhere('hajiinfo_tracking_number', tracking_no);
        });
    }
    updateInvoiceHajjPreRegIsCancel(invoice_id, is_cancel) {
        return __awaiter(this, void 0, void 0, function* () {
            const haji = yield this.query()
                .select('hajiinfo_tracking_number')
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .where('haji_info_invoice_id', invoice_id)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .andWhereNot('haji_info_is_cancel', is_cancel);
            yield this.query()
                .update({ invoice_is_cancel: !haji.length && is_cancel === 1 ? 1 : 0 })
                .into('trabill_invoices')
                .where({ invoice_id });
        });
    }
    getCancelRegTrackingInfo(cancel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .select('clt_client_id', 'clt_combine_id', 'clt_trxn_id', 'clt_invoice_id', 'clt_tracking_no', this.db.raw(`COALESCE(concat('client-',clt_client_id),concat('combined-',clt_combine_id)) AS comb_client`))
                .from('trabill_hajj_reg_cancel_tracking_no')
                .where('clt_cl_id', cancel_id)
                .andWhereNot('clt_is_deleted', 1));
            return data;
        });
    }
    getCancelHajjRegList(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('cl_id', 'cl_office_charge', 'cl_govt_charge', 'cl_total_charge', 'cl_created_date', this.db.raw(`GROUP_CONCAT(clt_tracking_no SEPARATOR ', ') AS tracking_no`))
                .from('trabill_hajj_reg_cancel_list')
                .leftJoin('trabill_hajj_reg_cancel_tracking_no', (event) => {
                return event
                    .on('clt_cl_id', '=', 'cl_id')
                    .andOn(this.db.raw(`clt_is_deleted = 0`));
            })
                .whereNot('cl_is_deleted', 1)
                .andWhere('cl_org_agency', this.org_agency)
                .groupBy('cl_id', 'cl_office_charge', 'cl_govt_charge', 'cl_total_charge', 'cl_created_date')
                .limit(size)
                .offset(offset);
            const [{ count }] = (yield this.query()
                .count('* AS count')
                .from('trabill_hajj_reg_cancel_list')
                .whereNot('cl_is_deleted', 1)
                .andWhere('cl_org_agency', this.org_agency));
            return { count, data };
        });
    }
    getHajjHajiInfo(search) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            return yield this.query()
                .select('hajiinfo_tracking_number', 'invoice_id', 'invoice_no', 'haji_info_vouchar_no', 'hajiinfo_serial', 'hajiinfo_gender', 'passport_nid_no', this.db.raw(`COALESCE(client_name, combine_name) AS client_name`))
                .from('trabill_invoice_hajj_haji_infos')
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .leftJoin('trabill_passport_details', {
                passport_id: 'haji_info_passport_id',
            })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .whereNot('haji_info_is_deleted', 1)
                .andWhereNot('hajinfo_is_cancel', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere((event) => {
                if (search)
                    event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE ?`, [
                        `%${search}%`,
                    ]);
            });
        });
    }
}
exports.default = HajjiManagementModels;
//# sourceMappingURL=HajjiMangement.Models.js.map