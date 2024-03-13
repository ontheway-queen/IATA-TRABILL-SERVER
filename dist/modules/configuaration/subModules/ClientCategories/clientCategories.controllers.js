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
const clientCategories_services_1 = __importDefault(require("./clientCategories.services"));
const clientCategories_validators_1 = __importDefault(require("./clientCategories.validators"));
class ControllersClientCategories extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesClientCategories = new clientCategories_services_1.default();
        this.validator = new clientCategories_validators_1.default();
        /**
         * create client categories
         */
        this.createClientCategory = this.assyncWrapper.wrap(this.validator.createClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesClientCategories.createClientCategory(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create client categories controller');
            }
        }));
        this.getAllClientCategories = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesClientCategories.getAllClientCategories(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.getClientCategories = this.assyncWrapper.wrap(this.validator.readClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesClientCategories.getClientCategories(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteClientCategoryById = this.assyncWrapper.wrap(this.validator.deleteClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesClientCategories.deleteClientCategoryById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editClientCategoryById = this.assyncWrapper.wrap(this.validator.editClientCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesClientCategories.editClientCategoryById(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = ControllersClientCategories;
//# sourceMappingURL=clientCategories.controllers.js.map