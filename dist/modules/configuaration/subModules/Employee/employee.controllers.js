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
const employee_services_1 = __importDefault(require("./employee.services"));
const employee_validators_1 = __importDefault(require("./employee.validators"));
class ControllersEmployee extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesEmployee = new employee_services_1.default();
        this.validator = new employee_validators_1.default();
        this.createControllerEmployee = this.assyncWrapper.wrap(this.validator.createEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.CreateEmployee(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerEmployee = this.assyncWrapper.wrap(this.validator.eidtEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.UpdateEmployee(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewEmployees = this.assyncWrapper.wrap(this.validator.readEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.viewEmployees(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllEmployees = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.getAllEmployees(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getEmployeeById = this.assyncWrapper.wrap(this.validator.readEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.getEmployeeById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerEmployee = this.assyncWrapper.wrap(this.validator.deleteEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.DeleteEmployee(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.readControllerBloodGroup = this.assyncWrapper.wrap(this.validator.readEmployee, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesEmployee.readBloodGroup(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ControllersEmployee;
//# sourceMappingURL=employee.controllers.js.map