"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const loan_controllers_1 = __importDefault(require("../controllers/loan.controllers"));
class LoanRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new loan_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        // Authority
        this.routers
            .route('/authority')
            .post(this.controllers.addLoanAuthority)
            .get(this.controllers.getLoanAuthorities);
        this.routers.get('/authority/all', this.controllers.getALLLoanAuthority);
        this.routers
            .route('/authority/:authority_id')
            .patch(this.controllers.editLoanAuhtority)
            .delete(this.controllers.deleteLoanAuthority);
        // Loan
        this.routers
            .route('/loan')
            .post(this.controllers.addLoan)
            .get(this.controllers.getLoans);
        this.routers
            .route('/loan/:loan_id')
            .get(this.controllers.getLoan)
            .patch(this.controllers.editLoan)
            .delete(this.controllers.deleteLoan);
        // Payment
        this.routers.get('/payment/loans/:authority_id', this.controllers.loansForPayment);
        this.routers
            .route('/payment')
            .post(this.controllers.addPayment)
            .get(this.controllers.allPayments);
        this.routers
            .route('/payment/:payment_id')
            .get(this.controllers.singlePayment)
            .patch(this.controllers.editPayment)
            .delete(this.controllers.deletePayment);
        // Receive
        this.routers.get('/received/loans/:authority_id', this.controllers.loansForReceive);
        this.routers
            .route('/received')
            .post(this.controllers.addReceived)
            .get(this.controllers.allReceived);
        this.routers
            .route('/received/:received_id')
            .get(this.controllers.singleReceived)
            .patch(this.controllers.editReceived)
            .delete(this.controllers.deleteReceived);
    }
}
exports.default = LoanRouter;
//# sourceMappingURL=loan.routers.js.map