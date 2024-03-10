import multer from 'multer';
import AbstractRouter from '../../../abstracts/abstract.routers';
import { uploadImageToAzure_trabill } from '../../../common/helpers/ImageUploadToAzure_trabill';
import PassportControllers from '../controllers/passport.controllers';

const storage = multer.memoryStorage();
const upload = multer({ storage });

class PassportRouter extends AbstractRouter {
  private controllers = new PassportControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get(
      '/is-unique-pass-no/:passport_no',
      this.controllers.passportNumberIsUnique
    );

    this.routers
      .route('/')
      .post(
        upload.fields([
          { name: 'passport_scan_copy', maxCount: 1 },
          { name: 'passport_upload_photo', maxCount: 1 },
          { name: 'passport_upload_others', maxCount: 1 },
        ]),
        uploadImageToAzure_trabill,
        this.controllers.addPassport
      )
      .get(this.controllers.allPassports);

    this.routers.get('/view-all', this.controllers.getPassportsForSelect);

    // change passport status
    this.routers
      .route('/status/:passport_id')
      .post(this.controllers.changeStatus)
      .get(this.controllers.getStatus);

    // single passport

    this.routers
      .route('/:passport_id')
      .get(this.controllers.singlePassport)
      .patch(
        upload.fields([
          { name: 'passport_scan_copy', maxCount: 1 },
          { name: 'passport_upload_photo', maxCount: 1 },
          { name: 'passport_upload_others', maxCount: 1 },
        ]),
        uploadImageToAzure_trabill,
        this.controllers.editPassport
      )
      .delete(this.controllers.deletePassport);
  }
}

export default PassportRouter;
