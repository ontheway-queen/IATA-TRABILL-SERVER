import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class ProductsValidator extends AbstractValidator {
  readProduct = [this.permissions.check(this.resources.products, 'read')];
  deleteProduct = [
    this.permissions.check(this.resources.products, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createProducts = [
    this.permissions.check(this.resources.products, 'create'),
    check('product_name')
      .isLength({ max: 65 })
      .withMessage('Product name can be at most 65 characters.'),
    check('product_category_id')
      .isInt()
      .notEmpty()
      .withMessage('Product category id must be provided.'),
    check('product_starting_from')
      .isLength({ max: 20 })
      .withMessage('Product starting from can be at most 20 characters.'),
    check('product_created_by')
      .isInt()
      .notEmpty()
      .withMessage('Product must be created.'),
  ];

  editProducts = [
    this.permissions.check(this.resources.products, 'update'),
    check('product_name')
      .isLength({ max: 65 })
      .withMessage('Product name can be at most 65 characters.'),
    check('product_category_id')
      .isInt()
      .optional(true)
      .withMessage('Product category id must be provided.'),
    check('product_starting_from')
      .isLength({ max: 20 })
      .withMessage('Product starting from can be at most 20 characters.'),
    check('product_created_by')
      .isInt()
      .optional(true)
      .withMessage('Product must be created.'),
  ];

  createProductCategory = [
    this.permissions.check(this.resources.products, 'create'),
    check('category_title')
      .isLength({ max: 55 })
      .withMessage('Category title can be at most 55 characters.'),
    check('category_created_by')
      .isInt()
      .notEmpty()
      .withMessage('Category must be created.'),
  ];

  editProductCategory = [
    this.permissions.check(this.resources.products, 'update'),
    check('category_title')
      .isLength({ max: 55 })
      .withMessage('Category title can be at most 55 characters.'),
    check('category_created_by')
      .isInt()
      .optional(true)
      .withMessage('Category must be created.'),
  ];
}

export default ProductsValidator;
