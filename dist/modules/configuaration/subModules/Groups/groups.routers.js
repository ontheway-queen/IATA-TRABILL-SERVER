"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const groups_controllers_1 = __importDefault(require("./groups.controllers"));
class RoutersGroup extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersGroup = new groups_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersGroup.viewGroups);
        this.routers.post('/create', this.controllersGroup.createControllerGroups);
        this.routers.get('/view-all', this.controllersGroup.getAllGroups);
        this.routers.patch('/update/:group_id', this.controllersGroup.updateControllerGroups);
        this.routers.delete('/delete/:group_id', this.controllersGroup.deleteControllerGroups);
    }
}
exports.default = RoutersGroup;
//# sourceMappingURL=groups.routers.js.map