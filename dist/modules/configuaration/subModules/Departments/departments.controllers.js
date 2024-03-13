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
const departments_services_1 = __importDefault(require("./departments.services"));
const departments_validators_1 = __importDefault(require("./departments.validators"));
class ControllersDepartments extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesDepartments = new departments_services_1.default();
        this.validator = new departments_validators_1.default();
        this.createDepartment = this.assyncWrapper.wrap(this.validator.createDepartment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDepartments.createDepartment(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewDepartment = this.assyncWrapper.wrap(this.validator.readDepartment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDepartments.viewDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllDepartments = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDepartments.getAllDepartments(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.editDepartment = this.assyncWrapper.wrap(this.validator.updateDepartment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDepartments.editDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteDepartment = this.assyncWrapper.wrap(this.validator.deleteDepartment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesDepartments.deleteDepartment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersDepartments;
//# sourceMappingURL=departments.controllers.js.map