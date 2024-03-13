"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploaderMW_1 = __importDefault(require("../common/middlewares/uploaderMW/uploaderMW"));
class AbstractRouter {
    constructor() {
        this.routers = (0, express_1.Router)();
        this.uploader = new uploaderMW_1.default();
    }
}
exports.default = AbstractRouter;
//# sourceMappingURL=abstract.routers.js.map