import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  IAirTicketRefund,
  IAirticketClientRefund,
  IGetCleintRefund,
  IGetVendorRefund,
  IPartialRefund,
  IRefundOther,
  IRefundOtherClient,
  IRefundOtherVendor,
  IRefundTourClient,
  IRefundTourPack,
  IRefundTourVendor,
  IVendorRefundInfo,
  IPartialRefundVendorInfo,
  otherVendorRefundInfo,
} from '../types/refund.interfaces';
import {
  invoice_hajj_billing_infos,
  invoice_hajj_pre_reg_billing_infos,
  invoice_umrah_billing_infos,
  invoice_visa_billing_infos,
  other_invoices_billing,
} from '../utils/constants';

class RefundModel extends AbstractModels {
  updateInvoiceIsRefund = async (invoiceId: number, refund: 0 | 1) => {
    const is_refund = await this.query()
      .from('trabill_invoices')
      .update('invoice_is_refund', refund)
      .where('invoice_id', invoiceId)
      .whereNot('invoice_is_deleted', 1);

    if (!is_refund) {
      throw new CustomError(
        'Invoice is already refunded or invoice id is invalid',
        400,
        'Invalid id'
      );
    }
  };

  updateInvoiceAirticketIsRefund = async (invoiceId: idType, refund: 0 | 1) => {
    await this.query()
      .update('invoice_is_refund', refund)
      .into('trabill_invoices')
      .where('invoice_id', invoiceId);
  };

  getInvoiceCategoryId = async (invoiceId: idType) => {
    const [category_id] = await this.query()
      .select('invoice_category_id')
      .from('trabill_invoices')
      .where('invoice_id', invoiceId);

    return category_id;
  };

  public async updateTourVendorsProductIsRefund(
    invoice_id: idType,
    refund: 0 | 1
  ) {
    await this.query()
      .update('accm_is_refunded', refund)
      .into('trabill_invoice_tour_accm')
      .where('accm_invoice_id', invoice_id);

    await this.query()
      .update('food_is_refunded', refund)
      .from('trabill_invoice_tour_food')
      .where('food_invoice_id', invoice_id);

    await this.query()
      .update('guide_is_refunded', refund)
      .into('trabill_invoice_tour_guide')
      .where('guide_invoice_id', invoice_id);

    await this.query()
      .update('other_trans_is_refunded', refund)
      .into('trabill_invoice_tour_other_trans')
      .where('other_trans_invoice_id', invoice_id);

    await this.query()
      .update('ticket_is_refunded', refund)
      .into('trabill_invoice_tour_ticket')
      .where('ticket_invoice_id', invoice_id);

    await this.query()
      .update('transport_is_refunded', refund)
      .into('trabill_invoice_tour_transport')
      .where('transport_invoice_id', invoice_id);
  }

  getInvoiceDuePayment = async (invoiceId: idType) => {
    const [[[invoice_pay]]] = await this.db.raw(
      `call ${this.database}.get_invoice_due(${invoiceId});`
    );

    if (!invoice_pay) {
      throw new CustomError(
        'Pleace provide valid invoice id',
        400,
        'Invalid id'
      );
    }
    return invoice_pay as {
      invoice_net_total: number;
      invoice_payment: number;
      invoice_due: number;
    };
  };

  /**
   * invoice air ticker refund
   * @param airticketId
   * @param categoryId
   * @param isRefund
   */

  updateAirticketItemIsRefund = async (
    airticketId: number,
    categoryId: number,
    isRefund: 1 | 0
  ) => {
    if (categoryId === 1) {
      await this.query()
        .update('airticket_is_refund', isRefund)
        .from('trabill_invoice_airticket_items')
        .where('airticket_id', airticketId)
        .andWhereNot('airticket_is_deleted', 1);
    } else if (categoryId === 2) {
      await this.query()
        .update('airticket_is_refund', isRefund)
        .from('trabill_invoice_noncom_airticket_items')
        .where('airticket_id', airticketId);
    } else if (categoryId === 3) {
      await this.query()
        .update('airticket_is_refund', isRefund)
        .into('trabill_invoice_reissue_airticket_items')
        .where('airticket_id', airticketId)
        .andWhereNot('airticket_is_deleted', 1);
    } else if (categoryId === 4) {
      await this.query()
        .update('billing_is_refund', isRefund)
        .into('trabill_other_invoices_billing')
        .where('billing_invoice_id', airticketId)
        .andWhereNot('billing_is_deleted', 1);
    } else if (categoryId === 5) {
      await this.query()
        .update('billing_is_refund', isRefund)
        .into('trabill_invoice_tour_billing')
        .where('billing_invoice_id', airticketId);
    }
  };

  public async insertAirTicketRefund(data: IAirTicketRefund) {
    const refund = await this.query()
      .insert({ ...data, atrefund_org_agency: this.org_agency })
      .into('trabill_airticket_refunds');

    return refund[0];
  }

  public async insertAirticketClientRefund(data: IAirticketClientRefund) {
    const refund = await this.query()
      .insert(data)
      .into('trabill_airticket_client_refunds');

    return refund[0];
  }

  public async insertVendorRefundInfo(data: IVendorRefundInfo[]) {
    await this.query().insert(data).into('trabill_airticket_vendor_refunds');
  }

  getInvoiceVendorPaymentByVendor = async (
    invoiceId: idType,
    vendor_id: number | null,
    combined_id: number | null
  ) => {
    const [data] = await this.query()
      .select(
        this.db.raw(
          'COALESCE(CAST(SUM(invendorpay_amount) AS DECIMAL(15,2)),0) AS total_vendor_pay'
        )
      )
      .from('trabill_invoice_vendor_payments')
      .where('invendorpay_invoice_id', invoiceId)
      .andWhere('invendorpay_vendor_id', vendor_id)
      .andWhere('invendorpay_combined_id', combined_id)
      .andWhereNot('invendorpay_isdeleted', 1)
      .groupBy('invendorpay_invoice_id');

    return data?.total_vendor_pay | 0;
  };

  public async checkInvoiceIsPaid(invoice_id: idType) {
    const [data] = (await this.query()
      .select(
        'invoice_category_id',
        'invoice_net_total',
        this.db.raw(
          `SUM(COALESCE(invclientpayment_amount, 0)) as total_payment`
        )
      )
      .from('trabill_invoices')
      .leftJoin(
        this.db.raw(
          `trabill_invoice_client_payments ON trabill_invoice_client_payments.invclientpayment_invoice_id = trabill_invoices.invoice_id AND invclientpayment_is_deleted = 0`
        )
      )
      .where('trabill_invoices.invoice_id', invoice_id)
      .groupBy('invoice_id', 'invoice_net_total')) as {
      invoice_net_total: number;
      total_payment: number;
      invoice_category_id: number;
    }[];

    return Number(data.invoice_category_id);
  }

