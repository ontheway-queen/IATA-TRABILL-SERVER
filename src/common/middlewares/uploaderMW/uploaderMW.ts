import { NextFunction, Request, Response } from 'express';
import AbstractUploader from '../../../abstracts/abstract.uploader';
import Uploader from '../../../common/utils/uploaders/uploaders';
import Constants from '../../../modules/passportMGT/utils/constants';
import CustomError from '../../utils/errors/customError';
import { TSubFolder } from '../types/MWTypes';

class UploaderMW extends AbstractUploader {
  private uploader: Uploader;

  constructor() {
    super();

    this.uploader = new Uploader(this.allowed_file_types, this.error_message);
  }

  public imageUpload(subfolder_path: TSubFolder) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const upload = this.uploader.memmoryStorage();

      upload.fields(Constants.fields(15))(req, res, (err) => {
        if (err) {
          next(new CustomError(err.message, 500, 'Upload failed'));
        } else {
          this.azure.imageUpload(subfolder_path)(req, res, next);
        }
      });
    };
  }

  public rawUpload(folder: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const upload = this.uploader.rawUpload(folder);

      upload.fields(Constants.fields(15))(req, res, (err) => {
        if (err) {
          next(new CustomError(err.message, 500, 'Upload failed'));
        } else {
          req.upFolder = folder;

          next();
        }
      });
    };
  }
}

export default UploaderMW;
