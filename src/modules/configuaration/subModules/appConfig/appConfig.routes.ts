import multer from 'multer';
import AbstractRouter from '../../../../abstracts/abstract.routers';
import {
  signatureUploadToAzure,
  uploadImageToAzure_trabill,
} from '../../../../common/helpers/ImageUploadToAzure_trabill';
import AppConfigControllers from './appConfig.controllers';

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

    this.routers.route('/app-config/signature').patch(
      upload.fields([
        { name: 'tac_sig_url', maxCount: 1 },
        { name: 'tac_wtr_mark_url', maxCount: 1 },
      ]),
      uploadImageToAzure_trabill,
      this.controllers.updateAppConfigSignature
    );

    // SIGNATURE
    this.routers
      .route('/signature')
      .post(
        upload.fields([{ name: 'sig_signature', maxCount: 1 }]),
        signatureUploadToAzure,
        this.controllers.addSignature
      )
      .get(this.controllers.getSignatures);

    this.routers
      .route('/signature/:sig_id')
      .patch(
        upload.fields([{ name: 'sig_signature', maxCount: 1 }]),
        signatureUploadToAzure,
        this.controllers.updateSignature
      )
      .put(this.controllers.updateSignatureStatus);
  }
}
export default AppConfigRoutes;
