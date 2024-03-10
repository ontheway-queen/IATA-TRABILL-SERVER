import AbstractModels from '../../../../abstracts/abstract.models';
import { IDeletePreviousVendor } from '../../../../common/interfaces/commonInterfaces';
import { idType } from '../../../../common/types/common.types';
import { IHotelInfoDB } from '../../../../common/types/Invoice.common.interface';
import CustomError from '../../../../common/utils/errors/customError';
import { IOtherBillingInfoDb } from '../../invoice_other/types/invoiceOther.interface';
import {
  IUmmrahPassenger,
  IUmmrahRefund,
  IUmmrahRefundItems,
} from '../Type/invoiceUmmrah.Interfaces';

class InvoiceUmmrah extends AbstractModels {
  public insertUmmrahPassengerInfo = async (data: IUmmrahPassenger) => {
    const [passenger_id] = await this.query()
      .insert(data)
      .into('trabill_invoice_umrah_passenger_info');

    return passenger_id;
  };
  public updateUmmrahPassengerInfo = async (
    data: IUmmrahPassenger,
    passenger_id: idType
  ) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_umrah_passenger_info')
      .where('passenger_id', passenger_id);

    return passenger_id;
  };
  public deleteUmmrahPassenger = async (
    passenger_id: idType,
    passenger_deleted_by: idType
  ) => {
    await this.query()
      .update({ passenger_is_deleted: 1, passenger_deleted_by })
      .into('trabill_invoice_umrah_passenger_info')
      .where('passenger_id', passenger_id);

    return passenger_id;
  };

  deleteUmmrahPassengerRoutes = async (
    iu_passenger_id: number,
    iu_deleted_by: idType
  ) => {
    await this.query()
      .update({ iu_is_deleted: 1, iu_deleted_by })
      .into('trabill_invoice_umrah_passenger_routes')
      .where('iu_passenger_id', iu_passenger_id);
  };

  deleteUmmrahRoutesByInvoiceId = async (
    invoiceId: idType,
    deleted_by: idType
  ) => {
    const passenger_id = await this.query()
      .select('passenger_id')
      .from('trabill_invoice_umrah_passenger_info')
      .where('passenger_invoice_id', invoiceId)
      .andWhereNot('passenger_is_deleted', 1);

    for (const item of passenger_id) {
      await this.query()
        .update({ iu_is_deleted: 1, iu_deleted_by: deleted_by })
        .into('trabill_invoice_umrah_passenger_routes')
        .where('iu_passenger_id', item.passenger_id);
    }
  };

  insertUmmrahPassengerRoutes = async (
    data: { iu_passenger_id: number; iu_airport_id: number }[]
  ) => {
    await this.query()
      .insert(data)
      .into('trabill_invoice_umrah_passenger_routes');
  };

  public getIUmmrahPassengerInfos = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        'passenger_id',
        'passenger_passport_id',
        'passenger_tracking_number',
        'ticket_pnr',
        'ticket_airline_id',
        'ticket_no',
        'ticket_reference_no',
        'ticket_journey_date',
        'ticket_return_date'
      )
      .from('trabill_invoice_umrah_passenger_info')
      .where('passenger_invoice_id', invoiceId)
      .andWhereNot('passenger_is_deleted', 1);

    let dataForReturn = [];

    for (const item of data) {
      const airlineId = await this.query()
        .select('iu_airport_id')
        .from('trabill_invoice_umrah_passenger_routes')
        .where('iu_passenger_id', item.passenger_id)
        .andWhereNot('iu_is_deleted', 1);

      const ticket_route = airlineId.map((item) => item.iu_airport_id);

      dataForReturn.push({ ...item, ticket_route });
    }

    return dataForReturn;
  };

  public viewIUmmrahPassengerInfos = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'passenger_passport_id',
        'passenger_tracking_number',
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'ticket_pnr',
        'ticket_airline_id',
        'ticket_no',
        'ticket_reference_no',
        'ticket_journey_date',
        'ticket_return_date'
      )
      .from('trabill_invoice_umrah_passenger_info')
      .where('passenger_invoice_id', invoiceId)
      .andWhereNot('passenger_is_deleted', 1)
      .leftJoin(
        'trabill_passport_details',
        'trabill_invoice_umrah_passenger_info.passenger_passport_id',
        'trabill_passport_details.passport_id'
      );
  };

  public deletePassengerInfo = async (
    invoiceId: idType,
    passenger_deleted_by: idType
  ) => {
    await this.query()
      .update({ passenger_is_deleted: 1, passenger_deleted_by })
      .into('trabill_invoice_umrah_passenger_info')
      .where('passenger_invoice_id', invoiceId);
  };

  // @INVOICE_UMMRAH_HOTEL_INFOS
  public insertIUHotelInfos = async (data: IHotelInfoDB | IHotelInfoDB[]) => {
    const hotel_id = await this.query()
      .insert(data)
      .into('trabill_invoice_umrah_hotel_infos');

    return hotel_id[0];
  };
  public updateIUHotelInfo = async (data: IHotelInfoDB, hotelId: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_umrah_hotel_infos')
      .where('hotel_id', hotelId);
  };

  public deleteIUHotelInfo = async (
    hotelId: idType,
    hotel_deleted_by: idType
  ) => {
    await this.query()
      .update({ hotel_is_deleted: 1, hotel_deleted_by })
      .into('trabill_invoice_umrah_hotel_infos')
      .where('hotel_id', hotelId);
  };

  public getIUHotelInfos = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        'hotel_id',
        'hotel_name',
        'hotel_check_in_date',
        'hotel_check_out_date',
        'hotel_room_type_id',
        'rtype_name as hotel_room_type'
      )
      .from('trabill_invoice_umrah_hotel_infos')
      .leftJoin('trabill_room_types', { rtype_id: 'hotel_room_type_id' })
      .where('hotel_invoice_id', invoiceId)
      .andWhereNot('hotel_is_deleted', 1);

    return data;
  };

  public deleteIUHotelInfosByInvoiceId = async (
    invoiceId: idType,
    hotel_deleted_by: idType
  ) => {
    const data = await this.query()
      .update({ hotel_is_deleted: 1, hotel_deleted_by })
      .into('trabill_invoice_umrah_hotel_infos')
      .where('hotel_invoice_id', invoiceId);

    return data;
  };

  // @INVOICE_UMMRAH_BILLING_INFOS
  public insertIUBillingInfos = async (data: IOtherBillingInfoDb) => {
    const billing_id = await this.query()
      .insert(data)
      .into('trabill_invoice_umrah_billing_infos');

    return billing_id[0];
  };
  public updateIUBillingInfo = async (
    data: IOtherBillingInfoDb,
    billing_id: idType
  ) => {
    return await this.db('trabill_invoice_umrah_billing_infos')
      .update(data)
      .where('billing_id', billing_id);
  };

  public getIUBillingInfos = async (invoiceId: idType, view?: boolean) => {
    const data = await this.query()
      .select(
        view ? 'vendor_name' : 'billing_vendor_id',
        'billing_combined_id',
        'pax_name',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit',
        view ? 'product_name' : 'billing_product_id'
      )
      .from('trabill_invoice_umrah_billing_infos')
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1)
      .leftJoin('trabill_vendors', { vendor_id: 'billing_vendor_id' })
      .leftJoin('trabill_products', { billing_product_id: 'product_id' });
    return data as {
      billing_vendor_id: number;
      billing_quantity: number;
      billing_cost_price: string;
      billing_combined_id: number;
    }[];
  };

  public getPrevIUBilling = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        'billing_combined_id as combined_id',
        'billing_vendor_id as vendor_id',
        this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'),
        'billing_vtrxn_id as prevTrxnId'
      )
      .from('trabill_invoice_umrah_billing_infos')
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1);
    return data as IDeletePreviousVendor[];
  };

  public getUmrahBillingInfo = async (billing_id: idType) => {
    const data = await this.query()
      .select(
        'billing_combined_id as combined_id',
        'billing_vendor_id as vendor_id',
        this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'),
        'billing_vtrxn_id as prevTrxnId',
        this.db.raw(
          `CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-', billing_vendor_id) ELSE CONCAT('combined-', billing_combined_id) END AS prevComvendor`
        )
      )
      .from('trabill_invoice_umrah_billing_infos')
      .where('billing_id', billing_id)
      .andWhereNot('billing_is_deleted', 1);
    return data as IDeletePreviousVendor[];
  };

  public getForEditBilling = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        'billing_id',
        this.db.raw(
          "CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"
        ),
        'pax_name',
        'billing_description',
        'billing_product_id',
        'billing_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit'
      )
      .from('trabill_invoice_umrah_billing_infos')
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1);
    return data;
  };

  public deleteIUBillingInfos = async (
    invoiceId: idType,
    billing_deleted_by: idType
  ) => {
    const data = await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_umrah_billing_infos')
      .where('billing_invoice_id', invoiceId);

    return data;
  };
  public deleteIUSingleBilling = async (
    billing_id: idType,
    billing_deleted_by: idType
  ) => {
    if (!billing_id) {
      throw new CustomError('please valid billing ID', 400, 'Bad ID');
    }
    return await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_umrah_billing_infos')
      .where('billing_id', billing_id);
  };

  public async createUmmrahRefund(data: IUmmrahRefund) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_invoice_ummrah_refund');

    return id;
  }

  public async createUmmrahRefundItems(
    data: IUmmrahRefundItems | IUmmrahRefundItems[]
  ) {
    return await this.query()
      .insert(data)
      .into('trabill_invoice_ummrah_refund_items');
  }

  public async updateUmmrahBillingRemainingQuantity(
    billing_id: idType,
    refund_quantity: number
  ) {
    const [{ billing_remaining_quantity }] = (await this.query()
      .select('billing_remaining_quantity')
      .from('trabill_invoice_umrah_billing_infos')
      .where({ billing_id })) as { billing_remaining_quantity: number }[];

    const remaining_quantity =
      Number(billing_remaining_quantity) - refund_quantity;

    return await this.query()
      .update({
        billing_remaining_quantity: remaining_quantity,
        billing_is_refund: remaining_quantity == 0 ? 1 : 0,
      })
      .into('trabill_invoice_umrah_billing_infos')
      .where({ billing_id });
  }

  public async updateUmmrahInvoiceIsRefund(
    invoice_id: idType,
    is_refund: 0 | 1
  ) {
    const data = (await this.query()
      .select('billing_id')
      .from('trabill_invoice_umrah_billing_infos')
      .where('billing_invoice_id', invoice_id)
      .andWhereNot('billing_is_refund', is_refund)
      .andWhereNot('billing_is_deleted', 1)) as { billing_id: number }[];

    if (!data.length)
      await this.query()
        .update({ invoice_is_refund: is_refund })
        .into('trabill_invoices')
        .where({ invoice_id });
  }

  public async getBillingInfo(invoice_id: idType) {
    return await this.query()
      .select(
        'billing_id',
        this.db.raw(
          `COALESCE(concat('client-', invoice_client_id), concat('combined-', invoice_combined_id)) AS comb_client`
        ),
        this.db.raw(
          `COALESCE(concat('vendor-', billing_vendor_id), concat('combined-', billing_combined_id)) AS comb_vendor`
        ),
        'billing_product_id',
        'product_name',
        'billing_quantity',
        'billing_remaining_quantity',
        'billing_unit_price',
        'billing_subtotal',
        'billing_cost_price',
        'billing_profit'
      )
      .from('trabill_invoice_umrah_billing_infos')
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_invoices', {
        'trabill_invoices.invoice_id': 'billing_invoice_id',
      })
      .where('billing_invoice_id', invoice_id)
      .andWhereNot('billing_is_deleted', 1)
      .andWhereNot('billing_is_refund', 1);
  }

  public async getUmmrahRefund(invoice_id: idType) {
    return await this.query()
      .select(
        'refund_id',
        this.db.raw(`COALESCE(client_name, combine_name) AS client_name`),
        'refund_voucher_no',
        'refund_client_total',
        'refund_client_type',
        'refund_client_payment_method',
        'refund_client_acc_id',
        'cl_acc.account_name AS client_account_name',
        'v_acc.account_name AS vendor_account_name',
        'refund_vendor_total',
        'refund_vendor_type',
        'refund_date'
      )
      .from('trabill_invoice_ummrah_refund')
      .leftJoin('trabill_clients', { client_id: 'refund_client_id' })
      .leftJoin('trabill_combined_clients', { combine_id: 'refund_combine_id' })
      .leftJoin('trabill_accounts AS cl_acc', {
        'cl_acc.account_id': 'refund_client_acc_id',
      })
      .leftJoin('trabill_accounts AS v_acc', {
        'v_acc.account_id': 'refund_vendor_acc_id',
      })
      .where('refund_org_agency', this.org_agency)
      .andWhere('refund_invoice_id', invoice_id)
      .andWhere('refund_is_deleted', 0);
  }

  public async getUmmrahRefundItems(invoice_id: idType) {
    return await this.query()
      .select(
        this.db.raw(`COALESCE(vendor_name, combine_name) AS vendor_name`),
        'ritem_quantity',
        'ritem_unit_price',
        'ritem_client_charge',
        'ritem_client_refund',
        'ritem_cost_price',
        'ritem_vendor_charge',
        'ritem_vendor_refund'
      )
      .from('trabill_invoice_ummrah_refund')
      .leftJoin('trabill_invoice_ummrah_refund_items', (event) => {
        return event
          .on('refund_id', '=', 'ritem_refund_id')
          .andOn(this.db.raw(`ritem_is_deleted = 0`));
      })
      .leftJoin('trabill_vendors', { vendor_id: 'ritem_vendor_id' })
      .leftJoin('trabill_combined_clients', { combine_id: 'ritem_combine_id' })
      .where('ritem_is_deleted', 0)
      .andWhere('refund_invoice_id', invoice_id);
  }
}

export default InvoiceUmmrah;
