import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import {
  IHotelInfoDB,
  ITicketInfo,
  ITransportInfo,
} from '../../../../common/types/Invoice.common.interface';
import {
  IOtherBillingInfoDb,
  IOtherInvoicePass,
} from '../types/invoiceOther.interface';

class InvoiceOther extends AbstractModels {
  // @Insert
  public async insertTicketInfo(data: ITicketInfo[]) {
    await this.query().insert(data).into('trabill_other_invoices_ticket');
  }
  public async updateTicketInfo(data: ITicketInfo, ticket_id: idType) {
    await this.query()
      .update(data)
      .into('trabill_other_invoices_ticket')
      .where('ticket_id', ticket_id);
  }

  public async insertHotelInfo(data: IHotelInfoDB | IHotelInfoDB[]) {
    await this.query().insert(data).into('trabill_other_invoices_hotel');
  }

  public async updatetHotelInfo(data: IHotelInfoDB, hotel_id: idType) {
    await this.query()
      .update(data)
      .into('trabill_other_invoices_hotel')
      .where('hotel_id', hotel_id);
  }

  public async insertTransportInfo(data: ITransportInfo[]) {
    await this.query().insert(data).into('trabill_other_invoices_transport');
  }

  public async updateTransportInfo(data: ITransportInfo, transport_id: idType) {
    await this.query()
      .update(data)
      .into('trabill_other_invoices_transport')
      .where('transport_id', transport_id);
  }

  public async insertBillingInfo(data: IOtherBillingInfoDb) {
    await this.query().insert(data).into('trabill_other_invoices_billing');
  }

  public async updateBillingInfo(
    data: IOtherBillingInfoDb,
    billing_id: idType
  ) {
    await this.query()
      .update(data)
      .into('trabill_other_invoices_billing')
      .where('billing_id', billing_id);
  }
  public async deleteOtherSingleBillingInfo(
    billing_id: idType,
    billing_deleted_by: idType
  ) {
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_other_invoices_billing')
      .where('billing_id', billing_id);
  }

  insertOtherInvoicePass = async (data: IOtherInvoicePass) => {
    await this.query().insert(data).into('trabill_other_invoices_passport');
  };

  updateOtherInvoicePass = async (
    data: IOtherInvoicePass,
    other_passport_id: idType
  ) => {
    await this.query()
      .update(data)
      .into('trabill_other_invoices_passport')
      .where('other_pass_id', other_passport_id);
  };

  deleteOtherInvoicePass = async (invoiceId: number, deleted_by: idType) => {
    const passId = await this.query()
      .select('other_pass_passport_id')
      .from('trabill_other_invoices_passport')
      .where('other_pass_invoice_id', invoiceId);

    await this.query()
      .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
      .into('trabill_passport_details')
      .where('passport_id', passId);

    await this.query()
      .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
      .into('trabill_other_invoices_passport')
      .where('other_pass_invoice_id', invoiceId);
  };

  // @Delete
  public async deleteTicketInfo(invoice_id: idType, ticket_deleted_by: idType) {
    await this.query()
      .update({ ticket_is_deleted: 1, ticket_deleted_by })
      .into('trabill_other_invoices_ticket')
      .where('ticket_invoice_id', invoice_id);
  }
  public async deleteSingleTicket(
    ticket_id: idType,
    ticket_deleted_by: idType
  ) {
    await this.query()
      .update({ ticket_is_deleted: 1, ticket_deleted_by })
      .into('trabill_other_invoices_ticket')
      .where('ticket_id', ticket_id);
  }

  public async deleteHotelInfo(invoice_id: idType, hotel_deleted_by: idType) {
    await this.query()
      .update({ hotel_is_deleted: 1, hotel_deleted_by })
      .into('trabill_other_invoices_hotel')
      .where('hotel_invoice_id', invoice_id);
  }
  public async deleteSingleHotelInfo(
    hotel_id: idType,
    hotel_deleted_by: idType
  ) {
    await this.query()
      .update({ hotel_is_deleted: 1, hotel_deleted_by })
      .into('trabill_other_invoices_hotel')
      .where('hotel_id', hotel_id);
  }

  public async deleteTransportInfo(
    invoice_id: idType,
    transport_deleted_by: idType
  ) {
    await this.query()
      .update({ transport_is_deleted: 1, transport_deleted_by })
      .into('trabill_other_invoices_transport')
      .where('transport_other_invoice_id', invoice_id);
  }
  public async deleteSingleTransportInfo(
    transport_id: idType,
    transport_deleted_by: idType
  ) {
    await this.query()
      .update({ transport_is_deleted: 1, transport_deleted_by })
      .into('trabill_other_invoices_transport')
      .where('transport_id', transport_id);
  }






  getProductsName = async (productIds: number[]) => {
    if (productIds.length) {

      const names = await this.query()
        .select(this.db.raw('GROUP_CONCAT(product_name) as productsName'))
        .from("trabill_products")
        .whereIn('product_id', productIds);

      return names[0].productsName
    }

    return ''



  }










