import { v4 as uuidv4 } from 'uuid';
import Lib from '../common/utils/libraries/lib';
import { ILoginInfo } from './admin_auth.types';

type TokenCreds = {
  user_username: string;
  user_full_name: string;
  user_role_id: number;
  user_id: number;
  user_agency_id: number;
};

class AuthUtil {
  public static async generateTokens(tokenCreds: TokenCreds, ip: string) {
    const newRefreshKey = await Lib.genKey();
    const newRefreshToken = Lib.createToken(tokenCreds, newRefreshKey, '7d');

    const newAccessKey = await Lib.genKey();
    const newAccessToken = Lib.createToken(tokenCreds, newAccessKey, '7d');

    const session_id = uuidv4();

    const loginInfo: ILoginInfo = {
      login_user_id: tokenCreds.user_id,
      login_ip_address: ip,
      login_session_id: session_id,
      login_access_token_secret: newAccessKey,
      login_refresh_token_secret: newRefreshKey,
      login_last_refresh_token: newRefreshToken,
      login_last_access_token: newAccessToken,
    };

    return {
      loginInfo,
      newAccessKey,
      newAccessToken,
      newRefreshKey,
      newRefreshToken,
      session_id,
    };
  }
}

export default AuthUtil;
