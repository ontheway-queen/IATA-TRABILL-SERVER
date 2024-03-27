import { IBillInfo, TDB, idType } from '../../../common/types/common.types';
import { IQuotation } from '../types/quotation.interfaces';
import AbstractModels from '../../../abstracts/abstract.models';
import moment from 'moment';

class QuotationModel extends AbstractModels {
  public async products() {
    const products = await this.query()
      .select('product_id', 'product_name')
      .from('trabill_products')
      .whereNot('products_is_deleted', 1);

    return products;
  }

  public async insertQuotation(data: IQuotation) {
    const quotation = await this.query()
      .insert({ ...data, quotations_org_agency: this.org_agency })
      .into('trabill_quotations');

    return quotation[0];
  }

  public async updateQuotation(
    quotation_id: number,
    data: Partial<IQuotation>
  ) {
    const quotation = await this.query()
      .into('trabill_quotations')
      .update(data)
      .where('quotation_id', quotation_id);

    return quotation;
  }

  public async deleteQuotation(
    quotation_id: number,
    quotation_deleted_by: idType
  ) {
    const quotation = await this.query()
      .into('trabill_quotations')
      .update({ quotation_is_deleted: 1, quotation_deleted_by })
      .where('quotation_id', quotation_id);

    return quotation;
  }

  public async insertBillInfo(data: IBillInfo[]) {
    const billInfo = await this.query()
      .insert(data)
      .into('trabill_quotations_billing_infos');

    return billInfo[0];
  }

  public async deleteBillInfo(
    quotation_id: number,
    billing_deleted_by: idType
  ) {
    const bill = await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_quotations_billing_infos')
      .where('billing_quotation_id', quotation_id);

    return bill;
  }

  public async viewQuotations(
    page: number,
    size: number,
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLocaleLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select(
        'quotation_id',
        this.db.raw(
          `COALESCE(client_name, company_name, combine_name) as client_name`
        ),
        this.db.raw(
          `COALESCE(client_mobile, company_contact_no, combine_mobile) as client_mobile`
        ),
        'quotation_no',
        'quotation_net_total',
        'quotation_discount_total',
        'quotation_date',
        'quotation_note',
        'quotation_is_confirm',
        'quotation_is_deleted'
      )
      .from('trabill_quotations')
      .leftJoin('trabill_clients', 'client_id', 'quotation_client_id')
      .leftJoin(
        'trabill_client_company_information',
        'company_client_id',
        'quotation_client_id'
      )
      .leftJoin('trabill_combined_clients', {
        'trabill_combined_clients.combine_id': 'quotation_combined_id',
      })
      .modify((event) => {
        event
          .andWhere('quotations_org_agency', this.org_agency)
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(quotation_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
            if (search_text) {
              this.andWhereRaw(
                `LOWER(trabill_quotations.quotation_no) LIKE ?`,
                [`%${search_text}%`]
              )
                .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                  `%${search_text}%`,
                ])
                .orWhereRaw(
                  `LOWER(trabill_combined_clients.combine_name) LIKE ?`,
                  [`%${search_text}%`]
                )
                .orWhereRaw(`LOWER(trabill_clients.client_mobile) LIKE ?`, [
                  `%${search_text}%`,
                ])
                .orWhereRaw(
                  `LOWER(trabill_combined_clients.combine_mobile) LIKE ?`,
                  [`%${search_text}%`]
                );
            }
          });
      })
      .andWhere('quotations_org_agency', this.org_agency)
      .andWhere('quotation_is_deleted', 0)
      .orderBy('quotation_create_date', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_quotations')
      .leftJoin(
        'trabill_clients',
        'trabill_clients.client_id',
        'trabill_quotations.quotation_client_id'
      )
      .leftJoin('trabill_combined_clients', {
        'trabill_combined_clients.combine_id': 'quotation_combined_id',
      })
      .modify((event) => {
        event
          .andWhere('quotations_org_agency', this.org_agency)
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(quotation_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
            if (search_text) {
              this.andWhereRaw(
                `LOWER(trabill_quotations.quotation_no) LIKE ?`,
                [`%${search_text}%`]
              )
                .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                  `%${search_text}%`,
                ])
                .orWhereRaw(
                  `LOWER(trabill_combined_clients.combine_name) LIKE ?`,
                  [`%${search_text}%`]
                )
                .orWhereRaw(`LOWER(trabill_clients.client_mobile) LIKE ?`, [
                  `%${search_text}%`,
                ])
                .orWhereRaw(
                  `LOWER(trabill_combined_clients.combine_mobile) LIKE ?`,
                  [`%${search_text}%`]
                );
            }
          });
      })
      .andWhere('quotations_org_agency', this.org_agency)
      .andWhere('quotation_is_deleted', 0);

    return { count: row_count, data };
  }

  public async viewQuotation(quotation_id: number) {
    const quotation = await this.query()
      .select(
        'quotation_id',

        this.db.raw(
          'CASE WHEN quotation_client_id IS NOT NULL THEN CONCAT("client-",quotation_client_id) ELSE CONCAT("combined-",quotation_combined_id) END AS client_id'
        ),

        'client_name',
        'client_mobile',
        'client_email',
        'client_address',
        'client_lbalance',
        'quotation_no',
        'quotation_net_total',
        'quotation_discount_total',
        'quotation_date',
        'quotation_note',
        'billing_subtotal as subtotal',
        'quotation_is_deleted',
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        ),
        'country_name'
      )
      .from('trabill_quotations')
      .leftJoin(
        'trabill_clients',
        'trabill_clients.client_id',
        'trabill_quotations.quotation_client_id'
      )
      .leftJoin(
        'trabill_users',
        'trabill_users.user_id',
        'trabill_quotations.quotation_created_by'
      )
      .leftJoin(
        'trabill_quotations_billing_infos',
        'trabill_quotations_billing_infos.billing_quotation_id',
        'trabill_quotations.quotation_id'
      )
      .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
      .where('quotation_id', quotation_id)
      .andWhereNot('quotation_is_deleted', 1);

    let billInfo: IBillInfo[] = [];

    billInfo = await this.query()
      .select(
        'product_id',
        'billing_description as description',
        'billing_quantity as quantity',
        'billing_unit_price as unit_price',
        'billing_product_total_price as total_price'
      )
      .leftJoin(
        'trabill_products',
        'trabill_products.product_id',
        'trabill_quotations_billing_infos.billing_product_id'
      )
      .from('trabill_quotations_billing_infos')
      .where('billing_quotation_id', quotation_id)
      .where('billing_is_deleted', 0);

    return { ...quotation[0], ...(quotation[0].quotation_id && { billInfo }) };
  }

  confirmQuotation = async (quotationId: idType) => {
    await this.query()
      .update('quotation_is_confirm', 1)
      .into('trabill_quotations')
      .where('quotation_id', quotationId);
  };

  public async viewBillInfos(quotation_id: number) {
    const billInfos = await this.query()
      .select(
        'product_name',
        'billing_quotation_id',
        'billing_description',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'country_name'
      )
      .leftJoin(
        'trabill_products',
        'trabill_products.product_id',
        'trabill_quotations_billing_infos.billing_product_id'
      )
      .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
      .from('trabill_quotations_billing_infos')
      .where('billing_quotation_id', quotation_id)
      .where('billing_is_deleted', 0);

    return billInfos;
  }
}

export default QuotationModel;
