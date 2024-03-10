import AbstractRouter from '../abstracts/abstract.routers';
import AdminAuthControllers from './admin_auth.controller';

class AdminAuthRouter extends AbstractRouter {
  private adminAuthController = new AdminAuthControllers();

  constructor() {
    super();

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

    this.routers.post(
      '/startup/token',
      this.adminAuthController.getStartupToken
    );
    this.routers.post(
      '/refresh/token',
      this.adminAuthController.getRefreshToken
    );
    this.routers.patch(
      '/dev-user-pass',
      this.adminAuthController._updateUserAndPassword
    );
  }
}

export default AdminAuthRouter;
