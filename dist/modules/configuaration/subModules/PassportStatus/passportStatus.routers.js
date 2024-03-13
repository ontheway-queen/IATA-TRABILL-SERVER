"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const passportStatus_controllers_1 = __importDefault(require("./passportStatus.controllers"));
class RoutersPassportStatus extends abstract_routers_1.default {
    constructor() {
        super();
        this.ControllerPassportStatus = new passportStatus_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.post('/create', this.ControllerPassportStatus.createControllerPassportStatus);
        this.routers.get('/passport', this.ControllerPassportStatus.viewPassports);
        this.routers.get('/passport/all', this.ControllerPassportStatus.getAllPassports);
        this.routers.get('/view-all', this.ControllerPassportStatus.readControllerPassportStatus);
        this.routers.patch('/update/:status_id', this.ControllerPassportStatus.updateControllerPassportStatus);
        this.routers.delete('/delete/:status_id', this.ControllerPassportStatus.deleteControllerPassportStatus);
    }
}
exports.default = RoutersPassportStatus;
//# sourceMappingURL=passportStatus.routers.js.map