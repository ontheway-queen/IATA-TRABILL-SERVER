import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class RoomTypesValidator extends AbstractValidator {
  readRoomTypes = [this.permissions.check(this.resources.room_types, 'read')];
  deleteRoomTypes = [
    this.permissions.check(this.resources.room_types, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createRoomTypes = [
    this.permissions.check(this.resources.room_types, 'create'),
    check('rtype_name')
      .isLength({ max: 85 })
      .withMessage('Room type name can be at most 85 characters.'),
  ];

  editRoomTypes = [
    this.permissions.check(this.resources.room_types, 'update'),
    check('rtype_name')
      .isLength({ max: 85 })
      .withMessage('Room type name can be at most 85 characters.'),
  ];
}

export default RoomTypesValidator;
