"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const cheques_controllers_1 = __importDefault(require("../controllers/cheques.controllers"));
class chequesRoutes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new cheques_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers
            .route('/')
            .get(this.controllers.getAllCheques)
            .patch(this.controllers.updateChequeStatus);
    }
}
exports.default = chequesRoutes;
//# sourceMappingURL=cheques.routes.js.map