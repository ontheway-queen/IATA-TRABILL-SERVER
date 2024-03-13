"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpenseHelper {
    /**
     * accpets array of expense details object from the request body
     * @returns parsed array of object ready to insert into database
     *
     * @param export_details IExpenseDetails[]
     *
     */
    static parseExpenseDetails(expense_details, expense_id) {
        const expenseDetailsInfo = [];
        for (let i = 0; i < expense_details.length; i++) {
            const element = expense_details[i];
            const toPush = {
                expdetails_expense_id: expense_id,
                expdetails_head_id: element.expdetails_head_id,
                expdetails_amount: element.expdetails_amount,
            };
            expenseDetailsInfo.push(toPush);
        }
        return expenseDetailsInfo;
    }
}
exports.default = ExpenseHelper;
//# sourceMappingURL=expenseHelper.js.map