"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const expense_controllers_1 = __importDefault(require("../controllers/expense.controllers"));
class ExpenseRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new expense_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.route('/cheque').get(this.controllers.expenseCheques);
        this.routers
            .route('/')
            .post(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.createExpense)
            .get(this.controllers.allExpenses);
        this.routers
            .route('/:expense_id')
            .get(this.controllers.singleExpenses)
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.editExpense)
            .delete(this.controllers.deleteExpense);
        this.routers.get('/expense-infos/:expense_id', this.controllers.expenseInfos);
    }
}
exports.default = ExpenseRouter;
//# sourceMappingURL=expense.routers.js.map