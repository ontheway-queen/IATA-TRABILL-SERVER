export interface ITokenCreds {
  user_username: string;
  user_full_name: string;
  user_role_id: number;
  user_id: number;
  user_agency_id: number;
}

export interface IUser {
  user_role_id: number;
  user_agency_id: number;
  user_username: string;
  user_full_name: string;
  user_password: string;
  user_id: number;
  role_name: number;
  role_permissions: string;
  user_role?: 'SUPER_ADMIN' | 'DEV_ADMIN' | 'EMPLOYEE';
  org_is_active?: 0 | 1;
  org_subscription_expired: string;
  role_user_type?: string;
  org_module_type?: 'TRABILL' | 'REC';
}

export interface PermissionData {
  role_name: string;
  role_permissions: string;
}

export interface ILoginInfo {
  login_user_id: number;
  login_ip_address: string;
  login_session_id: string;
  login_access_token_secret: string;
  login_refresh_token_secret: string;
  login_last_refresh_token: string;
  login_last_access_token: string;
}

export interface ILoginHistory {
  login_user_id: number;
  login_ip_address: string;
}

export interface ITokens {
  ipAddress: string | null;
  accessTokenSecret: string | null;
  refreshTokenSecret: string | null;
  refreshToken: string | null;
  accessToken: string | null;
}
