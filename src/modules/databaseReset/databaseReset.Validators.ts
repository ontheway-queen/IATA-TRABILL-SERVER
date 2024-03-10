import AbstractValidator from '../../abstracts/abstract.validators';

class DatabaseResetValidators extends AbstractValidator {
  database = [this.permissions.check(this.resources.database_backup, 'create')];
}

export default DatabaseResetValidators;
