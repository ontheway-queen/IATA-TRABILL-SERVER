"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const mahram_controllers_1 = __importDefault(require("./mahram.controllers"));
class RouterMahram extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersMahram = new mahram_controllers_1.default();
        this.callrouter();
    }
    callrouter() {
        this.routers.get('/', this.controllersMahram.viewMahrams);
        this.routers.post('/create', this.controllersMahram.createControllerMahram);
        this.routers.get('/view-all', this.controllersMahram.getAllMahrams);
        this.routers.patch('/update/:maharam_id', this.controllersMahram.updateControllerMahram);
        this.routers.delete('/delete/:maharam_id', this.controllersMahram.deleteControllerMahram);
    }
}
exports.default = RouterMahram;
//# sourceMappingURL=mahram.routers.js.map