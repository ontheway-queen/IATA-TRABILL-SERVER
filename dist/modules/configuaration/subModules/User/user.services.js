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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../../common/utils/libraries/lib"));
class UserServices extends abstract_services_1.default {
    constructor() {
        super();
        this.viewRoles = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .userModel(req)
                .viewRoles(page, size);
            return Object.assign({ success: true }, data);
        });
        this.viewUsers = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const users = yield this.models.configModel
                .userModel(req)
                .viewUsers(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel.userModel(req).countUsers();
            return { success: true, count, data: users };
        });
        this.getAllUsers = (req) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.models.configModel.userModel(req).getAllUsers();
            return { success: true, data: users };
        });
        this.getUserById = (req) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.user_id;
            const users = yield this.models.configModel.userModel(req).getUser(userId);
            return { success: true, data: users };
        });
        this.addRole = (req) => __awaiter(this, void 0, void 0, function* () {
            const { role_name } = req.body;
            const is_exist = yield this.models.configModel
                .userModel(req)
                .checkUserRoleIsExist(role_name);
            if (is_exist) {
                throw new customError_1.default(`This role name alrady exist, enter unique name`, 400, 'Bad request');
            }
            const role_id = yield this.models.configModel
                .userModel(req)
                .addRole(req.body);
            return { success: true, data: { role_id } };
        });
        this.checkUserRoleIsExist = (req) => __awaiter(this, void 0, void 0, function* () {
            const { role_name } = req.params;
            const role = yield this.models.configModel
                .userModel(req)
                .checkUserRoleIsExist(role_name);
            return {
                success: true,
                message: role ? 'Role name alrady exist' : 'Role name. is uniqe',
                data: {
                    is_uniqe: role ? true : false,
                },
            };
        });
        this.getRoleById = (req) => __awaiter(this, void 0, void 0, function* () {
            const roleId = req.params.role_id;
            const data = yield this.models.configModel
                .userModel(req)
                .getRoleById(roleId);
            return { success: true, data };
        });
        this.deleteRole = (req) => __awaiter(this, void 0, void 0, function* () {
            const roleId = req.params.role_id;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .userModel(req)
                .deleteRole(roleId, deleted_by);
            return { success: true, data };
        });
    }
    // CREATE USER
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, user_dial_code, user_email, user_first_name, user_last_name, user_role_id, user_username, user_mobile, user_agency_id, } = req.body;
            const user_password = yield lib_1.default.hashPass(password);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.configModel.userModel(req, trx);
                const roleName = yield conn.getUserRoleName(user_role_id);
                const checkPassword = (password) => {
                    const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                    return pattern.test(password);
                };
                if (!checkPassword(password)) {
                    throw new customError_1.default(`Password must be minimum 8 character and one special character required`, 400, 'Bad request');
                }
                const userInfo = {
                    user_agency_id,
                    user_password,
                    user_dial_code,
                    user_email,
                    user_first_name,
                    user_last_name,
                    user_role_id,
                    user_username,
                    user_mobile,
                    user_role: roleName.role_user_type,
                };
                const user_id = yield conn.createUser(userInfo);
                return {
                    success: true,
                    message: 'User created successfully',
                    user_id,
                };
            }));
        });
    }
    // UPDATE USER
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.user_id;
            if (!userId) {
                throw new customError_1.default('Please provide user id', 400, 'Empty user id');
            }
            const { password, user_dial_code, user_email, user_first_name, user_last_name, user_role_id, user_username, user_mobile, current_password, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.configModel.userModel(req, trx);
                const roleName = yield conn.getUserRoleName(user_role_id);
                let user_password = undefined;
                if (password) {
                    const checkPassword = (password) => {
                        const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                        return pattern.test(password);
                    };
                    if (!checkPassword(password)) {
                        throw new customError_1.default(`Password must be minimum 8 character and one special character required`, 400, 'Bad request');
                    }
                    user_password = yield lib_1.default.hashPass(password);
                    const { user_curr_pass } = yield conn.getUserPassword(userId);
                    yield lib_1.default.checkPassword(current_password, user_curr_pass);
                }
                const userInfo = {
                    user_password,
                    user_dial_code,
                    user_email,
                    user_first_name,
                    user_last_name,
                    user_role_id,
                    user_username,
                    user_mobile,
                    user_role: roleName.role_user_type,
                };
                yield conn.updateUser(userInfo, userId);
                return { success: true, message: 'User has been updated' };
            }));
        });
    }
    deleteUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.user_id;
            const conn = this.models.configModel.userModel(req);
            yield conn.deleteUser(userId);
            return {
                success: true,
                message: 'User has been deleted',
            };
        });
    }
    // RESET USER PASSWORD
    resetUserPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.params;
            const { current_user_email, password } = req.body;
            const conn = this.models.configModel.userModel(req);
            const { user_email } = yield conn.getUserPassword(user_id);
            if (current_user_email !== user_email) {
                throw new customError_1.default('Incorrect email address', 400, 'Invalid email');
            }
            if (password) {
                const checkPassword = (password) => {
                    const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                    return pattern.test(password);
                };
                if (!checkPassword(password)) {
                    throw new customError_1.default(`Password must be minimum 8 charecter and one special charecter required`, 400, 'Bad request');
                }
            }
            const hashedPass = yield lib_1.default.hashPass(password);
            yield conn.resetUserPassword(hashedPass, user_id);
            return {
                success: true,
                message: 'Resetting password of super admin was successfull',
            };
        });
    }
    // RESET USER PASSWORD
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.params;
            const { current_password, new_password } = req.body;
            const conn = this.models.configModel.userModel(req);
            if (new_password) {
                const checkPassword = (password) => {
                    const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                    return pattern.test(password);
                };
                if (!checkPassword(new_password)) {
                    throw new customError_1.default(`Password must be minimum 8 charecter and one special charecter required`, 400, 'Bad request');
                }
            }
            const { user_curr_pass } = yield conn.getUserPassword(user_id);
            yield lib_1.default.checkPassword(current_password, user_curr_pass);
            const hashedPass = yield lib_1.default.hashPass(new_password);
            yield conn.resetUserPassword(hashedPass, user_id);
            return {
                success: true,
                message: 'Changing password of super admin was successfull',
            };
        });
    }
}
exports.default = UserServices;
//# sourceMappingURL=user.services.js.map