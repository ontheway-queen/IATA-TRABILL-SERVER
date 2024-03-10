import multer from 'multer';
import AbstractRouter from '../../../../abstracts/abstract.routers';
import { uploadImageToAzure_trabill } from '../../../../common/helpers/ImageUploadToAzure_trabill';
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
      .route('/')
      .get(this.controllers.getAllOffice)
      .post(this.controllers.createOffice);

    this.routers.get('/view_all', this.controllers.viewAllOffice);

    // This for Get all client based on manpower
    this.routers
      .route('/all-client/:office_id')
      .get(this.controllers.getAllClientByOffice);

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

    this.routers
      .route('/:office_id')
      .get(this.controllers.getAllOfficeForEdit)
      .patch(this.controllers.editOffice)
      .delete(this.controllers.deleteOffice);
  }
}
export default AppConfigRoutes;
