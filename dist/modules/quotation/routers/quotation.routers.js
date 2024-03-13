"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const quotation_controllers_1 = __importDefault(require("../controllers/quotation.controllers"));
class QuotationRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new quotation_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.route('/products').get(this.controllers.products);
        this.routers
            .route('/')
            .post(this.controllers.createQuotation)
            .get(this.controllers.allQuotations);
        this.routers
            .route('/:quotation_id')
            .post(this.controllers.postQuotationOnConfirm)
            .get(this.controllers.singleQuotation)
            .patch(this.controllers.editQuotation)
            .delete(this.controllers.deleteQuotation);
        this.routers.get('/bill-infos/:quotation_id', this.controllers.billInfos);
    }
}
exports.default = QuotationRouter;
//# sourceMappingURL=quotation.routers.js.map