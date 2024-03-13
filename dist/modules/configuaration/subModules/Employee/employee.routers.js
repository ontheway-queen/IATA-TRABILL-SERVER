"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const employee_controllers_1 = __importDefault(require("./employee.controllers"));
class RoutersEmployee extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersEmployee = new employee_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersEmployee.viewEmployees);
        this.routers.post('/create', this.controllersEmployee.createControllerEmployee);
        this.routers.get('/view-all', this.controllersEmployee.getAllEmployees);
        this.routers.patch('/update/:employee_id', this.controllersEmployee.updateControllerEmployee);
        this.routers.delete('/delete/:employee_id', this.controllersEmployee.deleteControllerEmployee);
        this.routers.get('/view-blood-group', this.controllersEmployee.readControllerBloodGroup);
        this.routers.get('/:id', this.controllersEmployee.getEmployeeById);
    }
}
exports.default = RoutersEmployee;
//# sourceMappingURL=employee.routers.js.map