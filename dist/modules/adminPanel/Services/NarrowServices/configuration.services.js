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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const archiver_1 = __importDefault(require("archiver"));
const dbBackup_1 = require("../../../../common/utils/dbBackup/dbBackup");
// import * as archiver from 'archiver';
class AdminConfiguration extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllClientCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const { page, size } = req.query;
            const data = yield conn.getAllClientCategory(page, size);
            return {
                success: true,
                message: 'All client category',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.getClientCategoryForSelect = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getClientCategoryForSelect(search);
            return {
                success: true,
                message: 'All client category',
                data,
            };
        });
        this.insertClientCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const body = req.body;
            const data = yield conn.insertClientCategory(body);
            return { success: true, message: 'Create client category', data };
        });
        this.updateClientCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const body = req.body;
            const { category_id } = req.params;
            const data = yield conn.updateClientCategory(body, category_id);
            return { success: true, message: 'Updated client category', data };
        });
        this.deleteClientCate = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const { category_id } = req.params;
            yield conn.deleteClientCate(category_id);
            return { success: true, message: 'Delete client permanently' };
        });
        this.getAllAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const { page, size } = req.query;
            const data = yield conn.getAllAirports(page, size);
            return {
                success: true,
                message: 'All Airports',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.deleteAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteAirports(id, deleted_by);
            return { success: true, message: 'Delete Airport Successfuly', data };
        });
        this.updateAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateAirports(body, id);
            return { success: true, message: 'Update Airport Successfuly', data };
        });
        this.getAllProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllProducts(page, size);
            return {
                success: true,
                message: 'All Products',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.getProductCategoryForSelect = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getProductCategoryForSelect(search);
            return {
                success: true,
                message: 'All Products Category',
                data,
            };
        });
        this.insetProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.insetProducts(body);
            return {
                success: true,
                message: 'Create Product Successfuly',
                data,
            };
        });
        this.updateProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { product_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateProducts(body, product_id);
            return {
                success: true,
                message: 'Update Product Successfuly',
                data,
            };
        });
        this.deleteProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { product_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteProducts(product_id, deleted_by);
            return {
                success: true,
                message: 'Delete Product Successfuly',
                data,
            };
        });
        this.getAllVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllVisaType(page, size);
            return {
                success: true,
                message: 'All Visa Type',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertVisaType(body);
            return {
                success: true,
                message: 'Create Visa Type Successfuly',
                data,
            };
        });
        this.updateVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { visa_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateVisaType(body, visa_id);
            return {
                success: true,
                message: 'Update Visa Type Successfuly',
                data,
            };
        });
        this.deleteVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { visa_id } = req.params;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteVisaType(visa_id);
            return {
                success: true,
                message: 'Delete Visa Type Successfuly',
                data,
            };
        });
        this.getAllDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllDepartment(page, size);
            return {
                success: true,
                message: 'All Department',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertDepartment(body);
            return {
                success: true,
                message: 'Create Department Successfuly',
                data,
            };
        });
        this.updateDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { department_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateDepartment(body, department_id);
            return {
                success: true,
                message: 'Update Department Successfuly',
                data,
            };
        });
        this.deleteDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { department_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteDepartment(department_id, deleted_by);
            return {
                success: true,
                message: 'Delete Department Successfuly',
                data,
            };
        });
        this.getAllRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllRoomType(page, size);
            return {
                success: true,
                message: 'All Room Type',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertRoomType(body);
            return {
                success: true,
                message: 'Create Room Type Successfuly',
                data,
            };
        });
        this.updateRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateRoomType(body, type_id);
            return {
                success: true,
                message: 'Update Room Type Successfuly',
                data,
            };
        });
        this.deleteRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteRoomType(type_id, deleted_by);
            return {
                success: true,
                message: 'Delete Room Type Successfuly',
                data,
            };
        });
        this.getAllTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllTransportType(page, size);
            return {
                success: true,
                message: 'All Transport Type',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertTransportType(body);
            return {
                success: true,
                message: 'Create Transport Type Successfuly',
                data,
            };
        });
        this.updateTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateTransportType(body, type_id);
            return {
                success: true,
                message: 'Update Transport Type Successfuly',
                data,
            };
        });
        this.updateTransportTypeStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body.ttype_status;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateTransportTypeStatus(body, type_id);
            return {
                success: true,
                message: 'Update Transport Type Status Successfuly',
                data,
            };
        });
        this.deleteTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteTransportType(type_id, deleted_by);
            return {
                success: true,
                message: 'Delete Transport Type Successfuly',
                data,
            };
        });
        this.getAllDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllDesignation(page, size);
            return {
                success: true,
                message: 'All Designation Type',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertDesignation(body);
            return {
                success: true,
                message: 'Create Designation Successfuly',
                data,
            };
        });
        this.updateDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateDesignation(body, type_id);
            return {
                success: true,
                message: 'Update Designation Successfuly',
                data,
            };
        });
        this.deleteDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteDesignation(type_id, deleted_by);
            return {
                success: true,
                message: 'Delete Designation Successfuly',
                data,
            };
        });
        this.getAllPassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllPassportStatus(page, size);
            return {
                success: true,
                message: 'All Passport Status',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserPassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertPassportStatus(body);
            return {
                success: true,
                message: 'Create Passport Status Successfuly',
                data,
            };
        });
        this.updatePassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updatePassportStatus(body, type_id);
            return {
                success: true,
                message: 'Update Passport Status Successfuly',
                data,
            };
        });
        this.deletePassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deletePassportStatus(type_id, deleted_by);
            return {
                success: true,
                message: 'Delete Passport Status Successfuly',
                data,
            };
        });
        this.getAllAdminAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllAdminAgency(page, size);
            return {
                success: true,
                message: 'All Passport Status',
                count: data.totalCount,
                data: data.data,
            };
        });
        this.inserAdminAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const [data] = yield conn.insertAdminAgency(body);
            return {
                success: true,
                message: 'Create Passport Status Successfuly',
                data,
            };
        });
        this.updateAdminAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.updateAdminAgency(body, type_id);
            return {
                success: true,
                message: 'Update Passport Status Successfuly',
                data,
            };
        });
        this.deleteAdminAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteAdminAgency(type_id, deleted_by);
            return {
                success: true,
                message: 'Delete Passport Status Successfuly',
                data,
            };
        });
        this.getAllNotice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAllNotice(Number(page) || 1, Number(size) || 20);
            return {
                success: true,
                message: 'All Notice',
                count: data.count,
                data: data.data,
            };
        });
        this.getActiveNotice = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const data = yield conn.getActiveNotice();
            return {
                success: true,
                message: 'Active Notice',
                data,
            };
        });
        this.addNotice = (req) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const files = req.files;
            const [data] = yield conn.addNotice(Object.assign(Object.assign({}, body), { ntc_bg_img: (_a = files[0]) === null || _a === void 0 ? void 0 : _a.filename }));
            return {
                success: true,
                message: 'Notice Created Successfuly Done',
                data,
            };
        });
        this.editNotice = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.adminPanel(req);
            const files = req.files;
            if (files[0].filename) {
                const PREV_IMG_URL = yield conn.getNoticeImageURL(body.ntc_id);
                yield this.manageFile.deleteFromCloud([PREV_IMG_URL === null || PREV_IMG_URL === void 0 ? void 0 : PREV_IMG_URL.ntc_bg_img]);
            }
            const data = yield conn.editNotice(Object.assign(Object.assign({}, body), { ntc_bg_img: files[0].filename }), body.ntc_id);
            return {
                success: true,
                message: 'Notice Created Successfuly Done',
                data,
            };
        });
        this.downloadDB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            try {
                const accountList = yield conn.bk_account();
                const clientList = yield conn.bk_client();
                const clientTrnxList = yield conn.bk_client_trnx();
                const comClientList = yield conn.bk_com_client();
                const comClientTrnxList = yield conn.bk_com_client_trnx();
                const vendorList = yield conn.bk_vendor();
                const vendorTrnxList = yield conn.bk_vendor_trnx();
                const zipFileName = 'data_archive.zip';
                const zipStream = (0, archiver_1.default)('zip');
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
                zipStream.pipe(res);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'accountList.csv', accountList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'clientList.csv', clientList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'clientTrnxList.csv', clientTrnxList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'comClientList.csv', comClientList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'comClientTrnxList.csv', comClientTrnxList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'vendorList.csv', vendorList);
                yield (0, dbBackup_1.addCSVFileToZip)(zipStream, 'vendorTrnxList.csv', vendorTrnxList);
                zipStream.finalize();
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'Error during backup',
                });
            }
        });
    }
    insertAirports(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const body = req.body;
            const data = yield conn.insertAirports(body);
            return { success: true, message: 'Create Airports Successfully!', data };
        });
    }
}
exports.default = AdminConfiguration;
//# sourceMappingURL=configuration.services.js.map