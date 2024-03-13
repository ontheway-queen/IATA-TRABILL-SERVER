"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const departments_controllers_1 = __importDefault(require("./departments.controllers"));
class RoutersDepartments extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersDepartments = new departments_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersDepartments.viewDepartment);
        this.routers.post('/create', this.controllersDepartments.createDepartment);
        this.routers.get('/get-all', this.controllersDepartments.getAllDepartments);
        this.routers.patch('/edit/:id', this.controllersDepartments.editDepartment);
        this.routers.delete('/delete/:id', this.controllersDepartments.deleteDepartment);
    }
}
exports.default = RoutersDepartments;
//# sourceMappingURL=departments.routers.js.map