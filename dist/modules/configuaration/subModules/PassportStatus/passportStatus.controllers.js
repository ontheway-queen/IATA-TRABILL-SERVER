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
const passportStatus_services_1 = __importDefault(require("./passportStatus.services"));
const passportStatus_validators_1 = __importDefault(require("./passportStatus.validators"));
class ControllerPassportStatus extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesPassportStatus = new passportStatus_services_1.default();
        this.validator = new passportStatus_validators_1.default();
        this.createControllerPassportStatus = this.assyncWrapper.wrap(this.validator.createPassportStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.T_createPassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewPassports = this.assyncWrapper.wrap(this.validator.readPassportStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.viewPassports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllPassports = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.getAllPassports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerPassportStatus = this.assyncWrapper.wrap(this.validator.editPassportStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.T_updatePassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.readControllerPassportStatus = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.T_readPassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerPassportStatus = this.assyncWrapper.wrap(this.validator.deletePassportStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesPassportStatus.T_deletePassportStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ControllerPassportStatus;
//# sourceMappingURL=passportStatus.controllers.js.map