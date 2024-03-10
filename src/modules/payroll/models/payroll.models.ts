import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  ICreatePayroll,
  IPayrollCheque,
  IPayrollDeductions,
} from '../types/payroll.interfaces';

class PayrollModel extends AbstractModels {
  public async createPayroll(payrollInfo: ICreatePayroll) {
    const data = await this.query()
      .insert({ ...payrollInfo, payroll_org_agency: this.org_agency })
      .into('trabill_payroll');

    return data[0];
  }

  public async createPayrollDeductions(data: IPayrollDeductions[]) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_payroll_deductions');

    return id;
  }

  public async payrollImagesUrl(id: number | string) {
    const [urlList] = await this.query()
      .select('payroll_image_url')
      .from('trabill_payroll')
      .where('payroll_id', id);

    return urlList as {
      payroll_image_url: string;
    };
  }

  public async updatePayroll(payroll_id: idType, payroll: ICreatePayroll) {
    const data = await this.query()
      .into('trabill_payroll')
      .update(payroll)
      .where('payroll_id', payroll_id);

    return data;
  }

  public async getPayroll(
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select(
        'payroll_id',
        'payroll_vouchar_no',
        'employee_full_name',
        'payroll_account_id',
        'account_name',
        'payment_month',
        this.db.raw(
          'IFNULL(pcheque_status, account_name) AS bank_account_name'
        ),
        this.db.raw(
          'CASE WHEN payroll_pay_type = 4 THEN "Cheque" WHEN payroll_pay_type = 1 THEN "Cash" WHEN payroll_pay_type = 2 THEN "Bank" WHEN payroll_pay_type = 3 THEN "Mobile banking"  ELSE NULL END AS payroll_pay_method'
        ),
        'payroll_salary',
        'pcheque_bank_name',
        'payroll_attendance',
        'gross_salary',
        'designation_name',
        'payroll_net_amount',
        'payroll_date',
        'payroll_image_url'
      )
      .from('trabill_payroll')
      .leftJoin('trabill_accounts', { account_id: 'payroll_account_id' })
      .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
      .leftJoin('trabill_accounts_type', { acctype_id: 'payroll_pay_type' })
      .leftJoin('trabill_designations', {
        designation_id: 'employee_designation_id',
      })
      .leftJoin('trabill_payroll_cheque_details', {
        pcheque_payroll_id: 'payroll_id',
      })
      .where('payroll_id_deleted', 0)
      .modify((event) => {
        event
          .andWhere(function () {
            if (search) {
              this.andWhereRaw('LOWER(payroll_vouchar_no) LIKE ?', [
                `%${search}%`,
              ]).orWhereRaw('LOWER(employee_full_name) LIKE ?', [
                `%${search}%`,
              ]);
            }
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(payroll_date ,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
          })
          .andWhere('payroll_org_agency', this.org_agency);
      })
      .andWhere('payroll_org_agency', this.org_agency)
      .orderBy('payroll_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_payroll')
      .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
      .where('payroll_id_deleted', 0)
      .modify((event) => {
        event
          .andWhere(function () {
            if (search) {
              this.andWhereRaw('LOWER(payroll_vouchar_no) LIKE ?', [
                `%${search}%`,
              ]).orWhereRaw('LOWER(employee_full_name) LIKE ?', [
                `%${search}%`,
              ]);
            }
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(payroll_date ,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
          })
          .andWhere('payroll_org_agency', this.org_agency);
      })
      .andWhere('payroll_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getPayrollById(id: idType) {
    const data = await this.query()
      .select(
        'payroll_id',
        'gross_salary',
        'daily_salary',
        'payroll_profit_share',
        'payroll_vouchar_no',
        'payroll_employee_id',
        'employee_full_name',
        'designation_name',
        'employee_email',
        'employee_mobile',
        'employee_address',
        'payroll_account_id',
        this.db.raw('IFNULL(account_name, pcheque_status) AS account_name'),
        'pcheque_bank_name',
        'payroll_pay_type',
        this.db.raw(
          'CASE WHEN payroll_pay_type = 4 THEN "Cheque" WHEN payroll_pay_type = 1 THEN "Cash" WHEN payroll_pay_type = 2 THEN "Bank" WHEN payroll_pay_type = 3 THEN "Mobile banking"  ELSE NULL END AS payroll_pay_method'
        ),
        'pcheque_withdraw_date as cheque_withdraw_date',
        'payroll_salary',
        'payroll_mobile_bill',
        'payroll_transection_no',
        'payroll_transection_charge',
        'payroll_food_bill',
        'payroll_bonus',
        'payroll_commission',
        'payroll_fastival_bonus',
        'payroll_ta',
        'payroll_advance',

        'payroll_accommodation',
        'payroll_attendance',
        'payroll_health',
        'payroll_incentive',
        'payroll_provident',

        'payroll_net_amount',
        'payroll_note',
        'payroll_image_url',
        'payroll_date',
        'pcheque_number',
        'payroll_other1',
        'payroll_other2',
        'payroll_other3'
      )
      .from('trabill_payroll')
      .leftJoin('trabill_accounts', { account_id: 'payroll_account_id' })
      .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
      .leftJoin('trabill_accounts_type', { acctype_id: 'payroll_pay_type' })
      .leftJoin('trabill_designations', {
        designation_id: 'employee_designation_id',
      })
      .leftJoin('trabill_payroll_cheque_details', {
        pcheque_payroll_id: 'payroll_id',
      })
      .whereNot('payroll_id_deleted', 1)
      .andWhere('payroll_id', id);

    if (data.length) {
      return data[0];
    } else {
      return {};
    }
  }

  public async getPayrollDeductions(payroll_id: idType) {
    const data = (await this.query()
      .select('pd_id', 'pd_amount', 'pd_reason', this.db.raw(`0 AS is_deleted`))
      .from('trabill_payroll_deductions')
      .whereNot('pd_is_deleted', 1)
      .andWhere('pd_payroll_id', payroll_id)) as {
      pd_id: number;
      pd_amount: number;
      pd_reason: string;
    }[];

    if (!data.length) {
      const info = (await this.query()
        .select(
          this.db.raw(`NULL AS pd_id`),
          'payroll_deductions AS pd_amount',
          'payroll_deduction_reason AS pd_reason'
        )
        .from('trabill_payroll')
        .where({ payroll_id })) as {
        pd_id: number;
        pd_amount: number;
        pd_reason: string;
      }[];

      if (info.length) return info;
    }

    return data;
  }

  public async updatePayrollDeduction(
    data: {
      pd_amount: number;
      pd_reason: string;
    },
    pd_id: idType
  ) {
    await this.query()
      .update(data)
      .into('trabill_payroll_deductions')
      .where({ pd_id });
  }

  public async deletePayrollDeduction(pd_id: idType) {
    await this.query()
      .update({ pd_is_deleted: 1 })
      .into('trabill_payroll_deductions')
      .where({ pd_id });
  }

  public async deleteAllPayrollDeductions(
    pd_payroll_id: idType,
    pd_deleted_by: number
  ) {
    await this.query()
      .update({ pd_is_deleted: 1, pd_deleted_by })
      .into('trabill_payroll_deductions')
      .where({ pd_payroll_id });
  }

  // get previous transection balance
  public async getPrevTransectionAmount(payroll_id: idType) {
    const [data] = (await this.query()
      .select(
        'payroll_net_amount',
        'payroll_account_id',
        'payroll_pay_type',
        'payroll_acctrxn_id',
        'payroll_charge_id'
      )
      .from('trabill_payroll')
      .where('payroll_id', payroll_id)) as {
      payroll_net_amount: number;
      payroll_account_id: number;
      payroll_pay_type: number;
      payroll_acctrxn_id: number;
      payroll_charge_id: number;
    }[];

    if (data) {
      const {
        payroll_net_amount,
        payroll_account_id,
        payroll_pay_type,
        payroll_acctrxn_id,
        payroll_charge_id,
      } = data;
      return {
        previous_net_balance: Number(payroll_net_amount),
        prev_payroll_account_id: Number(payroll_account_id),
        prev_pay_type: Number(payroll_pay_type),
        prev_acctrxn_id: Number(payroll_acctrxn_id),
        prev_payroll_charge_id: Number(payroll_charge_id),
      };
    } else {
      throw new CustomError(
        "Can't find any payroll with this Id",
        400,
        'Bad request'
      );
    }
  }

  public async deletePrevPayrollCheque(
    payroll_id: idType,
    pcheque_deleted_by: idType
  ) {
    return await this.query()
      .update({ pcheque_is_deleted: 1, pcheque_deleted_by })
      .into('trabill_payroll_cheque_details')
      .where('pcheque_payroll_id', payroll_id);
  }

  public async deletePayroll(id: idType, payroll_deleted_by: idType) {
    const data = await this.query()
      .into('trabill_payroll')
      .update({ payroll_id_deleted: 1, payroll_deleted_by })
      .where('payroll_id', id);

    return data;
  }

  public async insertPayrollCheque(payroll_data: IPayrollCheque) {
    return await this.query()
      .insert(payroll_data)
      .into('trabill_payroll_cheque_details');
  }

  public viewEmployeeCommission = async (
    employee_id: number,
    month: string
  ) => {
    month = moment(new Date(month)).format('YYYY-MM');
    const [{ employee_commission }] = await this.query()
      .select('employee_commission')
      .from('trabill_employees')
      .where({ employee_id });

    if (!employee_commission && employee_commission <= 0) {
      return { net_total: 0 };
    }

    const [data] = await this.query()
      .select(
        this.db.raw(
          `CAST(SUM(total_profit) / employee_commission AS DECIMAL(15,2))  AS net_total`
        )
      )
      .from('view_employee_commission')
      .andWhere('invoice_sales_man_id', employee_id)
      .andWhereRaw(`DATE_FORMAT(sales_date, '%Y-%m') = ?`, [month])
      .groupBy('invoice_sales_man_id');

    if (data) {
      return data;
    }
    return { net_total: 0 };
  };
}
export default PayrollModel;
