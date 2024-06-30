import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { IBillInfo, idType } from '../../../common/types/common.types';
import { IQuotation } from '../types/quotation.interfaces';

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

  public async selectQuotation(quotation_id: idType) {
    const [quotation] = await this.query()
      .from('trabill_quotations')
      .select(
        'quotation_no as q_number',
        'quotation_date as sales_date',
        'quotation_discount_total as discount',
        'quotation_created_by as user',
        'quotation_inv_payment as payment',
        this.db.raw(`COALESCE(client_name,  combine_name) as client_name`),
        this.db.raw(`COALESCE(client_mobile, combine_mobile) as client_mobile`)
      )
      .leftJoin('trabill_clients', 'client_id', 'quotation_client_id')
      .leftJoin('trabill_combined_clients', {
        'trabill_combined_clients.combine_id': 'quotation_combined_id',
      })
      .where('quotation_id', quotation_id);

    return quotation as {
      q_number: string;
      sales_date: string;
      discount: number;
      payment: number;
      user: number;
    };
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
  public async insertAccumulatedBilling(
    data: {
      billing_quotation_id: number;
      billing_invoice_id: number;
      billing_category_id: number;
    }[]
  ) {
    await this.query().insert(data).into('trabill_quotations_billing_infos');
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
        this.db.raw(`COALESCE(client_name,  combine_name) as client_name`),
        this.db.raw(`COALESCE(client_mobile, combine_mobile) as client_mobile`),
        'quotation_no',
        'quotation_type',
        'quotation_net_total',
        'quotation_discount_total',
        'quotation_date',
        'quotation_note',
        'quotation_is_confirm',
        'quotation_is_deleted'
      )
      .from('trabill_quotations')
      .leftJoin('trabill_clients', 'client_id', 'quotation_client_id')
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
  public async getBilling(quotation_id: idType) {
    const billInfos = await this.query()
      .select(
        'billing_invoice_id as invoices_id',
        'billing_category_id as category_id'
      )
      .from('trabill_quotations_billing_infos')
      .where('billing_quotation_id', quotation_id)
      .where('billing_is_deleted', 0);

    return billInfos as {
      invoices_id: number;
      category_id: number;
    }[];
  }

  // INVOICE WITH QUOTATION
  getInvoiceByCl = async (client_id: idType, combine_id: idType) => {
    return await this.query()
      .select('invoice_id', 'invoice_no', 'invoice_category_id as category_id')
      .from('trabill_invoices')
      .where('invoice_org_agency', this.org_agency)
      .havingIn('invoice_category_id', [1, 3, 5])
      .andWhere('invoice_client_id', client_id)
      .andWhere('invoice_combined_id', combine_id)
      .andWhereNot('invoice_is_deleted', 1);
  };
  getAirTicketBilling = async (invoice_id: idType) => {
    return await this.query()
      .select(
        'invoice_id',
        'invoice_no',
        'passport_name',
        'airline_name',
        'airticket_pnr',
        'airticket_ticket_no',
        'airticket_client_price',
        'airticket_journey_date',
        'airticket_return_date',
        'airticket_routes'
      )
      .from('trabill.view_all_airticket_details')

      .where('invoice_id', invoice_id);
  };
  getOtherBilling = async (invoice_id: idType) => {
    return await this.query()
      .select(
        'trabill_other_invoices_billing.billing_invoice_id',
        'trabill_products.product_name',
        'trabill_other_invoices_billing.pax_name',
        'trabill_other_invoices_billing.billing_description',
        'trabill_other_invoices_billing.billing_quantity',
        'trabill_other_invoices_billing.billing_unit_price',
        'trabill_other_invoices_billing.billing_subtotal'
      )
      .from('trabill.trabill_other_invoices_billing')
      .leftJoin(
        'trabill.trabill_products',
        'trabill.trabill_products.product_id',
        'trabill.trabill_other_invoices_billing.billing_product_id'
      )

      .where('trabill_other_invoices_billing.billing_invoice_id', invoice_id);
  };
  getInvoicesTotal = async (invoice_id: number[]) => {
    const [data] = await this.query()
      .select(
        this.db.raw('sum(invoice_sub_total) as total_sub_total'),
        this.db.raw('sum(invoice_discount) as total_discount'),
        this.db.raw('sum(invoice_net_total) as total_net_total')
      )
      .from('trabill_invoices')
      .leftJoin('trabill_invoices_extra_amounts', {
        invoice_id: 'extra_amount_invoice_id',
      })
      .whereIn('invoice_id', invoice_id)
      .andWhereNot('invoice_is_deleted', 1);

    return data;
  };
  getInvoicePayment = async (invoice_id: number[]) => {
    const [data] = await this.query()
      .select(this.db.raw('sum(invclientpayment_amount) as total_payment'))
      .from('trabill_invoice_client_payments')
      .whereIn('invclientpayment_invoice_id', invoice_id)
      .andWhereNot('invclientpayment_is_deleted', 1);

    return data;
  };
}

export default QuotationModel;
