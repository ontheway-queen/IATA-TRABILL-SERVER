"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../abstracts/abstract.routers"));
const databaseReset_controllers_1 = __importDefault(require("./databaseReset.controllers"));
class DatabaseResetRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new databaseReset_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.patch('/reset/:agency_id', this.controllers.databaseReset);
    }
}
exports.default = DatabaseResetRouters;
//# sourceMappingURL=databaseReset.routers.js.map