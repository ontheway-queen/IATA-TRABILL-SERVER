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
const { BlobServiceClient } = require('@azure/storage-blob');
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../../config/config"));
class DeleteFile {
    constructor() {
        this.delete_image = (blobUrl, CustomContainerName = 'trabillcontainer') => __awaiter(this, void 0, void 0, function* () {
            if (blobUrl) {
                const urlParts = blobUrl.split('/');
                const blobName = urlParts.slice(4).join('/');
                const containerName = CustomContainerName;
                const blobServiceClient = BlobServiceClient.fromConnectionString(config_1.default.AZURE_STORAGE_CONNECTION_STRING);
                // Get a reference to the container
                const containerClient = blobServiceClient.getContainerClient(containerName);
                // Get a reference to the blob
                const blobClient = containerClient.getBlobClient(blobName);
                const blobExists = yield blobClient.exists();
                if (blobExists) {
                    yield blobClient.delete();
                }
                else {
                    console.log({ msg: 'Image not found on storage' });
                }
            }
            else {
                console.log({ msg: 'Previous image url not exist' });
            }
        });
        this.delete = (dir, files) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (files && files.length) {
                    for (let i = 0; i < files.length; i++) {
                        const filename = files[i];
                        const path = `${__dirname}/../../../uploads/${dir}/${filename}`;
                        yield fs_1.default.promises.unlink(path);
                    }
                }
                else {
                    return;
                }
            }
            catch (err) {
                console.log({ from: 'deleteFile', err });
            }
        });
    }
}
exports.default = DeleteFile;
//# sourceMappingURL=deleteFIle.js.map