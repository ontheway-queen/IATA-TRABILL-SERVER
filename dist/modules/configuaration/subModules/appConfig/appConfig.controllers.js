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
const appConfig_services_1 = __importDefault(require("./appConfig.services"));
const appConfig_validators_1 = __importDefault(require("./appConfig.validators"));
class AppConfigControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new appConfig_services_1.default();
        this.validator = new appConfig_validators_1.default();
        this.getAppConfig = this.assyncWrapper.wrap(this.validator.readAppConfig, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAppConfig(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.updateAppConfig = this.assyncWrapper.wrap(this.validator.readAppConfig, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAppConfig(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.updateAppConfigSignature = this.assyncWrapper.wrap(this.validator.readAppConfig, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAppConfigSignature(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.addSignature = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addSignature(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.updateSignature = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateSignature(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.updateSignatureStatus = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateSignatureStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getSignatures = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSignatures(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
    }
}
exports.default = AppConfigControllers;
//# sourceMappingURL=appConfig.controllers.js.map