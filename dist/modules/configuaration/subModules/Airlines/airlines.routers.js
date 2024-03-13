"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const airlines_controllers_1 = __importDefault(require("./airlines.controllers"));
class RoutersAirlines extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersAirlines = new airlines_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersAirlines.viewAirlines);
        this.routers.post('/create', this.controllersAirlines.createControllerAirlines);
        this.routers.get('/read', this.controllersAirlines.readControllerAirline);
        this.routers.patch('/update/:airline_id', this.controllersAirlines.updateControllerAirline);
        this.routers.delete('/delete/:airline_id', this.controllersAirlines.deleteControllerAirLines);
    }
}
exports.default = RoutersAirlines;
//# sourceMappingURL=airlines.routers.js.map