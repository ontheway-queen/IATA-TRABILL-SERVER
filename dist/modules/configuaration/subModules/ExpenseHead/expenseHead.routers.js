"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const expenseHead_controllers_1 = __importDefault(require("./expenseHead.controllers"));
class RoutersExpenseHead extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersExpenseHead = new expenseHead_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersExpenseHead.viewExpenseHeads);
        this.routers.post('/create', this.controllersExpenseHead.createControllerExpenseHead);
        this.routers.get('/read', this.controllersExpenseHead.getAllExpenseHeads);
        this.routers.patch('/update/:head_id', this.controllersExpenseHead.updateControllerExpenseHead);
        this.routers.delete('/delete/:head_id', this.controllersExpenseHead.deleteControllerExpenseHead);
    }
}
exports.default = RoutersExpenseHead;
//# sourceMappingURL=expenseHead.routers.js.map