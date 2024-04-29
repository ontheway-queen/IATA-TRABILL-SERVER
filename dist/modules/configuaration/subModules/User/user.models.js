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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class UserModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getUserPassword = (userId) => __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.query()
                .select('user_password as user_curr_pass', 'user_email')
                .from('trabill_users')
                .where('user_agency_id', this.org_agency)
                .andWhere('user_id', userId);
            if (!user) {
                throw new customError_1.default('Please provide valid user id', 400, 'Invalid user id');
            }
            return user;
        });
        this.getRoleById = (roleId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('role_name', 'role_permissions', 'role_user_type')
                .from('trabill_user_roles')
                .where('role_id', roleId);
            return data;
        });
        this.getUserRoleName = (roleId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('role_name', 'role_user_type')
                .from('trabill_user_roles')
                .where('role_id', roleId);
            return data;
        });
        this.deleteRole = (roleId, role_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ role_is_deleted: 1, role_deleted_by })
                .into('trabill_user_roles')
                .where('role_id', roleId);
        });
    }
    // role permission
    addRole({ role_name, role_permissions, user_role, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.query()
                .insert({
                role_user_type: user_role,
                role_name,
                role_permissions,
                org_agency: this.org_agency,
            })
                .into('trabill_user_roles');
            return role[0];
        });
    }
    checkUserRoleIsExist(role_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.query()
                .select('role_name')
                .from('trabill_user_roles')
                .where('org_agency', this.org_agency)
                .andWhere('role_name', role_name)
                .andWhereNot('role_is_deleted', 1);
            return role[0];
        });
    }
    viewRoles(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            page = Number(page);
            size = Number(size);
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('role_id', 'role_name', 'role_is_developer', 'role_is_super_developer', 'role_status')
                .from('trabill_user_roles')
                .where('org_agency', this.org_agency)
                .andWhereNot('role_is_deleted', 1)
                .orderBy('role_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_user_roles')
                .where('org_agency', this.org_agency)
                .andWhereNot('role_is_deleted', 1);
            return { count: row_count, data };
        });
    }
    // users
    createUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user_id] = yield this.query()
                .insert(Object.assign(Object.assign({}, userInfo), { user_agency_id: this.org_agency }))
                .into('trabill_users');
            if (!user_id) {
                throw new customError_1.default('User cannot create with this data', 400, 'User cannot create');
            }
            return user_id;
        });
    }
    createAgencyUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user_id] = yield this.query().insert(userInfo).into('trabill_users');
            if (!user_id) {
                throw new customError_1.default('User cannot create with this data', 400, 'User cannot create');
            }
            return user_id;
        });
    }
    viewUsers(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('*')
                .from('trabill.all_users')
                .where('user_agency_id', this.org_agency)
                .limit(size)
                .offset(page_number);
        });
    }
    countUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill.all_users')
                .where('user_agency_id', this.org_agency);
            return count.row_count;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('trabill.all_users')
                .where('user_agency_id', this.org_agency);
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.query()
                .select('user_first_name', 'user_last_name', 'user_username', 'user_email', 'user_dial_code', 'user_mobile', 'user_role_id')
                .from('trabill_users')
                .where('user_agency_id', this.org_agency)
                .andWhere('user_id', userId);
            return user;
        });
    }
    updateUser(userInfo, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(userInfo)
                .into('trabill_users')
                .where('user_agency_id', this.org_agency)
                .andWhere('user_id', userId);
        });
    }
    updateAgencyUser(userInfo, agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(userInfo)
                .from('trabill_users')
                .where('user_agency_id', agency_id);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ user_is_deleted: 1 })
                .into('trabill_users')
                .whereNotIn('user_role', ['SUPER_ADMIN', 'DEV_ADMIN'])
                .where('user_agency_id', this.org_agency)
                .andWhere('user_id', userId);
        });
    }
    resetUserPassword(password, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.query()
                .update({ user_password: password })
                .into('trabill_users')
                .where('user_id', user_id);
        });
    }
    getSingleUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.query()
                .select('user_role_id')
                .from('trabill_users')
                .join('trabill_user_roles', 'trabill_users.user_role_id', 'trabill_user_roles.role_id')
                .where('user_agency_id', this.org_agency)
                .andWhere('user_username', username)
                .andWhereNot('user_is_deleted', 1);
            return user[0];
        });
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.models.js.map