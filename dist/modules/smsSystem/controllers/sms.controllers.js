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
const sms_services_1 = __importDefault(require("../services/sms.services"));
const sms_validator_1 = __importDefault(require("../validators/sms.validator"));
class SmsControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new sms_services_1.default();
        this.validator = new sms_validator_1.default();
        this.createSms = this.assyncWrapper.wrap(this.validator.createSms, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createSms(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('SMS ...');
            }
        }));
        this.getSms = this.assyncWrapper.wrap(this.validator.readSms, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSms(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('get SMS ...');
            }
        }));
        this.getSmsBalance = this.assyncWrapper.wrap(this.validator.readSms, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.services.getSmsBalance(req);
            if (data.success) {
                res.status(201).json((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.data);
            }
            else {
                this.error('get SMS Balance');
            }
        }));
    }
}
exports.default = SmsControllers;
//# sourceMappingURL=sms.controllers.js.map