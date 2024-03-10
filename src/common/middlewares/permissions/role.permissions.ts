import { AccessControl } from 'accesscontrol';
import { NextFunction, Request, Response } from 'express';
import { db } from '../../../app/database';
import AdminAuthModel from '../../../auth/admin_auth.models';
import { Resources } from '../../types/common.types';
import CustomError from '../../utils/errors/customError';

type Action = 'create' | 'read' | 'update' | 'delete';

class CheckPermissions {
  public check =
    (resource_name: Resources, action: Action) =>
    (req: Request, _res: Response, next: NextFunction) => {
      (async () => {
        try {
          const authModel = new AdminAuthModel(db, req);

          const roles = await authModel.getRole(req.role_id || 1);

          if (roles) {
            const { role_name, role_permissions } = roles;

            const ac = new AccessControl(JSON.parse(role_permissions));

            const checkPerm = ac.can(role_name)[action](resource_name);

            if (checkPerm.granted) {
              next();
            } else {
              next(
                new CustomError(
                  'You are not Authorized for this action',
                  403,
                  'Unauthorized user'
                )
              );
            }
          } else {
            next(
              new CustomError(
                'Cannot find any role for this Id',
                400,
                'Role not found'
              )
            );
          }
        } catch (err: any) {
          next(new CustomError(err.message, 500, 'Internal server error'));
        }
      })();
    };
}

export default CheckPermissions;