  public async deleteBillingInfo(
    invocieId: idType,
    billing_deleted_by: idType
  ) {
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .from('trabill_other_invoices_billing')
      .where('billing_invoice_id', invocieId);
  }

  public async deleteOtherRefund(invocieId: idType, refund_deleted_by: idType) {
    await this.query()
      .update({ refund_is_deleted: 1, refund_deleted_by })
      .into('trabill_other_refunds')
      .where('refund_invoice_id', invocieId);
  }

  getPreviousBillingInfo = async (billing_id: idType) => {
    return await this.db('trabill_other_invoices_billing')
      .select(
        'billing_combined_id as combined_id',
        'billing_vendor_id as vendor_id',
        'billing_vtrxn_id as prevTrxnId'
      )
      .where('billing_id', billing_id)
      .andWhereNot('billing_is_deleted', 1);
  };

  public async deleteOtherPassport(invoice_id: idType, deleted_by: idType) {
    const passportId = await this.query()
      .select('other_pass_passport_id')
      .from('trabill_other_invoices_passport')
      .where('other_pass_invoice_id', invoice_id)
      .andWhereNot('other_pass_is_deleted', 1);

    await this.query()
      .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
      .into('trabill_other_invoices_passport')
      .where('other_pass_invoice_id', invoice_id);

    for (const item of passportId) {
      await this.query()
        .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
        .into('trabill_passport_details')
        .where('passport_id', item.other_pass_passport_id);
    }
  }
  public async deleteSingleOtherPassport(
    other_pass_id: idType,
    deleted_by: idType
  ) {
    const [{ other_pass_passport_id }] = await this.query()
      .select('other_pass_passport_id')
      .from('trabill_other_invoices_passport')
      .where('other_pass_id', other_pass_id);

    await this.query()
      .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
      .into('trabill_other_invoices_passport')
      .where('other_pass_id', other_pass_id);

    await this.query()
      .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
      .into('trabill_passport_details')
      .where('passport_id', other_pass_passport_id);
  }

  public async deleteUpdateBillingInfo(invoice_id: idType) {
    await this.query()
      .update({ billing_is_deleted: 1 })
      .into('trabill_other_invoices_billing')
      .where('billing_invoice_id', invoice_id);
  }

  // =============== GET REFUND INVOICE OTHERS BY CLIENT ID
  public getRefundOthersInfo = async (clientId: idType) => {
    const data = await this.query()
      .from('trabill_invoices')
      .select(
        'invoice_no',
        'billing_vendor_id',
        'pax_name',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_subtotal',
        'trabill_products.product_name'
      )
      .where('invoice_client_id', clientId)
      .andWhere('invoice_category_id', 5)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhereNot('invoice_is_deleted', 1)
      .leftJoin('trabill_other_invoices_billing', {
        billing_invoice_id: 'invoice_id',
      })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .andWhereNot('billing_is_deleted', 1);

    return data;
  };

  public getInvoiceBilling = async (id: idType) => {
    const data = await this.query()
      .from('trabill_other_invoices_billing')
      .select(
        'billing_id',
        this.db.raw(
          "CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"
        ),
        'billing_product_id',
        'pax_name',
        'billing_description',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_profit',
        'billing_cost_price'
      )

      .where('billing_invoice_id', id)
      .andWhereNot('billing_is_deleted', 1);
    return data;
  };

  public getPrevOtherBilling = async (invoiceId: idType) => {
    const data = await this.query()
      .from('trabill_other_invoices_billing')
      .select(
        this.db.raw(
          "CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS prevComvendor"
        ),
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
      prevComvendor: string;
    }[];
  };

  getPreviousSingleBilling = async (billing_id: idType) => {
    const [data] = await this.db('trabill_other_invoices_billing')
      .select(
        'billing_vtrxn_id as prevTrxnId',
        this.db.raw(
          `CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS prevComvendor`
        )
      )
      .where('billing_id', billing_id)
      .andWhereNot('billing_is_deleted', 1);

    return data as { prevTrxnId: number; prevComvendor: string };
  };

