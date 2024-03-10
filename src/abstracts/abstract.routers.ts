import { Router } from 'express';
import UploaderMW from '../common/middlewares/uploaderMW/uploaderMW';

abstract class AbstractRouter {
  readonly routers = Router();
  protected uploader = new UploaderMW();
}

export default AbstractRouter;
