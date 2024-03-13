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
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        COOKIE_SECRET: process.env.COOKIE_SECRET,
        OTP_URL: process.env.OTP_URL,
        SENDER_ID: process.env.SENDER_ID,
    };
};
const getSanitizedConfig = (config) => {
    return config;
};
const configuration = getConfig();
const config = getSanitizedConfig(configuration);
exports.default = config;
//# sourceMappingURL=config.js.map