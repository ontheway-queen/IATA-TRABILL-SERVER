import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/errors/customError';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

class FuncWrapper {
  // CONTROLLER ASYNCWRAPPER
  public wrap(cb: Func) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await cb(req, res, next);
      } catch (err: any) {
        console.log({ from: 'funcWrapper', err });

        next(new CustomError(err.message, err.status, err.type));
      }
    };
  }
}

export default FuncWrapper;
