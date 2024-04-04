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
const multer = require('multer');
// Create a Multer instance with the desired configuration
const upload = multer({ dest: 'uploads/' });
class AdminPanelControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new adminPanel_services_1.default();
        this.validator = new adminPanel_validators_1.default();
        // @MODULES
        this.createModules = this.assyncWrapper.wrap(this.validator.createModules, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createModules(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updatesSalesInfo = this.assyncWrapper.wrap(this.validator.updateSalesInfo, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updatesSalesInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateModules = this.assyncWrapper.wrap(this.validator.createModules, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateModules(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteModules = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteModules(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllModules = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllModules(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @MODULES
        this.createAgency = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateAgency = this.assyncWrapper.wrap(this.validator.updateAgency, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllAgency = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.resentAgency = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.resentAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteOrgAgency = this.assyncWrapper.wrap(this.validator.deleteOrgAgency, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteOrgAgency(req, res);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.agencyExcelReport = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.services.agencyExcelReport(req, res);
        }));
        this.getForEdit = this.assyncWrapper.wrap(this.validator.readAll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.checkUsername = this.assyncWrapper.wrap(this.validator.checkIsUnique, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.checkUsername(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        this.updateAgencyAcitiveStatus = this.assyncWrapper.wrap(this.validator.updateActivity, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAgencyActiveStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        this.agencyDatabaseReset = this.assyncWrapper.wrap(this.validator.updateActivity, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.agencyDatabaseReset(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        this.resetAgencyPassword = this.assyncWrapper.wrap(this.validator.resetAgencyPassword, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.resetAgencyPassword(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        this.updateAgencyLogo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAgencyLogo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        this.agencyActivity = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.agencyActivity(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error occurred while checking uniqueness');
            }
        }));
        // @REPORT
        this.agencyActivityReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgencyActivityReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('An error is occurred');
            }
        }));
        this.getAgencyProfile = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgencyProfile(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.updateAgencyProfile = this.assyncWrapper.wrap(this.validator.updateAgencyProfile, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAgencyProfile(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = AdminPanelControllers;
//# sourceMappingURL=adminPanel.controllers.js.map