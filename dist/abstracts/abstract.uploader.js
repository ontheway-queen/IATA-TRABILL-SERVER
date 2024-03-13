"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const azureUploader_1 = __importDefault(require("../common/middlewares/azure/azureUploader"));
const allowed_file_types = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
class AbstractUploader {
    constructor() {
        this.allowed_file_types = allowed_file_types;
        this.error_message = 'Only .jpg, .jpeg, .webp or .png format allowed!';
        this.azure = new azureUploader_1.default();
    }
}
exports.default = AbstractUploader;
//# sourceMappingURL=abstract.uploader.js.map