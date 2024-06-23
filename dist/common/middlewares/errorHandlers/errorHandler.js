"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const manageFile_1 = __importDefault(require("../manageFile/manageFile"));
class ErrorHandler {
    constructor() {
        /**
         * handleErrors
         */
        this.handleErrors = (err, req, res, _next) => {
            // file removing starts
            const files = req.files;
            if (files && files.length) {
                const images = files.map((item) => item.filename);
                this.manageFile.deleteFromCloud(images);
            }
            if (err instanceof customError_1.default) {
                this.customError.message =
                    err.message || 'Something went wrong, please try again later!';
                this.customError.type = err.type;
                this.customError.status = err.status;
            }
            else {
                this.customError.message =
                    'Something went wrong, please try again later!';
                this.customError.type = 'Internal Server Error';
            }
            res.status(this.customError.status || 500).json(this.customError);
        };
        this.customError = {
            success: false,
            message: 'Something went wrong :( please try again later!!',
            type: 'Internal server error!',
        };
        this.manageFile = new manageFile_1.default();
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map