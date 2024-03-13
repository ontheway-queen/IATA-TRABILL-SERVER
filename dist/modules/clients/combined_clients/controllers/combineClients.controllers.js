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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const combineClients_services_1 = __importDefault(require("../services/combineClients.services"));
const combineClients_validators_1 = __importDefault(require("../validators/combineClients.validators"));
class CombineClientsControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new combineClients_services_1.default();
        this.validator = new combineClients_validators_1.default();
        this.createCombineClients = this.assyncWrapper.wrap(this.validator.createCombineClients, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createCombineClients(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Combine Client Created...');
            }
        }));
        this.getAllCombines = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCombines(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all combine clients...');
            }
        }));
        this.viewAllCombine = this.assyncWrapper.wrap(this.validator.readAllCombines, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAllCombine(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        /**
         * get all combine
         */
        this.getCombineClientExcelReport = this.assyncWrapper.wrap(this.validator.readAllCombines, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCombineClientExcelReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get combine clients excel report...');
            }
        }));
        this.getCombinesForEdit = this.assyncWrapper.wrap(this.validator.readAllCombines, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCombineForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all combine clients...');
            }
        }));
        this.updateClientStatus = this.assyncWrapper.wrap(this.validator.updateClientStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateClientStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Update client status...');
            }
        }));
        this.editCombineClients = this.assyncWrapper.wrap(this.validator.updateCombineClients, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editCombineClients(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit combine client...');
            }
        }));
        this.deleteCombineClients = this.assyncWrapper.wrap(this.validator.deleteCombineClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteCombineClients(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete combine client...');
            }
        }));
    }
}
exports.default = CombineClientsControllers;
//# sourceMappingURL=combineClients.controllers.js.map