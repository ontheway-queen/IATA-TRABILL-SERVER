import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { idType } from '../../../common/types/common.types';
import CreatePayroll from './narrowServices/addPayroll.services';
import DeletePayroll from './narrowServices/deletePayroll.services';
import EditPayroll from './narrowServices/editPayroll.services';

class PayrollServices extends AbstractServices {
  constructor() {
    super();
  }

  public async getAllPayrolls(req: Request) {
    const { page, size, search, from_date, to_date } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.payrollModel(req);

    const data = await conn.getPayroll(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  }

  // get all payroll
  public async getPayrollsById(req: Request) {
    const { id } = req.params as { id: idType };

    const conn = this.models.payrollModel(req);

    const payroll = await conn.getPayrollById(id);
    const payroll_deductions = await conn.getPayrollDeductions(id);

    const data = { ...payroll, payroll_deductions };

    return { success: true, data };
  }

  public async viewEmployeeCommission(req: Request) {
    const { employee_id } = req.params as { employee_id: string };

    const { month } = req.query as { month: string };

    const conn = this.models.payrollModel(req);

    const data = await conn.viewEmployeeCommission(+employee_id, month);

    return { success: true, data };
  }

  public createPayrolls = new CreatePayroll().createPayrollServices;
  public editPayrolls = new EditPayroll().editPayrollServices;
  public deletePayrolls = new DeletePayroll().deletePayrollServices;
}
export default PayrollServices;
