import multer from 'multer';
import AbstractRouter from '../../../abstracts/abstract.routers';
import PayrollControllers from '../controllers/payroll.controllers';
import { uploadImageToAzure_trabill } from '../../../common/helpers/ImageUploadToAzure_trabill';

const storage = multer.memoryStorage();
const upload = multer({ storage });
class PayrollRouters extends AbstractRouter {
  public controllers = new PayrollControllers();
  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.post(
      '/create',
      upload.fields([{ name: 'payroll_image_url', maxCount: 1 }]),
      uploadImageToAzure_trabill,
      this.controllers.createPayroll
    );

    this.routers.route('/payrolls').get(this.controllers.getAllPayroll);

    this.routers
      .route('/payroll/:id')
      .get(this.controllers.getPayrollById)
      .patch(
        upload.fields([{ name: 'payroll_image_url', maxCount: 1 }]),
        uploadImageToAzure_trabill,
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
