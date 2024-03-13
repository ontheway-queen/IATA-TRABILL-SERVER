"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const { BlobServiceClient } = require('@azure/storage-blob');
const config_1 = __importDefault(require("../../../config/config"));
const funcWrapper_1 = __importDefault(require("../../utils/assyncWrapper/funcWrapper"));
class Azure {
    constructor() {
        this.funcWrapper = new funcWrapper_1.default();
    }
    imageUpload(subfolder_path) {
        const containerName = 'trabillcontainer';
        return this.funcWrapper.wrap((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const files = req.files;
            const keys = Object.keys(files);
            const fileFields = {};
            const blobServiceClient = BlobServiceClient.fromConnectionString(config_1.default.AZURE_STORAGE_CONNECTION_STRING);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            try {
                for (var _d = true, keys_1 = __asyncValues(keys), keys_1_1; keys_1_1 = yield keys_1.next(), _a = keys_1_1.done, !_a;) {
                    _c = keys_1_1.value;
                    _d = false;
                    try {
                        const key = _c;
                        const file = files[key][0];
                        const uniqueName = Date.now() +
                            '-' +
                            Math.round(Math.random() * 1e9) +
                            path_1.default.extname(file.originalname);
                        const fullPathName = `images/${subfolder_path}/${uniqueName}`;
                        const blockBlobClient = containerClient.getBlockBlobClient(fullPathName);
                        yield blockBlobClient.uploadData(file.buffer, {
                            blobHTTPHeaders: { blobContentType: file.mimetype },
                        });
                        const imageUrl = blockBlobClient.url;
                        fileFields[key] = imageUrl;
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = keys_1.return)) yield _b.call(keys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            req.image_files = fileFields;
            next();
        }));
    }
}
exports.default = Azure;
//# sourceMappingURL=azureUploader.js.map