"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_loki_1 = __importDefault(require("winston-loki"));
class Logger {
    constructor() {
        this.options = {
            format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
            transports: [
                new winston_loki_1.default({
                    labels: { App_Name: 'Trabill' },
                    host: 'http://127.0.0.1:3100',
                }),
            ],
        };
        this.logger = (0, winston_1.createLogger)(this.options);
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map