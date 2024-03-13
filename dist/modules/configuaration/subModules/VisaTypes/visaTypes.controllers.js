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
const visaTypes_services_1 = __importDefault(require("./visaTypes.services"));
const visaTypes_validators_1 = __importDefault(require("./visaTypes.validators"));
class ControllersVisaTypes extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesVisaTypes = new visaTypes_services_1.default();
        this.validator = new visaTypes_validators_1.default();
        this.createVisaType = this.assyncWrapper.wrap(this.validator.createVisaTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesVisaTypes.createVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create visa type controller');
            }
        }));
        this.viewVisaType = this.assyncWrapper.wrap(this.validator.readVisaTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesVisaTypes.viewVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.getAllVisaType = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesVisaTypes.getAllVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editVisaType = this.assyncWrapper.wrap(this.validator.editVisaTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesVisaTypes.editVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteVisaType = this.assyncWrapper.wrap(this.validator.deleteVisaTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesVisaTypes.deleteVisaType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersVisaTypes;
//# sourceMappingURL=visaTypes.controllers.js.map