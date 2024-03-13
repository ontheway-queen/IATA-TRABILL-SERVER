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
const abstract_models_1 = __importDefault(require("../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
class AdminAuthModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getUserModules = (agency_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('module_name', 'module_type')
                .from('trabill_agency_moduls')
                .where('agmod_org_id', agency_id)
                .leftJoin('trabill_modules', { module_id: 'agmod_module_id' });
            return data.map((item) => item.module_type);
        });
        this.getAgencyInfo = (agency_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('org_name', 'org_owner_email', 'org_logo', 'org_address1', 'org_address2', 'org_facebook', 'org_website', 'org_extra_info', 'org_mobile_number as org_mobile', 'org_extra_info', 'org_logo_width', 'org_logo_height', 'org_currency', 'org_module_type')
                .from('trabill_agency_organization_information')
                .where('org_id', agency_id);
            return data;
        });
        this.updateUsernameAndPassword = (email, user_password) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ user_password })
                .from('trabill_users')
                .where('user_email', email);
        });
        this._updateUserAndPass = (user_username, user_password, user_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ user_password, user_username })
                .from('trabill_users')
                .where('user_id', user_id);
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.query()
                .select('user_role_id', 'role_user_type', 'org_is_active', 'user_agency_id', 'user_role', 'user_username', 'user_first_name', 'user_last_name', 'org_subscription_expired', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'user_password', 'user_id', 'trabill_user_roles.role_name', 'trabill_user_roles.role_permissions', 'role_name')
                .from('trabill_users')
                .leftJoin('trabill_user_roles', {
                'trabill_users.user_role_id': 'trabill_user_roles.role_id',
            })
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'user_agency_id',
            })
                .where({ user_id })
                .andWhereNot('user_is_deleted', 1)) || []);
        });
    }
    getPasswordByUserName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.query()
                .select('user_role_id', 'org_is_active', 'user_agency_id', 'user_role', 'user_first_name', 'user_password', 'user_id')
                .from('trabill_users')
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'user_agency_id',
            })
                .where({ user_username: username })
                .andWhereNot('user_is_deleted', 1);
            if (!user) {
                throw new customError_1.default('Incorrect username or password', 401, 'Unauthorized');
            }
            return user;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.query()
                .select('user_role_id', 'role_user_type', 'org_is_active', 'user_agency_id', 'user_role', 'user_username', 'user_first_name', 'user_last_name', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'user_password', 'user_id', 'trabill_user_roles.role_name', 'trabill_user_roles.role_permissions', 'role_name', 'org_subscription_expired')
                .from('trabill_users')
                .join('trabill_user_roles', 'trabill_users.user_role_id', 'trabill_user_roles.role_id')
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'user_agency_id',
            })
                .where({ user_username: username })
                .andWhereNot('user_is_deleted', 1);
            if (!user) {
                throw new customError_1.default('Incorrect username or password', 401, 'Unauthorized');
            }
            return user;
        });
    }
    updateUserLoginInfo(session_id, loginInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(loginInfo)
                .into('trabill_users_login_info')
                .where({ login_session_id: session_id });
        });
    }
    insertUserLoginInfo(loginInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(this.db.raw(`${this.database}.trabill_users_login_info SET ? ON DUPLICATE KEY UPDATE ?`, [loginInfo, loginInfo]));
        });
    }
    adminPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ user_password }] = yield this.query()
                .select('user_password')
                .from('trabill_users')
                .where('user_role', 'DEV_ADMIN')
                .andWhereNot('user_is_deleted', 1);
            return user_password;
        });
    }
    deleteUserLoginInfo(session_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .delete()
                .from('trabill_users_login_info')
                .where('login_session_id', session_id);
            return data;
        });
    }
    getRefreshTokenSecret(session_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.query()
                .select('login_refresh_token_secret')
                .from('trabill_users_login_info')
                .where('login_session_id', session_id);
            const tok = token[0];
            if (tok) {
                return tok.login_refresh_token_secret;
            }
            return;
        });
    }
    getAccessTokenSecret(session_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [token] = yield this.query()
                .select('login_access_token_secret')
                .from('trabill_users_login_info')
                .where('login_session_id', session_id);
            return token;
        });
    }
    resetUserLoignInfo(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query()
                .update({
                login_session_id: null,
                login_last_access_token: null,
                login_last_refresh_token: null,
                login_access_token_secret: null,
                login_refresh_token_secret: null,
            })
                .where({ login_user_id: user_id });
        });
    }
    updateUserLoginHistory(loginHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(loginHistory)
                .into('trabill_users_login_history');
        });
    }
    getRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield this.query()
                .select('role_name', 'role_permissions')
                .from('trabill_user_roles')
                .where('role_id', role_id);
            return roles[0];
        });
    }
    getLastTokens(session_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [roles] = yield this.query()
                .select('login_ip_address as ipAddress', 'login_access_token_secret as accessTokenSecret', 'login_refresh_token_secret as refreshTokenSecret', 'login_last_refresh_token as refreshToken', 'login_last_access_token as accessToken')
                .from('trabill_users_login_info')
                .where('login_session_id', session_id);
            if (!roles) {
                throw new customError_1.default('No token 1', 400, 'User not logged in');
            }
            return roles;
        });
    }
}
exports.default = AdminAuthModel;
//# sourceMappingURL=admin_auth.models.js.map