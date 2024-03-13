"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assyncWrapper_1 = __importDefault(require("../common/middlewares/assyncWrapper/assyncWrapper"));
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
class AbstractController {
    constructor() {
        this.assyncWrapper = new assyncWrapper_1.default();
    }
    error(message, status, type) {
        throw new customError_1.default(message || 'Something went wrong', status || 500, type || 'Internal server Error');
    }
}
exports.default = AbstractController;
//# sourceMappingURL=abstract.controllers.js.map