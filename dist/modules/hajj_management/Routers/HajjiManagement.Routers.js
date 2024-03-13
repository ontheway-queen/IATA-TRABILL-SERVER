"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const HajjiManagement_Controllers_1 = __importDefault(require("../Controllers/HajjiManagement.Controllers"));
class HajjiManagementRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new HajjiManagement_Controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/tracking_no/hajj', this.controllers.getHajjTrackingList);
        this.routers.get('/tracking_no/hajj-pre-reg', this.controllers.getHajjPreReg);
        this.routers.get('/tracking_no/group/:group_id', this.controllers.getTrackingNoByGroup);
        this.routers.get('/tracking_no/:comb_client', this.controllers.getTrackingNoByClient);
        // ====================== client to client ====================
        this.routers
            .route('/client_to_client')
            .post(this.controllers.addClientToClient)
            .get(this.controllers.getAllClientToClient);
        this.routers
            .route('/client_to_client/:id')
            .patch(this.controllers.updateClientToClient)
            .delete(this.controllers.deleteClientToClient)
            .get(this.controllers.getDetailsClientToClient);
        this.routers.get('/client_to_client/view_details/:id', this.controllers.viewClientTransaction);
        // ====================== group transaction
        this.routers.post('/group_trans', this.controllers.addGroupToGroup);
        this.routers.get('/group_trans/all', this.controllers.getAllGroupTransaction);
        this.routers.get('/group_trans/view/:id', this.controllers.viewGroupTransfer);
        this.routers.get('/group_trans/:id', this.controllers.getDetailsGroupTransactioon);
        this.routers.patch('/group_trans/:id', this.controllers.updateGroupToGroup);
        this.routers.delete('/group_trans/:id', this.controllers.deleteGroupTransaction);
        // ============================= Transfer in ======================
        this.routers.post('/transfer_in', this.controllers.addTransferIn);
        this.routers.get('/transfer_in/all/:type', this.controllers.getAllHajiTransfer);
        this.routers.patch('/transfer_in/:id', this.controllers.updateTransferIn);
        this.routers.delete('/transfer_in/:id', this.controllers.deleteTransferIn);
        this.routers.get('/transfer_in/get-for-edit/:id', this.controllers.getDataForEdit);
        // ============================= Transfer out ======================
        this.routers.post('/transfer_out', this.controllers.addTransferOut);
        this.routers.patch('/transfer_out/:id', this.controllers.updateTransferOut);
        this.routers.post('/cancel_pre_reg', this.controllers.createCancelPreReg);
        this.routers.get('/cancel_pre_reg/all', this.controllers.getAllCancelPreReg);
        this.routers.post('/haji-info-by-traking_no', this.controllers.getHajjiInfoByTrakingNo);
        this.routers.delete('/cancel_pre_reg/:id', this.controllers.deleteCancelPreReg);
        this.routers.get('/hajj_haji_tracking_no', this.controllers.getHajjHajiInfo);
        this.routers
            .route('/cancel_hajj_reg')
            .post(this.controllers.createCancelHajjReg)
            .get(this.controllers.getCancelHajjRegList);
        this.routers.delete('/cancel_hajj_reg/:cancel_id', this.controllers.deleteCancelHajjReg);
    }
}
exports.default = HajjiManagementRouters;
//# sourceMappingURL=HajjiManagement.Routers.js.map