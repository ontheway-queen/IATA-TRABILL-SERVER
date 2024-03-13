"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../miscellaneous/constants");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
class Mini {
    constructor() {
        this.origins = constants_1.origin;
        this.cors = (req_origin, cb) => {
            const urlRegex = /https?:\/\/([a-z0-9]+[.])*trabill[.]biz/;
            const isReqUrlValid = req_origin &&
                (urlRegex.test(req_origin) || this.origins.includes(req_origin));
            if (isReqUrlValid) {
                cb(null, req_origin);
            }
            else {
                cb(null, this.origins);
            }
        };
    }
    404(_req, _res, next) {
        next(new customError_1.default('Cannot find the route', 404, 'Invalid route'));
    }
}
exports.default = Mini;
//# sourceMappingURL=mini.js.map