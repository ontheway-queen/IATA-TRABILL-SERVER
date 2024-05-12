import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import {
  ICreatePayroll,
  IPayrollCheque,
  IPayrollDeductions,
  IPayrollReqBody,
} from '../../types/payroll.interfaces';
import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';

class CreatePayroll extends AbstractServices {
  constructor() {
    super();
  }
  public createPayrollServices = async (req: Request) => {
    const imageList = req.imgUrl;

    const imageUrlObj: {
      payroll_image_url: string;
    } = Object.assign({}, ...imageList);

    const {
      payroll_employee_id,
      payroll_account_id,
      payroll_pay_type,
      payroll_salary,
      payroll_deductions,
      payroll_mobile_bill,
      payroll_transection_no,
      payroll_transection_charge,
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
      cheque_withdraw_date,
      payroll_bank_name,
      payroll_created_by,
      payroll_accommodation,
      payroll_attendance,
      payroll_health,
      payroll_incentive,
      payroll_provident,
      gross_salary,
      daily_salary,
      payroll_profit_share,
      payment_month,
      payroll_other1,
      payroll_other2,
      payroll_other3,
    } = req.body as IPayrollReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.payrollModel(req, trx);
      const trxns = new Trxns(req, trx);

      const payroll_vouchar_no = generateVoucherNumber(7, 'PR');

      let payroll_charge_id: number | null = null;
      if (payroll_pay_type === 3 && payroll_transection_charge) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: payroll_account_id,
          charge_amount: payroll_transection_charge,
          charge_purpose: `Payroll`,
          charge_note: payroll_note as string,
        };
        payroll_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      // common for payroll
      const payrollData: ICreatePayroll = {
        payment_month,
        gross_salary,
        daily_salary,
        payroll_profit_share,
        payroll_vouchar_no,
        payroll_employee_id,
        payroll_account_id,
        payroll_pay_type,
        payroll_salary,
        payroll_mobile_bill,
        payroll_transection_no,
        payroll_transection_charge,
        payroll_charge_id,
        payroll_food_bill,
        payroll_bonus,
        payroll_commission,
        payroll_fastival_bonus,
        payroll_ta,
        payroll_advance,
        payroll_net_amount,
        payroll_date,
        payroll_note,
        payroll_created_by,
        payroll_accommodation,
        payroll_attendance,
        payroll_health,
        payroll_incentive,
        payroll_provident,
        payroll_other1,
        payroll_other2,
        payroll_other3,
        ...imageUrlObj,
      };

      let payroll_id: number = 0;

      if (payroll_pay_type !== 4 && payroll_account_id) {
        let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
        if (payroll_pay_type === 1) {
          accPayType = 'CASH';
        } else if (payroll_pay_type === 2) {
          accPayType = 'BANK';
        } else if (payroll_pay_type === 3) {
          accPayType = 'MOBILE BANKING';
        } else {
          accPayType = 'CASH';
        }

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: payroll_account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: payroll_vouchar_no,
          acctrxn_amount: payroll_net_amount,
          acctrxn_created_at: payroll_date as string,
          acctrxn_created_by: payroll_created_by as number,
          acctrxn_note: payroll_note,
          acctrxn_particular_id: 59,
          acctrxn_particular_type: 'Payroll create',
          acctrxn_pay_type: accPayType,
        };

        const payroll_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        // INSERT PAYROLL DATA
        payroll_id = await conn.createPayroll({
          ...payrollData,
          payroll_acctrxn_id,
        });
      } else if (payroll_pay_type == 4) {
        payroll_id = await conn.createPayroll(payrollData);

        const payrollChequeInfo: IPayrollCheque = {
          pcheque_payroll_id: payroll_id,
          pcheque_amount: payroll_net_amount,
          pcheque_number: payroll_cheque_no as number,
          pcheque_bank_name: payroll_bank_name as string,
          pcheque_withdraw_date: cheque_withdraw_date as string,
          pcheque_status: 'PENDING',
        };

        await conn.insertPayrollCheque(payrollChequeInfo);
      }

      const deductions: Omit<IPayrollDeductions, 'pd_payroll_id'>[] =
        JSON.parse(payroll_deductions);

      if (payroll_deductions.length) {
        const deductionInfo: IPayrollDeductions[] = [];

        for (const deduction of deductions) {
          const { pd_amount, pd_reason } = deduction;
          deductionInfo.push({
            pd_payroll_id: +payroll_id,
            pd_amount,
            pd_reason,
          });
        }

        if (deductionInfo.length)
          await conn.createPayrollDeductions(deductionInfo);
      }

      await this.insertAudit(
        req,
        'create',
        `ADDED PAYROLL, VOUCHER ${payroll_vouchar_no}, SALARY BDT ${payroll_net_amount}/-`,
        payroll_created_by as number,
        'PAYROLL'
      );

      return {
        success: true,
        message: 'Payroll created successfully',
        data: payroll_id,
      };
    });
  };
}
export default CreatePayroll;