  public async viewAirticketVendorRefund(refundId: idType) {
    const [[airticket_vrefunds]] = await this.db.raw(
      `CALL ${this.database}.get_airticket_vendor_refund(${refundId})`
    );
    return airticket_vrefunds;
  }

  public async getAirticketVendorRefund(refundId: idType) {
    return await this.query()
      .select('*')
      .from('v_ait_refund_desc')
      .where('vrefund_refund_id', refundId);
  }

  public async getPreviousVendorRefundInfo(refundId: idType) {
    return await this.query()
      .select(
        'vrefund_vtrxn_id',
        'vrefund_category_id',
        'vrefund_charge_vtrxn_id',
        'vrefund_acctrxn_id',
        'vrefund_airticket_id',
        this.db.raw(
          "coalesce(concat('vendor-',vrefund_vendor_id), concat('combined-',vrefund_vendor_combined_id)) as comb_vendor"
        )
      )
      .from('trabill_airticket_vendor_refunds')
      .where('vrefund_refund_id', refundId);
  }

  public async getAirticketClientRefund(refundId: idType) {
    const clientRefund = (await this.query()
      .select(
        this.db.raw(
          "CASE WHEN crefund_client_id IS NOT NULL THEN CONCAT('client-',crefund_client_id) ELSE CONCAT('combined-',crefund_combined_id) END AS comb_client"
        ),
        'crefund_total_amount',
        'crefund_charge_amount',
        'crefund_return_amount',
        'crefund_date',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'crefund_account_id',
        'crefund_actransaction_id',
        'crefund_charge_ctrxnid',
        'crefund_ctrxnid'
      )
      .from('trabill_airticket_client_refunds')
      .where('crefund_refund_id', refundId)
      .andWhereNot('crefund_is_deleted', 1)) as IGetCleintRefund[];

    return clientRefund;
  }

  public async deleteAirTicketRefund(
    refund_id: idType,
    atrefund_deleted_by: idType
  ) {
    const refund = await this.query()
      .update({ atrefund_is_deleted: 1, atrefund_deleted_by })
      .into('trabill_airticket_refunds')
      .where('atrefund_id', refund_id);

    return refund;
  }

