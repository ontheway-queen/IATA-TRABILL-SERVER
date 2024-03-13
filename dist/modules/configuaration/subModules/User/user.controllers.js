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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const user_services_1 = __importDefault(require("./user.services"));
const user_validator_1 = __importDefault(require("./user.validator"));
class UserControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.userServices = new user_services_1.default();
        this.validator = new user_validator_1.default();
        this.viewRoles = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.viewRoles(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getRoleById = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.getRoleById(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteRole = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.deleteRole(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.createUser = this.assyncWrapper.wrap(this.validator.createUser, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.createUser(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create user');
            }
        }));
        this.updateUser = this.assyncWrapper.wrap(this.validator.updateUser, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.updateUser(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create user');
            }
        }));
        this.deleteUser = this.assyncWrapper.wrap(this.validator.deleteUser, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.deleteUser(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create user');
            }
        }));
        this.resetUserPassword = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.resetUserPassword(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create user');
            }
        }));
        this.changePassword = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.changePassword(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('create user');
            }
        }));
        this.viewUsers = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.viewUsers(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllUsers = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.getAllUsers(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getUserById = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.getUserById(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.addRole = this.assyncWrapper.wrap(this.validator.createRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.addRole(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.checkUserRoleIsExist = this.assyncWrapper.wrap(this.validator.readRole, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userServices.checkUserRoleIsExist(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = UserControllers;
//# sourceMappingURL=user.controllers.js.map