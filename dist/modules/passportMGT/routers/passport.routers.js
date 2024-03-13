"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const ImageUploadToAzure_trabill_1 = require("../../../common/helpers/ImageUploadToAzure_trabill");
const passport_controllers_1 = __importDefault(require("../controllers/passport.controllers"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class PassportRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new passport_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/is-unique-pass-no/:passport_no', this.controllers.passportNumberIsUnique);
        this.routers
            .route('/')
            .post(upload.fields([
            { name: 'passport_scan_copy', maxCount: 1 },
            { name: 'passport_upload_photo', maxCount: 1 },
            { name: 'passport_upload_others', maxCount: 1 },
        ]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.addPassport)
            .get(this.controllers.allPassports);
        this.routers.get('/view-all', this.controllers.getPassportsForSelect);
        // change passport status
        this.routers
            .route('/status/:passport_id')
            .post(this.controllers.changeStatus)
            .get(this.controllers.getStatus);
        // single passport
        this.routers
            .route('/:passport_id')
            .get(this.controllers.singlePassport)
            .patch(upload.fields([
            { name: 'passport_scan_copy', maxCount: 1 },
            { name: 'passport_upload_photo', maxCount: 1 },
            { name: 'passport_upload_others', maxCount: 1 },
        ]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.editPassport)
            .delete(this.controllers.deletePassport);
    }
}
exports.default = PassportRouter;
//# sourceMappingURL=passport.routers.js.map