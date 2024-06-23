"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const passport_controllers_1 = __importDefault(require("../controllers/passport.controllers"));
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
            .post(this.uploader.cloudUploadRaw(this.fileFolder.PASSPORT_FILE), this.controllers.addPassport)
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
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.PASSPORT_FILE), this.controllers.editPassport)
            .delete(this.controllers.deletePassport);
    }
}
exports.default = PassportRouter;
//# sourceMappingURL=passport.routers.js.map