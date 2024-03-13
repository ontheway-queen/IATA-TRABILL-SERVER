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
const transportType_services_1 = __importDefault(require("./transportType.services"));
const transportType_validators_1 = __importDefault(require("./transportType.validators"));
class TransportTypeControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new transportType_services_1.default();
        this.validator = new transportType_validators_1.default();
        this.createTransportType = this.assyncWrapper.wrap(this.validator.createTransportType, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createTransportType(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create room type controller');
            }
        }));
        this.viewTransportTypes = this.assyncWrapper.wrap(this.validator.readTransportType, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewTransportTypes(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllTransportTypes = this.assyncWrapper.wrap(this.validator.readTransportType, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTransportTypes(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteTransportType = this.assyncWrapper.wrap(this.validator.deleteTransportType, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.updateTransportType = this.assyncWrapper.wrap(this.validator.editTransportType, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = TransportTypeControllers;
//# sourceMappingURL=transportType.controllers.js.map