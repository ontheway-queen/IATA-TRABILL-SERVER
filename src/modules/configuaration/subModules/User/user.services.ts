import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import Lib from '../../../../common/utils/libraries/lib';
import { ICreateUser, IUpdateUser, IUser } from './user.interfaces';

class UserServices extends AbstractServices {
  constructor() {
    super();
  }

  public viewRoles = async (req: Request) => {
    const { page, size } = req.query as { page: idType; size: idType };

    const data = await this.models.configModel
      .userModel(req)
      .viewRoles(page, size);

    return { success: true, ...data };
  };

  // CREATE USER
  public async createUser(req: Request) {
    const {
      password,
      user_dial_code,
      user_email,
      user_first_name,
      user_last_name,
      user_role_id,
      user_username,
      user_mobile,
      user_agency_id,
      user_data_percent,
    } = req.body as IUser;

    const user_password = await Lib.hashPass(password);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.configModel.userModel(req, trx);

      const roleName = await conn.getUserRoleName(user_role_id);

      const checkPassword = (password: string) => {
        const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return pattern.test(password);
      };

      if (!checkPassword(password)) {
        throw new CustomError(
          `Password must be minimum 8 character and one special character required`,
          400,
          'Bad request'
        );
      }

      const userInfo: ICreateUser = {
        user_agency_id,
        user_password,
        user_dial_code,
        user_email,
        user_first_name,
        user_last_name,
        user_role_id,
        user_username,
        user_mobile,
        user_data_percent,
        user_role: roleName.role_user_type,
      };

      const user_id = await conn.createUser(userInfo);

      return {
        success: true,
        message: 'User created successfully',
        user_id,
      };
    });
  }

  // UPDATE USER
  public async updateUser(req: Request) {
    const userId = req.params.user_id;

    if (!userId) {
      throw new CustomError('Please provide user id', 400, 'Empty user id');
    }

    const {
      password,
      user_dial_code,
      user_email,
      user_first_name,
      user_last_name,
      user_role_id,
      user_username,
      user_data_percent,
      user_mobile,
      current_password,
    } = req.body as IUser;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.configModel.userModel(req, trx);

      const roleName = await conn.getUserRoleName(user_role_id);

      let user_password = undefined;
      if (password) {
        const checkPassword = (password: string) => {
          const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
          return pattern.test(password);
        };

        if (!checkPassword(password)) {
          throw new CustomError(
            `Password must be minimum 8 character and one special character required`,
            400,
            'Bad request'
          );
        }

        user_password = await Lib.hashPass(password);
        const { user_curr_pass } = await conn.getUserPassword(userId);

        await Lib.checkPassword(current_password as string, user_curr_pass);
      }

      const userInfo: IUpdateUser = {
        user_password,
        user_dial_code,
        user_email,
        user_first_name,
        user_last_name,
        user_role_id,
        user_username,
        user_mobile,
        user_data_percent,
        user_role: roleName.role_user_type,
      };

      await conn.updateUser(userInfo, userId);

      return { success: true, message: 'User has been updated' };
    });
  }

  public async deleteUser(req: Request) {
    const userId = req.params.user_id;

    const conn = this.models.configModel.userModel(req);

    await conn.deleteUser(userId);

    return {
      success: true,
      message: 'User has been deleted',
    };
  }

  // RESET USER PASSWORD
  public async resetUserPassword(req: Request) {
    const { user_id } = req.params;

    const { current_user_email, password } = req.body;
    const conn = this.models.configModel.userModel(req);

    const { user_email } = await conn.getUserPassword(user_id);
    if (current_user_email !== user_email) {
      throw new CustomError('Incorrect email address', 400, 'Invalid email');
    }

    if (password) {
      const checkPassword = (password: string) => {
        const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return pattern.test(password);
      };

      if (!checkPassword(password)) {
        throw new CustomError(
          `Password must be minimum 8 charecter and one special charecter required`,
          400,
          'Bad request'
        );
      }
    }

    const hashedPass = await Lib.hashPass(password);

    await conn.resetUserPassword(hashedPass, user_id);

    return {
      success: true,
      message: 'Resetting password of super admin was successfull',
    };
  }
  // RESET USER PASSWORD
  public async changePassword(req: Request) {
    const { user_id } = req.params;

    const { current_password, new_password } = req.body;
    const conn = this.models.configModel.userModel(req);

    if (new_password) {
      const checkPassword = (password: string) => {
        const pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return pattern.test(password);
      };

      if (!checkPassword(new_password)) {
        throw new CustomError(
          `Password must be minimum 8 charecter and one special charecter required`,
          400,
          'Bad request'
        );
      }
    }

    const { user_curr_pass } = await conn.getUserPassword(user_id);

    await Lib.checkPassword(current_password, user_curr_pass);

    const hashedPass = await Lib.hashPass(new_password);

    await conn.resetUserPassword(hashedPass, user_id);

    return {
      success: true,
      message: 'Changing password of super admin was successfull',
    };
  }

  public viewUsers = async (req: Request) => {
    const { page, size } = req.query;

    const users = await this.models.configModel
      .userModel(req)
      .viewUsers(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel.userModel(req).countUsers();

    return { success: true, count, data: users };
  };
  public getAllUsers = async (req: Request) => {
    const users = await this.models.configModel.userModel(req).getAllUsers();

    return { success: true, data: users };
  };

  public getUserById = async (req: Request) => {
    const userId = req.params.user_id;

    const users = await this.models.configModel.userModel(req).getUser(userId);

    return { success: true, data: users };
  };

  public addRole = async (req: Request) => {
    const { role_name } = req.body;

    const is_exist = await this.models.configModel
      .userModel(req)
      .checkUserRoleIsExist(role_name);

    if (is_exist) {
      throw new CustomError(
        `This role name alrady exist, enter unique name`,
        400,
        'Bad request'
      );
    }

    const role_id = await this.models.configModel
      .userModel(req)
      .addRole(req.body);

    return { success: true, data: { role_id } };
  };

  public checkUserRoleIsExist = async (req: Request) => {
    const { role_name } = req.params as { role_name: string };

    const role = await this.models.configModel
      .userModel(req)
      .checkUserRoleIsExist(role_name);

    return {
      success: true,
      message: role ? 'Role name alrady exist' : 'Role name. is uniqe',
      data: {
        is_uniqe: role ? true : false,
      },
    };
  };

  public getRoleById = async (req: Request) => {
    const roleId = req.params.role_id as string;

    const data = await this.models.configModel
      .userModel(req)
      .getRoleById(roleId);

    return { success: true, data };
  };

  public deleteRole = async (req: Request) => {
    const roleId = req.params.role_id as string;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .userModel(req)
      .deleteRole(roleId, deleted_by);

    return { success: true, data };
  };
}

export default UserServices;
