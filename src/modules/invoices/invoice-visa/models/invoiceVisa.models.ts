import moment from 'moment';
import AbstractModels from '../../../../abstracts/abstract.models';
import { isEmpty } from '../../../../common/helpers/invoice.helpers';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import { IVisaBillingDb, IVisaPassport } from '../types/invoiceVisa.interface';

class InvoiceVisaModels extends AbstractModels {
  public async getPrevBilling(billing_id: idType) {
    const data = await this.query()
      .select(
        'billing_vendor_id as vendor_id',
        'billing_combined_id as combined_id',
        'billing_status',

        this.db.raw('billing_cost_price * billing_quantity as prev_cost_price')
      )
      .from('trabill_invoice_visa_billing_infos')
      .where('billing_id', billing_id);

    if (isEmpty(data)) {
      throw new CustomError(
        'Cannot get previous billing info',
        400,
        'Invalid invoice id'
      );
    }

    const billing_data = [
      {
        ...data[0],
        prev_cost_price: Number(data[0].prev_cost_price),
      },
    ];

    return billing_data as {
      vendor_id: number | null;
      combined_id: number | null;
      prev_cost_price: number;
      billing_status: 'Approved' | 'Pending' | 'Rejected';
    }[];
  }

  public async deleteVisaPassport(
    invoice_id: idType,
    visapss_details_deleted_by: idType
  ) {
    await this.query()
      .update({ visapass_details_is_deleted: 1, visapss_details_deleted_by })
      .into('trabill_invoice_visa_billing_passport_infos')
      .where('visapss_details_invoice_id', invoice_id);
  }

  public async deleteSignleVisaPassport(
    visapss_details_id: idType,
    visapss_details_deleted_by: idType
  ) {
    await this.query()
      .update({ visapass_details_is_deleted: 1, visapss_details_deleted_by })
      .into('trabill_invoice_visa_billing_passport_infos')
      .where('visapss_details_id', visapss_details_id);
  }

