"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const appConfig_controllers_1 = __importDefault(require("./appConfig.controllers"));
class AppConfigRoutes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new appConfig_controllers_1.default();
        this.callRoute();
    }
    callRoute() {
        this.routers
            .route('/app-config')
            .get(this.controllers.getAppConfig)
            .patch(this.controllers.updateAppConfig);
        this.routers
            .route('/app-config/signature')
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.updateAppConfigSignature);
        // SIGNATURE
        this.routers
            .route('/signature')
            .post(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.addSignature)
            .get(this.controllers.getSignatures);
        this.routers
            .route('/signature/:sig_id')
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.updateSignature)
            .put(this.controllers.updateSignatureStatus);
    }
}
exports.default = AppConfigRoutes;
//# sourceMappingURL=appConfig.routes.js.map