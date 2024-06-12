import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import { allowAllFileTypes, rootFileFolder } from './uploaderConstants';
import CustomError from '../../utils/errors/customError';
import config from '../../../config/config';
import AbstractUploader from '../../../abstracts/abstract.uploader';

class Uploader extends AbstractUploader {
  constructor() {
    super();
  }

  // cloud upload raw
  public cloudUploadRaw(folder: string, types: string[] = allowAllFileTypes) {
    return (req: Request, res: Response, next: NextFunction): void => {
      req.upFiles = [];
      const upload = multer({
        storage: multerS3({
          acl: 'public-read',
          s3: this.s3Client,
          bucket: config.AWS_S3_BUCKET,
          metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
            const fileWithFolder =
              folder +
              '/' +
              Date.now() +
              '-' +
              Math.round(Math.random() * 1e9) +
              path.extname(file.originalname);

            file.filename = fileWithFolder;
            req.upFiles.push(fileWithFolder);
            cb(null, `${rootFileFolder}/${fileWithFolder}`);
          },
        }),
        fileFilter: function (_req, file, cb) {
          // Check allowed extensions
          if (types.includes(file.mimetype)) {
            cb(null, true); // no errors
          } else {
            cb(
              new Error(
                'File mimetype is not allowed' + ' for ' + file.fieldname
              )
            );
          }
        },
      });

      upload.any()(req, res, (err) => {
        console.log(req.files);
        if (err) {
          next(new CustomError(err.message, 500, 'Bad request'));
        } else {
          next();
        }
      });
    };
  }
}

export default Uploader;