  public getPrevVisaBilling = async (invoiceId: idType) => {
    const data = await this.query()
      .from('trabill_invoice_visa_billing_infos')
      .select(
        this.db.raw('billing_quantity*billing_cost_price as total_cost_price'),
        'billing_quantity',
        'billing_vendor_id',
        'billing_cost_price',
        'billing_combined_id',
        'billing_vtrxn_id as prevTrxnId'
      )
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1);
    return data as {
      billing_vendor_id: number | null;
      billing_quantity: number;
      billing_cost_price: number;
      billing_combined_id: number | null;
      total_cost_price: number;
      prevTrxnId: number;
    }[];
  };

  public async deleteBillingInfo(
    invoice_id: idType,
    billing_deleted_by: idType
  ) {
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_visa_billing_infos')
      .where('billing_invoice_id', invoice_id);
  }
  public async deleteBillingSingleInfo(
    billing_id: idType,
    billing_deleted_by: idType
  ) {
    if (!billing_id) {
      throw new CustomError('Please provide a valid ID', 400, 'Bad ID');
    }
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_visa_billing_infos')
      .where('billing_id', billing_id);
  }

  public getViewBillingInfo = async (inovice_id: idType) => {
    const data = await this.query()
      .select(
        'billing_id',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit',
        'product_name',
        'country_name',
        'billing_delivery_date',
        'billing_mofa_no',
        'billing_okala_no',
        'billing_visa_no',
        'billing_status',
        'type_name',
        'billing_token'
      )
      .from('trabill_invoice_visa_billing_infos')
      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'billing_combined_id',
      })
      .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_visa_types', { type_id: 'billing_visa_type_id' })
      .leftJoin('trabill_countries', {
        country_id: 'billing_visiting_country_id',
      })
      .where('billing_invoice_id', inovice_id)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };
  getPassportInfo = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire'
      )
      .from('trabill_invoice_visa_billing_passport_infos')
      .where('visapss_details_invoice_id', invoiceId)
      .rightJoin('trabill_passport_details', {
        passport_id: 'visapss_details_passport_id',
      })
      .andWhereNot('visapass_details_is_deleted', 1);
  };

  updateBillingStatus = async (
    status: 'Approved' | 'Rejected',
    billing_vtrxn_id: number | null,
    billingId: idType
  ) => {
    const success = await this.query()
      .from('trabill_invoice_visa_billing_infos')
      .update({ billing_status: status, billing_vtrxn_id })
      .where('billing_id', billingId);
    if (!success) {
      throw new CustomError(
        'Please provide valid billing id',
        400,
        'Invalid id'
      );
    }
  };

  updateInvoiceClientTrxn = async (
    invoice_cltrxn_id: number | null,
    invoiceId: idType
  ) => {
    const success = await this.query()
      .from('trabill_invoices')
      .update({ invoice_cltrxn_id })
      .where('invoice_id', invoiceId);
    if (!success) {
      throw new CustomError(
        'Please provide valid billing id',
        400,
        'Invalid id'
      );
    }
  };

  public async getPrevBillingByBillingId(billingId: idType) {
    const data = await this.query()
      .select(
        'billing_vendor_id as vendor_id',
        'billing_combined_id as combined_id',
        'billing_invoice_id as invoice_id',
        'invoice_sales_date',
        this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'),
        this.db.raw(
          'billing_unit_price * billing_quantity as prev_sales_price'
        ),
        this.db.raw(
          `CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS comb_client`
        ),
        this.db.raw(
          `CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS comb_vendor`
        )
      )
      .from('trabill_invoice_visa_billing_infos')
      .leftJoin('trabill_invoices', { invoice_id: 'billing_invoice_id' })
      .where('billing_id', billingId);

    if (isEmpty(data)) {
      throw new CustomError(
        'Cannot get previous billing info',
        400,
        'Invalid billing id'
      );
    }

    const billing_data = [
      {
        ...data[0],
        prev_cost_price: Number(data[0].prev_cost_price),
      },
    ];

    return billing_data as {
      vendor_id: number | null;
      combined_id: number | null;
      prev_cost_price: number;
      invoice_id: number;
      invoice_sales_date: string;
      prev_sales_price: number;
      comb_client: string;
      comb_vendor: string;
    }[];
  }

  getPrevBillingApprovedAmount = async (invoice_id: idType) => {
    const [{ total_amount }] = await this.db(
      'trabill_invoice_visa_billing_infos'
    )
      .select(this.db.raw('sum(billing_subtotal) as total_amount'))
      .where('billing_status', 'Approved')
      .andWhere('billing_invoice_id', invoice_id);

    return total_amount || (0 as number);
  };

  getVisaPassport = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        'visapss_details_id',
        'visapss_details_passport_id as passport_id'
      )
      .from('trabill_invoice_visa_billing_passport_infos')
      .where('visapss_details_invoice_id', invoiceId)
      .andWhereNot('visapass_details_is_deleted', 1);

    return data;
  };

  public getBillingInfo = async (inovice_id: idType) => {
    const data = await this.query()
      .select(
        'billing_id',
        this.db.raw(
          "CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"
        ),
        this.db.raw('coalesce(vendor_name, combine_name) as vendor_name'),
        'billing_delivery_date',
        'billing_mofa_no',
        'billing_okala_no',
        'billing_visa_no',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit',
        'billing_status',
        'billing_token',
        'billing_product_id',
        'billing_visiting_country_id',
        'billing_visa_type_id'
      )

      .from('trabill_invoice_visa_billing_infos')
      .leftJoin('trabill_vendors', { vendor_id: 'billing_vendor_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'billing_combined_id',
      })
      .where('billing_invoice_id', inovice_id)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  public insertVisaBilling = async (data: IVisaBillingDb) => {
    await this.query().insert(data).into('trabill_invoice_visa_billing_infos');
  };

  public updateVisaBilling = async (
    data: IVisaBillingDb,
    billing_id: idType
  ) => {
    return await this.db('trabill_invoice_visa_billing_infos')
      .update(data)
      .where('billing_id', billing_id);
  };

  public billingIsExist = async (billing_id: idType) => {
    if (!billing_id) {
      return undefined;
    }

    const [data] = await this.query()
      .select(
        'billing_invoice_id',
        'billing_vtrxn_id as prevTrxnId',
        this.db.raw(
          `CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-', billing_vendor_id) ELSE CONCAT('combined-', billing_combined_id) END AS prevComvendor`
        ),
        'billing_vtrxn_id',
        'billing_status'
      )
      .from('trabill_invoice_visa_billing_infos')
      .where('billing_id', billing_id);

    return data as {
      prevTrxnId: number;
      billing_invoice_id: number;
      prevComvendor: string;
      billing_status: string;
    };
  };

  public insertVisaPassport = async (data: IVisaPassport) => {
    await this.query()
      .insert(data)
      .into('trabill_invoice_visa_billing_passport_infos');
  };

  public updateVisaPassport = async (
    data: IVisaPassport,
    visapss_details_id: idType
  ) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_visa_billing_passport_infos')
      .where('visapss_details_id', visapss_details_id);
  };

  public async getAllInvoiceVisa(
    page: number,
    size: number,
    search_text: string = '',
    from_date: string,
    to_date: string
  ) {
    size = Number(size);
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const offset = (Number(page) - 1) * size;

    const data = await this.query()
      .select('*')
      .from('view_invoice_visalist')
      .modify((event) => {
        event
          .where('invoice_org_agency', this.org_agency)
          .andWhere(function () {
            if (search_text) {
              this.where('invoice_no', 'like', `%${search_text}%`)
                .orWhere('client_name', 'like', `%${search_text}%`)
                .orderByRaw(
                  'CASE WHEN invoice_no LIKE ? THEN 1 ELSE 2 END, invoice_no LIKE ? DESC',
                  [`${search_text}%`, `%${search_text}%`]
                );
            }
            if (from_date && to_date) {
              this.andWhereRaw(
                'DATE_FORMAT(invoice_date,"%Y-%m-%d") BETWEEN ? AND ?',
                [from_date, to_date]
              );
            }
          });
      })
      .andWhere('invoice_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);

    const [{ count }] = await this.db('view_invoice_visalist')
      .count('* as count')
      .modify((event) => {
        event
          .where('invoice_org_agency', this.org_agency)
          .andWhere(function () {
            if (search_text) {
              this.where('invoice_no', 'like', `%${search_text}%`)
                .orWhere('client_name', 'like', `%${search_text}%`)
                .orderByRaw(
                  'CASE WHEN invoice_no LIKE ? THEN 1 ELSE 2 END, invoice_no LIKE ? DESC',
                  [`${search_text}%`, `%${search_text}%`]
                );
            }
            if (from_date && to_date) {
              this.andWhereRaw(
                'DATE_FORMAT(invoice_date,"%Y-%m-%d") BETWEEN ? AND ?',
                [from_date, to_date]
              );
            }
          });
      })
      .andWhere('invoice_org_agency', this.org_agency);
    return { count, data };
  }
}

export default InvoiceVisaModels;
