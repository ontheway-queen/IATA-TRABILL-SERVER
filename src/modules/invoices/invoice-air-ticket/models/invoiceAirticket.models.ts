import AbstractModels from '../../../../abstracts/abstract.models';
import { IDeletePreviousVendor } from '../../../../common/interfaces/commonInterfaces';
import { idType } from '../../../../common/types/common.types';
import {
  IAirTicketDb,
  IAirTicketTaxRefund,
  IAirTicketTaxRefundItem,
  IFlightDetailsDb,
  ITaxesCommissionDB,
} from '../types/invoiceAirticket.interface';

class InvoiceAirticketModel extends AbstractModels {
  // CHECK TICKET NUMBER UNIQUE
  public isTicketNumberExist = async (ticketNo: string) => {
    const ticket_info = await this.db('view_all_airticket_details')
      .select('airticket_ticket_no')
      .andWhere('airticket_org_agency', this.org_agency);

    const data = ticket_info.map((item) => item.airticket_ticket_no);

    return data.includes(ticketNo);
  };

  getPreviousTicketItems = async (airticketId: idType) => {
    const [data] = await this.query()
      .select(
        this.db.raw(
          this.db.raw(
            "coalesce(concat('vendor-',airticket_vendor_id), concat('combined-',airticket_vendor_combine_id)) as comb_vendor"
          )
        ),
        'airticket_vtrxn_id'
      )
      .from('trabill_invoice_airticket_items')
      .where('airticket_id', airticketId);

    return data as { airticket_vtrxn_id: number; comb_vendor: string };
  };

  deleteAirticketFlightsAndPaxByTicketId = async (
    airticketId: idType,
    deleted_by: idType
  ) => {
    await this.query()
      .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_items_flight_details')
      .where('fltdetails_airticket_id', airticketId);

    await this.query()
      .update({ p_is_deleted: 1, p_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_pax')
      .where('p_airticket_id', airticketId);

    await this.query()
      .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_items')
      .where('airticket_id', airticketId);
  };

  // INVOICE AIRTICKET ITEM
  public async insertInvoiceAirticketItem(invoiceAirticketItems: IAirTicketDb) {
    const [airticket_id] = await this.query()
      .into('trabill_invoice_airticket_items')
      .insert({
        ...invoiceAirticketItems,
        airticket_org_agency: this.org_agency,
      });

    return airticket_id as number;
  }
  public async updateInvoiceAirticketItem(
    invoiceAirticketItems: IAirTicketDb,
    airticketId: idType
  ) {
    await this.query()
      .into('trabill_invoice_airticket_items')
      .update(invoiceAirticketItems)
      .where('airticket_id', airticketId);
  }

  public async getPassportByAirticket(pass_id: number) {
    const data = await this.query()
      .from('trabill_passport_details')
      .select(
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_visiting_country',
        this.db.raw(
          "DATE_FORMAT(passport_date_of_birth, '%Y-%c-%e') as passport_date_of_birth"
        ),
        this.db.raw(
          "DATE_FORMAT(passport_date_of_issue, '%Y-%c-%e') as passport_date_of_issue"
        ),
        this.db.raw(
          "DATE_FORMAT(passport_date_of_expire, '%Y-%c-%e') as passport_date_of_expire"
        )
      )
      .where('passport_id', pass_id)
      .andWhere('passport_org_agency', this.org_agency);

    return data;
  }

  deleteAirticketPax = async (passportId: idType, p_deleted_by: idType) => {
    await this.query()
      .update({ p_is_deleted: 1, p_deleted_by })
      .into('trabill_invoice_airticket_pax')
      .where('p_passport_id', passportId);
  };

  public async insertAirTicketFlightDetails(
    flight_details: IFlightDetailsDb | IFlightDetailsDb[]
  ) {
    const fltdetails_id = await this.query()
      .into('trabill_invoice_airticket_items_flight_details')
      .insert(flight_details);

    return fltdetails_id[0] as number;
  }

  public async insertAirTicketAirlineCommissions(
    taxes_commission: ITaxesCommissionDB | ITaxesCommissionDB[]
  ) {
    await this.query()
      .into('trabill_invoice_airticket_airline_commission')
      .insert(taxes_commission);
  }

  public async deleteAirTicketAirlineCommissions(invoiceId: idType) {
    await this.query()
      .update('is_deleted', 1)
      .into('trabill_invoice_airticket_airline_commission')
      .where('airline_invoice_id', invoiceId);
  }

  public async selectAirTicketAirlineCommissions(invoiceId: idType) {
    await this.query()
      .select('airline_taxes', 'airline_commission', 'airline_tax_type')
      .from('trabill_invoice_airticket_airline_commission')
      .where('airline_invoice_id', invoiceId)
      .andWhereNot('is_deleted', 1);
  }

  public async deleteAirticketFlightByFlightId(
    fltdetails_id: number,
    fltdetails_deleted_by: idType
  ) {
    await this.query()
      .into('trabill_invoice_airticket_items_flight_details')
      .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by })
      .where('fltdetails_id', fltdetails_id);
  }

