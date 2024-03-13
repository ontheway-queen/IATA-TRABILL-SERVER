"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const airports_controllers_1 = __importDefault(require("./airports.controllers"));
class RoutersAirports extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersAirports = new airports_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersAirports.viewAirports);
        this.routers.post('/create', this.controllersAirports.createAirports);
        this.routers.get('/view-one/:id', this.controllersAirports.viewAirportsById);
        this.routers.get('/view-all', this.controllersAirports.viewAllAirports);
        this.routers.delete('/delete/:airline_id', this.controllersAirports.deleteAirportsById);
        this.routers.get('/view-all-countries', this.controllersAirports.viewAllCountries);
        this.routers.patch('/:id', this.controllersAirports.editAirportsById);
    }
}
exports.default = RoutersAirports;
//# sourceMappingURL=airports.routers.js.map