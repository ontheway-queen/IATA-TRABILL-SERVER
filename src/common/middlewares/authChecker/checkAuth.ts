import { NextFunction, Request, Response } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { ITokenCreds } from '../../../auth/admin_auth.types';
import CustomError from '../../utils/errors/customError';
import Lib from '../../utils/libraries/lib';

class AuthChecker extends AbstractServices {
  public check = async (req: Request, _res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization?.split(' ')[1];
    const session_id = req.headers.sessionid as string;

    if (bearerToken && session_id) {
      try {
        const authConn = this.models.adminAuthModel(req);

        const data = await authConn.getAccessTokenSecret(session_id);

        if (data) {
          const { login_access_token_secret } = data;

          const userInfo = (await Lib.jwtVerify(
            bearerToken,
            login_access_token_secret
          )) as ITokenCreds;

          req.role_id = userInfo.user_role_id;
          req.user_id = userInfo.user_id;
          req.agency_id = userInfo.user_agency_id;

          // call the next middleware
          next();
        } else {
          await authConn.deleteUserLoginInfo(session_id);
          next(new CustomError('Token expired', 401, 'Token expired'));
        }
      } catch (err) {
        next(
          new CustomError(
            'Cannot give access to this resource as token expired',
            401,
            `Token expired ${session_id}`
          )
        );
      }
    } else {
      next(
        new CustomError(
          'Please provide a token to get access to this resource',
          401,
          `Token empty ${bearerToken}`
        )
      );
    }
  };
}

export default AuthChecker;
