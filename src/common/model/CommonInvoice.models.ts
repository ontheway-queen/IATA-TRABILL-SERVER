import moment from 'moment';
import AbstractModels from '../../abstracts/abstract.models';

import {
  IAirticketRoutes,
  InvoiceAirticketPreType,
} from '../../modules/invoices/invoice-air-ticket/types/invoiceAirticket.interface';
import { isEmpty, isNotEmpty } from '../helpers/invoice.helpers';
import { IInvoiceVoidDetails } from '../interfaces/commonInterfaces';
import {
  IInvoiceInfoDb,
  IUpdateInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../types/Invoice.common.interface';
import {
  InvoiceHistory,
  billingTableType,
  idType,
} from '../types/common.types';
import CustomError from '../utils/errors/customError';
import { IAdvanceMr, IAdvanceMrInsert } from './interfaces';

class CommonInvoiceModel extends AbstractModels {
  checkCreditLimit = async (
    ac_type: 'CLIENT' | 'COMBINED',
    ac_id: idType,
    ac_amount: number
  ) => {
    const [[[data]]] = await this.db.raw(
      `CALL ${this.database}.check_credit_limit(?, ?, ?)`,
      [ac_type, ac_id, ac_amount]
    );

    return data?.result;
  };

  public async getAllInvoices(
    category_id: 1 | 2 | 3 | 4 | 5 | 10 | 26 | 30 | 31,
    page: number,
    size: number,
    search_text: string = '',
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLowerCase();
    size = Number(size);
    const offset = (Number(page) - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select('*')
      .from('v_all_inv')
      .where('invoice_category_id', category_id)
      .modify((event) => {
        event
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(invoice_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }

            if (search_text) {
              this.andWhereRaw(`LOWER(v_all_inv.invoice_no) LIKE ?`, [
                `%${search_text}%`,
              ]).orWhereRaw(`LOWER(v_all_inv.client_name) LIKE ?`, [
                `%${search_text}%`,
              ]);
            }
          })
          .andWhere('invoice_org_agency', this.org_agency);
      })
      .andWhere('invoice_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);

    const [{ row_count }] = await this.query()
      .select(this.db.raw('count(*) as row_count'))
      .from('v_all_inv')
      .where('invoice_org_agency', this.org_agency)
      .andWhere('invoice_category_id', category_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereRaw(
            `DATE_FORMAT(invoice_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }

        if (search_text) {
          this.andWhereRaw(`LOWER(v_all_inv.invoice_no) LIKE ?`, [
            `%${search_text}%`,
          ]).orWhereRaw(`LOWER(v_all_inv.client_name) LIKE ?`, [
            `%${search_text}%`,
          ]);
        }
      });

    return { count: row_count, data };
  }

  public async insertInvoiceAirticketPax(
    p_invoice_id: number,
    p_airticket_id: number,
    p_passport_id: number
  ) {
    await this.query()
      .insert({ p_invoice_id, p_airticket_id, p_passport_id })
      .into('trabill_invoice_airticket_pax');
  }

  public async insertPaxIfNotExist(
    p_invoice_id: number,
    p_airticket_id: number,
    p_passport_id: number
  ) {
    const [isExist] = (await this.query()
      .count('* as count')
      .from('trabill_invoice_airticket_pax')
      .where('p_invoice_id', p_invoice_id)
      .where('p_airticket_id', p_airticket_id)
      .where('p_passport_id', p_passport_id)) as { count: number }[];

    if (!isExist.count) {
      await this.query()
        .insert({ p_invoice_id, p_airticket_id, p_passport_id })
        .into('trabill_invoice_airticket_pax');
    }
  }

  public async deleteInvoiceAirTicketPax(
    p_invoice_id: number,
    p_airticket_id: number,
    p_passport_id: number
  ) {
    await this.query()
      .update({ p_is_deleted: 1 })
      .from('trabill_invoice_airticket_pax')
      .where('p_invoice_id', p_invoice_id)
      .where('p_airticket_id', p_airticket_id)
      .where('p_passport_id', p_passport_id);
  }

  public async deletePreviousPax(
    p_invoice_id: number,
    p_airticket_id?: number
  ) {
    if (p_airticket_id) {
      await this.query()
        .update({ p_is_deleted: 1 })
        .from('trabill_invoice_airticket_pax')
        .whereNull('p_passport_id')
        .andWhere('p_invoice_id', p_invoice_id)
        .andWhere('p_airticket_id', p_airticket_id);
    }
  }

  public async deleteInvoicePax(
    p_invoice_id: number,
    p_airticket_id: number,
    p_passport_id: number
  ) {
    await this.query()
      .insert({ p_invoice_id, p_airticket_id, p_passport_id })
      .into('trabill_invoice_airticket_pax');
  }

  public async insertInvoiceAirticketPaxName(
    p_invoice_id: number,
    p_airticket_id: number,
    p_passport_name: string,
    p_passport_type: 'Adult' | 'Child' | 'Infant' | string,
    p_mobile_no: string,
    p_email: string
  ) {
    await this.query()
      .insert({
        p_invoice_id,
        p_airticket_id,
        p_passport_name,
        p_passport_type,
        p_mobile_no,
        p_email,
      })
      .into('trabill_invoice_airticket_pax');
  }

  public async updateInvoiceAirTicketPax(
    p_invoice_id: number,
    p_airticket_id: number,
    pax_passports?: number[]
  ) {
    const previous_pax = await this.query()
      .select('p_invoice_id', 'p_airticket_id', 'p_passport_id')
      .from('trabill_invoice_airticket_pax')
      .where('p_invoice_id', p_invoice_id)
      .andWhere('p_airticket_id', p_airticket_id)
      .whereNotNull('p_passport_id')
      .andWhereNot('p_is_deleted', 1);

    if (pax_passports) {
      for (const paxInfo of previous_pax) {
        if (!pax_passports.includes(paxInfo.p_passport_id)) {
          await this.query()
            .update({ p_is_deleted: 1 })
            .from('trabill_invoice_airticket_pax')
            .where('p_invoice_id', p_invoice_id)
            .andWhere('p_airticket_id', p_airticket_id)
            .andWhere('p_passport_id', paxInfo.p_passport_id);
        }
      }

      const pax_passport_id = previous_pax.map((item) => item.p_passport_id);

      for (const passportId of pax_passports) {
        if (!pax_passport_id.includes(passportId) && passportId) {
          await this.query()
            .insert({ p_invoice_id, p_airticket_id, p_passport_id: passportId })
            .into('trabill_invoice_airticket_pax');
        }
      }
    }
  }

  hasInvoiceMoneyReceipt = async (invoice_id: idType) => {
    const [data] = (await this.query()
      .count('invclientpayment_id as total')
      .from('trabill_invoice_client_payments')
      .where('invclientpayment_invoice_id', invoice_id)
      .whereNot('invclientpayment_is_deleted', 1)) as { total: number }[];

    return data.total;
  };

  public async getPreviousInvoices(invoice_id: idType) {
    const [data] = await this.query()
      .from('trabill_invoices')
      .select(
        'invoice_client_id as prevClientId',
        'invoice_net_total as prev_inv_net_total',
        'invoice_combined_id as prevComId',
        'invoice_agent_com_amount as prevAgentCommission',
        'invoice_agent_id as prevAgentId',
        'invoice_cltrxn_id as prevCtrxnId',
        'invoice_discount_cltrxn_id as prevClChargeTransId',
        'invoice_no as prevInvoiceNo',
        'invoice_note AS prevInvoiceNote',
        this.db.raw(
          "coalesce(concat('client-',invoice_client_id), concat('combined-',invoice_combined_id)) as comb_client"
        ),
        'invoice_category_id'
      )
      .where('invoice_id', invoice_id)
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      });

    if (!data) {
      throw new CustomError(
        'Please provide valid invoice id',
        400,
        'Invalid id'
      );
    }

    return {
      ...data,
      prevClientId: Number(data.prevClientId),
      prev_inv_net_total: Number(data.prev_inv_net_total),
    } as {
      prevClientId: number | null;
      prev_inv_net_total: number;
      prevComId: number | null;
      prevAgentCommission: number;
      prevAgentId: number;
      prevCtrxnId: number;
      prevClChargeTransId: number;
      comb_client: string;
      prevInvoiceNo: string;
      prevInvoiceNote: string;
      invoice_category_id: number;
    };
  }

  updateIsVoid = async (
    invoiceId: idType,
    invoice_void_charge: number,
    void_charge_ctrxn_id: null | number,
    invoice_void_date: string
  ) => {
    await this.query()
      .update({
        invoice_void_charge,
        invoice_is_void: 1,
        invoice_is_deleted: 1,
        invoice_void_ctrxn_id: void_charge_ctrxn_id,
        invoice_void_date,
      })
      .into('trabill_invoices')
      .where('invoice_id', invoiceId);
  };

  getProductsName = async (productIds: number[]) => {
    if (productIds.length) {
      const names = await this.query()
        .select(
          this.db.raw(
            `REPLACE(group_concat(product_name, '\n'), ',', '') as productsName`
          )
        )
        .from('trabill_products')
        .whereIn('product_id', productIds);

      return names[0].productsName;
    }

    return '';
  };

  // INVOICES
  public async insertInvoicesInfo(invoice_information: IInvoiceInfoDb) {
    const invoice_id = await this.query()
      .into('trabill_invoices')
      .insert({ ...invoice_information, invoice_org_agency: this.org_agency });

    if (!invoice_id.length) {
      throw new CustomError(
        'Cannot insert invoice data',
        400,
        'Invalid invoice data'
      );
    }

    return invoice_id[0] as number;
  }

  public async updateInvoiceInformation(
    id: idType,
    updated_invoice: IUpdateInvoiceInfoDb
  ) {
    await this.query()
      .into('trabill_invoices')
      .update(updated_invoice)
      .where('invoice_id', id);
  }
  public async updateInvoiceClTrxn(
    invoice_cltrxn_id: number | null,
    invoice_id: idType
  ) {
    await this.query()
      .into('trabill_invoices')
      .update({ invoice_cltrxn_id })
      .where('invoice_id', invoice_id);
  }

  public async deleteInvoices(
    invoiceId: idType,
    invoice_has_deleted_by: idType
  ) {
    // const has_v_pay = await this.query()
    //   .select('*')
    //   .from('trabill_invoice_vendor_payments')
    //   .where('invendorpay_isdeleted', 0)
    //   .andWhere('invendorpay_invoice_id', invoiceId);

    // const has_c_receipt = await this.query()
    //   .select('*')
    //   .from('trabill_invoice_client_payments')
    //   .where('invclientpayment_is_deleted', 0)
    //   .andWhere('invclientpayment_invoice_id', invoiceId);

    // if (has_c_receipt.length || has_v_pay.length) {
    //   throw new CustomError(
    //     `You can't delete this invoice`,
    //     400,
    //     'Bad request'
    //   );
    // }

    await this.db.raw(`CALL ${this.database}.delete_invoice(?,?);`, [
      invoiceId,
      invoice_has_deleted_by,
    ]);
  }

  getForEditInvoice = async (invoiceId: idType) => {
    const data = await this.query()
      .select('*')
      .from('view_invoice_for_edit')
      .where('invoice_id', invoiceId);

    if (isNotEmpty(data)) return data[0];
    else {
      throw new CustomError(
        'Please provide a valid invoice id',
        400,
        'Invalid invoice id'
      );
    }
  };

  getProductById = async (productId: idType) => {
    const data = await this.query()
      .select('product_name')
      .from('trabill_products')
      .where('product_id', productId);

    return data[0].product_name;
  };

  getAirticketPrerequire = async (invoice_id: idType) => {
    const data = await this.query()
      .from('trabill_invoices_airticket_prerequire')
      .select('invoice_show_discount', 'invoice_show_prev_due')
      .where('airticket_invoice_id', invoice_id);

    return data[0];
  };

  public getInvoiceAirTicketPaxDetails = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'passport_date_of_birth',
        'passport_date_of_expire',
        'passport_date_of_issue',
        this.db.raw('COALESCE(passport_email,p_email) AS passport_email'),
        this.db.raw(
          'COALESCE(passport_mobile_no,p_mobile_no) AS passport_mobile_no'
        ),
        'passport_nid_no',
        'passport_passport_no',
        this.db.raw(
          'COALESCE(passport_name, p_passport_name) AS passport_name'
        ),
        this.db.raw(
          'COALESCE(passport_person_type, p_passport_type) AS passport_person_type'
        )
      )
      .from('trabill_invoice_airticket_pax')
      .where('p_invoice_id', invoiceId)
      .andWhereNot('p_is_deleted', 1)
      .leftJoin('trabill_passport_details', {
        p_passport_id: 'passport_id',
      })
      .groupBy('passport_id');
  };

  public async getViewInvoiceInfo(invoiceId: idType) {
    const data = await this.query()
      .from('trabill_invoices')
      .select(
        'invoice_no',
        'invoice_reference',
        'invoice_client_previous_due',
        'invoice_total_profit',
        'invoice_show_discount',
        'invoice_show_prev_due',
        'employee_full_name',
        'invoice_net_total',
        'invoice_sub_total',
        'invoice_total_vendor_price',
        'invoice_category_id',
        'invoice_create_date as invoice_date',
        'invoice_sales_date',
        'invoice_due_date',
        'invoice_vat',
        'invoice_service_charge',
        'invoice_discount',
        'agent_name',
        'invoice_agent_com_amount',
        'invoice_walking_customer_name',
        'invoice_reissue_client_type',
        'invoice_is_refund',
        this.db.raw(
          "CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"
        ),
        this.db.raw(
          'COALESCE(cl.client_name, ccl.combine_name) AS client_name'
        ),
        this.db.raw(
          `COALESCE(cl.client_mobile, ccl.combine_mobile) AS client_mobile`
        ),
        this.db.raw(
          'COALESCE(cl.client_email, ccl.combine_email) AS client_email'
        ),
        this.db.raw(
          'COALESCE(cl.client_address, ccl.combine_address) AS client_address'
        ),

        'invoice_note',
        'user_first_name',
        this.db.raw(`CASE WHEN COUNT(ti_id) > 0 THEN 1 ELSE 0 END AS is_edited`)
      )
      .where('invoice_id', invoiceId)
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      })
      .leftJoin('trabill_invoices_airticket_prerequire', {
        airticket_invoice_id: 'invoice_id',
      })
      .leftJoin('trabill_agents_profile', { agent_id: 'invoice_agent_id' })
      .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
      .leftJoin('trabill_users', { user_id: 'invoice_created_by' })
      .leftJoin('trabill_clients as cl', { invoice_client_id: 'cl.client_id' })
      .leftJoin(
        'trabill_combined_clients as ccl',
        'ccl.combine_id',
        'invoice_combined_id'
      )
      .leftJoin(`trabill_invoice_info`, {
        ti_invoice_id: 'invoice_id',
      });

    if (isEmpty(data)) {
      throw new CustomError(
        'Please provide a valid invoice id',
        400,
        'Invalid Invoice Id'
      );
    }

    const [invoices_pay] = await this.query()
      .select(
        this.db.raw(
          'CAST(SUM(invclientpayment_amount) AS DECIMAL(15,2)) AS invoice_pay'
        ),

        this.db.raw(
          'CAST(invoice_net_total - SUM(invclientpayment_amount) AS DECIMAL(15,2)) AS invoice_due'
        )
      )
      .from('trabill_invoice_client_payments')
      .join('trabill_invoices', {
        invoice_id: 'invclientpayment_invoice_id',
      })
      .where('invclientpayment_invoice_id', invoiceId)
      .andWhereNot('invclientpayment_is_deleted', 1);

    return { ...data[0], ...invoices_pay };
  }

  public getViewBillingInfo = async (
    inovice_id: idType,
    billingTable: billingTableType
  ) => {
    const data = await this.query()
      .select(
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),

        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit',
        'product_name',
        'pax_name',
        'billing_description'
      )
      .from(billingTable)
      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'billing_combined_id',
      })
      .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .where('billing_invoice_id', inovice_id)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  //   INVOICE EXTRA AMOUNT
  insertInvoiceExtraAmount = async (data: InvoiceExtraAmount) => {
    await this.query().insert(data).into('trabill_invoices_extra_amounts');
  };

  insertInvoicePreData = async (data: InvoiceAirticketPreType) => {
    await this.query()
      .insert(data)
      .into('trabill_invoices_airticket_prerequire');
  };

  updateInvoiceExtraAmount = async (
    data: InvoiceExtraAmount,
    invoiceId: idType
  ) => {
    await this.query()
      .update(data)
      .into('trabill_invoices_extra_amounts')
      .where('extra_amount_invoice_id', invoiceId);
  };

  public updateAirticketPreData = async (
    data: InvoiceAirticketPreType,
    invoiceId: idType
  ) => {
    await this.query()
      .update(data)
      .into('trabill_invoices_airticket_prerequire')
      .where('airticket_invoice_id', invoiceId);
  };

  public async insertInvoiceHistory(historyData: InvoiceHistory) {
    await this.query()
      .into('trabill_invoices_history')
      .insert({ ...historyData, history_org_agency: this.org_agency });
  }
  public async insertInvHistory(historyData: any[]) {
    await this.query().into('trabill_invoices_history').insert(historyData);
  }

  public getClientDue = async (clientId: idType) => {
    const invoices = await this.query()
      .select(this.db.raw('sum(invoice_net_total) as total_invoices'))
      .from('trabill_invoices')
      .where('invoice_client_id', clientId)
      .andWhereNot('invoice_is_deleted', 1);

    if (isEmpty(invoices)) {
      throw new CustomError('Cannot get client due', 400, 'Invalid client id');
    }

    const paidPay = await this.query()
      .select(this.db.raw('sum(invclientpayment_amount) as total_paid'))
      .from('trabill_invoice_client_payments')
      .where('invclientpayment_client_id', clientId)
      .andWhereNot('invclientpayment_is_deleted', 1);

    if (isNotEmpty(paidPay)) {
      return Number(invoices[0].total_invoices) - Number(paidPay[0].total_paid);
    } else {
      return Number(invoices[0].total_invoices);
    }
  };

  insertAirticketRoute = async (data: IAirticketRoutes[]) => {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_invoice_airticket_routes');
    return id;
  };

  deleteAirticketRoute = async (
    invoiceId: idType,
    airoute_deleted_by: idType
  ) => {
    await this.query()
      .update({ airoute_is_deleted: 1, airoute_deleted_by })
      .into('trabill_invoice_airticket_routes')
      .where('airoute_invoice_id', invoiceId);
  };

  deleteAirticketRouteByTicketIdAndInvoice = async (
    invoiceId: idType,
    ticketId: idType,
    airoute_deleted_by: idType
  ) => {
    await this.query()
      .update({ airoute_is_deleted: 1, airoute_deleted_by })
      .into('trabill_invoice_airticket_routes')
      .where('airoute_invoice_id', invoiceId)
      .andWhere('airoute_airticket_id', ticketId);
  };

  getInvoiceRoutes = async (invoiceId: idType) => {
    const airticketRoutesId = await this.query()
      .select('airoute_route_sector_id')
      .from('trabill_invoice_airticket_routes')
      .leftJoin('trabill_airports', { airline_id: 'airoute_route_sector_id' })
      .where('airoute_invoice_id', invoiceId)
      .andWhereNot('airoute_is_deleted', 1);

    const airticket_route_or_sector = airticketRoutesId.map(
      (item) => item.airoute_route_sector_id
    );

    return airticket_route_or_sector;
  };

  getInvoiceRoutesName = async (invoiceId: idType) => {
    const [routes] = await this.query()
      .select(this.db.raw("group_concat(airline_iata_code, '-') as routes"))
      .from('trabill_invoice_airticket_routes')
      .where('airoute_invoice_id', invoiceId)
      .andWhereNot('airoute_is_deleted', 1)
      .leftJoin('trabill_airports', { airline_id: 'airoute_route_sector_id' })
      .groupBy('airoute_invoice_id');

    routes;
  };

  getAllInvoiceNomAndId = async () => {
    return await this.query()
      .select('invoice_id', 'invoice_no', 'invoice_category_id as cate_id')
      .from('trabill_invoices')
      .where('invoice_org_agency', this.org_agency)
      .whereNot('invoice_is_deleted', 1)
      .andWhereNot('invoice_is_refund', 1);
  };

  public getSmsInvoiceInfo = async (invoiceId: idType) => {
    const [data] = await this.query()
      .select(
        'invoice_no',
        'org_owner_full_name',
        this.db.raw('COALESCE(client_name, combine_name) AS client_name'),
        'invoice_net_total',
        'org_currency',
        'invoice_sales_date'
      )
      .from('trabill_invoices')
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'invoice_org_agency',
      })
      .leftJoin('view_all_clients', { client_id: 'invoice_client_id' })
      .leftJoin('view_all_combined_clients', {
        combine_id: 'invoice_combined_id',
      })
      .where('invoice_id', invoiceId);

    return data as {
      invoice_no: string;
      org_owner_full_name: string;
      client_name: string;
      invoice_net_total: number;
      org_currency: string;
      invoice_sales_date: string;
    };
  };

  public getSmsReceiptInfo = async (receiptId: idType) => {
    const [data] = await this.query()
      .select(
        'receipt_total_amount',
        'org_owner_full_name',
        'org_currency',
        this.db.raw('COALESCE(client_name, combine_name) AS client_name'),
        this.db.raw(
          'COALESCE(client_last_balance, combine_lastbalance_amount) AS client_last_balance'
        ),
        'receipt_payment_date'
      )
      .from('trabill_money_receipts')
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'receipt_org_agency',
      })
      .leftJoin('view_all_clients', { client_id: 'receipt_client_id' })
      .leftJoin('view_all_combined_clients', {
        combine_id: 'receipt_combined_id',
      })
      .where('receipt_id', receiptId);

    return data as {
      receipt_total_amount: number;
      org_owner_full_name: string;
      org_currency: string;
      client_name: string;
      client_last_balance: number;
      receipt_payment_date: string;
    };
  };

  getRoutesInfo = async (routes_id: number[]) => {
    const newRoute: { airline_iata_code: string }[] = [];

    for (const id of routes_id) {
      if (id) {
        const [route] = (await this.query()
          .select('airline_iata_code')
          .from('trabill_airports')
          .where('trabill_airports.airline_id', id)) as {
          airline_iata_code: string;
        }[];
        newRoute.push(route);
      }
    }

    const route = newRoute.map((item) => item.airline_iata_code).join('->');

    return route;
  };

  getPassportName = async (id: number[]) => {
    if (id[0]) {
      const names = await this.query()
        .select('passport_name')
        .from('trabill.trabill_passport_details')
        .whereIn('passport_id', id);

      return names.map((item) => item.passport_name).join(', ');
    }
  };

  public async createInvoiceVoidDetails(
    data: IInvoiceVoidDetails | IInvoiceVoidDetails[]
  ) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_invoices_void_details');

    return id;
  }

  getReissuedItemByInvId = async (existingInvoiceId: idType) => {
    return await this.query()
      .select(
        this.db.raw('COALESCE(vendor_name, combine_name) vendor_name'),
        'airticket_sales_date',
        'airticket_profit',
        'airticket_journey_date',
        'airticket_return_date',
        'airticket_purchase_price',
        'airticket_client_price',
        'airticket_ticket_no',
        'airticket_existing_invoiceid',
        'airticket_existing_airticket_id',
        'airticket_penalties',
        'airticket_fare_difference',
        'airticket_commission_percent',
        'airticket_ait',
        'airticket_issue_date',
        'airticket_classes'
      )
      .from('trabill_invoice_reissue_airticket_items')
      .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'airticket_vendor_combine_id',
      })
      .where('airticket_existing_invoiceid', existingInvoiceId)
      .andWhereNot('airticket_is_deleted', 1);
  };

  // ADVANCE MONEY RECEIPT
  getAdvanceMrById = async (cl_id: number | null, com_id: number | null) => {
    const data = await this.query()
      .select('*')
      .from('v_advance_mr')
      .where('receipt_org_agency', this.org_agency)
      .andWhere('receipt_client_id', cl_id)
      .andWhere('receipt_combined_id', com_id);

    return data as IAdvanceMr[];
  };

  insertAdvanceMr = async (data: IAdvanceMrInsert) => {
    await this.query().insert(data).into('trabill_invoice_client_payments');
  };

  getInvoiceDiscount = async (invoiceId: idType) => {
    const [data] = await this.query()
      .select(
        'invoice_vat',
        'invoice_discount',
        'invoice_service_charge as service_charge'
      )
      .from('trabill_invoices_extra_amounts')
      .where('extra_amount_invoice_id', invoiceId);

    return data;
  };

  getAuthorizedBySignature = async () => {
    const [data] = await this.query()
      .select(
        'sig_signature',
        'sig_type',
        'sig_name_title',
        'sig_position',
        'sig_phone_no'
      )
      .from('trabill_signature_info')
      .where('sig_org_id', this.org_agency)
      .andWhere('sig_type', 'AUTHORITY');

    return data;
  };

  getInvoicePreparedBy = async (invoice_id: idType) => {
    const [data] = await this.query()
      .select(
        'sig_signature',
        'sig_type',
        'sig_name_title',
        'sig_position',
        'sig_phone_no'
      )
      .from('trabill_invoices')
      .leftJoin('trabill_signature_info', { sig_user_id: 'invoice_created_by' })
      .where('invoice_id', invoice_id)
      .andWhere('sig_type', 'PREPARE');

    return data;
  };
}

export default CommonInvoiceModel;
