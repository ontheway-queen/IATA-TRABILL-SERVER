import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/errors/customError';
import ManageFile from '../manageFile/manageFile';

interface IcustomError {
  success: boolean;
  message: string;
  type: string;
  status?: number;
}

class ErrorHandler {
  private customError: IcustomError;
  private manageFile: ManageFile;

  constructor() {
    this.customError = {
      success: false,
      message: 'Something went wrong :( please try again later!!',
      type: 'Internal server error!',
    };

    this.manageFile = new ManageFile();
  }

  /**
   * handleErrors
   */
  public handleErrors = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // file removing starts
    const files = req.files as Express.Multer.File[] | [];

    if (files && files.length) {
      const images = files.map((item) => item.filename);
      this.manageFile.deleteFromCloud(images);
    }

    if (err instanceof CustomError) {
      this.customError.message =
        err.message || 'Something went wrong, please try again later!';
      this.customError.type = err.type;
      this.customError.status = err.status;
    } else {
      this.customError.message =
        'Something went wrong, please try again later!';
      this.customError.type = 'Internal Server Error';
    }

    res.status(this.customError.status || 500).json(this.customError);
  };
}

export default ErrorHandler;