  public getInvoiceBillingInfo = async (id: idType) => {
    const data = await this.query()
      .from('trabill_other_invoices_billing')
      .select(
        'pax_name',
        'billing_description',
        'billing_quantity',
        'billing_remaining_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit',
        'product_name',
        this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name')
      )
      .where('billing_invoice_id', id)
      .andWhereNot('billing_is_deleted', 1)
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'billing_combined_id',
      })
      .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' });
    return data;
  };

  public getInvoiceHotelInfo = async (id: idType) => {
    const data = await this.query()
      .select(
        'hotel_name',
        'hotel_reference_no',
        'hotel_check_in_date',
        'hotel_check_out_date',
        'rtype_name'
      )
      .from('trabill_other_invoices_hotel')
      .leftJoin('trabill_room_types', { rtype_id: 'hotel_room_type_id' })
      .where('hotel_invoice_id', id)
      .andWhereNot('hotel_is_deleted', 1);

    return data;
  };

  public getInvoiceHotel = async (id: idType) => {
    const data = await this.query()
      .select(
        'hotel_id',
        'hotel_name',
        'hotel_reference_no',
        'hotel_check_in_date',
        'hotel_check_out_date',
        'hotel_room_type_id'
      )
      .from('trabill_other_invoices_hotel')
      .where('hotel_invoice_id', id)
      .andWhereNot('hotel_is_deleted', 1);

    return data;
  };

  public getTransportType = async () => {
    const by_client = await this.query()
      .select('ttype_id', 'ttype_name')
      .from('trabill_transport_types')
      .andWhere('ttype_org_agency', null)
      .andWhereNot('ttype_has_deleted', 1);

    const by_default = await this.query()
      .from('trabill_transport_types')
      .select('ttype_id', 'ttype_name')
      .andWhere('ttype_org_agency', this.org_agency)
      .andWhereNot('ttype_has_deleted', 1);

    return [...by_client, ...by_default];
  };

  public getInvoiceTicketInfo = async (id: idType) => {
    const data = await this.query()
      .select(
        'ticket_id',
        'ticket_no',
        'ticket_airline_id',
        'ticket_route',
        'ticket_pnr',
        'ticket_reference_no',
        'ticket_journey_date',
        'ticket_return_date'
      )
      .from('trabill_other_invoices_ticket')
      .leftJoin(
        'trabill_airlines',
        'trabill_airlines.airline_id',
        'ticket_airline_id'
      )
      .leftJoin('trabill_invoice_airticket_routes', {
        airoute_id: 'ticket_route',
      })
      .leftJoin(
        'trabill_airports',
        'trabill_airports.airline_id',
        'airoute_route_sector_id'
      )
      .where('ticket_invoice_id', id)
      .andWhereNot('ticket_is_deleted', 1);

    return data;
  };

  public getInvoiceTransportInfo = async (id: idType) => {
    const data = await this.query()
      .select(
        'transport_id',
        'transport_type_id',
        'transport_reference_no',
        'transport_pickup_place',
        'transport_pickup_time',
        'transport_dropoff_place',
        'transport_dropoff_time'
      )
      .from('trabill_other_invoices_transport')
      .where('transport_other_invoice_id', id)
      .andWhereNot('transport_is_deleted', 1);

    return data;
  };

  public getInvoiceOtherPass = async (id: idType) => {
    const data = await this.query()
      .select(
        'other_pass_id',
        'passport_id',
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'passport_visiting_country'
      )
      .from('trabill_other_invoices_passport')
      .join('trabill_passport_details', {
        other_pass_passport_id: 'passport_id',
      })
      .where('other_pass_invoice_id', id)
      .andWhereNot('other_pass_is_deleted', 1)
      .andWhereNot('passport_is_deleted', 1);

    return data;
  };

  public getInvoiceOtherPassInfo = async (id: idType) => {
    const data = await this.query()
      .select(
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'country_name'
      )
      .from('trabill_other_invoices_passport')
      .join('trabill_passport_details', {
        other_pass_passport_id: 'passport_id',
      })
      .leftJoin('trabill_countries', {
        country_id: 'passport_visiting_country',
      })
      .where('other_pass_invoice_id', id)
      .andWhereNot('other_pass_is_deleted', 1)
      .andWhereNot('passport_is_deleted', 1);

    return data;
  };
  public getAllInvoiceOtherList = async (
    search_text: string,
    from_date: string,
    to_date: string,
    page: number = 1,
    size: idType = 20
  ) => {
    search_text && search_text.toLowerCase();
    size = Number(size);
    page = Number(page);
    const offset = (page - 1) * size;

    const data = await this.query()
      .select('*')
      .from('view_invoice_other_list')
      .modify((event) => {
        event
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(invoice_date, '%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }


            if (search_text) {
              this.andWhereRaw(`LOWER(invoice_no) LIKE ?`, [
                `%${search_text}%`,
              ]).orWhereRaw(`LOWER(client_name) LIKE ?`, [
                `%${search_text}%`,
              ]);
            }


          })
          .andWhere('invoice_org_agency', this.org_agency);
      })
      .where('invoice_org_agency', this.org_agency)
      .limit(size)
      .offset(offset);




    const [total] = (await this.query()
      .count('* as count')
      .from('view_invoice_other_list')
      .modify((event) => {
        event
          .andWhere(function () {
            if (from_date && to_date) {
              this.andWhereRaw(
                `DATE_FORMAT(invoice_date, '%Y-%m-%d') BETWEEN ? AND ?`,
                [from_date, to_date]
              );
            }

            if (search_text) {
              this.andWhereRaw(`LOWER(invoice_no) LIKE ?`, [
                `%${search_text}%`,
              ]).orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`]);
            }
          })
          .andWhere('invoice_org_agency', this.org_agency);
      })
      .where('invoice_org_agency', this.org_agency)) as { count: number }[];

    return { data, count: total.count };
  };
}

export default InvoiceOther;
