import AbstractRouter from '../../../abstracts/abstract.routers';
import PayrollControllers from '../controllers/payroll.controllers';

class PayrollRouters extends AbstractRouter {
  public controllers = new PayrollControllers();
  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.post(
      '/create',
      this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
      this.controllers.createPayroll
    );

    this.routers.route('/payrolls').get(this.controllers.getAllPayroll);

    this.routers
      .route('/payroll/:id')
      .get(this.controllers.getPayrollById)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.editPayroll
      )
      .delete(this.controllers.deletePayroll);

    this.routers.get(
      '/employee-commission/:employee_id',
      this.controllers.viewEmployeeCommission
    );
  }
}
export default PayrollRouters;