  public async getAllAirticketRefund(
    page: number,
    size: number,
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const refunds = await this.query()
      .select(
        'atrefund_id',
        'atrefund_vouchar_number',
        'atrefund_client_id',
        'atrefund_combined_id',
        'atrefund_date',
        'atrefund_note',
        'atrefund_trxn_charge',
        'atrefund_create_date',
        'account_name',
        'crefund_total_amount',
        'crefund_charge_amount',
        'crefund_return_amount',
        'crefund_profit',
        'crefund_condition_type',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'invoice_id',
        'invoice_no',
        'invoice_category_id',
        this.db.raw('coalesce(client_name, combine_name) as client_name')
      )
      .from('trabill.trabill_airticket_refunds')
      .leftJoin(
        'trabill_airticket_client_refunds',
        'crefund_refund_id',
        '=',
        'atrefund_id'
      )
      .leftJoin('trabill_invoices', 'invoice_id', '=', 'atrefund_invoice_id')
      .leftJoin('trabill_clients', 'client_id', '=', 'atrefund_client_id')
      .leftJoin(
        'trabill_combined_clients',
        'combine_id',
        '=',
        'atrefund_combined_id'
      )
      .leftJoin('trabill_accounts', 'account_id', '=', 'crefund_account_id')
      .where('atrefund_org_agency', this.org_agency)
      .andWhereNot('atrefund_is_deleted', 1)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereRaw(
            `DATE_FORMAT(atrefund_date,'%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
        if (search_text) {
          this.andWhereRaw(`LOWER(atrefund_vouchar_number) LIKE ?`, [
            `%${search_text}%`,
          ])
            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`])
            .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search_text}%`]);
        }
      })
      .limit(size)
      .offset(page_number)
      .orderBy('atrefund_id', 'desc');

    return refunds;
  }

  public async countAitRefDataRow(
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLowerCase();
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill.trabill_airticket_refunds')
      .leftJoin('trabill_clients', 'client_id', '=', 'atrefund_client_id')
      .leftJoin(
        'trabill_combined_clients',
        'combine_id',
        '=',
        'atrefund_combined_id'
      )
      .where('atrefund_org_agency', this.org_agency)
      .andWhereNot('atrefund_is_deleted', 1)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereRaw(
            `DATE_FORMAT(atrefund_date,'%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
        if (search_text) {
          this.andWhereRaw(`LOWER(atrefund_vouchar_number) LIKE ?`, [
            `%${search_text}%`,
          ])
            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`])
            .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search_text}%`]);
        }
      });

    return count;
  }

  public async getAirticketRefundById(refund_id: string) {
    const [[[airticket_refund]]] = await this.db.raw(
      `CALL ${this.database}.get_airticket_refund(${refund_id})`
    );

    return airticket_refund;
  }

  public async getAitRefundInfo(airticket_id: idType, category_id: idType) {
    const [data] = (await this.query()
      .select(
        'airticket_pnr',
        'passport_name',
        'airticket_routes',
        'airticket_ticket_no'
      )
      .from('view_all_airticket_details')
      .where('invoice_category_id', category_id)
      .andWhere('airticket_id', airticket_id)) as {
      airticket_routes: string;
      passport_name: string;
      airticket_pnr: string;
      airticket_ticket_no: string;
    }[];

    return data;
  }

  // ============== x end airticket refund x ================= \\

  public async getAllTicketNoClient(combClient: string) {
    const { client_id, combined_id } = separateCombClientToId(combClient);

    const ticket_infos = await this.query()
      .select(
        'airticket_invoice_id as invoice_id',
        'invoice_no as invoice_no',
        'airticket_ticket_no as ticket_no'
      )
      .from('view_all_airticket_details')
      .whereNot('airticket_is_refund', 1)
      .whereNot('airticket_is_reissued', 1)
      .andWhere('airticket_client_id', client_id)
      .andWhere('airticket_combined_id', combined_id);

    return ticket_infos;
  }

  public async airTicketInfos(ticket_no: idType[], invoice_id: number) {
    const ticket_infos = await this.query()
      .select(
        'airticket_invoice_id',
        'invoice_category_id',
        'airticket_id',
        'airticket_vendor_id',
        'airticket_vendor_combine_id',
        'airticket_airline_id',
        'airline_name',
        'vendor_name',
        'airticket_discount_total',
        this.db.raw(
          'CAST(airticket_client_price AS DECIMAL(15,2)) AS airticket_client_price'
        ),
        this.db.raw(
          'CAST(airticket_purchase_price AS DECIMAL(15,2)) AS airticket_purchase_price'
        ),
        this.db.raw(
          'CAST(airticket_client_price - airticket_purchase_price -airticket_discount_total AS DECIMAL(15,2)) as airticket_profit'
        ),

        'airticket_pnr',
        'airticket_ticket_no'
      )
      .from('v_airticket_for_refund')
      .where('airticket_org_agency', this.org_agency)
      .andWhere('airticket_invoice_id', invoice_id)
      .havingIn('airticket_ticket_no', ticket_no);

    return ticket_infos;
  }

  // get invoice airticket refunds
  public async getAirticketRefundItems(invoiceId: idType) {
    const client_refund = await this.query()
      .select(
        'crefund_total_amount',
        'crefund_charge_amount',
        'crefund_profit',
        'crefund_return_amount',
        'atrefund_vouchar_number',
        this.db.raw(
          `coalesce(client_name, combine_name, company_name) as client_name`
        )
      )
      .from('trabill_airticket_refunds')
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'atrefund_client_id',
      })
      .leftJoin('trabill_airticket_client_refunds', {
        crefund_refund_id: 'atrefund_id',
      })
      .leftJoin('trabill_clients ', {
        client_id: 'atrefund_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .where('atrefund_invoice_id', invoiceId)
      .andWhere('crefund_is_deleted', 0)
      .andWhereNot('atrefund_is_deleted', 1);

    const vendor_refund = await this.query()
      .select(
        'atrefund_vouchar_number',
        'vrefund_total_amount',
        'vrefund_charge_amount',
        'vrefund_return_amount',
        this.db.raw(`COALESCE(vendor_name, combine_name) as vendor_name`)
      )
      .from('trabill_airticket_refunds')
      .leftJoin('trabill_airticket_vendor_refunds', {
        vrefund_refund_id: 'atrefund_id',
      })
      .leftJoin('trabill_vendors', { vendor_id: 'vrefund_vendor_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vrefund_vendor_combined_id',
      })
      .where('atrefund_invoice_id', invoiceId)
      .andWhereNot('atrefund_deleted_by', 1)
      .andWhereNot('atrefund_is_deleted', 1);

    return { client_refund, vendor_refund };
  }

  // get invoice airticket refunds
  public async getOtherRefundItems(invoiceId: idType) {
    const client_refund = await this.query()
      .select(
        'refund_vouchar_number as atrefund_vouchar_number',
        'crefund_charge_amount',
        'crefund_total_amount',
        'crefund_return_amount',
        this.db.raw(
          `coalesce(client_name, combine_name, company_name) as client_name`
        )
      )
      .from('trabill_other_refunds')
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'refund_client_id',
      })
      .leftJoin('trabill_other_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .leftJoin('trabill_clients as cl', {
        refund_client_id: 'client_id',
      })
      .leftJoin('trabill_combined_clients as comb', {
        refund_combined_id: 'combine_id',
      })
      .where('refund_invoice_id', invoiceId)
      .andWhereNot('refund_is_deleted', 1);

    const vendor_refund = await this.query()
      .select(
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        'vrefund_vouchar_number as atrefund_vouchar_number',
        'vrefund_return_amount',
        'vrefund_payment_type',
        'vrefund_charge as vrefund_charge_amount',
        'vrefund_amount as vrefund_total_amount'
      )
      .from('trabill_other_refunds')
      .leftJoin(
        this.db.raw(
          `trabill_other_refunds_to_vendors ON vrefund_refund_id = refund_id AND vrefund_is_deleted = 0`
        )
      )
      .leftJoin('trabill_vendors as tv', {
        'trabill_other_refunds_to_vendors.vrefund_vendor_id': 'vendor_id',
      })
      .leftJoin('trabill_combined_clients as tcc', {
        'trabill_other_refunds_to_vendors.vrefund_vendor_combined_id':
          'tcc.combine_id',
      })
      .where('refund_invoice_id', invoiceId)
      .andWhereNot('refund_is_deleted', 1);

    return { client_refund, vendor_refund };
  }

  getAirticketRefund = async (refund_id: idType) => {
    const [data] = (await this.query()
      .select('atrefund_invoice_id', 'atrefund_trxn_charge_id')
      .from('trabill_airticket_refunds')
      .where('atrefund_id', refund_id)) as {
      atrefund_invoice_id: number;
      atrefund_trxn_charge_id: number;
    }[];

    return data;
  };

  public async getTourRefund(refund_id: idType) {
    const [data] = await this.query()
      .select('refund_invoice_id', 'refund_charge_id')
      .from('trabill_tour_refunds')
      .where('refund_id', refund_id);

    if (data) {
      return data as { refund_invoice_id: number; refund_charge_id: number };
    } else {
      throw new CustomError(
        `Can't find any invoice with this id please provide a valid refund`,
        400,
        'Bad ID'
      );
    }
  }

  public async getTourClientRefund(refund_id: idType) {
    const clientRefund = (await this.query()
      .select(
        this.db.raw(
          "CASE WHEN crefund_client_id IS NOT NULL THEN CONCAT('client-',crefund_client_id) ELSE CONCAT('combined-',crefund_combined_id) END AS comb_client"
        ),
        'crefund_charge_amount',
        'crefund_total_amount',
        'crefund_return_amount',
        'crefund_charge_ctrxnid',
        'crefund_ctrxnid',
        'crefund_account_id',
        'crefund_actransaction_id',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'crefund_date'
      )
      .from('trabill_tour_refunds_to_clients')
      .where('crefund_refund_id', refund_id)) as IGetCleintRefund[];

    return clientRefund;
  }

  public async getTourVendorRefund(refund_id: idType) {
    const vendorRefund = (await this.query()
      .select(
        this.db.raw(
          "CASE WHEN vrefund_vendor_id IS NOT NULL THEN CONCAT('vendor-',vrefund_vendor_id) ELSE CONCAT('combined-',vrefund_vendor_combined_id) END AS comb_vendor"
        ),
        'vrefund_vtrxn_id',
        'vrefund_charge_vtrxn_id',
        'vrefund_account_id',
        'vrefund_acctrxn_id',
        'vrefund_total_amount',
        'vrefund_charge_amount',
        'vrefund_return_amount',
        'vrefund_payment_type',
        'vrefund_moneyreturn_type'
      )
      .from('trabill_tour_refunds_to_vendors')
      .where('vrefund_refund_id', refund_id)) as IGetVendorRefund[];

    return vendorRefund;
  }

  /**
   * Get invoice by client id
   */
  public getInvoiceOtherByClient = async (
    clientId?: idType,
    combined_id?: idType
  ) => {
    const data = await this.query()
      .select(
        'invoice_id',
        'invoice_no',
        'client_lbalance as lbalance_amount',
        'client_name'
      )
      .from('trabill_invoices')
      .leftJoin('trabill_clients', {
        client_id: 'invoice_client_id',
      })
      .where('invoice_org_agency', this.org_agency)
      .andWhere('invoice_category_id', 5)
      .andWhere('invoice_client_id', clientId)
      .andWhere('invoice_combined_id', combined_id)
      .andWhere('invoice_is_refund', 0)
      .andWhereNot('invoice_is_deleted', 1);

    return data;
  };

  public getInvoiceOtherByVendor = async (vendor_id: idType) => {
    const data = await this.query()
      .select(
        'billing_invoice_id as invoice_id',
        'invoice_no',
        'vendor_lbalance AS lbalance_amount'
      )
      .from('trabill_other_invoices_billing')
      .leftJoin('trabill_invoices', { invoice_id: 'billing_invoice_id' })
      .leftJoin('trabill_vendors', {
        vendor_id: 'billing_vendor_id',
      })
      .distinct()
      .where('billing_vendor_id', vendor_id)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  public getBillingInfo = async (invoiceId: idType, category_id: number) => {
    let table = '';

    if (other_invoices_billing.includes(category_id)) {
      table = 'trabill_other_invoices_billing';
    } else if (invoice_visa_billing_infos.includes(category_id)) {
      table = 'trabill_invoice_visa_billing_infos';
    } else if (invoice_hajj_pre_reg_billing_infos.includes(category_id)) {
      table = 'trabill_invoice_hajj_pre_reg_billing_infos';
    } else if (invoice_hajj_billing_infos.includes(category_id)) {
      table = 'trabill_invoice_hajj_billing_infos';
    } else if (invoice_umrah_billing_infos.includes(category_id)) {
      table = 'trabill_invoice_umrah_billing_infos';
    } else {
      throw new CustomError(
        'Please provide a valid invoice Id',
        400,
        'Bad request'
      );
    }

    const data = await this.query()
      .select(
        'billing_id',
        'billing_invoice_id',
        'billing_product_id',
        'product_name',
        'billing_cost_price',
        this.db.raw(
          'COALESCE(billing_vendor_id, billing_combined_id) as billing_vendor_id'
        ),
        this.db.raw(
          'CASE WHEN billing_combined_id IS NOT NULL THEN "combined" ELSE "vendor" END AS vendor_type'
        ),
        this.db.raw(
          'COALESCE(vendor_name, combine_name) as billing_vendor_name'
        ),
        this.db.raw(
          'COALESCE(vendor_lbalance, combine_lbalance) as billing_vendor_last_balance'
        ),
        'billing_quantity',
        'billing_remaining_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_create_date'
      )
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_vendors', {
        billing_vendor_id: 'vendor_id',
      })
      .leftJoin('trabill_combined_clients', {
        billing_combined_id: 'combine_id',
      })
      .distinct()
      .from(table)
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  /**
   * Get vendor bill infos
   */
  public getVendorInfo = async (vendor_id: idType) => {
    const data = await this.query()
      .select(
        'billing_id',
        'billing_invoice_id',
        'billing_product_id',
        'product_name',
        'billing_quantity',
        'billing_cost_price',
        'billing_subtotal',
        'billing_remaining_quantity'
      )
      .from('trabill_other_invoices_billing')
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .distinct()
      .where('billing_vendor_id', vendor_id)
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  /**
   * Refund invoice other(client)
   */
  public async refundOther(data: IRefundOther) {
    const refund = await this.query()
      .insert({ ...data, refund_org_agency: this.org_agency })
      .into('trabill_other_refunds');

    return refund[0];
  }

  public async getOthrRefundInfo(invoice_id: idType) {
    const [data] = (await this.query()
      .select('pax_name', 'ticket_pnr', 'ticket_no', 'airticket_route')
      .from('view_otr_info_for_refund')
      .where('billing_invoice_id', invoice_id)) as {
      pax_name: string;
      ticket_pnr: string;
      ticket_no: string;
      airticket_route: string;
    }[];

    return data;
  }

  public async deleteOtherRefund(refund_id: idType, deleted_by: idType) {
    await this.query()
      .update({ crefund_is_deleted: 1, crefund_deleted_by: deleted_by })
      .into('trabill_other_refunds_to_clients')
      .where('crefund_refund_id', refund_id);

    await this.query()
      .update({ vrefund_is_deleted: 1, vrefund_deleted_by: deleted_by })
      .into('trabill_other_refunds_to_vendors')
      .where('vrefund_refund_id', refund_id);

    const refund = await this.query()
      .update({ refund_is_deleted: 1, refund_deleted_by: deleted_by })
      .into('trabill_other_refunds')
      .where('refund_id', refund_id);

    return refund;
  }

  public async getOtherRefundInvoice(refund_id: idType) {
    const [data] = await this.query()
      .select('refund_invoice_id', 'refund_charge_id')
      .from('trabill_other_refunds')
      .where('refund_id', refund_id)
      .andWhereNot('refund_is_deleted', 1);

    if (data) {
      return data as { refund_invoice_id: number; refund_charge_id: number };
    } else {
      throw new CustomError(
        'Please provide a valid refund ID',
        400,
        'Bad request'
      );
    }
  }

  public async getOtherClientRefundInfo(refund_id: idType) {
    const refund = (await this.query()
      .select(
        this.db.raw(
          `CASE WHEN crefund_client_id IS NOT NULL THEN CONCAT('client-',crefund_client_id) ELSE CONCAT('combined-',crefund_combined_id) END AS comb_client`
        ),
        'crefund_charge_amount',
        'crefund_total_amount',
        'crefund_return_amount',
        'crefund_date',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'crefund_account_id',
        'crefund_actransaction_id',
        'crefund_ctrxnid',
        'crefund_charge_ctrxnid'
      )
      .from('trabill_other_refunds_to_clients')
      .where('crefund_refund_id', refund_id)) as IGetCleintRefund[];

    return refund;
  }

  public async getOtherVendorRefundInfo(refund_id: idType) {
    const refund = (await this.query()
      .select(
        this.db.raw(
          `CASE WHEN vrefund_vendor_id IS NOT NULL THEN CONCAT('vendor-',vrefund_vendor_id) ELSE CONCAT('combined-',vrefund_vendor_combined_id) END AS comb_vendor`
        ),
        'vrefund_invoice_id',
        'vrefund_amount',
        'vrefund_charge',
        'vrefund_return_amount',
        'vrefund_payment_type',
        'vrefund_account_id',
        'vrefund_acctrxn_id',
        'vrefund_vtrxn_id',
        'vrefund_charge_vtrxn_id'
      )
      .from('trabill_other_refunds_to_vendors')
      .where('vrefund_refund_id', refund_id)
      .andWhereNot('vrefund_is_deleted', 1)) as otherVendorRefundInfo[];

    return refund;
  }

  public async getReminingQuantity(invoice_id: idType) {
    const data = await this.query()
      .select('billing_remaining_quantity')
      .from('trabill_other_invoices_billing')
      .where('billing_invoice_id', invoice_id)
      .andWhereNot('billing_is_deleted', 1);

    return data[0] as { billing_remaining_quantity: number };
  }

  public async getOtherRefundQuantity(refund_id: idType) {
    const data = await this.query()
      .select('vrefund_quantity')
      .from('trabill_other_refunds_to_vendors')
      .where('vrefund_refund_id', refund_id)
      .andWhereNot('vrefund_is_deleted', 1);

    return Number(data[0].vrefund_quantity);
  }

  public async updateRemainingQty(
    invoice_id: number,
    category_id: number,
    remaining_quantity: number
  ) {
    let table = 'trabill_other_invoices_billing';

    if (Number(category_id) == 10) {
      table = 'trabill_invoice_visa_billing_infos';
    }

    if (Number(category_id) == 30) {
      table = 'trabill_invoice_hajj_pre_reg_billing_infos';
    }

    if (Number(category_id) == 31) {
      table = 'trabill_invoice_hajj_billing_infos';
    }

    if (Number(category_id) == 26) {
      table = 'trabill_invoice_umrah_billing_infos';
    }

    const refund = await this.query()
      .update({ billing_remaining_quantity: remaining_quantity })
      .into(table)
      .where('billing_invoice_id', invoice_id)
      .andWhereNot('billing_is_deleted', 1);

    return refund;
  }

  public async refundOtherClient(data: IRefundOtherClient) {
    const refund = await this.query()
      .insert(data)
      .into('trabill_other_refunds_to_clients');

    return refund[0];
  }

  public async refundOtherVendor(data: IRefundOtherVendor[]) {
    const [refund] = await this.query()
      .insert(data)
      .into('trabill_other_refunds_to_vendors');

    return refund;
  }

  public async getAllOtherRefund(
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

    const refunds = await this.query()
      .select(
        'refund_id',
        'invoice_no',
        'refund_invoice_id',
        'refund_note',
        'refund_create_date as refund_date',
        'crefund_charge_amount',
        'crefund_total_amount',
        'crefund_return_amount',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'refund_vouchar_number as crefund_vouchar_number',
        'crefund_is_deleted',
        this.db.raw(
          'coalesce(client_name, combine_name, company_name) AS crefund_client_name'
        ),
        this.db.raw(
          'coalesce(crefund_client_id, crefund_combined_id) AS crefund_client_id'
        ),
        this.db.raw(
          'CASE WHEN crefund_combined_id IS NOT NULL THEN "combined" ELSE "client" END AS crefund_client_type'
        )
      )
      .from('trabill_other_refunds')
      .leftJoin('trabill_clients', {
        client_id: 'refund_client_id',
      })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'refund_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'refund_combined_id',
      })
      .leftJoin('trabill_invoices', { invoice_id: 'refund_invoice_id' })
      .leftJoin('trabill_other_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .leftJoin('trabill_other_refunds_to_vendors', {
        vrefund_refund_id: 'refund_id',
      })
      .modify((event) => {
        event.where('refund_org_agency', this.org_agency).andWhere(function () {
          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(refund_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
          if (search_text) {
            this.andWhereRaw(`LOWER(trabill_invoices.invoice_no) LIKE ?`, [
              `%${search_text}%`,
            ])
              .orWhereRaw(`LOWER(refund_vouchar_number) LIKE ?`, [
                `%${search_text}%`,
              ])
              .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`])
              .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search_text}%`]);
          }
        });
      })
      .andWhere('refund_is_deleted', 0)
      .andWhere('refund_org_agency', this.org_agency)
      .limit(size)
      .offset(page_number);

    return refunds;
  }

  public async countOtrRefDataRow(
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLocaleLowerCase();
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_other_refunds')
      .leftJoin('trabill_clients', {
        client_id: 'refund_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'refund_combined_id',
      })
      .leftJoin('trabill_invoices', { invoice_id: 'refund_invoice_id' })
      .modify((event) => {
        event.where('refund_org_agency', this.org_agency).andWhere(function () {
          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(refund_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
          if (search_text) {
            this.andWhereRaw(`LOWER(trabill_invoices.invoice_no) LIKE ?`, [
              `%${search_text}%`,
            ])
              .orWhereRaw(`LOWER(refund_vouchar_number) LIKE ?`, [
                `%${search_text}%`,
              ])
              .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`])
              .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search_text}%`]);
          }
        });
      })
      .andWhere('refund_is_deleted', 0)
      .andWhere('refund_org_agency', this.org_agency);

    return count;
  }

  public async getAllOtherRefundVendor(refund_id: idType) {
    const refunds = await this.query()
      .select(
        'vrefund_id',
        'vrefund_refund_id',
        'vrefund_invoice_id',
        'vrefund_quantity',
        'vrefund_charge',
        'vrefund_amount',
        'vrefund_return_amount',
        'vrefund_payment_type',
        'vrefund_moneyreturn_type',
        'vrefund_vouchar_number',
        'vrefund_is_deleted',
        this.db.raw('IFNULL(vendor_name, combine_name) AS vrefund_vendor_name'),
        this.db.raw(
          'IFNULL(vrefund_vendor_id, vrefund_vendor_combined_id) AS vrefund_vendor_id'
        ),
        this.db.raw(
          'CASE WHEN vrefund_vendor_combined_id IS NOT NULL THEN "combined" ELSE "vendor" END AS vrefund_vendor_type'
        )
      )
      .from('trabill_other_refunds_to_vendors')
      .leftJoin('trabill_vendors', {
        vendor_id: 'vrefund_vendor_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vrefund_vendor_combined_id',
      })
      .where('vrefund_refund_id', refund_id)
      .andWhereNot('vrefund_is_deleted', 1);

    return refunds;
  }

  public async getRefundOtherClient(refund_id: idType) {
    const info = await this.query()
      .select(
        'crefund_refund_id',
        'crefund_invoice_id',
        this.db.raw(
          'IFNULL(crefund_client_id, crefund_combined_id) AS crefund_client_id'
        ),
        this.db.raw(
          'CASE WHEN crefund_combined_id IS NOT NULL THEN "combined" ELSE "client" END AS crefund_client_type'
        ),
        this.db.raw(
          'COALESCE(client_name, company_name, combine_name) AS crefund_client_name'
        ),
        this.db.raw(
          'COALESCE(client_mobile, company_contact_no, combine_mobile) AS crefund_client_mobile'
        ),
        'crefund_charge_amount',
        'crefund_total_amount',
        'crefund_return_amount',
        'crefund_vouchar_number',
        'crefund_payment_type',
        'crefund_moneyreturn_type',
        'crefund_account_id',
        'crefund_date'
      )
      .from('trabill_other_refunds_to_clients')
      .leftJoin('trabill_clients', {
        client_id: 'crefund_client_id',
      })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'crefund_client_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .where('crefund_refund_id', refund_id);

    return info[0];
  }

  /**
   * Get refund other vendors with refund id
   */
  public async getRefundOtherVendor(refund_id: string | number) {
    const info = await this.query()
      .select(
        'product_name',
        'vrefund_id',
        'vrefund_refund_id',
        'vrefund_invoice_id',
        this.db.raw(
          'IFNULL(vrefund_vendor_id, vrefund_vendor_combined_id) AS vrefund_vendor_id'
        ),
        this.db.raw(
          'CASE WHEN vrefund_vendor_combined_id IS NOT NULL THEN "combined" ELSE "vendor" END AS vrefund_vendor_type'
        ),
        this.db.raw('IFNULL(vendor_name, combine_name) AS vrefund_vendor_name'),
        this.db.raw(
          'IFNULL(vendor_mobile, combine_mobile) AS vrefund_vendor_mobile'
        ),
        'vrefund_product_id',
        'vrefund_quantity',
        'vrefund_charge',
        'vrefund_amount',
        'vrefund_return_amount',
        'vrefund_vouchar_number',
        'vrefund_payment_type',
        'vrefund_moneyreturn_type',
        'vrefund_account_id',
        'vrefund_client_refund_amount',
        'vrefund_client_refund_charge',
        'vrefund_date'
      )
      .from('trabill_other_refunds_to_vendors')
      .leftJoin('trabill_vendors', {
        vendor_id: 'vrefund_vendor_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vrefund_vendor_combined_id',
      })
      .leftJoin('trabill_products', { product_id: 'vrefund_product_id' })
      .where('vrefund_refund_id', refund_id)
      .andWhereNot('vrefund_is_deleted', 1);

    return info;
  }

  public async insertRefundTour(data: IRefundTourPack) {
    const refund = await this.query()
      .insert({ ...data, refund_org_agency: this.org_agency })
      .into('trabill_tour_refunds');

    return refund[0];
  }

  public async deleteRefundTour(refund_id: idType, deleted_by: idType) {
    await this.query()
      .update({ crefund_is_deleted: 1, crefund_deleted_by: deleted_by })
      .into('trabill_tour_refunds_to_clients')
      .where('crefund_refund_id', refund_id);

    await this.query()
      .update({ vrefund_is_deleted: 1, vrefund_deleted_by: deleted_by })
      .into('trabill_tour_refunds_to_vendors')
      .where('vrefund_refund_id', refund_id);

    const refund = await this.query()
      .update({ refund_is_deleted: 1, refund_deleted_by: deleted_by })
      .into('trabill_tour_refunds')
      .where('refund_id', refund_id);

    return refund;
  }

  public async refundTourClient(data: IRefundTourClient) {
    const refund = await this.query()
      .insert(data)
      .into('trabill_tour_refunds_to_clients');

    return refund[0];
  }

  public async addTourVendor(data: IRefundTourVendor[]) {
    const refund = await this.query()
      .insert(data)
      .into('trabill_tour_refunds_to_vendors');

    return refund[0];
  }

  public getCategoryId = async (invoiceId: idType) => {
    const invoice = await this.query()
      .select('invoice_category_id')
      .from('trabill_invoices')
      .where('invoice_id', invoiceId);

    if (invoice[0]) {
      return invoice[0].invoice_category_id;
    } else {
      throw new CustomError(
        'Please provide valid invoice id',
        400,
        'Invalid Id'
      );
    }
  };

  public getTourInvoice = async (
    client_id: number | null,
    combined_id: number | null
  ) => {
    const data = await this.query()
      .select('invoice_id', 'invoice_no', 'invoice_net_total')
      .from('trabill_invoices')
      .where('invoice_category_id', 4)
      .andWhere('invoice_client_id', client_id)
      .andWhere('invoice_combined_id', combined_id)
      .whereNot('invoice_is_deleted', 1)
      .andWhereNot('invoice_is_refund', 1);

    if (!data.length) {
      throw new CustomError(
        'No data found',
        404,
        'Pleace provide valid client id'
      );
    }

    return data;
  };

  public async getAllTourPackRefund(
    is_deleted: idType,
    page: number,
    size: number,
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    const page_number = (page - 1) * size;
    search_text && search_text.toLowerCase();
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select(
        'refund_id',
        this.db.raw('IFNULL(client_name, combine_name) as client_name'),
        'crefund_total_amount as refund_amount',
        'crefund_charge_amount as refund_charge',
        'refund_vouchar_number as voucher_no',
        'crefund_payment_type as payment_type',
        'crefund_return_amount as return_amount',
        'refund_note',
        'refund_create_date as create_date'
      )
      .from('trabill_tour_refunds')
      .leftJoin('trabill_tour_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .leftJoin('trabill_clients', { client_id: 'crefund_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .modify((event) => {
        event.where('refund_org_agency', this.org_agency).andWhere(function () {
          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(refund_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
          if (search_text) {
            this.andWhereRaw(`LOWER(refund_vouchar_number) LIKE ?`, [
              `%${search_text}%`,
            ])
              .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                `%${search_text}%`,
              ])
              .orWhereRaw(
                `LOWER(trabill_combined_clients.combine_name) LIKE ?`,
                [`%${search_text}%`]
              );
          }
        });
      })
      .andWhere('refund_is_deleted', is_deleted)
      .andWhere('refund_org_agency', this.org_agency)
      .orderBy('refund_id', 'desc')
      .limit(size)
      .offset(page_number);

    return data;
  }

  public async countTurRefDataRow(
    is_deleted: idType,
    search_text: string,
    from_date: string,
    to_date: string
  ) {
    search_text && search_text.toLowerCase();
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_tour_refunds')
      .leftJoin('trabill_tour_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .leftJoin('trabill_clients', { client_id: 'crefund_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .where('refund_org_agency', this.org_agency)
      .andWhere('refund_is_deleted', is_deleted)
      .modify((event) => {
        event
          .andWhere('refund_org_agency', this.org_agency)
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(refund_create_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
            if (search_text) {
              this.andWhereRaw(`LOWER(refund_vouchar_number) LIKE ?`, [
                `%${search_text}%`,
              ])
                .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                  `%${search_text}%`,
                ])
                .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search_text}%`]);
            }
          });
      });
    return count;
  }

  public async getAllTourRefundVendor(refund_id: idType) {
    const refund = await this.query()
      .select(
        'vrefund_id',
        'vrefund_refund_id',
        'vrefund_invoice_id',
        'vrefund_total_amount',
        'vrefund_charge_amount',
        'vrefund_return_amount',
        'vrefund_vouchar_number',
        'vrefund_payment_type',
        'vrefund_moneyreturn_type',
        'vrefund_is_deleted',
        this.db.raw('IFNULL(vendor_name, combine_name) AS vrefund_vendor_name'),
        this.db.raw(
          'CASE WHEN vrefund_vendor_combined_id IS NOT NULL THEN "combined" ELSE "VENDOR" END AS vrefund_vendor_type'
        )
      )
      .from('trabill_tour_refunds_to_vendors')
      .leftJoin('trabill_vendors', {
        vendor_id: 'vrefund_vendor_id',
      })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vrefund_vendor_combined_id',
      })
      .whereNot('vrefund_is_deleted', 1)
      .andWhere('vrefund_refund_id', refund_id);

    return refund;
  }

  public async viewTourForEdit(refund_id: idType) {
    const data = await this.query()
      .select(
        'refund_id',
        this.db.raw(
          'IFNULL(client_name, combine_name, company_name) as client_name'
        ),
        'crefund_total_amount as refund_amount',
        'refund_note',
        'crefund_charge_amount as refund_charge',
        'crefund_vouchar_number as voucher_no',
        'crefund_payment_type as payment_type',
        'refund_create_date as create_date'
      )
      .from('trabill_tour_refunds')
      .leftJoin('trabill_tour_refunds_to_clients', {
        crefund_refund_id: 'refund_id',
      })
      .leftJoin('trabill_clients', { client_id: 'crefund_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'crefund_client_id',
      })
      .where('refund_id', refund_id);

    return data;
  }

  public async view_tour_info_for_refund(invoice_id: idType) {
    const [data] = (await this.query()
      .select('pax_name', 'ticket_pnr', 'ticket_no', 'airticket_route')
      .from('view_tour_info_for_refund')
      .where('billing_invoice_id', invoice_id)) as {
      pax_name: string;
      ticket_pnr: string;
      ticket_no: string;
      airticket_route: string;
    }[];

    return data;
  }

  async addPartialRefund(data: IPartialRefund) {
    const [id] = await this.query()
      .insert({
        ...data,
        prfnd_org_agency: this.org_agency,
      })
      .into('trabill_pershial_refund');

    return id;
  }

  addPartialRefundVendorInfo = async (
    data: IPartialRefundVendorInfo | IPartialRefundVendorInfo[]
  ) => {
    await this.query().insert(data).into('trabill_pershial_vendor_refund');
  };

  getPersialRefundTickets = async (
    client_id: number | null,
    combine_id: number | null
  ) => {
    return await this.query()
      .from('trabill.trabill_invoices as ti')
      .select(
        'ti.invoice_id',
        'ti.invoice_no',
        'ti.invoice_net_total',
        this.db.raw('IFNULL(SUM(ticp.invclientpayment_amount), 0) AS payment')
      )
      .leftJoin(
        'trabill.trabill_invoice_client_payments AS ticp',
        'ti.invoice_id',
        'ticp.invclientpayment_invoice_id'
      )
      .where('invoice_org_agency', this.org_agency)
      .whereIn('invoice_category_id', [1, 2, 3])
      .andWhere('invoice_client_id', client_id)
      .andWhere('invoice_combined_id', combine_id)
      .whereNot('invoice_is_deleted', 1)
      // .whereNot('invoice_is_refund', 1)
      .whereNot('invoice_is_cancel', 1)
      .whereNot('invoice_is_void', 1)
      .groupBy('ti.invoice_id', 'ti.invoice_no', 'ti.invoice_net_total');
    // .havingRaw('payment >= ti.invoice_net_total');
  };

  getPersialRefundTicketsByInvoice = async (invoice_id: idType) => {
    return await this.query()
      .select(
        'airticket_id',
        'airticket_invoice_id',
        'airticket_org_agency',
        'airticket_ticket_no as airticket_no'
      )
      .from('trabill_invoice_airticket_items')
      .where('airticket_invoice_id', invoice_id)
      .whereNot('airticket_is_refund', 1)
      .whereNot('airticket_is_reissued', 1)
      .whereNot('airticket_is_deleted', 1)
      .unionAll([
        this.db
          .select(
            'airticket_id',
            'airticket_invoice_id',
            'airticket_org_agency',
            'airticket_ticket_no'
          )
          .from('trabill_invoice_noncom_airticket_items')
          .where('airticket_invoice_id', invoice_id)
          .whereNot('airticket_is_refund', 1)
          .whereNot('airticket_is_reissued', 1)
          .whereNot('airticket_is_deleted', 1),
      ])
      .unionAll([
        this.db
          .select(
            'airticket_id',
            'airticket_invoice_id',
            'airticket_org_agency',
            'airticket_ticket_no'
          )
          .from('trabill_invoice_reissue_airticket_items')
          .where('airticket_invoice_id', invoice_id)
          .whereNot('airticket_is_refund', 1)
          .whereNot('airticket_is_reissued', 1)
          .whereNot('airticket_is_deleted', 1),
      ]);
  };

  getPersialRfndInvoiceId = async (refund_id: idType) => {
    const [data] = (await this.query()
      .select('prfnd_invoice_id', 'prfnd_vouchar_number')
      .from('trabill_pershial_refund')
      .where('prfnd_id', refund_id)) as {
      prfnd_invoice_id: number;
      prfnd_vouchar_number: string;
    }[];

    return data;
  };

  getPersialRfndInfo = async (refund_id: idType) => {
    const [data] = (await this.query()
      .select(
        this.db.raw(
          `CASE WHEN prfnd_client_id IS NOT NULL THEN CONCAT('client-',prfnd_client_id) ELSE CONCAT('combined-',prfnd_combine_id) END AS comb_client`
        ),
        'prfnd_trxn_id',
        'prfnd_charge_trxn_id',
        'prfnd_actrxn_id'
      )
      .from('trabill_pershial_refund')
      .where('prfnd_id', refund_id)) as {
      comb_client: string;
      prfnd_trxn_id: number;
      prfnd_charge_trxn_id: number;
      prfnd_actrxn_id: number;
    }[];

    return data;
  };

  getPersialRefundVendorInfo = async (refund_id: idType) => {
    const data = (await this.query()
      .select(
        this.db.raw(
          `CASE WHEN vprfnd_vendor_id IS NOT NULL THEN CONCAT('vendor-',vprfnd_vendor_id) ELSE CONCAT('combined-',vprfnd_combine_id) END AS comb_vendor`
        ),
        'vprfnd_trxn_id',
        'vprfnd_charge_trxn_id',
        'vprfnd_actrxn_id',
        'vprfnd_airticket_id'
      )
      .from('trabill_pershial_vendor_refund')
      .where('vprfnd_refund_id', refund_id)
      .andWhere('vprfnd_is_deleted', 0)) as {
      comb_vendor: string;
      vprfnd_trxn_id: number;
      vprfnd_charge_trxn_id: number;
      vprfnd_actrxn_id: number;
      vprfnd_airticket_id: number;
    }[];

    return data;
  };

  DeletePartialRefund = async (refund_id: idType, prfnd_deleted_by: idType) => {
    return await this.query()
      .update({ prfnd_is_deleted: 1, prfnd_deleted_by })
      .into('trabill_pershial_refund')
      .where('prfnd_id', refund_id);
  };

  deletePartialVendorRefund = async (
    refund_id: idType,
    vprefund_deleted_by: idType
  ) => {
    return await this.query()
      .update({
        vprfnd_is_deleted: 1,
        vprefund_deleted_by,
      })
      .into('trabill_pershial_vendor_refund')
      .where('vprfnd_refund_id', refund_id);
  };

  getInvoiceInfo = async (invoice_id: idType) => {
    const [data] = (await this.query()
      .select('invoice_category_id')
      .from('trabill_invoices')
      .where('invoice_id', invoice_id)) as { invoice_category_id: number }[];

    return data;
  };

  getPersialRefund = async (
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) => {
    search && search.toLowerCase();
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const offset = (page - 1) * size;

    let data: any[] = [];

    const refund_info = await this.query()
      .select(
        'prfnd_id',
        'prfnd_vouchar_number',
        this.db.raw(
          `COALESCE(client_name, combine_name, company_name) AS client_name`
        ),
        'prfnd_date',
        'prfnd_payment_type',
        'prfnd_total_amount',
        'prfnd_charge_amount',
        'prfnd_return_amount',
        'prfnd_note',
        'prfnd_profit_amount',
        'prfnd_create_date'
      )
      .from('trabill_pershial_refund')
      .leftJoin('trabill_clients AS tc', { 'tc.client_id': 'prfnd_client_id' })
      .leftJoin('trabill_combined_clients AS tcc', {
        'tcc.combine_id': 'prfnd_combine_id',
      })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'prfnd_client_id',
      })
      .modify((build) => {
        build
          .andWhere('prfnd_org_agency', this.org_agency)
          .andWhere(function () {
            if (search) {
              this.andWhereRaw(`LOWER(prfnd_vouchar_number) LIKE ?`, [
                `%${search}%`,
              ])
                .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(company_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search}%`]);
            }

            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(prfnd_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
          });
      })
      .andWhere('prfnd_is_deleted', 0)
      .andWhere('prfnd_org_agency', this.org_agency)
      .orderBy('prfnd_id', 'desc')
      .limit(size)
      .offset(offset);

    for (const info of refund_info) {
      const vendor_refund_info = await this.query()
        .select(
          'vprfnd_id',
          this.db.raw(`COALESCE(vendor_name, combine_name) AS vendor_name`),
          'vprfnd_payment_type',
          'vprfnd_total_amount',
          'vprfnd_charge_amount',
          'vprfnd_return_amount'
        )
        .from('trabill_pershial_vendor_refund')
        .leftJoin('trabill_vendors', { vendor_id: 'vprfnd_vendor_id' })
        .leftJoin('trabill_combined_clients', {
          combine_id: 'vprfnd_combine_id',
        })
        .where('vprfnd_refund_id', info.prfnd_id)
        .andWhere('vprfnd_is_deleted', 0);

      data.push({ ...info, vendor_refund_info });
    }

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_pershial_refund')
      .leftJoin('trabill_clients AS tc', { 'tc.client_id': 'prfnd_client_id' })
      .leftJoin('trabill_combined_clients AS tcc', {
        'tcc.combine_id': 'prfnd_combine_id',
      })
      .leftJoin('trabill_client_company_information', {
        company_client_id: 'prfnd_client_id',
      })
      .modify((build) => {
        build
          .andWhere('prfnd_org_agency', this.org_agency)
          .andWhere(function () {
            if (search) {
              this.andWhereRaw(`LOWER(prfnd_vouchar_number) LIKE ?`, [
                `%${search}%`,
              ])
                .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(company_name) LIKE ?`, [`%${search}%`])
                .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search}%`]);
            }

            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(prfnd_date,'%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }
          });
      })
      .andWhere('prfnd_org_agency', this.org_agency)
      .andWhere('prfnd_is_deleted', 0);

    return { count: row_count, data };
  };

  getSinglePersialRefund = async (refund_id: idType) => {
    const [refund_info] = await this.query()
      .select(
        'prfnd_id',
        'prfnd_invoice_id',
        'invoice_no',
        'prfnd_vouchar_number',
        'prfnd_date',
        'prfnd_client_id',
        'prfnd_combine_id',
        this.db.raw(`COALESCE(client_name, combine_name) AS client_name`),
        'client_mobile',
        'prfnd_payment_type',
        'prfnd_total_amount',
        'prfnd_charge_amount',
        'prfnd_note',
        'prfnd_return_amount',
        'prfnd_profit_amount',
        'prfnd_create_date'
      )
      .from('trabill_pershial_refund')
      .leftJoin('trabill_invoices', { invoice_id: 'prfnd_invoice_id' })
      .leftJoin('trabill_clients', { client_id: 'prfnd_client_id' })
      .leftJoin('trabill_combined_clients', { combine_id: 'prfnd_combine_id' })
      .where('prfnd_id', refund_id);

    const vendor_refund_info = await this.query()
      .select(
        'vprfnd_vendor_id',
        'vprfnd_combine_id',
        'vprfnd_account_id',
        'vprfnd_payment_type',
        'vprfnd_payment_method',
        'vprfnd_total_amount',
        'vprfnd_return_amount',
        'vprfnd_charge_amount',
        'vprfnd_ait',
        'vprfnd_base_fare',
        'vprfnd_used_base_fare',
        'vprfnd_remaining_base_fare',
        'vprfnd_tax',
        'vprfnd_used_tax',
        'vprfnd_remaining_tax',
        'vprfnd_total_commission',
        this.db.raw(`COALESCE(combine_name, vendor_name) as vendor_name`),
        this.db.raw(`COALESCE(combine_mobile, vendor_mobile) as vendor_mobile`)
      )
      .from('trabill_pershial_vendor_refund')
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vprfnd_combine_id',
      })
      .leftJoin('trabill_vendors', { vendor_id: 'vprfnd_vendor_id' })
      .where('vprfnd_refund_id', refund_info.prfnd_id)
      .andWhere('vprfnd_is_deleted', 0);

    const data = { ...refund_info, vendor_refund_info };

    return data;
  };

  getPartialAirticketInfo = async (
    airticket_id: idType,
    invoice_id: idType
  ) => {
    const [data] = await this.query()
      .select(
        'airticket_invoice_id as invoice_id',
        'invoice_no',
        'airticket_client_id as invoice_client_id',
        'airticket_client_id as invoice_combined_id',
        'client_name',
        'airticket_id',
        'airline_name',
        'airticket_ticket_no',
        'airticket_client_price as client_price',
        'airticket_base_fare',
        'airticket_purchase_price as vendor_price',
        'airticket_vendor_id as vendor_id',
        'airticket_vendor_combine_id as vendor_combine_id',
        'vendor_name',
        'airticket_tax'
      )
      .from('trabill.v_airticket_for_refund')
      .where('airticket_org_agency', this.org_agency)
      .andWhere('airticket_invoice_id', invoice_id)
      .andWhere('airticket_id', airticket_id);

    return data;
  };
}

export default RefundModel;
