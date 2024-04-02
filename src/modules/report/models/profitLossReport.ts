import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';

class ProfitLossReport extends AbstractModels {
  public async getEmployeExpense(
    employee_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const page_number = (page - 1) * size;

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
        'payroll_create_date as created_date',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        )
      )
      .from('trabill_payroll')
      .leftJoin('trabill_users', { user_id: 'payroll_created_by' })
      .leftJoin('trabill_employees', { employee_id: 'payroll_employee_id' })
      .andWhereRaw('Date(payroll_create_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (employee_id !== 'all') {
          builder.where('payroll_employee_id', employee_id);
        }
      })
      .andWhere('payroll_id_deleted', 0)
      .andWhere('payroll_org_agency', this.org_agency)
      .orderBy('payroll_id', 'desc')
      .limit(size)
      .offset(page_number);

    return data;
  }

  public async countEmployeeExpenseDataRow(
    employee_id: idType,
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_payroll')
      .where('payroll_id_deleted', 0)
      .andWhereRaw('Date(payroll_create_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (employee_id !== 'all') {
          builder.where('payroll_employee_id', employee_id);
        }
      })
      .andWhere('payroll_org_agency', this.org_agency);

    return count.row_count;
  }

  public async totalSales(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = await this.query()
      .select(
        this.db.raw(
          'CAST(SUM(view_invoice_total_billing.sales_price) AS DECIMAL(15,2)) AS total_sales_price'
        ),
        this.db.raw(
          'CAST(SUM(cost_price) AS DECIMAL(15,2)) AS total_cost_price'
        )
      )
      .from('view_invoice_total_billing')
      .andWhere('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.create_date) BETWEEN ? AND ?',
        [from_date, to_date]
      );

    return data;
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
        'Date(view_invoice_total_billing.create_date) BETWEEN ? AND ?',
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('view_invoice_total_billing')
      .where('view_invoice_total_billing.org_agency_id', this.org_agency)
      .andWhereRaw(
        'Date(view_invoice_total_billing.create_date) BETWEEN ? AND ?',
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

  public async refundProfitAir(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [infos] = await this.query()
      .select(this.db.raw('sum(refund_profit) as refund_profit'))
      .from('view_refunds_profit')
      .where('agency_id', this.org_agency)
      .andWhereRaw('Date(created_date) BETWEEN ? AND ?', [from_date, to_date]);

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

  public allIncentive = async (from_date: string, to_date: string) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [incentive] = (await this.query()
      .select(
        this.db.raw(
          'CAST(sum(COALESCE(incentive_amount, 0)) AS DECIMAL(15, 2)) as incentive_total'
        )
      )
      .from('trabill_incentive_income_details')
      .where('incentive_is_deleted', 0)
      .andWhere('incentive_org_agency', this.org_agency)
      .andWhereRaw('Date(incentive_created_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { incentive_total: number }[];

    return Number(incentive.incentive_total);
  };

  public async getEmployeeExpense(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = (await this.query()
      .select(this.db.raw('sum(payroll_net_amount) as employee_salary'))
      .from('trabill_payroll')
      .where('payroll_org_agency', this.org_agency)
      .andWhereNot('payroll_id_deleted', 1)
      .andWhereRaw('Date(payroll_create_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { employee_salary: number }[];

    return Number(data.employee_salary);
  }

  agentLedgers = async (
    agentId: idType,
    from_date: string,
    to_date: string,
    page: number = 1,
    size: number = 20
  ) => {
    const offset = (page - 1) * size;
    return await this.query()
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
  };

  public async allExpenses(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [expenses] = (await this.query()
      .select(
        this.db.raw(
          'CAST(SUM(COALESCE(expense_total_amount, 0)) AS DECIMAL(15, 2)) as expense_total'
        )
      )
      .from('trabill_expenses')
      .where('expense_is_deleted', 0)
      .andWhere('expense_org_agency', this.org_agency)
      .andWhereRaw('Date(expense_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { expense_total: number }[];

    return Number(expenses.expense_total);
  }

  public async getAllClientDiscount(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = await this.query()
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
      ]);

    const [receipt] = await this.query()
      .select(
        this.db.raw(`SUM(COALESCE(receipt_total_discount,0)) AS total_discount`)
      )
      .from('trabill_money_receipts')
      .where('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(`Date(receipt_payment_date)  BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ]);

    const total_discount =
      Number(data.total_discount) + Number(receipt.total_discount);

    return total_discount;
  }

  public async getInvoicesServiceCharge(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const [data] = await this.db('trabill_invoices')
      .select(
        this.db.raw(
          `CAST(sum(COALESCE(invoice_service_charge,0)) AS DECIMAL(15,2)) as total_service_charge`
        )
      )
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      })
      .where('invoice_is_deleted', 0)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency);

    return Number(data.total_service_charge);
  }

  /*  public async getTourProfitLoss(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const [{ tour_profit }] = await this.query()
      .select(
        this.db.raw(
          `SUM(COALESCE(billing_total_sales,0) - COALESCE(billing_cost_price, 0)) as tour_profit`
        )
      )
      .from('trabill_invoice_tour_billing')

      .where('billing_is_deleted', 0)
      .leftJoin('trabill_invoices', { invoice_id: 'billing_invoice_id' })
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      );

    return Number(tour_profit);
  } */

  public async getBankCharge(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = (await this.query()
      .sum('charge_amount AS loss')
      .from('trabill_online_trxn_charge')
      .where('charge_is_deleted', 0)
      .andWhere('charge_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(charge_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { loss: number }[];

    return Number(data.loss);
  }

  public async getVendorAit(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = (await this.query()
      .select(
        this.db.raw(
          `CAST(SUM(COALESCE(vendor_ait, 0)) AS DECIMAL(15,2)) AS total_ait`
        )
      )
      .from('trabill_vendor_payments')
      .where('vpay_is_deleted', 0)
      .andWhere('vpay_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(created_date, "%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])) as { total_ait: number }[];

    return Number(data.total_ait);
  }

  public async getNonInvoiceIncomeProfit(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = (await this.query()
      .select(
        this.db.raw(
          `CAST(SUM(COALESCE(nonincome_amount, 0)) AS DECIMAL(15, 2)) AS total_amount`
        )
      )
      .from('trabill_noninvoice_income_details')
      .where('nonincome_is_deleted', 0)
      .andWhere('nonincome_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(nonincome_created_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { total_amount: number }[];

    return Number(data.total_amount);
  }

  public async getAgentPayment(from_date: string, to_date: string) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = (await this.query()
      .select(
        this.db.raw(
          `CAST(SUM(COALESCE(receipt_total_amount,0)) AS DECIMAL(15,2)) AS agent_payment`
        )
      )
      .from('trabill_money_receipts')
      .where('receipt_payment_to', 'AGENT_COMMISSION')
      .andWhere('receipt_has_deleted', 0)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(receipt_payment_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as {
      agent_payment: number;
    }[];

    return Number(data.agent_payment);
  }

  getInvoiceVoidProfit = async (from_date: string, to_date: string) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const [data] = (await this.query()
      .sum('invoice_void_charge as total_charge')
      .from('trabill_invoices')
      .andWhere('invoice_is_void', 1)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('invoice_org_agency', this.org_agency)) as {
      total_charge: number;
    }[];

    return Number(data.total_charge) || 0;
  };
  getClientRefundTotal = async (from_date: string, to_date: string) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const [data] = (await this.query()
      .sum('return_amount as total_return')
      .from('v_client_refunds')
      .andWhereRaw(`DATE_FORMAT(refund_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])
      .andWhere('org_id', this.org_agency)) as {
      total_return: number;
    }[];

    return Number(data.total_return) || 0;
  };

  public async visaWiseProfitLoss(
    visa_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const page_number = (page - 1) * size;

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
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_invoices')
      .leftJoin('trabill_invoice_visa_billing_infos', {
        billing_invoice_id: 'invoice_id',
      })
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
      .andWhere('trabill_invoices.invoice_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async ticketWiseProfitLossReport(
    ticket_no: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const page_number = (page - 1) * size;

    const airticket = await this.query()
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
      .andWhereRaw('DATE_FORMAT(create_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(page_number);
    return airticket;
  }
  public async countTicketWiseProfitLossReportDataRow(
    ticket_no: idType,
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('view_all_airticket_details')
      .modify((event) => {
        if (ticket_no && ticket_no !== 'all') {
          event.where('airticket_id', ticket_no);
        }
      })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw('DATE_FORMAT(create_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ]);

    return row_count;
  }

  public async getOnlineTrxnCharge(
    page: number,
    size: number,
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const page_number = (page - 1) * size;

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
      .offset(page_number);

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
