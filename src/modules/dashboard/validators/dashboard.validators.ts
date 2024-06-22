import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class DashboardValidators extends AbstractValidator {
  dashboardValidator = [
    this.permissions.check(this.resources.products, 'read'),
    check('type')
      .optional()
      .isIn(['PNR', 'PASSPORT'])
      .withMessage('Please provide valid data'),
  ];

  readAllProducts = [this.permissions.check(this.resources.products, 'read')];

  readTotalSales = [
    this.permissions.check(this.resources.sales_report, 'read'),
  ];

  uploadBSP = [];
}
export default DashboardValidators;
