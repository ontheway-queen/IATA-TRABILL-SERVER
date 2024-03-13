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
const customError_1 = __importDefault(require("../../utils/errors/customError"));
class FuncWrapper {
    // CONTROLLER ASYNC WRAPPER
    wrap(cb) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield cb(req, res, next);
            }
            catch (err) {
                console.log({ from: 'funcWrapper', err });
                next(new customError_1.default(err.message, err.status, err.type));
            }
        });
    }
}
exports.default = FuncWrapper;
//# sourceMappingURL=funcWrapper.js.map