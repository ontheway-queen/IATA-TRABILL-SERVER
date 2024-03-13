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
const designations_services_1 = __importDefault(require("./designations.services"));
const designations_validators_1 = __importDefault(require("./designations.validators"));
class ControllersDesignations extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesDesignations = new designations_services_1.default();
        this.validator = new designations_validators_1.default();
        this.createDesignation = this.assyncWrapper.wrap(this.validator.createDesignation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDesignations.createDesignation(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create designation controller');
            }
        }));
        this.viewDesignations = this.assyncWrapper.wrap(this.validator.readDesignation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDesignations.viewDesignations(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllDesignations = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDesignations.getAllDesignations(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteDesignation = this.assyncWrapper.wrap(this.validator.deleteDesignation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDesignations.deleteDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editDesignation = this.assyncWrapper.wrap(this.validator.editDesignation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDesignations.editDesignation(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = ControllersDesignations;
//# sourceMappingURL=designations.controllers.js.map