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
exports.uploadImageWithBuffer = exports.uploadImageToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const stream_1 = __importDefault(require("stream"));
const config_1 = __importDefault(require("../../../config/config"));
aws_sdk_1.default.config.update({
    accessKeyId: config_1.default.AWS_S3_ACCESS_KEY,
    secretAccessKey: config_1.default.AWS_S3_SECRET_KEY,
    region: 'ap-south-1',
});
// Create an S3 client
const s3 = new aws_sdk_1.default.S3();
const uploadImageToS3 = (imageUrl, bucketName, pathName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlParts = imageUrl.split('/');
        const s3Filename = pathName + '/' + urlParts[urlParts.length - 1];
        // Download the image
        const response = yield (0, axios_1.default)({
            url: imageUrl,
            responseType: 'stream',
        });
        // Create a pass-through stream to upload to S3
        const passThrough = new stream_1.default.PassThrough();
        // Upload the image to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: s3Filename,
            Body: passThrough,
            ContentType: response.headers['content-type'],
        };
        const uploadPromise = s3.upload(uploadParams).promise();
        // Pipe the image stream to the pass-through stream
        response.data.pipe(passThrough);
        // Wait for the upload to finish
        yield uploadPromise;
        const uploadUrl = `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${s3Filename}`;
        return uploadUrl;
    }
    catch (error) {
        console.error('Error uploading image to S3:', error);
    }
});
exports.uploadImageToS3 = uploadImageToS3;
// uploadImageToS3(image_url, 'm360ict', 'trabill/iata');
const uploadImageWithBuffer = (imageBuffer, fileName, ContentType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3Filename = `trabill/bsp/${fileName}`;
        // Upload the image buffer to S3
        const uploadParams = {
            Bucket: 'm360ict',
            Key: s3Filename,
            Body: imageBuffer,
            ContentType: ContentType,
        };
        const uploadPromise = s3.upload(uploadParams).promise();
        // Wait for the upload to finish
        yield uploadPromise;
        const uploadUrl = `https://m360ict.s3.ap-south-1.amazonaws.com/${s3Filename}`;
        return uploadUrl;
    }
    catch (error) {
        console.error('Error uploading image to S3:', error);
    }
});
exports.uploadImageWithBuffer = uploadImageWithBuffer;
//# sourceMappingURL=imageUploader.js.map