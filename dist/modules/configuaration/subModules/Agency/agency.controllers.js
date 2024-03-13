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
const agency_services_1 = __importDefault(require("./agency.services"));
const agency_validator_1 = __importDefault(require("./agency.validator"));
class ControllersAgency extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesAgency = new agency_services_1.default();
        this.validator = new agency_validator_1.default();
        this.createControllerAgency = this.assyncWrapper.wrap(this.validator.createAgency, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAgency.createAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerAgency = this.assyncWrapper.wrap(this.validator.updateAgency, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAgency.updateAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewAgencies = this.assyncWrapper.wrap(this.validator.getAllAgencies, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAgency.viewAgencies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAgencies = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAgency.getAgencies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerAgency = this.assyncWrapper.wrap(this.validator.deleteAgency, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAgency.deleteAgency(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersAgency;
//# sourceMappingURL=agency.controllers.js.map