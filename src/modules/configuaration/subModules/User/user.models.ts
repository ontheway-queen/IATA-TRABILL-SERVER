import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import { UserReqBody } from '../../types/configuration.interfaces';
import {
  ICreateUser,
  IUpdateUser,
  IUpdateUserAdmin,
  userRoleType,
} from './user.interfaces';

class UserModel extends AbstractModels {
  // role permission
  public async addRole({
    role_name,
    role_permissions,
    user_role,
  }: UserReqBody) {
    const role = await this.query()
      .insert({
        role_user_type: user_role,
        role_name,
        role_permissions,
        org_agency: this.org_agency,
      })
      .into('trabill_user_roles');

    return role[0];
  }

  public async checkUserRoleIsExist(role_name: string) {
    const role = await this.query()
      .select('role_name')
      .from('trabill_user_roles')
      .where('org_agency', this.org_agency)
      .andWhere('role_name', role_name)
      .andWhereNot('role_is_deleted', 1);

    return role[0];
  }

  public async viewRoles(page: idType = 1, size: idType = 20) {
    page = Number(page);
    size = Number(size);
    const page_number = (page - 1) * size;

    const data = await this.query()
      .select(
        'role_id',
        'role_name',
        'role_is_developer',
        'role_is_super_developer',
        'role_status'
      )
      .from('trabill_user_roles')
      .where('org_agency', this.org_agency)
      .andWhereNot('role_is_deleted', 1)
      .orderBy('role_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_user_roles')
      .where('org_agency', this.org_agency)
      .andWhereNot('role_is_deleted', 1);

    return { count: row_count, data };
  }

  // users
  public async createUser(userInfo: ICreateUser) {
    const [user_id] = await this.query()
      .insert({ ...userInfo, user_agency_id: this.org_agency })
      .into('trabill_users');

    if (!user_id) {
      throw new CustomError(
        'User cannot create with this data',
        400,
        'User cannot create'
      );
    }

    return user_id;
  }
  public async createAgencyUser(userInfo: ICreateUser) {
    const [user_id] = await this.query().insert(userInfo).into('trabill_users');

    if (!user_id) {
      throw new CustomError(
        'User cannot create with this data',
        400,
        'User cannot create'
      );
    }

    return user_id;
  }

  public async viewUsers(page: number, size: number) {
    const page_number = (page - 1) * size;
    return await this.query()
      .select('*')
      .from('trabill.all_users')
      .where('user_agency_id', this.org_agency)
      .limit(size)
      .offset(page_number);
  }

  public async countUsers() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill.all_users')
      .where('user_agency_id', this.org_agency);

    return count.row_count;
  }

  public async getAllUsers() {
    return await this.query()
      .select('*')
      .from('trabill.all_users')
      .where('user_agency_id', this.org_agency);
  }

  public async getUser(userId: idType) {
    const [user] = await this.query()
      .select(
        'user_first_name',
        'user_last_name',
        'user_username',
        'user_email',
        'user_dial_code',
        'user_mobile',
        'user_role_id'
      )
      .from('trabill_users')
      .where('user_agency_id', this.org_agency)
      .andWhere('user_id', userId);

    return user;
  }

  getUserPassword = async (userId: string) => {
    const [user] = await this.query()
      .select('user_password as user_curr_pass', 'user_email')
      .from('trabill_users')
      .where('user_agency_id', this.org_agency)
      .andWhere('user_id', userId);

    if (!user) {
      throw new CustomError(
        'Pleace provide valid user id',
        400,
        'Invalid user id'
      );
    }
    return user as { user_curr_pass: string; user_email: string };
  };

  public async updateUser(userInfo: IUpdateUser, userId: idType) {
    return await this.query()
      .update(userInfo)
      .into('trabill_users')
      .where('user_agency_id', this.org_agency)
      .andWhere('user_id', userId);
  }
  public async updateAgencyUser(userInfo: IUpdateUserAdmin, agency_id: idType) {
    return await this.query()
      .update(userInfo)
      .from('trabill_users')
      .where('user_agency_id', agency_id);
  }

  public async deleteUser(userId: idType) {
    return await this.query()
      .update({ user_is_deleted: 1 })
      .into('trabill_users')
      .whereNotIn('user_role', ['SUPER_ADMIN', 'DEV_ADMIN'])
      .where('user_agency_id', this.org_agency)
      .andWhere('user_id', userId);
  }

  public async resetUserPassword(password: string, user_id: string | number) {
    const success = await this.query()
      .update({ user_password: password })
      .into('trabill_users')
      .where('user_id', user_id);
  }

  public async getSingleUser(username: string) {
    const user = await this.query()
      .select('user_role_id')
      .from('trabill_users')
      .join(
        'trabill_user_roles',
        'trabill_users.user_role_id',
        'trabill_user_roles.role_id'
      )
      .where('user_agency_id', this.org_agency)
      .andWhere('user_username', username)
      .andWhereNot('user_is_deleted', 1);

    return user[0];
  }

  getRoleById = async (roleId: idType) => {
    const [data] = await this.query()
      .select('role_name', 'role_permissions', 'role_user_type')
      .from('trabill_user_roles')
      .where('role_id', roleId);
    return data;
  };

  getUserRoleName = async (roleId: idType) => {
    const [data] = await this.query()
      .select('role_name', 'role_user_type')
      .from('trabill_user_roles')
      .where('role_id', roleId);
    return data as {
      role_name: string;
      role_user_type: userRoleType;
    };
  };

  deleteRole = async (roleId: idType, role_deleted_by: idType) => {
    await this.query()
      .update({ role_is_deleted: 1, role_deleted_by })
      .into('trabill_user_roles')
      .where('role_id', roleId);
  };
}

export default UserModel;
