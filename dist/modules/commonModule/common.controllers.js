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
const abstract_controllers_1 = __importDefault(require("../../abstracts/abstract.controllers"));
const adminPanel_services_1 = __importDefault(require("../adminPanel/Services/adminPanel.services"));
const user_validator_1 = __importDefault(require("../configuaration/subModules/User/user.validator"));
class CommonControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new adminPanel_services_1.default();
        this.validator = new user_validator_1.default();
        this.generateVoucher = this.assyncWrapper.wrap(this.validator.commonModule, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.generateVouchers(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = CommonControllers;
//# sourceMappingURL=common.controllers.js.map