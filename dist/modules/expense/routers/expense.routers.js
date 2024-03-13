"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const expense_controllers_1 = __importDefault(require("../controllers/expense.controllers"));
const ImageUploadToAzure_trabill_1 = require("../../../common/helpers/ImageUploadToAzure_trabill");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
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
            .post(upload.fields([
            { name: 'expense_voucher_url_1', maxCount: 1 },
            { name: 'expense_voucher_url_2', maxCount: 1 },
        ]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.createExpense)
            .get(this.controllers.allExpenses);
        this.routers
            .route('/:expense_id')
            .get(this.controllers.singleExpenses)
            .patch(upload.fields([
            { name: 'expense_voucher_url_1', maxCount: 1 },
            { name: 'expense_voucher_url_2', maxCount: 1 },
        ]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.editExpense)
            .delete(this.controllers.deleteExpense);
        this.routers.get('/expense-infos/:expense_id', this.controllers.expenseInfos);
    }
}
exports.default = ExpenseRouter;
//# sourceMappingURL=expense.routers.js.map