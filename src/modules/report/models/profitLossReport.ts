import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';

class ProfitLossReport extends AbstractModels {
  public async getEmployeeExpenses(
    employee_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'payroll_id',
        'employee_full_name as employes_name',
        'payroll_salary as employes_salary',
        'payroll_net_amount',
        this.db.raw(
          '(payroll_net_amount - payroll_salary) as payroll_other_aloowance'
        ),
        'payroll_note as note',
        'payroll_date',
        'payroll_create_date as created_date',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        )
      )
      .from('trabill_payroll')
      .leftJoin('trabill_users', { user_id: 'payroll_created_by' })
      .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
      .andWhereRaw('Date(payroll_date) BETWEEN ? AND ?', [from_date, to_date])
      .modify((builder) => {
        if (employee_id !== 'all') {
          builder.where('payroll_employee_id', employee_id);
        }
      })
      .andWhere('payroll_id_deleted', 0)
      .andWhere('payroll_org_agency', this.org_agency)
      .orderBy('payroll_id', 'desc')
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .select(this.db.raw(`count(*) as count`))
      .from('trabill_payroll')
      .where('payroll_id_deleted', 0)
      .andWhereRaw('Date(payroll_date) BETWEEN ? AND ?', [from_date, to_date])
      .modify((builder) => {
        if (employee_id !== 'all') {
          builder.where('payroll_employee_id', employee_id);
        }
      })
      .andWhere('payroll_org_agency', this.org_agency)) as { count: number }[];

    return { count, data };
  }

  public async getUserPercentage(user_id: number) {
    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    return user.user_data_percent;
  }

  public async totalSales(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('view_invoice_total_billing')
      .andWhere('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.sales_date) BETWEEN ? AND ?',
        [from_date, to_date]
      )) as { count: number }[];

    const limit = Math.round((count * percentage) / 100);

    const data = (await this.query()
      .select('sales_price', 'cost_price')
      .from('view_invoice_total_billing')
      .andWhere('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.sales_date) BETWEEN ? AND ?',
        [from_date, to_date]
      )
      .orderBy('invoice_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as {
      sales_price: number;
      cost_price: number;
    }[];

    const total = data.reduce(
      (
        acc: {
          total_sales_price: number;
          total_cost_price: number;
        },
        item: any
      ) => {
        acc.total_sales_price += parseFloat(item.sales_price) || 0;
        acc.total_cost_price += parseFloat(item.cost_price) || 0;
        return acc;
      },
      {
        total_sales_price: 0,
        total_cost_price: 0,
      }
    );

    return total;
  }

  public async getOverallSalesSummery(
    from_date: string,
    to_date: string,
    page: number = 1,
    size: number = 20
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select('*')
      .from('view_invoice_total_billing')
      .where('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.sales_date) BETWEEN ? AND ?',
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('view_invoice_total_billing')
      .where('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.sales_date) BETWEEN ? AND ?',
        [from_date, to_date]
      )) as { count: number }[];

    return { data, count };
  }

  public async getOverallClientRefund(
    from_date: string,
    to_date: string,
    page: number = 1,
    size: number = 20
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select('*')
      .from('v_client_refunds')
      .where('v_client_refunds.org_id', this.org_agency)
      .andWhereRaw('Date(v_client_refunds.refund_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('v_client_refunds')
      .where('v_client_refunds.org_id', this.org_agency)
      .andWhereRaw('Date(v_client_refunds.refund_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    return { data, count };
  }

  public async getOverallPurchase(
    from_date: string,
    to_date: string,
    page: number = 1,
    size: number = 20
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'cost.invoice_id',
        'invoice_org_agency',
        'invoice_category_id',
        'invoice_no',
        'airticket_ticket_no',
        'cost_price',
        this.db.raw('coalesce(combine_name,vendor_name) as vendor_name'),
        'invoice_sales_date'
      )
      .from('v_inv_cost as cost')
      .leftJoin(
        'trabill_invoices as inv',
        'inv.invoice_id',
        '=',
        'cost.invoice_id'
      )
      .leftJoin('trabill_vendors as v', 'v.vendor_id', '=', 'cost.vendor_id')
      .leftJoin(
        'trabill_combined_clients as c',
        'c.combine_id',
        '=',
        'cost.combine_id'
      )
      .where('invoice_org_agency', this.org_agency)
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('v_inv_cost as cost')
      .leftJoin(
        'trabill_invoices as inv',
        'inv.invoice_id',
        '=',
        'cost.invoice_id'
      )
      .leftJoin('trabill_vendors as v', 'v.vendor_id', '=', 'cost.vendor_id')
      .leftJoin(
        'trabill_combined_clients as c',
        'c.combine_id',
        '=',
        'cost.combine_id'
      )
      .where('invoice_org_agency', this.org_agency)
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    return { data, count };
  }

  public async refundProfitAir(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [infos] = await this.query()
      .select(this.db.raw('sum(refund_profit) as refund_profit'))
      .from('view_refunds_profit')
      .where('agency_id', this.org_agency)
      .andWhereRaw('Date(atrefund_date) BETWEEN ? AND ?', [from_date, to_date]);

    return Number(infos.refund_profit);
  }

  public async getRefundProfit(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const data = await this.query()
      .select(this.db.raw(`SUM(crefund_charge_amount) AS client_refund_charge`))
      .from('trabill_airticket_client_refunds')
      .whereNot('atrefund_is_deleted', 1)
      .andWhere('atrefund_org_agency', this.org_agency);
  }

  public allIncentive = async (
    from_date: string,
    to_date: string,
    percentage: number
  ) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_incentive_income_details')
      .where('incentive_is_deleted', 0)
      .andWhere('incentive_org_agency', this.org_agency)
      .andWhereRaw('Date(incentive_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    const limit = Math.round((count || 0 * percentage) / 100);

    const data = (await this.query()
      .select(
        this.db.raw(
          'CAST(sum(COALESCE(incentive_amount, 0)) AS DECIMAL(15, 2)) as incentive_total'
        )
      )
      .from('trabill_incentive_income_details')
      .where('incentive_is_deleted', 0)
      .andWhere('incentive_org_agency', this.org_agency)
      .andWhereRaw('Date(incentive_date) BETWEEN ? AND ?', [from_date, to_date])
      .orderBy('incentive_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as { incentive_amount: number }[];

    const total = data.reduce(
      (
        acc: {
          incentive_amount: number;
        },
        item: any
      ) => {
        acc.incentive_amount += parseFloat(item.incentive_amount) || 0;
        return acc;
      },
      {
        incentive_amount: 0,
      }
    );

    return Number(total.incentive_amount);
  };

  public async getEmployeeExpense(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_payroll')
      .where('payroll_org_agency', this.org_agency)
      .andWhereNot('payroll_id_deleted', 1)
      .andWhereRaw('Date(payroll_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    const limit = Math.round((count || 0 * percentage) / 100);

    const data = (await this.query()
      .select('payroll_net_amount')
      .from('trabill_payroll')
      .where('payroll_org_agency', this.org_agency)
      .andWhereNot('payroll_id_deleted', 1)
      .andWhereRaw('Date(payroll_date) BETWEEN ? AND ?', [from_date, to_date])
      .orderBy('payroll_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as { payroll_net_amount: number }[];

    const total = data.reduce(
      (
        acc: {
          payroll_net_amount: number;
        },
        item: any
      ) => {
        acc.payroll_net_amount += parseFloat(item.payroll_net_amount) || 0;
        return acc;
      },
      {
        payroll_net_amount: 0,
      }
    );

    return Number(total.payroll_net_amount);
  }

  agentLedgers = async (
    agentId: idType,
    from_date: string,
    to_date: string,
    page: number = 1,
    size: number = 20
  ) => {
    const offset = (page - 1) * size;
    const data = await this.query()
      .select('*')
      .from('trxn.v_agent_ledgers')
      .where('agtrxn_agency_id', this.org_agency)
      .andWhere('agtrxn_agent_id', agentId)
      .andWhereRaw('Date(agtrxn_created_at) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);
    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trxn.v_agent_ledgers')
      .where('agtrxn_agency_id', this.org_agency)
      .andWhere('agtrxn_agent_id', agentId)
      .andWhereRaw('Date(agtrxn_created_at) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    return { data, count };
  };

  public async allExpenses(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* AS count')
      .from('trabill_expenses')
      .where('expense_is_deleted', 0)
      .andWhere('expense_org_agency', this.org_agency)
      .andWhereRaw('Date(expense_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    const limit = Math.round((count || 0 * percentage) / 100);

    const data = (await this.query()
      .select('expense_total_amount')
      .from('trabill_expenses')
      .where('expense_is_deleted', 0)
      .andWhere('expense_org_agency', this.org_agency)
      .andWhereRaw('Date(expense_date) BETWEEN ? AND ?', [from_date, to_date])
      .orderBy('expense_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as { expense_total: number }[];

    const total = data.reduce(
      (
        acc: {
          expense_total: number;
        },
        item: any
      ) => {
        acc.expense_total += parseFloat(item.expense_total_amount) || 0;
        return acc;
      },
      {
        expense_total: 0,
      }
    );

    return Number(total.expense_total);
  }

  public async getAllClientDiscount(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ invoice_count }] = (await this.query()
      .count('* as invoice_count')
      .from('trabill_invoices')
      .where('invoice_is_deleted', 0)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { invoice_count: number }[];

    const invoice_limit = Math.round((invoice_count * percentage) / 100);

    const data = await this.query()
      .select(
        this.db.raw(`SUM(COALESCE(invoice_discount, 0)) AS total_discount`)
      )
      .from('trabill_invoices')
      .leftJoin('trabill_invoices_extra_amounts', {
        invoice_id: 'extra_amount_invoice_id',
      })
      .where('invoice_is_deleted', 0)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .orderBy('invoice_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(invoice_limit);
      });

    const invoice_total = data.reduce(
      (
        acc: {
          total_discount: number;
        },
        item: any
      ) => {
        acc.total_discount += parseFloat(item.invoice_discount) || 0;
        return acc;
      },
      {
        total_discount: 0,
      }
    );

    const [{ receipt_count }] = (await this.query()
      .count('* as receipt_count')
      .from('trabill_money_receipts')
      .where('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(`Date(receipt_payment_date)  BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])) as { receipt_count: number }[];

    const receipt_limit = Math.round((receipt_count * percentage) / 100);

    const receipt = await this.query()
      .select('receipt_total_discount')
      .from('trabill_money_receipts')
      .where('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(`Date(receipt_payment_date)  BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])
      .orderBy('receipt_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(receipt_limit);
      });

    const receipt_total = receipt.reduce(
      (
        acc: {
          total_discount: number;
        },
        item: any
      ) => {
        acc.total_discount += parseFloat(item.receipt_total_discount) || 0;
        return acc;
      },
      {
        total_discount: 0,
      }
    );

    const total_discount =
      Number(invoice_total.total_discount) +
      Number(receipt_total.total_discount);

    return total_discount;
  }

  public async getInvoicesServiceCharge(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.db('trabill_invoices')
      .count('* as count')
      .where('invoice_is_deleted', 0)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency)) as { count: number }[];

    const limit = Math.round((count * percentage) / 100);

    const data = await this.db('trabill_invoices')
      .select(this.db.raw(`invoice_service_charge`))
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      })
      .where('invoice_is_deleted', 0)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency)
      .orderBy('invoice_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      });

    const total = data.reduce(
      (
        acc: {
          total_service_charge: number;
        },
        item: any
      ) => {
        acc.total_service_charge +=
          parseFloat(item.invoice_service_charge) || 0;
        return acc;
      },
      {
        total_service_charge: 0,
      }
    );

    return Number(total.total_service_charge);
  }

  public async getBankCharge(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_online_trxn_charge')
      .where('charge_is_deleted', 0)
      .andWhere('charge_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(charge_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { count: number }[];

    const limit = Math.round((count * percentage) / 100);

    const data = (await this.query()
      .select('charge_amount')
      .from('trabill_online_trxn_charge')
      .where('charge_is_deleted', 0)
      .andWhere('charge_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(charge_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .orderBy('charge_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as { charge_amount: number }[];

    const total = data.reduce(
      (
        acc: {
          charge_amount: number;
        },
        item: any
      ) => {
        acc.charge_amount += parseFloat(item.charge_amount) || 0;
        return acc;
      },
      {
        charge_amount: 0,
      }
    );

    return Number(total.charge_amount);
  }

  public async getVendorAit(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_vendor_payments')
      .where('vpay_is_deleted', 0)
      .andWhere('vpay_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    const data = (await this.query()
      .select(`vendor_ait`)
      .from('trabill_vendor_payments')
      .where('vpay_is_deleted', 0)
      .andWhere('vpay_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .orderBy('vpay_id', 'desc')) as { vendor_ait: number }[];

    const total = data.reduce(
      (
        acc: {
          vendor_ait: number;
        },
        item: any
      ) => {
        acc.vendor_ait += parseFloat(item.vendor_ait) || 0;
        return acc;
      },
      {
        vendor_ait: 0,
      }
    );

    return Number(total.vendor_ait);
  }

  public async getNonInvoiceIncomeProfit(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_noninvoice_income_details')
      .where('nonincome_is_deleted', 0)
      .andWhere('nonincome_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(nonincome_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { count: number }[];

    const limit = Math.round((count * percentage) / 100);

    const data = (await this.query()
      .select(`nonincome_amount`)
      .from('trabill_noninvoice_income_details')
      .where('nonincome_is_deleted', 0)
      .andWhere('nonincome_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(nonincome_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .orderBy('nonincome_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as { total_amount: number }[];

    const total = data.reduce(
      (
        acc: {
          nonincome_amount: number;
        },
        item: any
      ) => {
        acc.nonincome_amount += parseFloat(item.nonincome_amount) || 0;
        return acc;
      },
      {
        nonincome_amount: 0,
      }
    );

    return Number(total.nonincome_amount);
  }

  public async getAgentPayment(
    from_date: string,
    to_date: string,
    percentage: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_money_receipts')
      .where('receipt_payment_to', 'AGENT_COMMISSION')
      .andWhere('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(receipt_payment_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as {
      count: number;
    }[];

    const limit = Math.round((count * percentage) / 100);

    const data = (await this.query()
      .select('receipt_total_amount')
      .from('trabill_money_receipts')
      .where('receipt_payment_to', 'AGENT_COMMISSION')
      .andWhere('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(receipt_payment_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .orderBy('receipt_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as {
      receipt_total_amount: number;
    }[];

    const total = data.reduce(
      (
        acc: {
          receipt_total_amount: number;
        },
        item: any
      ) => {
        acc.receipt_total_amount += parseFloat(item.receipt_total_amount) || 0;
        return acc;
      },
      {
        receipt_total_amount: 0,
      }
    );

    return Number(total.receipt_total_amount);
  }

  getInvoiceVoidProfit = async (
    from_date: string,
    to_date: string,
    percentage: number
  ) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .sum('invoice_void_charge as total_charge')
      .from('trabill_invoices')
      .andWhere('invoice_is_void', 1)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency)) as {
      count: number;
    }[];

    const limit = Math.round((count || 0 * percentage) / 100);

    const data = (await this.query()
      .select('invoice_void_charge')
      .from('trabill_invoices')
      .andWhere('invoice_is_void', 1)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency)
      .orderBy('invoice_id', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as {
      total_charge: number;
    }[];

    const total = data.reduce(
      (
        acc: {
          total_charge: number;
        },
        item: any
      ) => {
        acc.total_charge += parseFloat(item.invoice_void_charge) || 0;
        return acc;
      },
      {
        total_charge: 0,
      }
    );

    return Number(total.total_charge) || 0;
  };
  getClientRefundTotal = async (
    from_date: string,
    to_date: string,
    percentage: number
  ) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('v_all_refunds')
      .andWhereRaw(`DATE_FORMAT(atrefund_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])
      .andWhere('atrefund_org_agency', this.org_agency)) as {
      count: number;
    }[];

    const limit = Math.round((count * percentage) / 100);

    const data = (await this.query()
      .select('crefund_return_amount', 'vrefund_return_amount')
      .from('v_all_refunds')
      .andWhereRaw(`DATE_FORMAT(atrefund_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])
      .andWhere('atrefund_org_agency', this.org_agency)
      .orderBy('atrefund_date', 'desc')
      .modify((event) => {
        if (percentage) event.limit(limit);
      })) as {
      crefund_return_amount: string;
      vrefund_return_amount: string;
    }[];

    const total = data.reduce(
      (
        acc: {
          client_refund_return: number;
          vendor_refund_return: number;
        },
        item: any
      ) => {
        acc.client_refund_return += parseFloat(item.crefund_return_amount) || 0;
        acc.vendor_refund_return += parseFloat(item.vrefund_return_amount) || 0;
        return acc;
      },
      {
        client_refund_return: 0,
        vendor_refund_return: 0,
      }
    );

    return total;
  };

  public async visaWiseProfitLoss(
    visa_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number,
    user_id: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const [{ count }] = (await this.query()
      .select(this.db.raw(`count(*) as count`))
      .from('trabill_invoices')
      .leftJoin('trabill_invoice_categories', {
        invcat_id: 'invoice_category_id',
      })
      .where('invoice_is_deleted', 0)
      .andWhere('invcat_parentcat', 'VISA')
      .modify((event) => {
        if (visa_id !== 'all') {
          event.where('invoice_category_id', visa_id);
        }
      })
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .andWhere('trabill_invoices.invoice_org_agency', this.org_agency)) as {
      count: number;
    }[];

    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    let total_count: number = count;

    if (user && user.user_data_percent) {
      total_count = Math.round((count * +user.user_data_percent) / 100);

      if (size > total_count) {
        size = total_count;
      }
      if (page - 1 > 0) {
        size = total_count - offset;
      }
    }

    const data = await this.query()
      .select(
        'invoice_sales_date',
        'invoice_no',
        'invoice_id',
        'invoice_category_id',
        'product_name',
        'invcat_parentcat',
        'billing_cost_price as costitem_cost_price',
        'billing_subtotal as costitem_sale_price',
        'invoice_total_profit as refund_profit',
        'billing_quantity'
      )
      .from('trabill_invoices')
      .leftJoin('trabill_invoice_visa_billing_infos', {
        billing_invoice_id: 'invoice_id',
      })
      .leftJoin('trabill_invoice_categories', {
        invcat_id: 'invoice_category_id',
      })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .where('invoice_is_deleted', 0)
      .andWhere('invcat_parentcat', 'VISA')
      .modify((event) => {
        if (visa_id !== 'all') {
          event.where('invoice_category_id', visa_id);
        }
      })
      .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .andWhere('trabill_invoices.invoice_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);

    return { count: total_count, data };
  }

  public async ticketWiseProfitLossReport(
    ticket_no: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number,
    user_id: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('view_all_airticket_details')
      .modify((event) => {
        if (ticket_no && ticket_no !== 'all') {
          event.where('airticket_id', ticket_no);
        }
      })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { count: number }[];

    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    let total_count: number = count;

    if (user && user.user_data_percent) {
      total_count = Math.round((count * +user.user_data_percent) / 100);

      if (size > total_count) {
        size = total_count;
      }
      if (page - 1 > 0) {
        size = total_count - offset;
      }
    }

    const data = await this.query()
      .select(
        'airticket_id',
        'airticket_airline_id',
        'airticket_client_id',
        'airticket_vendor_combine_id',
        'invoice_category_id',

        'airticket_pnr',
        'airticket_purchase_price',
        'passport_name',
        'airline_name',

        'airticket_ticket_no',
        'invoice_no',
        'sales_date',
        'create_date AS invoice_create_date',
        'client_name',
        'airticket_client_price',
        this.db.raw(
          '(airticket_client_price - airticket_purchase_price) as airticket_profit'
        ),
        'airticket_invoice_id as invoice_id'
      )
      .from('view_all_airticket_details')
      .modify((event) => {
        if (ticket_no && ticket_no !== 'all') {
          event.where('airticket_id', ticket_no);
        }
      })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    return { count: total_count, data };
  }

  public async getOnlineTrxnCharge(
    page: number,
    size: number,
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'to_acc.account_name as to_acc_name',
        'from_acc.account_name as from_acc_name',
        'to_vendor.vendor_name as to_vendor_name',
        'from_vendor.vendor_name as from_vendor_name',
        this.db.raw(
          `COALESCE(to_client.client_name, to_combined.combine_name) as to_client_name`
        ),
        this.db.raw(
          `COALESCE(from_client.client_name, from_combined.combine_name) as from_client_name`
        ),
        'charge_amount',
        'charge_purpose',
        'charge_created_date',
        'charge_note'
      )
      .from('trabill_online_trxn_charge')
      .leftJoin('trabill_accounts as to_acc', {
        'to_acc.account_id': 'charge_to_acc_id',
      })
      .leftJoin('trabill_accounts as from_acc', {
        'from_acc.account_id': 'charge_from_acc_id',
      })
      .leftJoin('trabill_clients as to_client', {
        'to_client.client_id': 'charge_to_client_id',
      })
      .leftJoin('trabill_clients as from_client', {
        'from_client.client_id': 'charge_from_client_id',
      })
      .leftJoin('trabill_vendors as to_vendor', {
        'to_vendor.vendor_id': 'charge_to_vendor_id',
      })
      .leftJoin('trabill_vendors as from_vendor', {
        'from_vendor.vendor_id': 'charge_from_vendor_id',
      })
      .leftJoin('trabill_combined_clients as to_combined', {
        'to_combined.combine_id': 'charge_to_combined_id',
      })
      .leftJoin('trabill_combined_clients as from_combined', {
        'from_combined.combine_id': 'charge_to_combined_id',
      })
      .where('charge_org_agency', this.org_agency)
      .andWhereNot('charge_is_deleted', 1)
      .andWhereRaw('Date(charge_created_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    return data;
  }

  public async countOnlineTrxnChargeDataRow(
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_online_trxn_charge')
      .where('charge_org_agency', this.org_agency)
      .andWhereNot('charge_is_deleted', 1)
      .andWhereRaw('Date(charge_created_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ]);

    return count.row_count;
  }

  public async getClientLedgerExcel() {
    const client = await this.query()
      .select(
        'client_entry_id',
        'client_type',
        'client_gender',
        'client_email',
        'client_address',
        'client_created_date'
      )
      .from('trabill_clients')
      .where('client_org_agency', this.org_agency)
      .andWhereNot('client_is_deleted', 1);

    return client;
  }

  payrollReport = async (
    payroll_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) => {
    const offset = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select('*')
      .from('v_payroll')
      .modify((e) => {
        e.andWhere('payroll_org_agency', this.org_agency).andWhere(function () {
          if (payroll_id && payroll_id !== 'all') {
            this.andWhere('payroll_employee_id', payroll_id);
          }

          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(payroll_date,'%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
        });
      })
      .andWhere('payroll_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);

    const [{ row_count, total_payment }] = await this.query()
      .select(
        this.db.raw(`count(*) as row_count`),
        this.db.raw(`CAST(SUM(payroll_net_amount) AS SIGNED) AS total_payment`)
      )
      .from('v_payroll')
      .modify((e) => {
        e.andWhere('payroll_org_agency', this.org_agency).andWhere(function () {
          if (payroll_id && payroll_id !== 'all') {
            this.andWhere('payroll_employee_id', payroll_id);
          }

          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(payroll_date,'%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
        });
      })
      .andWhere('payroll_org_agency', this.org_agency);

    return { count: row_count, data: { total_payment, data } };
  };
}
export default ProfitLossReport;
