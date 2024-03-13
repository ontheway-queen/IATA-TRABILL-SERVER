"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const sms_controllers_1 = __importDefault(require("../controllers/sms.controllers"));
const upload = (0, multer_1.default)({});
class SmsRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new sms_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        // create sms
        this.routers.route('/').post(this.controllers.createSms);
        this.routers.get('/all', this.controllers.getSms);
        this.routers.get('/balance', this.controllers.getSmsBalance);
    }
}
exports.default = SmsRouter;
//# sourceMappingURL=sms.routers.js.map