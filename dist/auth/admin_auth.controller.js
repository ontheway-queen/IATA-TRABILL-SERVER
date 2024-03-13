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
const abstract_controllers_1 = __importDefault(require("../abstracts/abstract.controllers"));
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
const adminPanel_validators_1 = __importDefault(require("../modules/adminPanel/Validators/adminPanel.validators"));
const admin_auth_services_1 = __importDefault(require("./admin_auth.services"));
class AdminAuthControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new admin_auth_services_1.default();
        this.validator = new adminPanel_validators_1.default();
        this.loginUser = this.assyncWrapper.wrap(this.validator.loginUser, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.loginUser(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('login controller');
            }
        }));
        this.loginAdmin = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.loginAdmin(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('login controller');
            }
        }));
        this.logoutUser = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.logoutUser(req);
            if (data.success) {
                res.status(204).json(data);
            }
            else {
                this.error('login controller');
            }
        }));
        this.getStartupToken = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getStartupToken(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getToken controller');
            }
        }));
        this.getRefreshToken = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getRefreshToken(req);
            if (data instanceof customError_1.default) {
                res.status(400).json(Object.assign({ success: false }, data));
            }
            else if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getToken controller');
            }
        }));
        this.forgotPasswordOrUsername = this.assyncWrapper.wrap(this.validator.forgotUsernameOrPass, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.forgotPasswordOrUsername(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getToken controller');
            }
        }));
        this.varifyOTPandChangeUsernamePassword = this.assyncWrapper.wrap(this.validator.verifyOtpChangeUsernamePass, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.varifyOTPandChangeUsernamePassword(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getToken controller');
            }
        }));
        this._updateUserAndPassword = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services._updateUserAndPassword(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getToken controller');
            }
        }));
    }
}
exports.default = AdminAuthControllers;
//# sourceMappingURL=admin_auth.controller.js.map