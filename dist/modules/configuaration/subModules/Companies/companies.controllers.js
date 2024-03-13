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
const companies_services_1 = __importDefault(require("./companies.services"));
const companies_validators_1 = __importDefault(require("./companies.validators"));
class ControllersCompanies extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesCompanies = new companies_services_1.default();
        this.validator = new companies_validators_1.default();
        this.createControllerCompanies = this.assyncWrapper.wrap(this.validator.createCompanies, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesCompanies.CreateCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerCompanies = this.assyncWrapper.wrap(this.validator.editCompanies, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesCompanies.UpdateCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerCompanies = this.assyncWrapper.wrap(this.validator.deleleCompanies, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesCompanies.DeleteCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.viewCompanies = this.assyncWrapper.wrap(this.validator.readCompanies, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesCompanies.viewCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllCompanies = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesCompanies.getAllCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ControllersCompanies;
//# sourceMappingURL=companies.controllers.js.map