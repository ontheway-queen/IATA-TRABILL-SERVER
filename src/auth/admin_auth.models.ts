import AbstractModels from '../abstracts/abstract.models';
import { idType } from '../common/types/common.types';
import CustomError from '../common/utils/errors/customError';
import {
  ILoginHistory,
  ILoginInfo,
  ITokens,
  IUser,
  PermissionData,
} from './admin_auth.types';

class AdminAuthModel extends AbstractModels {
  public async getUserById(user_id: number) {
    return (
      ((await this.query()
        .select(
          'user_role_id',
          'role_user_type',
          'org_is_active',
          'user_agency_id',
          'user_role',
          'user_username',
          'user_first_name',
          'user_last_name',
          'org_subscription_expired',
          this.db.raw(
            "concat(user_first_name, ' ', user_last_name) AS user_full_name"
          ),
          'user_password',
          'user_id',
          'trabill_user_roles.role_name',
          'trabill_user_roles.role_permissions',
          'role_name'
        )
        .from('trabill_users')
        .leftJoin('trabill_user_roles', {
          'trabill_users.user_role_id': 'trabill_user_roles.role_id',
        })
        .leftJoin('trabill_agency_organization_information', {
          org_id: 'user_agency_id',
        })
        .where({ user_id })
        .andWhereNot('user_is_deleted', 1)) as IUser[]) || []
    );
  }

  public async getPasswordByUserName(username: string) {
    const [user] = await this.query()
      .select(
        'user_role_id',
        'org_is_active',
        'user_agency_id',
        'user_role',
        'user_first_name',
        'user_password',
        'user_id'
      )
      .from('trabill_users')
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'user_agency_id',
      })
      .where({ user_username: username })
      .andWhereNot('user_is_deleted', 1);

    if (!user) {
      throw new CustomError(
        'Incorrect username or password',
        401,
        'Unauthorized'
      );
    }

    return user as {
      user_role_id: number;
      org_is_active: number;
      user_agency_id: number;
      user_first_name: string;
      user_password: string;
      user_id: number;
      user_role: 'SUPER_ADMIN' | 'DEV_ADMIN' | 'EMPLOYEE';
    };
  }

  public async getUserByUsername(username: string) {
    const [user] = await this.query()
      .select(
        'user_role_id',
        'role_user_type',
        'org_is_active',
        'user_agency_id',
        'user_role',
        'user_username',
        'user_first_name',
        'user_last_name',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        ),
        'user_password',
        'user_id',
        'trabill_user_roles.role_name',
        'trabill_user_roles.role_permissions',
        'role_name',
        'org_subscription_expired'
      )
      .from('trabill_users')
      .join(
        'trabill_user_roles',
        'trabill_users.user_role_id',
        'trabill_user_roles.role_id'
      )
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'user_agency_id',
      })
      .where({ user_username: username })
      .andWhereNot('user_is_deleted', 1);

    if (!user) {
      throw new CustomError(
        'Incorrect username or password',
        401,
        'Unauthorized'
      );
    }

    return user as IUser;
  }

  public async updateUserLoginInfo(session_id: string, loginInfo: ILoginInfo) {
    return await this.query()
      .update(loginInfo)
      .into('trabill_users_login_info')
      .where({ login_session_id: session_id });
  }

  public async insertUserLoginInfo(loginInfo: ILoginInfo) {
    return await this.query().insert(
      this.db.raw(
        `${this.database}.trabill_users_login_info SET ? ON DUPLICATE KEY UPDATE ?`,
        [loginInfo, loginInfo]
      )
    );
  }

  public async adminPassword() {
    const [{ user_password }] = await this.query()
      .select('user_password')
      .from('trabill_users')
      .where('user_role', 'DEV_ADMIN')
      .andWhereNot('user_is_deleted', 1);

    return user_password;
  }

  public async deleteUserLoginInfo(session_id: string) {
    const data = await this.query()
      .delete()
      .from('trabill_users_login_info')
      .where('login_session_id', session_id);

    return data;
  }

  public async getRefreshTokenSecret(session_id: string) {
    const token = await this.query()
      .select('login_refresh_token_secret')
      .from('trabill_users_login_info')
      .where('login_session_id', session_id);

    const tok = token[0] as
      | {
          login_refresh_token_secret: string;
        }
      | undefined;

    if (tok) {
      return tok.login_refresh_token_secret;
    }

    return;
  }

  public async getAccessTokenSecret(session_id: string) {
    const [token] = await this.query()
      .select('login_access_token_secret')
      .from('trabill_users_login_info')
      .where('login_session_id', session_id);

    return token as
      | {
          login_access_token_secret: string;
        }
      | undefined;
  }

  public async resetUserLoignInfo(user_id: number) {
    return this.query()
      .update({
        login_session_id: null,
        login_last_access_token: null,
        login_last_refresh_token: null,
        login_access_token_secret: null,
        login_refresh_token_secret: null,
      })
      .where({ login_user_id: user_id });
  }

  public async updateUserLoginHistory(loginHistory: ILoginHistory) {
    return await this.query()
      .insert(loginHistory)
      .into('trabill_users_login_history');
  }

  public async getRole(role_id: number) {
    const roles = await this.query()
      .select('role_name', 'role_permissions')
      .from('trabill_user_roles')
      .where('role_id', role_id);

    return roles[0] as PermissionData | undefined;
  }

  public async getLastTokens(session_id: string) {
    const [roles] = await this.query()
      .select(
        'login_ip_address as ipAddress',
        'login_access_token_secret as accessTokenSecret',
        'login_refresh_token_secret as refreshTokenSecret',
        'login_last_refresh_token as refreshToken',
        'login_last_access_token as accessToken'
      )
      .from('trabill_users_login_info')
      .where('login_session_id', session_id);

    if (!roles) {
      throw new CustomError('No token 1', 400, 'User not logged in');
    }

    return roles as ITokens;
  }

  getUserModules = async (agency_id: number) => {
    const data = await this.query()
      .select('module_name', 'module_type')
      .from('trabill_agency_moduls')
      .where('agmod_org_id', agency_id)
      .leftJoin('trabill_modules', { module_id: 'agmod_module_id' });

    return data.map((item) => item.module_type);
  };

  getAgencyInfo = async (agency_id: idType) => {
    const [data] = await this.query()
      .select(
        'org_name',
        'org_owner_email',
        'org_logo',
        'org_address1',
        'org_address2',
        'org_facebook',
        'org_website',
        'org_extra_info',
        'org_mobile_number as org_mobile',
        'org_extra_info',
        'org_logo_width',
        'org_logo_height',
        'org_currency',
        'org_module_type'
      )
      .from('trabill_agency_organization_information')
      .where('org_id', agency_id);

    return data;
  };

  updateUsernameAndPassword = async (email: string, user_password: string) => {
    await this.query()
      .update({ user_password })
      .from('trabill_users')
      .where('user_email', email);
  };
  _updateUserAndPass = async (
    user_username: string,
    user_password: string,
    user_id: idType
  ) => {
    await this.query()
      .update({ user_password, user_username })
      .from('trabill_users')
      .where('user_id', user_id);
  };
}

export default AdminAuthModel;
