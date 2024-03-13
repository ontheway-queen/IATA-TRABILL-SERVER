"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
class Uploader {
    constructor(allowed_file_types, error_message) {
        this.allowed_file_types = allowed_file_types;
        this.error_message = error_message;
    }
    /**
     * memmoryStorage
     */
    memmoryStorage() {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({
            storage: storage,
            fileFilter: (req, file, cb) => {
                if (this.allowed_file_types.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new Error(this.error_message));
                }
            },
        });
        return upload;
    }
    // RAW IMAGE UPLOADER
    rawUpload(subfolder_path) {
        const uploadsFolder = `${__dirname}/../../../uploads/${subfolder_path}`;
        const storage = multer_1.default.diskStorage({
            destination: (_req, _file, cb) => {
                cb(null, uploadsFolder);
            },
            filename: (req, file, cb) => {
                const uniqueName = Date.now() +
                    '-' +
                    Math.round(Math.random() * 1e9) +
                    path_1.default.extname(file.originalname);
                if (req.upFiles && req.upFiles.length) {
                    req.upFiles.push(uniqueName);
                }
                else {
                    req.upFiles = [uniqueName];
                }
                cb(null, uniqueName);
            },
        });
        // preapre the final multer upload object
        const upload = (0, multer_1.default)({
            storage: storage,
            fileFilter: (_req, file, cb) => {
                if (this.allowed_file_types.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new Error(this.error_message));
                }
            },
        });
        return upload;
    }
}
exports.default = Uploader;
//# sourceMappingURL=uploaders.js.map