"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../abstracts/abstract.routers"));
const admin_auth_controller_1 = __importDefault(require("./admin_auth.controller"));
class AdminAuthRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.adminAuthController = new admin_auth_controller_1.default();
        this.initRouters();
    }
    initRouters() {
        this.routers.post('/login', this.adminAuthController.loginUser);
        this.routers.post('/admin-login', this.adminAuthController.loginAdmin);
        this.routers.post('/logout', this.adminAuthController.logoutUser);
        this.routers
            .route('/forgot-password')
            .get(this.adminAuthController.forgotPasswordOrUsername)
            .put(this.adminAuthController.varifyOTPandChangeUsernamePassword);
        this.routers.post('/startup/token', this.adminAuthController.getStartupToken);
        this.routers.post('/refresh/token', this.adminAuthController.getRefreshToken);
        this.routers.patch('/dev-user-pass', this.adminAuthController._updateUserAndPassword);
    }
}
exports.default = AdminAuthRouter;
//# sourceMappingURL=admin_auth.router.js.map