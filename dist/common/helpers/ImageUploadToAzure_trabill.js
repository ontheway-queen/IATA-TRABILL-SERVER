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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToAzure_trabill = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const config_1 = __importDefault(require("../../config/config"));
const containerName = 'trabillcontainer';
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(config_1.default.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);
const uploadImageToAzure_trabill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).send('No image uploaded');
    }
    const images = req.files;
    const imageURLlist = [];
    for (const key in images) {
        if (Object.prototype.hasOwnProperty.call(images, key)) {
            const element = images[key];
            const image = element[0];
            const currentDateTime = Date.now();
            const uniqueName = 'images/' + currentDateTime + image.originalname;
            const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
            yield blockBlobClient.upload(image.buffer, image.buffer.length);
            const imageUrl = `https://trabillteststorage.blob.core.windows.net/${containerName}/${uniqueName}`;
            const myObject = {};
            myObject[key] = imageUrl;
            imageURLlist.push(myObject);
        }
    }
    req.imgUrl = imageURLlist;
    next();
});
exports.uploadImageToAzure_trabill = uploadImageToAzure_trabill;
//# sourceMappingURL=ImageUploadToAzure_trabill.js.map