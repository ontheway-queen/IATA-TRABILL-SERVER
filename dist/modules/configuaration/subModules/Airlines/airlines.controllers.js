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
const airlines_services_1 = __importDefault(require("./airlines.services"));
const airlines_validators_1 = __importDefault(require("./airlines.validators"));
class ControllersAirlines extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesAirlines = new airlines_services_1.default();
        this.validator = new airlines_validators_1.default();
        this.createControllerAirlines = this.assyncWrapper.wrap(this.validator.validatorAirlineCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirlines.createAirlines(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerAirline = this.assyncWrapper.wrap(this.validator.validatorAirlineUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirlines.updateAirline(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewAirlines = this.assyncWrapper.wrap(this.validator.readAirline, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirlines.viewAirlines(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.readControllerAirline = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirlines.getAirlines(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerAirLines = this.assyncWrapper.wrap(this.validator.deleteAirline, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirlines.deleteAirLines(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersAirlines;
//# sourceMappingURL=airlines.controllers.js.map