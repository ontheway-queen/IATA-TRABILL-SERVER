/*
refactor code sales purchase report models
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/

import dayjs from 'dayjs';
import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import { idType } from '../../../common/types/common.types';

class SalesPurchasesReport extends AbstractModels {
  salesPurchaseReport = async (user_id: number) => {
    const today = new Date().toISOString().slice(0, 10);

    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    const [{ total_sales }] = (await this.query()
      .count('* as total_sales')
      .from('view_invoice_total_billing')
      .whereRaw('DATE(sales_date) = ?', today)
      .where('org_agency_id', this.org_agency)) as { total_sales: number }[];

    const sales = await this.query()
      .select(
        'invoice_no',
        'client_name',
        this.db.raw(`(sales_price - invoice_discount) AS sales_price`),
        'sales_date',
        'create_date'
      )
      .from('view_invoice_total_billing')
      .whereRaw('DATE(sales_date) = ?', today)
      .where('org_agency_id', this.org_agency)
      .limit(Math.round((total_sales || 0) * (+user.user_data_percent / 100)));

    const [{ total_collection }] = (await this.query()
      .count('* as total_collection')
      .from('trabill_money_receipts')
      .whereRaw('DATE(receipt_payment_date) = ?', today)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereNot('receipt_has_deleted', 1)
      .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')) as {
      total_collection: number;
    }[];

    const collection = await this.query()
      .select(
        'receipt_vouchar_no',
        'receipt_payment_to',
        this.db.raw(
          'coalesce(combine_name, client_name, company_name) as client_name'
        ),
        'receipt_total_amount',
        'receipt_payment_date'
      )
      .from('trabill_money_receipts')
      .leftJoin('trabill_clients', {
        client_id: 'receipt_client_id',
      })
      .leftJoin('trabill_client_company_information', {
        'trabill_client_company_information.company_client_id':
          'trabill_clients.client_id',
      })
      .leftJoin('trabill_combined_clients', {
        receipt_combined_id: 'combine_id',
      })
      .whereRaw('DATE(receipt_payment_date) = ?', today)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereNot('receipt_has_deleted', 1)
      .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
      .limit(
        Math.round((total_collection || 0) * (+user.user_data_percent / 100))
      );

    return { sales, collection };
  };
  paymentAndPurchase = async (user_id: number) => {
    const date = dayjs().format('YYYY-MM-DD');

    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    const [{ total_count }] = (await this.query()
      .count('* as total_count')
      .from('view_invoices_billing')
      .where('org_agency_id', this.org_agency)
      .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") = ?', [date])) as {
      total_count: number;
    }[];

    const purchase = await this.query()
      .select(
        'invoice_no',
        'cost_price',
        'sales_date AS invoice_sales_date',
        'vendor_name',
        'create_date'
      )
      .from('view_invoices_billing')
      .where('org_agency_id', this.org_agency)
      .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") = ?', [date])
      .limit(Math.round((total_count * +user.user_data_percent) / 100));

    const [{ total_payment }] = (await this.query()
      .count('* as total_payment')
      .from('trabill_vendor_payments')
      .whereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") = ?', [date])
      .andWhere('vpay_org_agency', this.org_agency)
      .andWhereNot('vpay_is_deleted', 1)) as { total_payment: number }[];

    const payments = await this.query()
      .select(
        'invoice_no',
        'vouchar_no',
        this.db.raw('coalesce(combine_name, vendor_name) as vendor_name'),
        'vpay_receipt_no',
        'cost_price',
        'payment_amount',
        'payment_date'
      )
      .from('trabill_vendor_payments')
      .leftJoin('view_invoices_details', { invoice_id: 'vpay_invoice_id' })
      .leftJoin('trabill_vendors as vendor', {
        vpay_vendor_id: 'vendor.vendor_id',
      })
      .leftJoin('trabill_combined_clients as combined', {
        vpay_combined_id: 'combined.combine_id',
      })
      .whereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") = ?', [date])
      .andWhere('vpay_org_agency', this.org_agency)
      .andWhereNot('vpay_is_deleted', 1)
      .limit(
        Math.round((total_payment || 0) * (+user.user_data_percent / 100))
      );

    return { purchase, payments };
  };

  public async getSalesReport(
    comb_client: string,
    employee_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number,
    user_id: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const [{ count }] = await this.query()
      .count('* as count')
      .from('view_sales_and_purchase_report')
      .andWhereRaw('DATE(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (employee_id && employee_id !== 'all') {
          builder.where('invoice_sales_man_id', employee_id);
        }
        if (client_id) {
          builder.where('invoice_client_id', client_id);
        }
        if (combined_id) {
          builder.where('invoice_combined_id', combined_id);
        }
      })
      .andWhere('org_agency_id', this.org_agency);

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
      .select('*')
      .from('view_sales_and_purchase_report')
      .andWhereRaw('DATE(invoice_sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (employee_id && employee_id !== 'all') {
          builder.where('invoice_sales_man_id', employee_id);
        }
        if (client_id) {
          builder.where('invoice_client_id', client_id);
        }
        if (combined_id) {
          builder.where('invoice_combined_id', combined_id);
        }
      })
      .andWhere('org_agency_id', this.org_agency)
      .limit(size)
      .offset(offset);

    const infos = data.reduce(
      (
        acc: {
          sales_price: number;
          cost_price: number;
          total_profit: number;
          total_client_payments: number;
        },
        item: any
      ) => {
        acc.sales_price += parseFloat(item.invoice_net_total) || 0;
        acc.cost_price += parseFloat(item.cost_price) || 0;
        acc.total_profit += parseFloat(item.total_profit) || 0;
        acc.total_client_payments +=
          parseFloat(item.total_client_payments) || 0;
        return acc;
      },
      {
        sales_price: 0,
        cost_price: 0,
        total_profit: 0,
        total_client_payments: 0,
      }
    );

    return { count: total_count, data: { data, ...infos } };
  }

  public async salesManWiseCollectionDue(
    employee_id: idType,
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
      .from('view_invoice_total_billing as view')
      .modify((event) => {
        if (employee_id && employee_id !== 'all') {
          event.where('view.invoice_sales_man_id', employee_id);
        }
        if (from_date && to_date) {
          event.whereRaw(
            'DATE_FORMAT(view.sales_date,"%Y-%m-%d") BETWEEN ? AND ?',
            [from_date, to_date]
          );
        }
      })
      .andWhere('view.org_agency_id', this.org_agency)) as { count: number }[];

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

    const result = await this.query()
      .select(
        'view.invoice_id',
        'view.invoice_category_id',
        'view.invoice_no',
        'trabill_employees.employee_full_name',
        this.db.raw(
          `(view.sales_price - view.invoice_discount) as sales_price`
        ),
        'view.cost_price',
        'view.        AS client_payment',
        'view.create_date',
        'view.sales_date',
        'view.invoice_sales_man_id'
      )
      .from('view_invoice_total_billing as view')
      .leftJoin(
        'trabill_employees',
        'employee_id',
        '=',
        'view.invoice_sales_man_id'
      )
      .modify((event) => {
        if (employee_id && employee_id !== 'all') {
          event.where('view.invoice_sales_man_id', employee_id);
        }
        if (from_date && to_date) {
          event.whereRaw(
            'DATE_FORMAT(view.sales_date,"%Y-%m-%d") BETWEEN ? AND ?',
            [from_date, to_date]
          );
        }
      })
      .andWhere('view.org_agency_id', this.org_agency)

      .limit(size)
      .offset(offset);

    const total = result.reduce(
      (
        acc: {
          sales_price: number;
          client_payment: number;
        },
        item: any
      ) => {
        acc.sales_price += parseFloat(item.sales_price) || 0;
        acc.client_payment += parseFloat(item.invoice_total_pay) || 0;
        return acc;
      },
      {
        sales_price: 0,
        client_payment: 0,
      }
    );

    return { count: total_count, data: { result, ...total } };
  }

  public async getClientSales(
    client_id: idType,
    combined_id: idType,
    employee_id: idType,
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
      .from('view_client_wise_sales ')

      .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (client_id && client_id !== 'all') {
          builder.where('invoice_client_id', client_id);
        }
        if (combined_id && combined_id !== 'all') {
          builder.where('invoice_combined_id', combined_id);
        }
        if (employee_id && employee_id !== 'all') {
          builder.where('invoice_sales_man_id', employee_id);
        }
      })
      .andWhere('org_agency_id', this.org_agency)) as { count: number }[];

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

    const sales_data = await this.query()
      .select(
        'client_name',
        'employee_full_name',
        'invoice_sales_man_id',
        'pax_name',
        `ticket_no`,
        'invoice_no',
        'net_total',
        'sales_price',
        'cost_price',
        'invoice_client_id',
        'invoice_combined_id',
        'sales_date'
      )
      .from('view_client_wise_sales')

      .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .modify((builder) => {
        if (client_id && client_id !== 'all') {
          builder.where('invoice_client_id', client_id);
        }
        if (combined_id && combined_id !== 'all') {
          builder.where('invoice_combined_id', combined_id);
        }
        if (employee_id && employee_id !== 'all') {
          builder.where('invoice_sales_man_id', employee_id);
        }
      })
      .andWhere('org_agency_id', this.org_agency)
      .limit(size)
      .offset(offset);

    const total = sales_data.reduce(
      (
        acc: {
          sales_price: number;
        },
        item: any
      ) => {
        acc.sales_price += parseFloat(item.sales_price) || 0;
        return acc;
      },
      {
        sales_price: 0,
      }
    );

    return { count: total_count, sales_data, ...total };
  }

  public async getClientCollectionClient(
    client_id: idType,
    combined_id: idType,
    employee_id: idType,
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
      .from('trabill_money_receipts')
      .leftJoin('trabill_transaction_type', {
        trxntype_id: 'receipt_trnxtype_id',
      })
      .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
      .leftJoin('trabill_users', { user_id: 'receipt_created_by' })
      .modify((builder) => {
        if (client_id !== 'all') {
          builder.where('receipt_client_id', client_id);
        }
        if (combined_id && combined_id !== 'all') {
          builder.where('receipt_combined_id', combined_id);
        }
        if (employee_id && employee_id !== 'all') {
          builder.where('receipt_received_by', employee_id);
        }
      })
      .whereNot('receipt_has_deleted', 1)
      .andWhere('trabill_money_receipts.receipt_org_agency', this.org_agency)
      .andWhereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
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

    const collection_data = await this.query()
      .select(
        'receipt_id',
        'trxntype_name',
        'receipt_vouchar_no',
        'receipt_payment_date',
        'client_name',
        'receipt_total_amount',
        'employee_full_name',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        ),
        'receipt_client_id',
        'receipt_combined_id'
      )
      .from('trabill_money_receipts')
      .leftJoin('trabill_transaction_type', {
        trxntype_id: 'receipt_trnxtype_id',
      })
      .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
      .leftJoin('trabill_users', { user_id: 'receipt_created_by' })
      .leftJoin('trabill_employees', { employee_id: 'receipt_received_by' })
      .modify((builder) => {
        if (client_id !== 'all') {
          builder.where('receipt_client_id', client_id);
        }
        if (combined_id && combined_id !== 'all') {
          builder.where('receipt_combined_id', combined_id);
        }
        if (employee_id && employee_id !== 'all') {
          builder.where('receipt_received_by', employee_id);
        }
      })
      .whereNot('receipt_has_deleted', 1)
      .andWhere('trabill_money_receipts.receipt_org_agency', this.org_agency)
      .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
      .andWhereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    const total = collection_data.reduce(
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

    return { count: total_count, collection_data, ...total };
  }

  public async getInvoicePurches(
    vendor_id: idType,
    combine_id: idType,
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
        'view.inv_id as invoice_id',
        'view.invoice_no',
        'view.purchase_price',
        'view.vendor_name',
        'view.create_date as created_date',
        'view.sales_date'
      )
      .from('view_all_invoices_billing AS view')
      .where('invoice_org_agency', this.org_agency)
      .modify((event) => {
        if (vendor_id && vendor_id !== 'all') {
          event.andWhere('view.vendor_id', vendor_id);
        }
        if (combine_id && combine_id !== 'all') {
          event.andWhere('view.combined_id', combine_id);
        }
      })
      .andWhereRaw('Date(view.sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .orderBy('view.inv_id', 'desc')
      .limit(size)
      .offset(offset);

    return data;
  }

  public async countInvoicePurchaseDataRow(
    vendor_id: idType,
    combine_id: idType,
    from_date: string,
    to_date: string
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('view_all_invoices_billing AS view')
      .where('invoice_org_agency', this.org_agency)
      .modify((event) => {
        if (vendor_id && vendor_id !== 'all') {
          event.andWhere('view.vendor_id', vendor_id);
        }
        if (combine_id && combine_id !== 'all') {
          event.andWhere('view.combined_id', combine_id);
        }
      })
      .andWhereRaw('Date(view.sales_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ]);

    return row_count;
  }

  public getTaxReport = async (
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'invoice_vat',
        'invoice_no',
        'invoice_sales_date',
        this.db.raw(
          'COALESCE(client_name, company_name, combine_name) as client_name'
        )
      )
      .from('trabill_invoices_extra_amounts')
      .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
      .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'invoice_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'invoice_combined_id',
      })
      .where('invoice_vat', '>', 0)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhere('invoice_is_deleted', 0)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_invoices_extra_amounts')
      .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
      .where('invoice_vat', '>', 0)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhere('invoice_is_deleted', 0)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      );

    return { count: row_count, data };
  };

  public getOtherTaxReport = async (
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'invoice_id',
        'invoice_category_id',
        'invoice_client_id',
        'invoice_combined_id',
        'invoice_no',
        'invoice_sales_date',
        this.db.raw(
          `COALESCE(client_name, company_name, combine_name) as client_name`
        ),
        'airticket_tax',
        'airticket_tax1',
        'airticket_bd_charge',
        'airticket_xt_charge',
        'airticket_ut_charge',
        'airticket_es_charge',
        'airticket_ow_charge',
        'airticket_pz_charge',
        'airticket_qa_charge',
        'airticket_g4_charge',
        'airticket_e5_charge',
        'airticket_p7_charge',
        'airticket_p8_charge',
        'airticket_r9_charge',
        this.db.raw(`(
          COALESCE(airticket_tax,0) +
          COALESCE(airticket_tax1,0) +
          airticket_bd_charge +
          airticket_xt_charge +
          airticket_ut_charge +
          airticket_es_charge +
          airticket_ow_charge +
          airticket_pz_charge +
          airticket_qa_charge +
          airticket_g4_charge +
          airticket_e5_charge +
          airticket_p7_charge +
          airticket_p8_charge +
          airticket_r9_charge
      ) AS total`)
      )
      .from('trabill_invoice_airticket_items')
      .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
      .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'invoice_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'invoice_combined_id',
      })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('airticket_is_deleted', 0)
      .limit(size)
      .offset(offset);

    const [{ row_count }] = await this.query()
      .select(this.db.raw('count(*) as row_count'))
      .from('trabill_invoice_airticket_items')
      .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('airticket_is_deleted', 0);

    return { count: row_count, data };
  };

  public getSumTaxAmount = async (from_date: string, to_date: string) => {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const [data] = await this.query()
      .select(
        this.db.raw(`sum(
          COALESCE(airticket_tax,0) +
          COALESCE(airticket_tax1,0) +
          airticket_bd_charge +
          airticket_xt_charge +
          airticket_ut_charge +
          airticket_es_charge +
          airticket_ow_charge +
          airticket_pz_charge +
          airticket_qa_charge +
          airticket_g4_charge +
          airticket_e5_charge +
          airticket_p7_charge +
          airticket_p8_charge +
          airticket_r9_charge
      ) AS total`)
      )
      .from('trabill_invoice_airticket_items')
      .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
      .where('airticket_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .andWhere('airticket_is_deleted', 0);

    return data;
  };

  public async getDailySalesReport(
    comb_client: string,
    employee_id: idType,
    product_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number,
    user_id: number
  ) {
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');
    const offset = (page - 1) * size;

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const [user] = (await this.query()
      .select('user_data_percent')
      .from('trabill_users')
      .where({ user_id })) as { user_data_percent: number }[];

    const [count] = (await this.query()
      .count('* as total')
      .from('view_daily_sales_report')
      .where('org_agency_id', this.org_agency)
      .modify((event) => {
        if (client_id) event.andWhere('invoice_client_id', client_id);

        if (combined_id) event.andWhere('invoice_combined_id', combined_id);

        if (product_id && product_id !== 'all')
          event.andWhere('billing_product_id', product_id);

        if (employee_id && employee_id !== 'all')
          event.andWhere('employee_id', employee_id);
      })
      .andWhereRaw(`DATE_FORMAT(sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])) as { total: number }[];

    let total_count: number = count.total;

    if (user && user.user_data_percent) {
      total_count = Math.round((count.total * +user.user_data_percent) / 100);

      if (size > total_count) {
        size = total_count;
      }
      if (page - 1 > 0) {
        size = total_count - offset;
      }
    }

    const data = await this.query()
      .select('*')
      .from('view_daily_sales_report')
      .where('org_agency_id', this.org_agency)
      .modify((event) => {
        if (client_id) event.andWhere('invoice_client_id', client_id);

        if (combined_id) event.andWhere('invoice_combined_id', combined_id);

        if (product_id && product_id !== 'all')
          event.andWhere('billing_product_id', product_id);

        if (employee_id && employee_id !== 'all')
          event.andWhere('employee_id', employee_id);
      })
      .andWhereRaw(`DATE_FORMAT(sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ])
      .limit(size)
      .offset(offset);

    const [infos] = await this.query()
      .sum('invoice_sub_total as invoice_sub_total')
      .sum('invoice_net_total as total_sales')
      .sum('cost_price as total_cost')
      .sum('client_pay_amount as total_collection')
      .sum('due_amount as total_due')
      .sum('invoice_service_charge as total_service_charge')
      .sum('invoice_discount as total_discount')
      .from('view_daily_sales_report')
      .where('org_agency_id', this.org_agency)
      .modify((event) => {
        if (client_id) event.andWhere('invoice_client_id', client_id);

        if (combined_id) event.andWhere('invoice_combined_id', combined_id);

        if (product_id && product_id !== 'all')
          event.andWhere('billing_product_id', product_id);

        if (employee_id && employee_id !== 'all')
          event.andWhere('employee_id', employee_id);
      })
      .andWhereRaw(`DATE_FORMAT(sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
        from_date,
        to_date,
      ]);

    return { count: total_count, data: { data, ...infos } };
  }

  // OVERALL PROFIT LOSS
  getSalesReportSummary = async (
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) => {
    const offset = (page - 1) * size;
    const data = await this.query()
      .from('trabill_invoices')
      .select(
        'invoice_id',
        'invoice_client_id',
        'invoice_combined_id',
        'invoice_reissue_client_type',
        'invoice_no',
        'invoice_category_id',
        'invoice_sub_total',
        'invoice_net_total',
        'invoice_total_profit',
        'invoice_sales_date',
        'invoice_note',
        this.db.raw('COALESCE(client_name, combine_name) AS client_name')
      )
      .leftJoin('trabill_clients', 'client_id', 'invoice_client_id')
      .leftJoin('trabill_combined_clients', 'combine_id', 'invoice_combined_id')
      .whereNot('invoice_is_deleted', 1)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);
    const [{ count }] = await this.query()
      .from('trabill_invoices')
      .count('* as count')
      .whereNot('invoice_is_deleted', 1)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);

    return { data, count };
  };

  // SALES MAN WISE CLIENT TOTAL DUE
  public async salesManWiseClientTotalDue(
    employee_id: idType,
    page: number,
    size: number
  ) {
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        this.db.raw('sum(view.sales_price) as total_sales'),
        this.db.raw('sum(view.invoice_discount) as total_discount'),
        this.db.raw('sum(view.invoice_total_pay) as total_client_payment'),
        this.db.raw('sum(view.client_due) as total_client_due'),
        this.db.raw('count(*) as total'),
        'employee_full_name'
      )
      .from('view_invoice_total_billing as view')
      .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
      .modify((event) => {
        if (employee_id && employee_id !== 'all') {
          event.where('view.invoice_sales_man_id', employee_id);
        }
      })
      .andWhere('view.org_agency_id', this.org_agency)
      .andWhere('client_due', '>', 0)
      .groupBy('invoice_sales_man_id')

      .limit(size)
      .offset(offset);

    return { count: 0, data };
  }

  // COLLECTION REPORT
  public getCollections = async (
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string,
    account_id: idType,
    client_id: idType,
    combined_id: idType,
    employee_id: idType,
    user_id: idType
  ) => {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select(
        'receipt_id',
        'receipt_received_by',
        'account_id',
        'client_id',
        'combine_id',
        'receipt_vouchar_no',
        'employee_full_name',
        'user_full_name',
        'account_name',
        'client_name',
        'receipt_payment_to',
        'receipt_payment_date',
        'receipt_total_amount',
        'charge_amount',
        'acctype_name',
        'bank_name',
        'receipt_payment_type',
        'cheque_status'
      )
      .from('v_mr')
      .andWhere((builder) => {
        builder
          .andWhere('receipt_org_agency', this.org_agency)
          .modify((event) => {
            if (search) {
              event
                .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                  `%${search}%`,
                ])
                .orWhereRaw(`LOWER(employee_full_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(user_full_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                  `%${search}%`,
                ]);
            }
            if (from_date && to_date) {
              event.andWhereRaw(
                `DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
            if (account_id && account_id !== 'all') {
              builder.where('account_id', account_id);
            }
            if (client_id && client_id !== 'all') {
              builder.where('client_id', client_id);
            }
            if (combined_id && combined_id !== 'all') {
              builder.where('combine_id', combined_id);
            }
            if (employee_id && employee_id !== 'all') {
              builder.where('receipt_received_by', employee_id);
            }
            if (user_id && user_id !== 'all') {
              builder.where('receipt_created_by', user_id);
            }
          });
      })
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('v_mr')
      .andWhere((builder) => {
        builder
          .andWhere('receipt_org_agency', this.org_agency)
          .modify((event) => {
            if (search) {
              event
                .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                  `%${search}%`,
                ])
                .orWhereRaw(`LOWER(employee_full_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(user_full_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                  `%${search}%`,
                ]);
            }
            if (from_date && to_date) {
              event.andWhereRaw(
                `DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
            if (account_id && account_id !== 'all') {
              builder.where('account_id', account_id);
            }
            if (client_id && client_id !== 'all') {
              builder.where('client_id', client_id);
            }
            if (combined_id && combined_id !== 'all') {
              builder.where('combine_id', combined_id);
            }
            if (employee_id && employee_id !== 'all') {
              builder.where('receipt_received_by', employee_id);
            }
            if (user_id && user_id !== 'all') {
              builder.where('receipt_created_by', user_id);
            }
          });
      })
      .andWhere('receipt_org_agency', this.org_agency);

    return { count: row_count, data };
  };
}

export default SalesPurchasesReport;
