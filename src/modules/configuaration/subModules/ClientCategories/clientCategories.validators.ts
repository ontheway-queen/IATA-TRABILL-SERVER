import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class ClientCategoryValidator extends AbstractValidator {
  readClientCategory = [this.permissions.check(this.resources.clients, 'read')];

  deleteClientCategory = [
    this.permissions.check(this.resources.client_category, 'delete'),
  ];

  createClientCategory = [
    this.permissions.check(this.resources.client_category, 'create'),
    check('category_title')
      .isLength({ max: 65 })
      .withMessage('Category title can be at most 65 characters.'),
    check('category_prefix')
      .isLength({ max: 10 })
      .withMessage('Category title can be at most 10 characters.'),
  ];

  editClientCategory = [
    this.permissions.check(this.resources.client_category, 'update'),
    check('category_title')
      .isLength({ max: 65 })
      .withMessage('Category title can be at most 65 characters.'),
    check('category_prefix')
      .isLength({ max: 10 })
      .withMessage('Category title can be at most 10 characters.'),
    check('category_created_by')
      .isInt()
      .optional(true)
      .withMessage('Category title can be at most 20 characters.'),
  ];
}

export default ClientCategoryValidator;
