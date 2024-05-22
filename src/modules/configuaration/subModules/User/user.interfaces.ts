export interface IUser {
  user_first_name: string;
  user_last_name?: string;
  user_username: string;
  user_email: string;
  user_dial_code?: string;
  user_mobile?: string;
  user_role_id: number;
  current_password?: string;
  password: string;
  user_agency_id: number;
  user_data_percent: number | null;
  user_role: userRoleType;
}
export interface ICreateUser
  extends Omit<IUser, 'current_password' | 'password'> {
  user_password: string;
}

export interface IUpdateUser
  extends Omit<IUser, 'current_password' | 'password' | 'user_agency_id'> {
  user_password: string | undefined;
}

export interface IUpdateUserAdmin {
  user_first_name: string;
  user_last_name: string;
  user_username?: string;
  user_email: string;
  user_dial_code?: string;
  user_mobile?: string;
  user_password?: string;
}

export type userRoleType =
  | 'EMPLOYEE'
  | 'ACCOUNT'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'DEV_ADMIN';
