import AbstractModels from '../../../../abstracts/abstract.models';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { idType } from '../../../../common/types/common.types';

import CustomError from '../../../../common/utils/errors/customError';
import { IAddClient, IUpdateClient } from '../types/client.interfaces';

class ClientModel extends AbstractModels {
  // INSERT CLIENT
  public async insertClient(data: IAddClient) {
    const [id] = await this.query().insert(data).into('trabill_clients');
    return id;
  }

  // UPDATE CLIENT OPENING BALANCE TRXN ID
  updateClientOpeningTransactions = async (
    client_opening_client_trxn_id: idType | null,
    clientId: idType
  ) => {
    return await this.query()
      .update({ client_opening_client_trxn_id })
      .into('trabill_clients')
      .where('client_id', clientId);
  };

  // SELECT CLIENT LAST BALANCE
  selectClientLBalance = async (comb_client: string) => {
    const { client_id, combined_id } = separateCombClientToId(comb_client);

    const balance = (await this.query()
      .select('combine_lbalance AS last_balance')
      .from('trabill_combined_clients')
      .where('combine_id', combined_id)
      .unionAll([
        this.db
          .select('client_lbalance AS last_balance')
          .from('trabill_clients')
          .where('client_id', client_id),
      ])) as { last_balance: number }[];

    if (balance.length) {
      return Number(balance[0].last_balance);
    } else {
      throw new CustomError(
        'Please provide a valid client Id',
        400,
        'Invalid client Id'
      );
    }
  };

  // GET SINGLE CLIENT BY CLIENT ID
  public async getSingleClient(id: idType) {
    const [client] = await this.query()
      .select(
        'client_id',
        'client_address',
        'client_category_id',
        'client_credit_limit',
        'client_email',
        'client_source',
        'client_gender',
        'client_mobile',
        'client_name',
        'client_trade_license',
        'client_type',
        'client_org_agency',
        'client_entry_id',
        'client_created_by',
        'client_designation',
        'client_lbalance',
        'client_created_date',
        'client_activity_status',
        'category_title',
        'client_walking_customer'
      )
      .from('trabill_clients')
      .leftJoin('trabill_client_categories', {
        category_id: 'client_category_id',
      })
      .where('client_id', id);

    if (!client) {
      throw new CustomError('Found no client with this ID', 400, 'Bad request');
    }
    return client;
  }

  // UPDATE  CLIENT
  public async updateClient(client_id: idType, data: IUpdateClient) {
    const client = await this.query()
      .into('trabill_clients')
      .update(data)
      .where('client_id', client_id);

    if (client) {
      return client;
    } else {
      throw new CustomError(`You can't edit this client`, 400, `Bad request`);
    }
  }

  public async updateClientStatus(
    client_id: idType,
    status: 'active' | 'inactive'
  ) {
    const client = await this.query()
      .into('trabill_clients')
      .update('client_activity_status', status == 'active' ? 1 : 0)
      .where('client_id', client_id)
      .andWhere('client_org_agency', this.org_agency);

    return client;
  }

  getClientCompany = async (client_id: idType) => {
    const [{ company_id }] = await this.db('trabill_client_company_information')
      .select('company_id')
      .where('company_client_id', client_id)
      .andWhereNot('company_is_deleted', 1);

    return company_id;
  };

  getClLastBalanceById = async (clientId: idType) => {
    const client = (await this.query()
      .select('client_lbalance')
      .from('trabill_clients')
      .where('client_id', clientId)) as { client_lbalance: number }[];

    if (!client.length) {
      throw new CustomError(
        'Please provide valid client id',
        400,
        'Invalid client id'
      );
    }

    const client_total_invoice = await this.query()
      .from('trabill_invoices')
      .select(this.db.raw('sum(invoice_net_total) as client_total'))
      .where('invoice_client_id', clientId)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereNot('invoice_is_deleted', 1);
    const client_total = Number(client_total_invoice[0]?.client_total);

    const client_pay_invoice = await this.query()
      .from('trabill_invoice_client_payments')
      .select(this.db.raw('sum(invclientpayment_amount) as total_pay'))
      .where('invclientpayment_client_id', clientId)
      .andWhereNot('invclientpayment_is_deleted', 1);
    const client_pay = Number(client_pay_invoice[0]?.total_pay);

    return {
      client_invoice_total: client_total,
      client_prev_due: client_total - client_pay,
      client_last_balance: Number(client[0].client_lbalance),
    } as {
      client_invoice_total: number;
      client_prev_due: number;
      client_last_balance: number;
    };
  };

