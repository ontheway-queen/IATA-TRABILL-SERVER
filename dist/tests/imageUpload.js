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
exports.uploadImageToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const stream_1 = __importDefault(require("stream"));
aws_sdk_1.default.config.update({
    accessKeyId: 'AKIA33M2Q5WREAJ7WOWU',
    secretAccessKey: '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',
    region: 'ap-south-1',
});
// Create an S3 client
const s3 = new aws_sdk_1.default.S3();
function uploadImageToS3(imageUrl, bucketName, pathName) {
    return __awaiter(this, void 0, void 0, function* () {
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
            console.log({
                uploadUrl,
            });
        }
        catch (error) {
            console.error('Error uploading image to S3:', error);
        }
    });
}
exports.uploadImageToS3 = uploadImageToS3;
// uploadImageToS3(image_url, 'm360ict', 'trabill/iata');
//# sourceMappingURL=imageUpload.js.map