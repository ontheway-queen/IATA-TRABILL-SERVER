import { NextFunction, Request, Response } from 'express';
import { origin } from '../../../miscellaneous/constants';
import CustomError from '../../utils/errors/customError';

class Mini {
  private origins = origin;

  public cors = (
    req_origin: string | undefined,
    cb: (err: Error | null, origin?: string | string[] | undefined) => void
  ): void => {
    const urlRegex = /https?:\/\/([a-z0-9]+[.])*trabill[.]biz/;

    const isReqUrlValid =
      req_origin &&
      (urlRegex.test(req_origin) || this.origins.includes(req_origin));

    if (isReqUrlValid) {
      cb(null, req_origin);
    } else {
      cb(null, this.origins);
    }
  };

  public 404(_req: Request, _res: Response, next: NextFunction) {
    next(new CustomError('Cannot find the route', 404, 'Invalid route'));
  }
}

export default Mini;
