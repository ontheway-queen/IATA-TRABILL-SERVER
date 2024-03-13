"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const user_controllers_1 = __importDefault(require("./user.controllers"));
class UserRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.userControllers = new user_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.userControllers.viewUsers);
        this.routers.get('/all-roles', this.userControllers.viewRoles);
        this.routers
            .route('/roles/:role_id')
            .get(this.userControllers.getRoleById)
            .delete(this.userControllers.deleteRole);
        this.routers.get('/roles/is-exist/:role_name', this.userControllers.checkUserRoleIsExist);
        this.routers
            .route('/roles')
            .post(this.userControllers.addRole)
            .get(this.userControllers.viewRoles);
        this.routers.route('/all').get(this.userControllers.getAllUsers);
        this.routers.route('/all/:user_id').get(this.userControllers.getUserById);
        this.routers.route('/create-user').post(this.userControllers.createUser);
        this.routers
            .route('/update-user/:user_id')
            .patch(this.userControllers.updateUser);
        this.routers
            .route('/delete-user/:user_id')
            .delete(this.userControllers.deleteUser);
        this.routers
            .route('/reset-user-password/:user_id')
            .post(this.userControllers.resetUserPassword);
        this.routers
            .route('/change-password/:user_id')
            .put(this.userControllers.changePassword);
    }
}
exports.default = UserRouters;
//# sourceMappingURL=user.routers.js.map