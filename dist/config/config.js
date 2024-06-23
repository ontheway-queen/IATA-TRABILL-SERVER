"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const getConfig = () => {
    return {
        DB_PASS: process.env.DB_PASS,
        DB_USER: process.env.DB_USER,
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        OTP_URL: process.env.OTP_URL,
        SENDER_ID: process.env.SENDER_ID,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
        AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
    };
};
const getSanitizedConfig = (config) => {
    return config;
};
const configuration = getConfig();
const config = getSanitizedConfig(configuration);
exports.default = config;
//# sourceMappingURL=config.js.map