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
const airports_services_1 = __importDefault(require("./airports.services"));
const airports_validators_1 = __importDefault(require("./airports.validators"));
class ControllersAirports extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesAirports = new airports_services_1.default();
        this.validator = new airports_validators_1.default();
        this.createAirports = this.assyncWrapper.wrap(this.validator.createAirports, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.createAirports(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create airports controller');
            }
        }));
        this.viewAirports = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.viewAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.viewAllAirports = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.getAllAirports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.viewAirportsById = this.assyncWrapper.wrap(this.validator.readAirports, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.getAirportById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteAirportsById = this.assyncWrapper.wrap(this.validator.deleteAirports, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.deleteAirportsById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editAirportsById = this.assyncWrapper.wrap(this.validator.editAirports, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.editAirportsById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.viewAllCountries = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesAirports.viewAllCountries(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersAirports;
//# sourceMappingURL=airports.controllers.js.map