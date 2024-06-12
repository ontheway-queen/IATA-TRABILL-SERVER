"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class DashboardValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.dashboardValidator = [
            this.permissions.check(this.resources.products, 'read'),
            (0, express_validator_1.check)('type')
                .optional()
                .isIn(['PNR', 'PASSPORT'])
                .withMessage('Please provide valid data'),
        ];
        this.readAllProducts = [this.permissions.check(this.resources.products, 'read')];
        this.readTotalSales = [
            this.permissions.check(this.resources.sales_report, 'read'),
        ];
        this.uploadBSP = [(0, express_validator_1.check)('tbd_date').notEmpty().toDate()];
    }
}
exports.default = DashboardValidators;
//# sourceMappingURL=dashboard.validators.js.map