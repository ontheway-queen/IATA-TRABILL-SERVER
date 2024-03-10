import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';

class DeletePayroll extends AbstractServices {
  constructor() {
    super();
  }

  public deletePayrollServices = async (req: Request) => {
    const payrollId = req.params.id as string;

    const { payroll_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.payrollModel(req, trx);

      let {
        previous_net_balance,
        prev_acctrxn_id,
        prev_pay_type,
        prev_payroll_charge_id,
      } = await conn.getPrevTransectionAmount(payrollId);

      if (prev_pay_type !== 4) {
        await new Trxns(req, trx).deleteAccTrxn(prev_acctrxn_id);
      }

      if (prev_pay_type == 4) {
        await conn.deletePrevPayrollCheque(payrollId, payroll_deleted_by);
      }

      if (prev_payroll_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(prev_payroll_charge_id);
      }

      await conn.deletePayroll(payrollId, payroll_deleted_by);

      await conn.deleteAllPayrollDeductions(payrollId, payroll_deleted_by);

      await this.insertAudit(
        req,
        'delete',
        `Payroll has been delete ${previous_net_balance}/-`,
        payroll_deleted_by,
        'PAYROLL'
      );
      return {
        success: true,
        message: 'Payroll deleted successfuly',
      };
    });
  };
}
export default DeletePayroll;
