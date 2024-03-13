"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const deleteFIle_1 = __importDefault(require("../../utils/fileRemover/deleteFIle"));
class ErrorHandler {
    constructor() {
        /**
         * handleErrors
         */
        this.handleErrors = (err, req, res, _next) => {
            // file removing starts
            const files = req.upFiles;
            const folder = req.upFolder;
            const image_files = req.image_files;
            if (files) {
                this.deleteFile.delete(folder, files);
            }
            // if (image_files) {
            //   this.deleteFile.delete_image(image_files);
            // }
            // file removing ends
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
        this.deleteFile = new deleteFIle_1.default();
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map