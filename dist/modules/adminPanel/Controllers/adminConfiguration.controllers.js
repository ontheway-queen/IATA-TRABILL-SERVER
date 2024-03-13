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
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const adminPanel_services_1 = __importDefault(require("../Services/adminPanel.services"));
const adminPanel_validators_1 = __importDefault(require("../Validators/adminPanel.validators"));
class AdminConfigurationControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new adminPanel_services_1.default();
        this.validator = new adminPanel_validators_1.default();
        this.getAllClientCategory = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllClientCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getClientCategoryForSelect = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientCategoryForSelect(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.insertClientCategory = this.assyncWrapper.wrap(this.validator.createClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.insertClientCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteClientCate = this.assyncWrapper.wrap(this.validator.deleteClientCate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteClientCate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateClientCategory = this.assyncWrapper.wrap(this.validator.createClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateClientCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllAirports = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.insertAirports = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.deleteAirports = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.updateAirports = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getAllProducts = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getProductCategoryForSelect = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getProductCategoryForSelect(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.insetProducts = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.insetProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateProducts = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteProducts = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllVisaType = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserVisaType = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateVisaType = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteVisaType = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllDepartment = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserDepartment = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateDepartment = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteDepartment = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllRoomType = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserRoomType = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateRoomType = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteRoomType = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllTransportType = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserTransportType = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateTransportType = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateTransportTypeStatus = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTransportTypeStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteTransportType = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllDesignation = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserDesignation = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateDesignation = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteDesignation = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllPassportStatus = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllPassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserPassportStatus = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserPassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updatePassportStatus = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updatePassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deletePassportStatus = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deletePassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllAdminAgency = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAdminAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.inserAdminAgency = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.inserAdminAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateAdminAgency = this.assyncWrapper.wrap(this.validator.commonEdit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAdminAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteAdminAgency = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAdminAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getOfficeSalesman = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOfficeSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getTrabillEmployeeForSelect = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTrabillEmployeeForSelect(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.viewOfficeSalesman = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewOfficeSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteOfficeSalesman = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteOfficeSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.updateOfficeSalesman = this.assyncWrapper.wrap(this.validator.updateTrabillSalesman, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateOfficeSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.insertOfficeSalesman = this.assyncWrapper.wrap(this.validator.createTrabillSalesman, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.insertOfficeSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAgencySaleBy = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgencySaleBy(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getSalesmanSalesForChart = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSalesmanSalesForChart(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getTrabillSalesmanSales = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTrabillSalesmanSales(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllNotice = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllNotice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getActiveNotice = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getActiveNotice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addNotice = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addNotice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editNotice = this.assyncWrapper.wrap(this.validator.commonCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editNotice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.downloadDB = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.downloadDB(req, res);
        }));
    }
}
exports.default = AdminConfigurationControllers;
//# sourceMappingURL=adminConfiguration.controllers.js.map