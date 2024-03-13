"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_uploader_1 = __importDefault(require("../../../abstracts/abstract.uploader"));
const uploaders_1 = __importDefault(require("../../../common/utils/uploaders/uploaders"));
const constants_1 = __importDefault(require("../../../modules/passportMGT/utils/constants"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
class UploaderMW extends abstract_uploader_1.default {
    constructor() {
        super();
        this.uploader = new uploaders_1.default(this.allowed_file_types, this.error_message);
    }
    imageUpload(subfolder_path) {
        return (req, res, next) => {
            const upload = this.uploader.memmoryStorage();
            upload.fields(constants_1.default.fields(15))(req, res, (err) => {
                if (err) {
                    next(new customError_1.default(err.message, 500, 'Upload failed'));
                }
                else {
                    this.azure.imageUpload(subfolder_path)(req, res, next);
                }
            });
        };
    }
    rawUpload(folder) {
        return (req, res, next) => {
            const upload = this.uploader.rawUpload(folder);
            upload.fields(constants_1.default.fields(15))(req, res, (err) => {
                if (err) {
                    next(new customError_1.default(err.message, 500, 'Upload failed'));
                }
                else {
                    req.upFolder = folder;
                    next();
                }
            });
        };
    }
}
exports.default = UploaderMW;
//# sourceMappingURL=uploaderMW.js.map