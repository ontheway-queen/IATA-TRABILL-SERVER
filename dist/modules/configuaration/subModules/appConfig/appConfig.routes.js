"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const ImageUploadToAzure_trabill_1 = require("../../../../common/helpers/ImageUploadToAzure_trabill");
const appConfig_controllers_1 = __importDefault(require("./appConfig.controllers"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
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
        this.routers.route('/app-config/signature').patch(upload.fields([
            { name: 'tac_sig_url', maxCount: 1 },
            { name: 'tac_wtr_mark_url', maxCount: 1 },
        ]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.updateAppConfigSignature);
        // SIGNATURE
        this.routers
            .route('/signature')
            .post(upload.fields([{ name: 'sig_signature', maxCount: 1 }]), ImageUploadToAzure_trabill_1.signatureUploadToAzure, this.controllers.addSignature)
            .get(this.controllers.getSignatures);
        this.routers
            .route('/signature/:sig_id')
            .patch(upload.fields([{ name: 'sig_signature', maxCount: 1 }]), ImageUploadToAzure_trabill_1.signatureUploadToAzure, this.controllers.updateSignature)
            .put(this.controllers.updateSignatureStatus);
    }
}
exports.default = AppConfigRoutes;
//# sourceMappingURL=appConfig.routes.js.map