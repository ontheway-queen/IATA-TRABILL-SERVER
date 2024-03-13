"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const designations_controllers_1 = __importDefault(require("./designations.controllers"));
class RoutersDesignations extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersDesignations = new designations_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersDesignations.viewDesignations);
        this.routers.post('/create', this.controllersDesignations.createDesignation);
        this.routers.get('/get-all', this.controllersDesignations.getAllDesignations);
        this.routers.delete('/delete/:id', this.controllersDesignations.deleteDesignation);
        this.routers.patch('/edit/:id', this.controllersDesignations.editDesignation);
    }
}
exports.default = RoutersDesignations;
//# sourceMappingURL=designations.routers.js.map