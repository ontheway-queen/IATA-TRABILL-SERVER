import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import {
  ICombineClient,
  ICombineClientsEditReqBody,
  ICombineProducts,
  ICombinedTransaction,
  IUpdateCombinedTransaction,
} from '../types/combineClients.interfaces';

class CombineClientsModels extends AbstractModels {
  public async insertCombineClient(data: ICombineClient) {
    const id = await this.query()
      .insert({ ...data, combine_org_agency: this.org_agency })
      .into('trabill_combined_clients');

    return id[0];
  }



  public async getTraxn(combine_id: idType) {
    const [{ total }] = await this.query()
      .from(`${this.trxn}.comb_trxn`)
      .count('* as total')
      .where('comtrxn_comb_id', combine_id)
      .andWhere('comtrxn_agency_id', this.org_agency)
      .andWhereNot('comtrxn_particular_id', 11)
      .andWhereNot('comtrxn_is_deleted', 1);

    return total;
  }

  updateCombineClientOpeningTrxnId = async (
    combine_opening_trxn_id: idType | null,
    combine_id: idType
  ) => {
    return await this.query()
      .update({ combine_opening_trxn_id })
      .into('trabill_combined_clients')
      .where('combine_id', combine_id);
  };

  getCombineClientOpeningTrxnId = async (combine_id: idType) => {
    const [combine] = await this.query()
      .select('combine_opening_trxn_id')
      .from('trabill_combined_clients')
      .where('combine_id', combine_id);

    return Number(combine.combine_opening_trxn_id);
  };


  getCombinedLastBalance = async (combined_id: idType) => {
    const client = (await this.query()
      .select('combine_lbalance')
      .from('trabill_combined_clients')
      .where('combine_id', combined_id)) as { combine_lbalance: number }[];

    if (!client.length) {
      throw new CustomError(
        'Pleace provide valid client id',
        400,
        'Invalid client id'
      );
    }

    const client_total_invoice = await this.query()
      .from('trabill_invoices')
      .select(this.db.raw('sum(invoice_net_total) as client_total'))
      .where('invoice_combined_id', combined_id)
      .andWhereNot('invoice_is_deleted', 1);
    const client_total = Number(client_total_invoice[0]?.client_total);

    const client_pay_invoice = await this.query()
      .from('trabill_invoice_client_payments')
      .select(this.db.raw('sum(invclientpayment_amount) as total_pay'))
      .where('invclientpayment_combined_id', combined_id)
      .andWhereNot('invclientpayment_is_deleted', 1);
    const client_pay = Number(client_pay_invoice[0]?.total_pay);

    return {
      client_invoice_total: client_total,
      client_prev_due: client_total - client_pay,
      client_last_balance: Number(client[0].combine_lbalance),
    } as {
      client_invoice_total: number;
      client_prev_due: number;
      client_last_balance: number;
    };
  };

  public async insertCombineClientProducts(data: ICombineProducts[]) {
    const combineProducts = await this.query()
      .insert(data)
      .into('trabill_combine_products');

    return combineProducts;
  }

  public async getAllCombines(
    is_deleted: idType,
    page: number,
    size: number,
    search: string
  ) {
    const page_number = (page - 1) * size;

    const combined_client = await this.query()
      .select('*')
      .from('view_all_combined_clients')
      .where('combine_is_deleted', is_deleted)
      .andWhere((builder) => {
        builder.where('combine_org_agency', this.org_agency).modify((event) => {
          if (search && search !== 'all') {
            event
              .andWhere(
                'view_all_combined_clients.combine_name',
                'LIKE',
                `%${search}%`
              )
              .orWhere(
                'view_all_combined_clients.combine_mobile',
                'LIKE',
                `%${search}%`
              )
              .orWhere(
                'view_all_combined_clients.combine_email',
                'LIKE',
                `%${search}%`
              );
          }
        });
      })
      .andWhere('combine_org_agency', this.org_agency)
      .limit(size)
      .offset(page_number);

    return combined_client;
  }

  public async viewAllCombine(search: string) {
    const combine = await this.query()
      .select('combine_id', 'combine_name', 'combine_lbalance as last_balance')
      .from('trabill_combined_clients')
      .whereNot('combine_is_deleted', 1)
      .modify((event) => {
        if (search) {
          event
            .andWhere('combine_org_agency', this.org_agency)
            .andWhere('combine_name', 'like', `%${search}%`)
            .orWhere('combine_mobile', 'like', `%${search}%`);
        } else {
          event.orderBy('combine_id', 'desc').limit(20);
        }
      })
      .andWhere('combine_org_agency', this.org_agency);

    return combine;
  }

