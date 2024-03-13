"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const combineClients_controllers_1 = __importDefault(require("../controllers/combineClients.controllers"));
class CombineClientsRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new combineClients_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.post('/create', this.controllers.createCombineClients);
        this.routers.get('/combines', this.controllers.getAllCombines);
        this.routers.get('/view-combine', this.controllers.viewAllCombine);
        this.routers.get('/excel/report', this.controllers.getCombineClientExcelReport);
        this.routers
            .route('/combines/:id')
            .patch(this.controllers.updateClientStatus)
            .delete(this.controllers.deleteCombineClients);
        this.routers.get('/combine_for_edit/:combine_id', this.controllers.getCombinesForEdit);
        this.routers.patch('/update-client/:id', this.controllers.editCombineClients);
    }
}
exports.default = CombineClientsRouters;
//# sourceMappingURL=combineClients.routers.js.map