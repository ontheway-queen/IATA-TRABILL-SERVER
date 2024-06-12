import AbstractRouter from '../../../../abstracts/abstract.routers';
import AppConfigControllers from './appConfig.controllers';

class AppConfigRoutes extends AbstractRouter {
  private controllers = new AppConfigControllers();

  constructor() {
    super();

    this.callRoute();
  }

  private callRoute() {
    this.routers
      .route('/app-config')
      .get(this.controllers.getAppConfig)
      .patch(this.controllers.updateAppConfig);

    this.routers
      .route('/app-config/signature')
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.updateAppConfigSignature
      );

    // SIGNATURE
    this.routers
      .route('/signature')
      .post(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.addSignature
      )
      .get(this.controllers.getSignatures);

    this.routers
      .route('/signature/:sig_id')
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.updateSignature
      )
      .put(this.controllers.updateSignatureStatus);
  }
}
export default AppConfigRoutes;