  public async updateAirticketFlightByFlightId(
    flight_details: IFlightDetailsDb,
    fltdetails_id: number
  ) {
    await this.query()
      .into('trabill_invoice_airticket_items_flight_details')
      .update(flight_details)
      .where('fltdetails_id', fltdetails_id);
  }

  public getPassportIdByInvoiceId = async (invoice_id: number) => {
    const data = await this.query()
      .from('trabill_invoice_airticket_items as passport_id')
      .select('airticket_passport_id')
      .where('invoice_id', invoice_id)
      .andWhereNot('airticket_is_deleted', 1);

    if (data.length) {
      return data[0].invpassport_passport_id;
    }

    return false;
  };

  public getAirTicketFlights = async (invoiceId: idType) => {
    return await this.query()
      .from('trabill_invoice_airticket_items_flight_details')
      .select(
        'fltdetails_fly_date',
        'fltdetails_arrival_time',
        'fltdetails_departure_time',
        'airline_name',
        this.db.raw(
          "concat(airport_from.airline_iata_code, ' ',airport_from.airline_airport) as flight_from"
        ),
        this.db.raw(
          "concat(airport_to.airline_iata_code, ' ',airport_to.airline_airport) as flight_to"
        )
      )
      .where('fltdetails_invoice_id', invoiceId)
      .andWhereNot('fltdetails_is_deleted', 1)
      .leftJoin('trabill_airlines', {
        airline_id: 'fltdetails_airline_id',
      })
      .leftJoin('trabill_airports as airport_from', {
        'airport_from.airline_id':
          'trabill_invoice_airticket_items_flight_details.fltdetails_from_airport_id',
      })
      .leftJoin('trabill_airports as airport_to', {
        'airport_to.airline_id':
          'trabill_invoice_airticket_items_flight_details.fltdetails_to_airport_id',
      });
  };

  public getViewAirticketItems = async (invoiceId: idType) => {
    return await this.query()
      .select(
        'view_airticket_details.*',
        'client_total_tax_refund',
        'vendor_total_tax_refund',
        'created_at'
      )
      .from('view_airticket_details')
      .leftJoin('trabill_airticket_tax_refund', {
        refund_invoice_id: 'airticket_invoice_id',
      })
      .where('airticket_invoice_id', invoiceId);
  };

  getAirticketItems = async (invoiceId: idType) => {
    const ticket_details = await this.query()
      .select(
        'airticket_id',
        this.db.raw(
          "CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS airticket_comvendor"
        ),
        'airticket_ticket_type',
        'airticket_classes',
        'airticket_ait_from',
        'airticket_passport_id',
        'airticket_ticket_no',
        'airticket_pax_name',
        'airticket_pnr',
        'airticket_gross_fare',
        'airticket_base_fare',
        'airticket_tax',
        'airticket_tax1',
        'airticket_ait',
        'airticket_discount_type',
        'airticket_vat',
        'airticket_commission_percent',
        'airticket_net_commssion',
        'airticket_segment',
        'airticket_gds_id',
        'airticket_client_price',
        'airticket_discount_total',
        'airticket_extra_fee',
        'airticket_purchase_price',
        'airticket_other_expense',
        'airticket_other_bonus_total',
        'airticket_other_bonus_type',
        'airticket_profit',
        'airticket_issue_date',
        'airticket_journey_date',
        'airticket_return_date',
        'airticket_airline_id',
        'airticket_es_charge',
        'airticket_ut_charge',
        'airticket_xt_charge',
        'airticket_bd_charge',
        'airticket_ow_charge',
        'airticket_pz_charge',
        'airticket_qa_charge',
        'airticket_e5_charge',
        'airticket_g4_charge',
        'airticket_p7_charge',
        'airticket_p8_charge',
        'airticket_r9_charge',
        'airticket_total_taxes_commission',
        'airticket_commission_percent_total',
        'airticket_is_refund'
      )
      .from('trabill_invoice_airticket_items')
      .where('airticket_invoice_id', invoiceId)
      .andWhereNot('airticket_is_deleted', 1);

    const ticketInfo = [];

    for (const ticket of ticket_details) {
      const { airticket_id } = ticket;

      const airticketRoutesId = await this.query()
        .select('airoute_route_sector_id')
        .from('trabill_invoice_airticket_routes')
        .where('airoute_invoice_id', invoiceId)
        .andWhere('airoute_airticket_id', airticket_id)
        .andWhereNot('airoute_is_deleted', 1);

      const airticket_route_or_sector = airticketRoutesId.map(
        (item) => item.airoute_route_sector_id
      );

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
          'fltdetails_id',
          'fltdetails_from_airport_id',
          'fltdetails_to_airport_id',
          'fltdetails_airline_id',
          'fltdetails_flight_no',
          'fltdetails_fly_date',
          'fltdetails_departure_time',
          'fltdetails_arrival_time'
        )
        .from('trabill_invoice_airticket_items_flight_details')
        .where('fltdetails_airticket_id', airticket_id)
        .andWhereNot('fltdetails_is_deleted', 1);

      const taxes_commission = await this.query()
        .select('airline_taxes', 'airline_commission', 'airline_tax_type')
        .from('trabill_invoice_airticket_airline_commission')
        .where('airline_airticket_id', airticket_id)
        .andWhereNot('is_deleted', 1);

      ticketInfo.push({
        ticket_details: { ...ticket, airticket_route_or_sector },
        pax_passport,
        flight_details,
        taxes_commission,
      });
    }