  public async getClientInfo(id: idType) {
    const data = await this.query()
      .select(
        'client_type',
        this.db.raw(`COALESCE(client_name, company_name) as client_name`),
        'client_email',
        'company_email',
        this.db.raw(
          'COALESCE(client_mobile, company_contact_no) as client_mobile'
        ),
        'client_address',
        'client_lbalance'
      )
      .from('trabill_clients')
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'client_id',
      })
      .where('client_id', id);

    return data[0];
  }

  public async getAllClients(page: number, size: number, search: string) {
    const page_number = (page - 1) * size;

    const clients = await this.query()
      .select('*')
      .from('view_all_clients')
      .where((builder) => {
        builder.where('client_org_agency', this.org_agency).modify((event) => {
          if (search && search !== 'all') {
            event
              .andWhere('view_all_clients.client_name', 'LIKE', `%${search}%`)
              .orWhere('view_all_clients.mobile', 'LIKE', `%${search}%`)
              .andWhereRaw(`LOWER(view_all_clients.client_entry_id) LIKE ?`, [
                `%${search}%`,
              ]);
          }
        });
      })
      .andWhere('client_org_agency', this.org_agency)
      .limit(size)
      .offset(page_number);

    return clients;
  }

  public async viewAllClient(search: string) {
    search && search.toLowerCase();

    const clients = await this.query()
      .select(
        'client_id',
        'client_name',
        'client_last_balance as last_balance',
        'category_prefix',
        'mobile',
        'client_walking_customer',
        'client_activity_status'
      )
      .from(`${this.database}.view_all_clients`)
      .modify((event) => {
        if (search && search !== 'all') {
          event
            .where('client_org_agency', this.org_agency)
            .andWhere('client_activity_status', 1)
            .andWhere(this.db.raw('LOWER(client_id)'), 'LIKE', `%${search}%`)
            .orWhere(this.db.raw('LOWER(client_name)'), 'LIKE', `%${search}%`)
            .orWhere(this.db.raw('LOWER(mobile)'), 'LIKE', `%${search}%`);
        }
      })
      .andWhere('client_org_agency', this.org_agency)
      .andWhere('client_activity_status', 1)
      .limit(20);

    return clients;
  }

  public async countClientDataRow(search: string) {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('view_all_clients')
      .andWhere((builder) => {
        builder.where('client_org_agency', this.org_agency).modify((event) => {
          if (search && search !== 'all') {
            event
              .andWhere('view_all_clients.client_name', 'LIKE', `%${search}%`)
              .orWhere('view_all_clients.mobile', 'LIKE', `%${search}%`)
              .orWhere('view_all_clients.email', 'LIKE', `%${search}%`);
          }
        });
      })
      .andWhere('client_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getClientExcelData() {
    const clients = await this.query()
      .select(
        'trabill_clients.client_id',
        'trabill_clients.client_name',
        'client_source',
        'trabill_clients.client_email as email',
        'trabill_clients.client_mobile as mobile',
        'trabill_clients.client_lbalance as client_last_balance',
        'trabill_clients.client_activity_status',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS created_by"
        )
      )
      .from('trabill_clients')
      .join(
        'trabill_users',
        'trabill_users.user_id',
        'trabill_clients.client_created_by'
      )
      .leftJoin(
        'trabill_client_categories',
        'trabill_clients.client_category_id',
        'trabill_client_categories.category_id'
      )
      .where('client_org_agency', this.org_agency)
      .andWhereNot('client_is_deleted', 1)
      .orderBy('client_created_date', 'desc');

    return clients;
  }

  getClientOpeningTrxnInfo = async (clientId: idType) => {
    const client = await this.query()
      .select('client_opening_client_trxn_id')
      .from('trabill_clients')
      .where('client_id', clientId);

    return Number(client[0].client_opening_client_trxn_id);
  };

  public async getTraxn(client_id: number) {
    const [{ total }] = await this.query()
      .from(`${this.trxn}.client_trxn`)
      .count('* as total')
      .where('ctrxn_cl_id', client_id)
      .andWhere('ctrxn_agency_id', this.org_agency)
      .andWhereNot('ctrxn_particular_id', 11)
      .andWhereNot('ctrxn_is_delete', 1);

    return total;
  }

  public async deleteClient(client_id: number, delete_by: idType) {
    await this.db.raw("call deleteAccountByType('CLIENT', ?, ?);", [
      delete_by,
      client_id,
    ]);
  }

  public async getClientName(client_id: number) {
    const client = await this.query()
      .from('trabill_clients')
      .select('client_name')
      .where('client_id', client_id);

    return client[0] as { client_name: string };
  }

  public async clientAllInvoices(
    client_id: idType,
    combined_id: idType,
    page = 1,
    size = 20
  ) {
    const offset = (page - 1) * size;

    const data = await this.query()
      .select('*')
      .from('v_all_inv')
      .modify((e) => {
        if (client_id) {
          e.where('invoice_client_id', client_id);
        } else if (combined_id) {
          e.where('invoice_combined_id', combined_id);
        }
      })
      .andWhere('invoice_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);

    const [total] = await this.query()
      .count('* as count')
      .from('trabill_invoices')
      .modify((e) => {
        if (client_id) {
          e.where('invoice_client_id', client_id);
        } else if (combined_id) {
          e.where('invoice_combined_id', combined_id);
        }
      })
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereNot('invoice_is_deleted', 1);

    return { data, count: total.count };
  }

  public async clientMoneyReceipts(client_id: idType) {
    const data = await this.query()
      .select(
        'receipt_id',
        'receipt_vouchar_no',
        'receipt_payment_date',
        'receipt_total_amount',
        'receipt_note'
      )
      .from('trabill_money_receipts')
      .where('receipt_payment_status', 'SUCCESS')
      .andWhere('receipt_client_id', client_id)
      .andWhereNot('receipt_has_deleted', 1)
      .andWhere('receipt_org_agency', this.org_agency);

    return data;
  }

  public async clientAllQuotations(client_id: idType) {
    const data = await this.query()
      .select(
        'quotation_id',
        'quotation_no',
        'quotation_note',
        'quotation_create_date',
        'quotation_discount_total',
        'quotation_net_total'
      )
      .from('trabill_quotations')
      .leftJoin('trabill_clients', {
        client_id: 'quotation_client_id',
      })
      .where('quotation_client_id', client_id)
      .distinct()
      .where('quotation_is_deleted', 0)
      .andWhere('quotations_org_agency', this.org_agency);

    return data;
  }

  public async clientAirticketRefund(client_id: idType) {
    const data = await this.query()
      .select(
        'crefund_client_id',
        'atrefund_id',
        'invoice_no',
        'atrefund_date',
        'crefund_return_amount',
        'crefund_payment_type'
      )
      .from('trabill_airticket_refunds')
      .leftJoin('trabill_invoices', { invoice_client_id: 'atrefund_client_id' })
      .leftJoin('trabill_airticket_client_refunds', {
        crefund_refund_id: 'atrefund_id',
      })
      .where('crefund_client_id', client_id)
      .andWhereNot('atrefund_is_deleted', 1);

    return data;
  }

  public async clientOtherRefund(client_id: idType) {
    const data = await this.query()
      .select(
        'refund_client_id',
        'refund_vouchar_number',
        'crefund_return_amount as refund_net_total',
        'crefund_charge_amount',
        'crefund_payment_type as refund_payment_type'
      )
      .from('trabill_other_refunds')
      .leftJoin('trabill_other_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .where('refund_client_id', client_id)
      .andWhereNot('refund_is_deleted', 1)
      .andWhere('refund_org_agency', this.org_agency);

    return data;
  }

  public async clientTourRefund(client_id: idType) {
    const data = await this.query()
      .select(
        'crefund_client_id',
        'refund_vouchar_number',
        'crefund_total_amount as refund_total',
        'crefund_payment_type as payment_type',
        'crefund_charge_amount as charge_amount'
      )
      .from('trabill_tour_refunds')
      .leftJoin('trabill_tour_refunds_to_clients', { crefund_id: 'refund_id' })
      .where('crefund_client_id', client_id)
      .andWhereNot('refund_is_deleted', 1)
      .andWhere('refund_org_agency', this.org_agency);

    return data;
  }

  public async clientAllPassport(client_id: idType) {
    const data = await this.query()
      .select(
        'passport_id',
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire'
      )
      .from('trabill_passport_details')
      .whereNot('passport_is_deleted', 1)
      .andWhere('passport_client_id', client_id)
      .andWhere('passport_org_agency', this.org_agency);

    return data;
  }

  public async getAllClientsAndCombined(search: string | '') {
    search && search.toLowerCase();

    const querySearch = `%${search}%`;

    const clients = await this.query()
      .select(
        'client_id',
        'client_entry_id',
        'client_name',
        'client_mobile',
        this.db.raw('"client" as client_type'),
        'client_walking_customer'
      )
      .from('trabill.trabill_clients')
      .where('client_org_agency', this.org_agency)
      .andWhereNot('client_is_deleted', 1)
      .andWhere((builder) => {
        builder.where('client_org_agency', this.org_agency).modify((event) => {
          if (search && search !== 'all') {
            event
              .whereRaw('LOWER(client_name) LIKE ?', [querySearch])
              .orWhereRaw('LOWER(client_mobile) LIKE ? ', [querySearch]);
          } else {
            event.limit(30);
          }
        });
      })

      .unionAll([
        this.db
          .select(
            'combine_id',
            'combine_entry_id',
            'combine_name',
            'combine_mobile',
            this.db.raw('"combined" as client_type'),
            this.db.raw('0 as client_walking_customer')
          )
          .from('trabill.trabill_combined_clients')
          .where('combine_org_agency', this.org_agency)
          .andWhereNot('combine_is_deleted', 1)
          .andWhere((builder) => {
            builder
              .where('combine_org_agency', this.org_agency)
              .modify((event) => {
                if (search && search !== 'all') {
                  event
                    .whereRaw('LOWER(combine_name) LIKE ?', [querySearch])
                    .orWhereRaw('LOWER(combine_mobile) LIKE ? ', [querySearch]);
                } else {
                  event.limit(30);
                }
              });
          }),
      ])
      .orderBy('client_name')
      .limit(30);

    return clients;
  }

  public async getClientCombinedIncentiveIncome(page: number, size: number) {
    const page_number = (page - 1) * size;

    const data = await this.query()
      .select(
        'incentive_id',
        this.db.raw('coalesce(client_name, combine_name) as client_name'),
        this.db.raw(
          `coalesce(combine_company_name, 'company_name') as company_name`
        ),
        'incentive_vouchar_no',
        'account_name',
        'incentive_adjust_bill',
        'incentive_amount',
        'trxntype_name as transaction_type',
        'incentive_created_date',
        'incentive_note',
        this.db.raw(`concat(user_first_name,' ',user_last_name) as created_by`),
        'incentive_is_deleted'
      )
      .from('trabill_incentive_income_details')
      .leftJoin('trabill_accounts', {
        'trabill_accounts.account_id': 'incentive_account_id',
      })
      .leftJoin('trabill_clients', { client_id: 'incentive_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'incentive_combine_id',
      })
      .leftJoin('trabill_transaction_type', {
        trxntype_id: 'incentive_trnxtype_id',
      })
      .leftJoin('trabill_users', { user_id: 'incentive_created_by' })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'client_id',
      })
      .where('incentive_org_agency', this.org_agency)
      .andWhere('incentive_is_deleted', 0)
      .andWhere('incentive_type', 'COMB_CLIENT')

      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw('count(*) as row_count'))
      .from('trabill_incentive_income_details')
      .where('incentive_org_agency', this.org_agency)
      .andWhere('incentive_is_deleted', 0)
      .andWhere('incentive_type', 'COMB_CLIENT');

    return { count: row_count, data };
  }

  public async getSingleClientCombinedIncentiveIncome(incentive_id: idType) {
    const client = await this.query()
      .select(
        'incentive_id',
        this.db.raw('coalesce(client_name, combine_name) as client_name'),
        this.db.raw(
          'CASE WHEN incentive_client_id IS NOT NULL THEN CONCAT("client-",incentive_client_id) ELSE CONCAT("combined-",incentive_combine_id) END AS comb_client'
        ),
        'incentive_account_id',
        'account_name',
        'account_branch_name',
        'incentive_adjust_bill',
        'incentive_amount',
        'incentive_note',
        this.db.raw(`concat(user_first_name,' ',user_last_name) as created_by`),
        'incentive_is_deleted',
        'incentive_trnxtype_id as type_id',
        'trxntype_name',
        'incentive_account_category_id',
        this.db.raw(
          `CASE WHEN incentive_account_category_id = 1 THEN 'Cash' WHEN incentive_account_category_id = 2 THEN 'Bank' WHEN incentive_account_category_id = 3 THEN 'Mobile Banking' WHEN incentive_account_category_id = 4 THEN 'Cheque' ELSE NULL END AS transaction_type`
        ),
        'incentive_created_date'
      )
      .from('trabill_incentive_income_details')
      .leftJoin('trabill_accounts', {
        'trabill_accounts.account_id': 'incentive_account_id',
      })
      .leftJoin('trabill_clients', { client_id: 'incentive_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'incentive_combine_id',
      })
      .leftJoin('trabill_transaction_type', {
        trxntype_id: 'incentive_trnxtype_id',
      })
      .leftJoin('trabill_users', { user_id: 'incentive_created_by' })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'client_id',
      })
      .andWhere('incentive_id', incentive_id);

    return client;
  }

  public async getCombClientMobile(client_id: number, combine_id: number) {
    const [data] = await this.query()
      .select('client_category_id as category_id', 'client_mobile as mobile')
      .from('trabill_clients')
      .where('client_id', client_id)
      .unionAll([
        this.db
          .select(
            'combine_category_id as category_id',
            'combine_mobile as mobile'
          )
          .from('trabill_combined_clients')
          .where('combine_id', combine_id),
      ]);
    return data as { category_id: number; mobile: string };
  }
}

export default ClientModel;
