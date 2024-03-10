import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class GroupsValidator extends AbstractValidator {
  readGroup = [this.permissions.check(this.resources.groups, 'read')];
  deleteGroup = [
    this.permissions.check(this.resources.groups, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by ')
      .isInt()
      .withMessage('Deleted By must be an integer value'),
  ];

  createGroup = [
    this.permissions.check(this.resources.groups, 'create'),
    check('group_name')
      .notEmpty()
      .withMessage('Please Enter Group Name ')
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('group_type')
      .isIn(['UMRAH', 'HAJJ'])
      .withMessage('Enter UMRAH or HAJJ '),
    check('group_created_by')
      .isInt()
      .optional(true)
      .withMessage('Enter numeric value'),
    check('group_status')
      .isInt()
      .optional(true)
      .withMessage('Enter numeric value'),
  ];

  editGroup = [
    this.permissions.check(this.resources.groups, 'update'),
    check('group_name')
      .isLength({ max: 75 })
      .optional(true)
      .withMessage('Source title can be at most 75 characters.'),
    check('group_type')
      .isIn(['UMRAH', 'HAJJ'])
      .optional(true)
      .withMessage('Enter UMRAH or HAJJ '),
    check('group_created_by')
      .isInt()
      .optional(true)
      .withMessage('Enter numeric value'),
    check('group_status')
      .isInt()
      .optional(true)
      .withMessage('Enter numeric value'),
  ];
}

export default GroupsValidator;