    return ticketInfo;
  };

  public async getPrevAirticketVendor(invoice_id: number) {
    const data = await this.query()
      .from('trabill_invoice_airticket_items')
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

  public getInvoiceActivity = async (id: number) => {
    const data = await this.query()
      .select(
        this.db.raw(
          "concat(user_first_name, ' ', user_last_name) AS user_full_name"
        ),
        'history_activity_type',
        'history_create_date',
        'invoice_no',
        'invoicelog_content'
      )
      .from('trabill_invoices_history')
      .where('history_invoice_id', id)
      .leftJoin('trabill_invoices', { invoice_id: 'history_invoice_id' })
      .leftJoin('trabill_users', { user_id: 'history_created_by' });

    return data;
  };

  deleteAirticketItems = async (invoice_id: idType, deleted_by: idType) => {
    // 1. flight details
    await this.query()
      .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_items_flight_details')
      .where('fltdetails_invoice_id', invoice_id);

    // 2. airticket items
    await this.query()
      .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
      .into('trabill_invoice_airticket_items')
      .where('airticket_invoice_id', invoice_id);

    // 3. prerequire
    await this.query()
      .update({
        invoice_show_is_deleted: 1,
        invoice_show_deleted_by: deleted_by,
      })
      .into('trabill_invoices_airticket_prerequire')
      .where('airticket_invoice_id', invoice_id);
  };

  // EMAIL SEND QUERYS
  public getInvoiceClientInfo = async (invoice_id: idType) => {
    const [data] = await this.db('trabill_invoices')
      .select(
        'invoice_client_id as client_id',
        'invoice_combined_id as combined_id',
        'invoice_org_agency',
        'invoice_no',
        'invoice_sales_date'
      )
      .where('invoice_id', invoice_id);

    return data as {
      client_id: number;
      combined_id: number;
      invoice_org_agency: number;
      invoice_no: string;
      invoice_sales_date: Date;
    };
  };

  public getClientCombineClientMail = async (
    client_id: idType,
    combine_id: idType
  ) => {
    const [data] = await this.db('trabill_clients')
      .select('client_email')
      .where('client_id', client_id)
      .unionAll([
        this.db('trabill_combined_clients')
          .select('combine_email as client_email')
          .where('combine_id', combine_id),
      ]);

    return data as { client_email: string };
  };

  public getAgencyInfo = async (agency_id: idType) => {
    const [data] = await this.db('trabill_agency_organization_information')
      .select(
        'org_name',
        'org_owner_email',
        'org_logo',
        'org_address1',
        'org_mobile_number'
      )
      .where('org_id', agency_id);

    return data as {
      org_name: string;
      org_owner_email: number;
      org_logo: string;
      org_address1: string;
      org_mobile_number: string;
    };
  };

  // SELECT CUSTOM AIR TICKET REPORT
  selectCustomAirTicketReport = async (
    fields: string[],
    page: idType,
    size: idType,
    from_date: string,
    to_date: string
  ) => {
    const offset = (Number(page || 1) - 1) * Number(size || 20);

    const data = await this.query()
      .select(fields)
      .from('view_all_airticket_details')
      .modify((event) => {
        event.andWhere(function () {
          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
        });
      })
      .where('airticket_org_agency', this.org_agency)
      .limit(Number(size || 20))
      .offset(offset);

    return data;
  };

  selectCustomAirTicketReportCount = async (
    from_date: string,
    to_date: string
  ) => {
    const [{ count }] = (await this.query()
      .count('* as count')
      .from('view_all_airticket_details')
      .modify((event) => {
        event.andWhere(function () {
          if (from_date && to_date) {
            this.andWhereRaw(
              `DATE_FORMAT(create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }
        });
      })
      .where('airticket_org_agency', this.org_agency)) as { count: number }[];

    return count;
  };

  // AIR TICKET INFO
  selectAirTicketTax = async (invoiceId: idType) => {
    const results = await this.query()
      .select(
        'airticket_id',
        'airticket_client_price',
        'airticket_purchase_price',
        'airticket_tax',
        this.db.raw(
          "coalesce(CONCAT('client-',airticket_client_id), CONCAT('combined-',airticket_combined_id)) as comb_client"
        ),
        this.db.raw(
          "coalesce(CONCAT('vendor-',airticket_vendor_id), CONCAT('combined-',airticket_vendor_combine_id)) as comb_vendor"
        )
      )
      .from('trabill_invoice_airticket_items')
      .where('airticket_org_agency', this.org_agency)
      .andWhere('airticket_invoice_id', invoiceId)
      .andWhereNot('airticket_is_refund', 1)
      .andWhereNot('airticket_is_deleted', 1);

    return results;
  };

  insertAirTicketTaxRefund = async (data: IAirTicketTaxRefund) => {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_airticket_tax_refund');

    return id;
  };
  insertAirTicketTaxRefundItem = async (data: IAirTicketTaxRefundItem) => {
    await this.query().insert(data).into('trabill_airticket_tax_refund_items');
  };

  updateAirTicketItemRefund = async (airTicketId: idType) => {
    await this.query()
      .update({ airticket_is_refund: 1 })
      .from('trabill_invoice_airticket_items')
      .where('airticket_id', airTicketId);
  };
  updateInvoiceRefund = async (invoiceId: idType) => {
    await this.query()
      .update({ invoice_is_refund: 1 })
      .from('trabill_invoices')
      .where('invoice_id', invoiceId);
  };

  viewAirTicketTaxRefund = async (invoiceId: idType) => {
    const [refunds] = await this.query()
      .select(
        'refund_id',
        'client_refund_type',
        'vendor_refund_type',
        'client_total_tax_refund',
        'vendor_total_tax_refund',
        'created_at',
        'cl_ac.account_name as client_account',
        'v_ac.account_name as vendor_account'
      )
      .from('trabill_airticket_tax_refund')
      .leftJoin(
        'trabill_accounts as cl_ac',
        'cl_ac.account_id',
        '=',
        'client_account_id'
      )
      .leftJoin(
        'trabill_accounts as v_ac',
        'v_ac.account_id',
        '=',
        'vendor_account_id'
      )
      .where({
        refund_agency_id: this.org_agency,
        refund_invoice_id: invoiceId,
        is_deleted: 0,
      });

    if (refunds) {
      const ticket_info = await this.query()
        .select(
          'airticket_ticket_no',
          'airticket_gds_id',
          'refund_tax_amount',
          this.db.raw('coalesce(vendor_name, combine_name) as vendor_name')
        )
        .from('trabill_airticket_tax_refund_items')
        .leftJoin(
          'trabill_invoice_airticket_items',
          'airticket_id',
          '=',
          'refund_airticket_id'
        )
        .leftJoin('trabill_vendors', 'vendor_id', '=', 'refund_vendor_id')
        .leftJoin(
          'trabill_combined_clients',
          'combine_id',
          '=',
          'refund_combined_id'
        )
        .where('refund_id', refunds.refund_id);

      return { ...refunds, ticket_info };
    }

    return {};
  };

  public async getInvoiceInfoForVoid(invoice_id: idType) {
    const [data] = await this.query()
      .select('invoice_id', 'invoice_no', 'client_name', 'net_total')
      .from('view_invoices')
      .where({ invoice_id });

    const vendors = await this.query()
      .select('vendor_name', 'comb_vendor', 'cost_price', 'airticket_ticket_no')
      .from('view_invoices_cost')
      .where({ invoice_id });

    return { ...data, vendors };
  }
}

export default InvoiceAirticketModel;