  public async countCombineDataRow(is_deleted: idType, search: string) {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('view_all_combined_clients')
      .where('combine_is_deleted', is_deleted)
      .andWhere((builder) => {
        builder.where('combine_org_agency', this.org_agency).modify((event) => {
          if (search && search !== 'all') {
            event
              .andWhere(
                'view_all_combined_clients.combine_name',
                'LIKE',
                `%${search}%`
              )
              .orWhere(
                'view_all_combined_clients.combine_mobile',
                'LIKE',
                `%${search}%`
              )
              .orWhere(
                'view_all_combined_clients.combine_email',
                'LIKE',
                `%${search}%`
              );
          }
        });
      })
      .andWhere('combine_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getCombineClientExcelReport() {
    const data = await this.query()
      .select(
        'combine_id as id',
        'combine_name as name',
        'combine_mobile as mobile',
        'combine_email as email',
        'combine_address as address',
        'combine_company_name as company_name',
        'combine_lbalance as combine_amount',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS created_by"
        ),
        this.db.raw(
          `CASE WHEN combine_client_status = 1 THEN 'Active' WHEN combine_client_status = 0 THEN 'Inactive' END AS status`
        )
      )
      .from('trabill_combined_clients')
      .leftJoin('trabill_users', { user_id: 'combine_create_by' })
      .where('combine_org_agency', this.org_agency)
      .whereNot('combine_is_deleted', 1)
      .orderBy('combine_id', 'desc');

    return data;
  }

  public async getSingleCombinedClient(combine_id: idType) {
    const data = await this.query()
      .select(
        'combine_id',
        'combine_category_id',
        'combine_name',
        'combine_mobile',
        'combine_email',
        'combine_address',
        'combine_company_name',
        'combine_gender',
        'combine_designation',
        'trabill_combined_clients.combine_credit_limit',
        'combine_commission_rate',
        'combine_lbalance as combine_lastbalance_amount',
        'combine_client_status',
        'combine_opening_trxn.comtrxn_amount AS combine_opening_balance',
        this.db.raw(
          `CASE WHEN combine_opening_trxn.comtrxn_type = 'DEBIT' THEN 'due' WHEN combine_opening_trxn.comtrxn_type = 'CREDIT' THEN 'advance'  ELSE NULL END AS opening_balance_type`
        )
      )
      .from('trabill_combined_clients')
      .leftJoin(`${this.trxn}.comb_trxn as combine_opening_trxn`, {
        'combine_opening_trxn.comtrxn_id':
          'trabill_combined_clients.combine_opening_trxn_id',
      })
      .leftJoin('trabill_users', { user_id: 'combine_create_by' })
      .where('combine_id', combine_id);

    return data[0];
  }

  public async getCombinePrevProductsId(combine_id: idType) {
    const products = await this.query()
      .select('cproduct_product_id')
      .from('trabill_combine_products')
      .where('cproduct_combine_id', combine_id)
      .andWhereNot('cproduct_is_deleted', 1);

    if (products.length) {
      const data = products?.map((item) => {
        return item.cproduct_product_id;
      });

      return data;
    }

    return [];
  }

  public async getCombineClientName(combine_id: idType) {
    const data = await this.query()
      .select('combine_name')
      .from('trabill_combined_clients')
      .where('combine_id', combine_id);

    if (data[0]) {
      const combineInfo = data[0].combine_name as { combine_name: string };

      return combineInfo;
    }
  }

  public async getClientLastBalanceById(client_id: idType, combine_id: idType) {
    const balance = (await this.query()
      .select('combine_lbalance AS last_balance')
      .from('trabill_combined_clients')
      .where('combine_id', combine_id)
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
  }

  public async updateClientStatus(id: idType, status: 0 | 1) {
    const data = await this.query()
      .update('combine_client_status', status)
      .from('trabill_combined_clients')
      .where('combine_client_status', status === 1 ? 0 : 1)
      .where('combine_id', id)
      .andWhere('combine_org_agency', this.org_agency);

    if (data === 0) {
      throw new CustomError(
        'Pleace provide a valid combined id',
        400,
        'Invalid id'
      );
    }

    return data;
  }

  public async updateCombineInformation(
    id: idType,
    update_information: ICombineClientsEditReqBody
  ) {
    const data = await this.query()
      .into('trabill_combined_clients')
      .update(update_information)
      .where('combine_id', id);

    return data;
  }

  public async deletePreviousProduct(id: idType) {
    const data = await this.query()
      .update({ cproduct_is_deleted: 1 })
      .into('trabill_combine_products')
      .where('cproduct_combine_id', id);
    return data;
  }

  public async deleteCombineClients(combine_id: idType, delete_by: idType) {
    await this.db.raw("call deleteAccountByType('COMBINED', ?, ?);", [
      delete_by,
      combine_id,
    ]);
  }
}
export default CombineClientsModels;
