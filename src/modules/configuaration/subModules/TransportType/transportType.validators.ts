import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class TransportTypeValidator extends AbstractValidator {
  readTransportType = [
    this.permissions.check(this.resources.room_types, 'read'),
  ];

  deleteTransportType = [
    this.permissions.check(this.resources.room_types, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted by')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  createTransportType = [
    this.permissions.check(this.resources.room_types, 'create'),
    check('ttype_name')
      .isLength({ max: 85 })
      .withMessage('Room type name can be at most 85 characters.'),

    check('ttype_status').isIn([0, 1]).withMessage('Status must be 0 or 1.'),
  ];

  editTransportType = [
    this.permissions.check(this.resources.room_types, 'update'),
    check('ttype_name')
      .isLength({ max: 85 })
      .withMessage('Room type name can be at most 85 characters.'),

    check('ttype_status').isIn([0, 1]).withMessage('Status must be 0 or 1.'),
  ];
}

export default TransportTypeValidator;
