"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const transportType_controllers_1 = __importDefault(require("./transportType.controllers"));
class TransportTypeRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controller = new transportType_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controller.viewTransportTypes);
        this.routers.post('/create', this.controller.createTransportType);
        this.routers.get('/all', this.controller.getAllTransportTypes);
        this.routers.delete('/delete/:id', this.controller.deleteTransportType);
        this.routers.patch('/update/:id', this.controller.updateTransportType);
    }
}
exports.default = TransportTypeRouter;
//# sourceMappingURL=transportType.Routers.js.map