import { Router } from 'express';
import Uploader from '../common/middlewares/uploader/uploader';
import FileFolders from '../miscellaneous/fileFolder';

abstract class AbstractRouter {
  readonly routers = Router();
  protected uploader = new Uploader();
  protected fileFolder = FileFolders;
}

export default AbstractRouter;
