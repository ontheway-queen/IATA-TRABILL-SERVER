import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxnUpdate } from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  ICreatePayroll,
  IEditPayrollDeduction,
  IPayrollCheque,
  IPayrollDeductions,
  IPayrollEditReqBody,
} from '../../types/payroll.interfaces';

class EditPayroll extends AbstractServices {
  constructor() {
    super();
  }
  public editPayrollServices = async (req: Request) => {
    const {
      payroll_employee_id,
      payroll_account_id,
      payroll_pay_type,
      payroll_salary,
      payroll_deductions,
      payroll_mobile_bill,
      payroll_food_bill,
      payroll_bonus,
      payroll_commission,
      payroll_fastival_bonus,
      payroll_ta,
      payroll_advance,
      payroll_net_amount,
      payroll_date,
      payroll_note,
      payroll_cheque_no,
      payroll_bank_name,
      cheque_withdraw_date,
      payroll_updated_by,
      payroll_accommodation,
      payroll_attendance,
      payroll_health,
      payroll_incentive,
      payroll_provident,
      payroll_transection_charge,
      gross_salary,
      daily_salary,
      payroll_profit_share,
      payroll_other1,
      payroll_other2,
      payroll_other3,
      payment_month,
    } = req.body as IPayrollEditReqBody;

    const payrollId = req.params.id as string;

    const imageList = req.imgUrl;

    const imageUrlObj: {
      payroll_image_url: string;
    } = Object.assign({}, ...imageList);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.payrollModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      let {
        previous_net_balance,
        prev_pay_type,
        prev_acctrxn_id,
        prev_payroll_charge_id,
      } = await conn.getPrevTransectionAmount(payrollId);

      if (imageUrlObj.payroll_image_url) {
        const data = await conn.payrollImagesUrl(payrollId);
        await this.deleteFile.delete_image(data?.payroll_image_url as string);
      }

      const payrollData = {
        payroll_employee_id,
        payroll_account_id,
        payroll_pay_type,
        payment_month,
        gross_salary,
        daily_salary,
        payroll_profit_share: payroll_profit_share || 0,
        payroll_salary: payroll_salary || 0,
        payroll_mobile_bill: payroll_mobile_bill || 0,
        payroll_food_bill: payroll_food_bill || 0,
        payroll_bonus: payroll_bonus || 0,
        payroll_commission: payroll_commission || 0,
        payroll_fastival_bonus: payroll_fastival_bonus || 0,
        payroll_ta: payroll_ta || 0,
        payroll_advance: payroll_advance || 0,
        payroll_accommodation: payroll_accommodation || 0,
        payroll_attendance: payroll_attendance || 0,
        payroll_health: payroll_health || 0,
        payroll_incentive: payroll_incentive || 0,
        payroll_provident: payroll_provident || 0,
        payroll_other1: payroll_other1 || 0,
        payroll_other2: payroll_other2 || 0,
        payroll_other3: payroll_other3 || 0,
        payroll_net_amount,
        payroll_date,
        payroll_note,
        payroll_updated_by,
        ...imageUrlObj,
      };

      let payroll_acctrxn_id;

      if (payroll_pay_type !== 4) {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: payroll_account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_amount: payroll_net_amount,
          acctrxn_created_at: payroll_date as string,
          acctrxn_created_by: payroll_updated_by as number,
          acctrxn_note: payroll_note,
          acctrxn_particular_id: 60,
          acctrxn_particular_type: 'payroll ',
          acctrxn_pay_type: 'CASH',
          trxn_id: prev_acctrxn_id,
        };

        payroll_acctrxn_id = await trxns.AccTrxnUpdate(AccTrxnBody);
      } else {
        if (prev_pay_type !== 4) {
          await trxns.deleteAccTrxn(prev_acctrxn_id);
        }
      }

      if (payroll_pay_type == 4) {
        if (prev_pay_type === 4) {
          await conn.deletePrevPayrollCheque(
            payrollId,
            payroll_updated_by as number
          );
        }

        const chequeInfo: IPayrollCheque = {
          pcheque_payroll_id: Number(payrollId),
          pcheque_amount: payroll_net_amount,
          pcheque_number: payroll_cheque_no as number,
          pcheque_bank_name: payroll_bank_name as string,
          pcheque_withdraw_date: cheque_withdraw_date as string,
          pcheque_status: 'PENDING',
        };

        await conn.insertPayrollCheque(chequeInfo);
      }

      let payroll_charge_id: number | null = null;
      if (payroll_pay_type === 3 && payroll_transection_charge) {
        if (prev_payroll_charge_id) {
          await vendor_conn.updateOnlineTrxnCharge(
            {
              charge_amount: payroll_transection_charge,
              charge_purpose: 'Payroll',
              charge_note: payroll_note,
            },
            prev_payroll_charge_id
          );
        } else {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_from_acc_id: payroll_account_id,
            charge_amount: payroll_transection_charge,
            charge_purpose: `Payroll`,
            charge_note: payroll_note as string,
          };
          payroll_charge_id = await vendor_conn.insertOnlineTrxnCharge(
            online_charge_trxn
          );
        }
      } else if (
        prev_pay_type === 3 &&
        payroll_pay_type !== 3 &&
        prev_payroll_charge_id
      ) {
        await vendor_conn.deleteOnlineTrxnCharge(prev_payroll_charge_id);
      }

      const deductions: IEditPayrollDeduction[] =
        JSON.parse(payroll_deductions);

      if (payroll_deductions.length) {
        const deductionInfo: IPayrollDeductions[] = [];
        for (const deduction of deductions) {
          const { pd_amount, pd_reason, pd_id, is_deleted } = deduction;

          if (is_deleted && is_deleted === 1) {
            await conn.deletePayrollDeduction(pd_id);
          } else {
            if (pd_id) {
              await conn.updatePayrollDeduction(
                { pd_amount, pd_reason },
                pd_id
              );
            } else {
              deductionInfo.push({
                pd_payroll_id: +payrollId,
                pd_amount,
                pd_reason,
              });
            }
          }
        }

        if (deductionInfo.length)
          await conn.createPayrollDeductions(deductionInfo);
      }

      const payrollNewData = {
        ...payrollData,
        payroll_acctrxn_id,
        payroll_charge_id,
      };

      await conn.updatePayroll(payrollId, payrollNewData as ICreatePayroll);

      await this.insertAudit(
        req,
        'update',
        `UPDATED PAYROLL, SALARY BDT ${previous_net_balance}/- TO ${payroll_net_amount}/-`,
        payroll_updated_by as number,
        'PAYROLL'
      );
      return {
        success: true,
        message: 'Payroll updated successfully',
      };
    });
  };
}
export default EditPayroll;
