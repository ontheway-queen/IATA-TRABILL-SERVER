"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../abstracts/abstract.routers"));
const common_controllers_1 = __importDefault(require("./common.controllers"));
class CommonRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.conroller = new common_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/voucher/:type', this.conroller.generateVoucher);
    }
}
exports.default = CommonRouters;
//# sourceMappingURL=common.routers.js.map