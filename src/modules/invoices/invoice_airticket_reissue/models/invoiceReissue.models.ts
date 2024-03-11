import AbstractModels from '../../../../abstracts/abstract.models';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { IDeletePreviousVendor } from '../../../../common/interfaces/commonInterfaces';
import { idType } from '../../../../common/types/common.types';
import { IFlightDetailsDb } from '../../invoice-air-ticket/types/invoiceAirticket.interface';

import {
  IReissueRefundDb,
  IReissueRefundItemDb,
  IReissueTicketDetailsDb,
} from '../types/invoiceReissue.interface';

class ReIssueAirticket extends AbstractModels {
  public async insertReissueAirTicketItems(data: IReissueTicketDetailsDb) {
    const id = await this.query()
      .insert({ ...data, airticket_org_agency: this.org_agency })
      .into('trabill_invoice_reissue_airticket_items');

    return id[0];
  }

  public async insertReissueFlightDetails(
    invoiceFlightDetails: IFlightDetailsDb[]
  ) {
    await this.query()
      .into('trabill_invoice_reissue_airticket_items_flight_details')
      .insert(invoiceFlightDetails);
  }

  public async deleteAirticketReissue(
    invoice_id: number,
    airticket_deleted_by: idType
  ) {
    return await this.query()
      .into('trabill_invoice_reissue_airticket_items')
      .update({ airticket_is_deleted: 1, airticket_deleted_by })
      .where('airticket_invoice_id', invoice_id);
  }

