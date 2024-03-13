"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const roomTypes_controllers_1 = __importDefault(require("./roomTypes.controllers"));
class RoutersRoomTypes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersRoomTypes = new roomTypes_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersRoomTypes.viewRoomTypes);
        this.routers.post('/create', this.controllersRoomTypes.createRoomType);
        this.routers.get('/get-all', this.controllersRoomTypes.getAllRoomTypes);
        this.routers.delete('/delete/:id', this.controllersRoomTypes.deleteRoomType);
        this.routers.patch('/edit/:id', this.controllersRoomTypes.editRoomType);
    }
}
exports.default = RoutersRoomTypes;
//# sourceMappingURL=roomTypes.routers.js.map