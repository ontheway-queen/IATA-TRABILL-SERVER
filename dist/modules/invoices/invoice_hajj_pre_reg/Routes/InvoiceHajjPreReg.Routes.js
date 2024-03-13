"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const InvoiceHajjPreReg_Controllers_1 = __importDefault(require("../Controllers/InvoiceHajjPreReg.Controllers"));
class InoviceHajjPreRegRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new InvoiceHajjPreReg_Controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.put('/void/:invoice_id', this.controllers.voidHajjPreReg);
        this.routers
            .route('/')
            .post(this.controllers.addInvoiceHajjPre)
            .get(this.controllers.getAllInvoiceHajjiPreReg);
        this.routers.get('/view/:id', this.controllers.viewInvoiceHajjiPreReg);
        this.routers.post('/serial-tracking-isexist', this.controllers.hajiInfoSerialIsUnique);
        this.routers.get('/pre_reg_reports/:year', this.controllers.getPreRegistrationReports);
        this.routers.get('/haji_info_by_tracking', this.controllers.hajiInformationHajjiManagement);
        this.routers.get('/haji_info_by_tracking/:id', this.controllers.hajiInfoByTrackingNo);
        this.routers.get('/haji_pre_reg_infos', this.controllers.getAllHajiPreRegInfos);
        this.routers
            .route('/haji_info_status/:invoice_id')
            .patch(this.controllers.updateHajjiInfoStatus);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getDetailsById)
            .patch(this.controllers.editInvoiceHajjPre)
            .delete(this.controllers.deleteInvoiceHajjPre);
    }
}
exports.default = InoviceHajjPreRegRouters;
//# sourceMappingURL=InvoiceHajjPreReg.Routes.js.map