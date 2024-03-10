import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class MahramValidator extends AbstractValidator {
  readMahram = [this.permissions.check(this.resources.maharam, 'read')];
  deleteMahram = [
    this.permissions.check(this.resources.maharam, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  createMahram = [
    this.permissions.check(this.resources.maharam, 'create'),
    check('maharam_name')
      .notEmpty()
      .withMessage('Must enter maharam_name')
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('maharam_created_by')
      .notEmpty()
      .withMessage('Must enter a value')
      .isInt()
      .withMessage('Enter numeric value'),
  ];

  editMahram = [
    this.permissions.check(this.resources.maharam, 'update'),
    check('maharam_name')
      .optional(true)
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
  ];
}

export default MahramValidator;