  public async deleteReissueFlightDetails(
    invoice_id: number,
    fltdetails_deleted_by: idType
  ) {
    await this.query()
      .into('trabill_invoice_reissue_airticket_items_flight_details')
      .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by })
      .where('fltdetails_invoice_id', invoice_id);
  }

  public async getReissuePrevVendors(invoice_id: number) {
    const data = await this.query()
      .from('trabill_invoice_reissue_airticket_items')
      .select(
        'airticket_vendor_id as vendor_id',
        'airticket_vendor_combine_id as combined_id',
        'airticket_purchase_price as prev_cost_price',
        'airticket_vtrxn_id as prevTrxnId'
      )
      .where('airticket_invoice_id', invoice_id)
      .andWhereNot('airticket_is_deleted', 1);

    return data as IDeletePreviousVendor[];
  }

  public async updateInvoiceReissueAirticket(
    invoice_id: number,
    updated_data: IReissueTicketDetailsDb
  ) {
    const data = await this.query()
      .into('trabill_invoice_reissue_airticket_items')
      .update(updated_data)
      .where('airticket_invoice_id', invoice_id);

    return data;
  }

  deleteReissueTicketItems = async (invoiceId: idType, deleted_by: idType) => {
    await this.query()
      .update({ p_is_deleted: 1, p_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_pax')
      .where('p_invoice_id', invoiceId);

    await this.query()
      .into('trabill_invoice_reissue_airticket_items_flight_details')
      .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
      .where('fltdetails_invoice_id', invoiceId);

    await this.query()
      .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
      .into('trabill_invoice_reissue_airticket_items')
      .where('airticket_invoice_id', invoiceId);
  };

  public getInvoiceReissuePaxDetails = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'passport_date_of_birth',
        'passport_date_of_expire',
        'passport_date_of_issue',
        'passport_email',
        'passport_mobile_no',
        'passport_name',
        'passport_nid_no',
        'passport_passport_no',
        'passport_person_type'
      )
      .from('trabill_invoice_reissue_airticket_items as reissue_ait_item')
      .where('airticket_invoice_id', invoiceId)
      .andWhereNot('airticket_is_deleted', 1)
      .leftJoin('trabill_passport_details', {
        airticket_passport_id: 'passport_id',
      })
      .leftJoin('trabill_airports', {
        'trabill_airports.airline_id':
          'reissue_ait_item.airticket_route_or_sector',
      });
  };

  public async getReissueAirticketInfo(id: idType) {
    return await this.query()
      .select(
        'airticket_penalties',
        'airticket_commission_percent',
        'airticket_fare_difference',
        'airticket_id',
        'airticket_classes',
        'airticket_ticket_no',
        'airticket_pnr',
        'airticket_client_price',
        'airticket_extra_fee',
        'airticket_purchase_price',
        'airticket_profit',
        'airticket_journey_date',
        'airticket_return_date',
        'airticket_issue_date',
        this.db.raw('COALESCE(vendor_name, combine_name) vendor_name'),
        'airline_name',
        'passport_name',
        'view_airticket_routes.airticket_routes'
      )
      .from('trabill_invoice_reissue_airticket_items as airticketitem')
      .where('airticket_invoice_id', id)
      .andWhereNot('airticket_is_deleted', 1)
      .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'airticket_vendor_combine_id',
      })
      .leftJoin('trabill_airlines', { airline_id: 'airticket_airline_id' })
      .leftJoin('trabill_passport_details', {
        passport_id: 'airticket_passport_id',
      })
      .leftJoin('view_airticket_routes', function () {
        this.on(
          'view_airticket_routes.airoute_invoice_id',
          '=',
          'airticketitem.airticket_invoice_id'
        ).andOn(
          'view_airticket_routes.airoute_airticket_id',
          '=',
          'airticketitem.airticket_id'
        );
      });
  }

  public getFlightDetails = async (invoiceId: idType) => {
    const data = await this.query()
      .from('trabill_invoice_reissue_airticket_items_flight_details')
      .select(
        'fltdetails_fly_date',
        'fltdetails_arrival_time',
        'fltdetails_departure_time',
        'trabill_airlines.airline_name',
        'from.airline_airport as flight_from',
        'to.airline_airport as flight_to'
      )
      .where('fltdetails_invoice_id', invoiceId)
      .andWhereNot('fltdetails_is_deleted', 1)
      .leftJoin('trabill_airlines', {
        'trabill_airlines.airline_id': 'fltdetails_airline_id',
      })
      .leftJoin('trabill_airports as from', {
        'from.airline_id': 'fltdetails_from_airport_id',
      })
      .leftJoin('trabill_airports as to', {
        'to.airline_id': 'fltdetails_to_airport_id',
      });

    return data;
  };

  public async getExistingClientAirticket(
    client: string,
    table_name: 'trabill_invoice' | 'trabill_invoice_noncom'
  ) {
    const { client_id, combined_id } = separateCombClientToId(client);

    const data1 = await this.query()
      .from(`${table_name}_airticket_items`)
      .select(
        'airticket_id',
        'airticket_invoice_id',
        this.db.raw(
          "CASE WHEN airticket_client_id IS NOT NULL THEN CONCAT('client-',airticket_client_id) ELSE CONCAT('combined-',airticket_combined_id) END AS airticket_client_id"
        ),
        this.db.raw(
          "coalesce(concat('vendor-',airticket_vendor_id), concat('combined-',airticket_vendor_combine_id)) as comb_vendor"
        ),
        this.db.raw("COALESCE(passport_name, p_passport_name) AS passport_name"),
        'airticket_ticket_no',
        'vendor_name',
        'airticket_purchase_price',
        'airticket_client_price',
        'airticket_profit',
        'airline_name',
        'airticket_pnr',
        this.db.raw(
          "DATE_FORMAT(airticket_issue_date, '%Y %M %e') as airticket_issue_date"
        ),
        this.db.raw(
          "DATE_FORMAT(airticket_journey_date, '%Y %M %e') as airticket_journey_date"
        ),
        this.db.raw(
          "DATE_FORMAT(airticket_return_date, '%Y %M %e') as airticket_return_date"
        )
      )
      .leftJoin('trabill_invoice_airticket_pax', {
        p_airticket_id: 'airticket_id',
        airticket_invoice_id: 'p_invoice_id'
      })

      .leftJoin('trabill_passport_details', { passport_id: 'p_passport_id' })
      .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
      .leftJoin('trabill_airlines', { airline_id: 'airticket_airline_id' })
      .where('airticket_client_id', client_id)
      .andWhere('airticket_combined_id', combined_id);

    return data1;
  }

  getInvoiceReissueData = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        this.db.raw(
          "CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"
        ),
        'invoice_net_total',
        'invoice_reference',
        'invoice_no',
        'invoice_sales_date',
        'invoice_due_date',
        'invoice_sales_man_id',
        'invoice_sub_total',
        'invoice_note',
        'invoice_agent_id',
        'invoice_show_passport_details',
        'invoice_reissue_client_type',
        'invoice_show_prev_due',
        'invoice_vat',
        'invoice_service_charge',
        'invoice_discount',
        'invoice_agent_id',
        'invoice_agent_com_amount'
      )
      .from('trabill_invoices')
      .where('invoice_id', invoiceId)
      .leftJoin('trabill_invoices_extra_amounts', {
        extra_amount_invoice_id: 'invoice_id',
      })
      .leftJoin('trabill_invoices_airticket_prerequire', {
        airticket_invoice_id: 'invoice_id',
      });

    return data[0];
  };

  public async getExistingClTicketInfo(invoice_id: idType) {
    const data = await this.query()
      .select(
        this.db.raw(
          "CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS comb_vendor"
        ),
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
        'airticket_classes',
      )
      .from('trabill_invoice_reissue_airticket_items')
      .where('airticket_invoice_id', invoice_id)
      .andWhereNot('airticket_is_deleted', 1)

    return data[0];
  }

  getReissueAirticketsForEdit = async (invoiceId: idType) => {
    const airtickets = await this.query()
      .select(
        this.db.raw(
          "CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS airticket_comvendor"
        ),
        'airticket_penalties',
        'airticket_commission_percent',
        'airticket_fare_difference',
        'airticket_id',
        'airticket_passport_id',
        'airticket_issue_date',
        'airticket_journey_date',
        'airticket_return_date',
        'airticket_ticket_no',
        'airticket_client_price',
        'airticket_purchase_price',
        'airticket_airline_id',
        'airticket_extra_fee',
        'airticket_pnr',
        'airticket_profit',
        'airticket_classes'
      )
      .from('trabill_invoice_reissue_airticket_items')
      .where('airticket_invoice_id', invoiceId)
      .andWhereNot('airticket_is_deleted', 1);

    const data = [];

    for (const ticket of airtickets) {
      const { airticket_id } = ticket;
      const pax_passport = await this.query()
        .select(
          'p_passport_id as passport_id',
          'p_passport_name as passport_name',
          'p_passport_type as passport_person_type',
          'p_mobile_no AS passport_mobile_no',
          'p_email AS passport_email'
        )
        .from('trabill_invoice_airticket_pax')
        .where('p_invoice_id', invoiceId)
        .andWhere('p_airticket_id', airticket_id)
        .andWhereNot('p_is_deleted', 1);

      const flight_details = await this.query()
        .select(
          'fltdetails_from_airport_id',
          'fltdetails_to_airport_id',
          'fltdetails_airline_id',
          'fltdetails_flight_no',
          'fltdetails_fly_date',
          'fltdetails_departure_time',
          'fltdetails_arrival_time'
        )
        .from('trabill_invoice_reissue_airticket_items_flight_details')
        .where('fltdetails_airticket_id', airticket_id)
        .andWhereNot('fltdetails_is_deleted', 1);

      const airticketRoutesId = await this.query()
        .select('airoute_route_sector_id')
        .from('trabill_invoice_airticket_routes')
        .where('airoute_invoice_id', invoiceId)
        .andWhere('airoute_airticket_id', airticket_id)
        .andWhereNot('airoute_is_deleted', 1);

      const airticket_route_or_sector = airticketRoutesId.map(
        (item) => item.airoute_route_sector_id
      );

      data.push({
        ticket_details: { ...ticket, airticket_route_or_sector },
        pax_passport,
        flight_details,
      });
    }

    return data;
  };

  getReissueTicketInfo = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'airticket_id',
        'airticket_org_agency',
        'airticket_ticket_no',
        'airticket_client_price',
        'airticket_purchase_price',
        this.db.raw(
          "coalesce( concat('client-', airticket_client_id), concat('combined-', airticket_combined_id)) as comb_client"
        ),
        this.db.raw(
          'coalesce( concat("vendor-", airticket_vendor_id), concat("combined-", airticket_vendor_combine_id)) as comb_vendor'
        )
      )
      .from('trabill_invoice_reissue_airticket_items')
      .where('airticket_invoice_id', invoiceId)
      .andWhereNot('airticket_is_refund', 1)
      .andWhereNot('airticket_is_deleted', 1);
  };

  // REISSUE REFUND
  insertReissueRefund = async (data: IReissueRefundDb) => {
    const id = await this.query()
      .insert(data)
      .into('trabill_invoice_reissue_refund');

    if (id) {
      return id[0];
    }
  };
  deleteReissueRefund = async (id: idType) => {
    return await this.query()
      .update({ refund_is_deleted: 1 })
      .from('trabill_invoice_reissue_refund')
      .where('refund_id', id);
  };

  insertReissueRefundItem = async (data: IReissueRefundItemDb[]) => {
    return await this.query()
      .insert(data)
      .into('trabill_invoice_reissue_refund_items');
  };
  deleteReissueRefundItem = async (id: idType) => {
    return await this.query()
      .update({ ritem_is_deleted: 1 })
      .from('trabill_invoice_reissue_refund_items')
      .where('ritem_refund_id', id);
  };

  reissueItemRefundUpdate = async (airticketId: idType) => {
    await this.query()
      .update({ airticket_is_refund: 1 })
      .from('trabill_invoice_reissue_airticket_items')
      .where('airticket_id', airticketId)
      .whereNot('airticket_is_deleted', 1)
      .andWhereNot('airticket_is_refund', 1);
  };
  updateInvoiceIsRefund = async (invoiceId: idType) => {
    await this.query()
      .update({ invoice_is_refund: 1 })
      .from('trabill_invoices')
      .where('invoice_id', invoiceId)
      .whereNot('invoice_is_refund', 1)
      .andWhereNot('invoice_is_deleted', 1);
  };

  getReissueRefundData = async (invoiceId: idType) => {
    return await this.query()
      .select(
        this.db.raw('COALESCE(client_name, combine_name) AS client_name'),
        'refund_voucher',
        'refund_client_total',
        'refund_client_type',
        'refund_client_payment_method',
        'refund_vendor_total',
        'refund_vendor_type',
        'refund_vendor_payment_method',
        'refund_date',
        'refund_create_at',
        'cl_acc.account_name as client_refund_account',
        'v_acc.account_name as vendor_refund_account'
      )
      .from('trabill_invoice_reissue_refund')
      .leftJoin('trabill_clients', { client_id: 'refund_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'refund_combined_id',
      })
      .leftJoin('trabill_accounts as cl_acc', {
        'cl_acc.account_id': 'refund_client_account_id',
      })
      .leftJoin('trabill_accounts as v_acc', {
        'v_acc.account_id': 'refund_vendor_account_id',
      })
      .where('refund_invoice_id', invoiceId)
      .whereNot('refund_is_deleted', 1);
  };
  getReissueRefundItems = async (invoiceId: idType) => {
    return await this.query()
      .select(
        this.db.raw('COALESCE(vendor_name,combine_name) AS vendor_name'),
        'ritem_sales',
        'ritem_client_charge',
        'ritem_client_refund',
        'ritem_purchase',
        'ritem_vendor_charge',
        'ritem_vendor_refund'
      )
      .from('trabill_invoice_reissue_refund')
      .leftJoin('trabill_invoice_reissue_refund_items', {
        refund_id: 'ritem_refund_id',
      })
      .leftJoin('trabill_vendors', { vendor_id: 'ritem_vendor_id' })
      .leftJoin('trabill_combined_clients', { combine_id: 'ritem_combined_id' })
      .where('refund_invoice_id', invoiceId)
      .whereNot('refund_is_deleted', 1)
      .andWhereNot('ritem_is_deleted', 1);
  };



  updateInvoiceIsReissued = async (invoiceId: idType) => {
    await this.query()
      .update("invoice_is_reissued", 1)
      .from("trabill_invoices")
      .where("invoice_id", invoiceId)

  }

  getExistingInvCateId = async (invoiceId: idType) => {
    const [data] = await this.query()
      .select("invoice_category_id")
      .from("trabill_invoices")
      .where("invoice_id", invoiceId);

    return data.invoice_category_id as number;

  }

  updateAirTicketIsReissued = async (categoryId: number, airTicketId: idType) => {
    if (categoryId === 1) {
      await this.query()
        .update("airticket_is_reissued", 1)
        .from("trabill_invoice_airticket_items")
        .where("airticket_id", airTicketId)
    }
    else if (categoryId === 2) {
      await this.query()
        .update("airticket_is_reissued", 1)
        .from("trabill_invoice_noncom_airticket_items")
        .where("airticket_id", airTicketId)
    }

  }







}

export default ReIssueAirticket;
