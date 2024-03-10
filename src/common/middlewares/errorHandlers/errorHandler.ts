import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/errors/customError';
import DeleteFile from '../../utils/fileRemover/deleteFIle';

interface IcustomError {
  success: boolean;
  message: string;
  type: string;
  status?: number;
}

class ErrorHandler {
  private customError: IcustomError;
  private deleteFile: DeleteFile;

  constructor() {
    this.customError = {
      success: false,
      message: 'Something went wrong :( please try again later!!',
      type: 'Internal server error!',
    };

    this.deleteFile = new DeleteFile();
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
    const files = req.upFiles;
    const folder = req.upFolder;
    const image_files = req.image_files;

    if (files) {
      this.deleteFile.delete(folder, files);
    }

    // if (image_files) {
    //   this.deleteFile.delete_image(image_files);
    // }
    // file removing ends

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
