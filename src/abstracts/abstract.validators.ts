import CheckPermissions from '../common/middlewares/permissions/role.permissions';
import { Resources } from '../common/types/common.types';

abstract class AbstractValidator {
  protected permissions = new CheckPermissions();
  protected resources = Resources;
}

export default AbstractValidator;
