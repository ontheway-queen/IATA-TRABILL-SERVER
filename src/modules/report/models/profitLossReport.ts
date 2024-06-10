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

  // OVERALL PROFIT LOSS
  overallProfitLoss = async (from_date: string, to_date: string) => {
    const [[data]] = await this.db.raw('call trabill.overall_profit(?,?,?);', [
      from_date,
      to_date,
      this.org_agency,
    ]);

    return data;
  };

  public async getUserPercentage1(user_id: number) {
    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    return user.user_data_percent;
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
