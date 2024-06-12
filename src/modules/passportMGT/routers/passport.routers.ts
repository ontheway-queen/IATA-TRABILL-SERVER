import multer from 'multer';
import AbstractRouter from '../../../abstracts/abstract.routers';
import PassportControllers from '../controllers/passport.controllers';

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
        this.uploader.cloudUploadRaw(this.fileFolder.PASSPORT_FILE),
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
        this.uploader.cloudUploadRaw(this.fileFolder.PASSPORT_FILE),
        this.controllers.editPassport
      )
      .delete(this.controllers.deletePassport);
  }
}

export default PassportRouter;
