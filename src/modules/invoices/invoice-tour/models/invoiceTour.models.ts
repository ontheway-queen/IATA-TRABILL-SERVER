import AbstractModels from '../../../../abstracts/abstract.models';
import { IDeletePreviousVendor } from '../../../../common/interfaces/commonInterfaces';
import { idType } from '../../../../common/types/common.types';
import {
  IAirticketroute,
  IInvoiceTourItem,
  ITourAccmDB,
  ITourBilling,
  ITourFoodDB,
  ITourGuideDB,
  ITourOtherTranDB,
  ITourTicketDB,
  ITourTransDB,
} from '../types/invouceTour.interfaces';

class invoiceTourModels extends AbstractModels {
  insertTourTicketInfo = async (data: ITourTicketDB) => {
    await this.query().insert(data).into('trabill_invoice_tour_ticket');
  };

  deleteTourTicketInfo = async (
    ticket_id: idType,
    ticket_deleted_by: idType
  ) => {
    await this.query()
      .update({ ticket_is_deleted: 1, ticket_deleted_by })
      .into('trabill_invoice_tour_ticket')
      .where('ticket_id', ticket_id);
  };

  getSignleTourTicketInfo = async (ticket_id: idType) => {
    return (await this.db('trabill_invoice_tour_ticket')
      .select(
        'ticket_vendor_id as vendor_id',
        'ticket_combined_id as combined_id',
        'ticket_vtrxnid as prevTrxnId',
        'ticket_cost_price as prev_cost_price',
        this.db.raw(
          `CASE WHEN ticket_vendor_id IS NOT NULL THEN CONCAT('vendor-', ticket_vendor_id) ELSE CONCAT('combined-', ticket_combined_id) END AS prevCombvendor`
        )
      )
      .where('ticket_id', ticket_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertInvoiceTourItem = async (data: IInvoiceTourItem) => {
    await this.query().insert(data).into('trabill_invoice_tour_item');
  };

  updateInvoiceTourItem = async (data: IInvoiceTourItem, invoiceId: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_item')
      .where('itour_invoice_id', invoiceId);
  };

  insertTourTransport = async (data: ITourTransDB) => {
    await this.query().insert(data).into('trabill_invoice_tour_transport');
  };

  updateTourTransport = async (data: ITourTransDB, transport_id: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_transport')
      .where('transport_id', transport_id);
  };

  deleteTourTransport = async (
    transport_id: idType,
    transport_deleted_by: idType
  ) => {
    await this.query()
      .update({ transport_is_deleted: 1, transport_deleted_by })
      .into('trabill_invoice_tour_transport')
      .where('transport_id', transport_id);
  };

  getTransportData = async (transport_id: idType) => {
    return (await this.db('trabill_invoice_tour_transport')
      .select(
        'transport_vendor_id as vendor_id',
        'transport_combined_id as combined_id',
        'transport_vtrxnid as prevTrxnId',
        this.db.raw(
          `CASE WHEN transport_vendor_id IS NOT NULL THEN CONCAT('vendor-', transport_vendor_id) ELSE CONCAT('combined-', transport_combined_id) END AS prevCombvendor`
        ),
        'transport_cost_price as prev_cost_price'
      )
      .where('transport_id', transport_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertTourOtherTrans = async (data: ITourOtherTranDB) => {
    return await this.query()
      .insert(data)
      .into('trabill_invoice_tour_other_trans');
  };

  updateTourOtherTrans = async (
    data: ITourOtherTranDB,
    other_trans_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_invoice_tour_other_trans')
      .where('other_trans_id', other_trans_id);
  };

  deleteTourOtherTrans = async (
    other_trans_id: idType,
    other_trans_deleted_by: idType
  ) => {
    return await this.query()
      .update({ other_trans_is_deleted: 1, other_trans_deleted_by })
      .into('trabill_invoice_tour_other_trans')
      .where('other_trans_id', other_trans_id);
  };

  getTourOtherTransportInfo = async (other_trans_id: idType) => {
    return (await this.db('trabill_invoice_tour_other_trans')
      .select(
        'other_trans_vendor_id as vendor_id',
        'other_trans_combined_id as combined_id',
        'other_trans_vtrxnid as prevTrxnId',
        'other_trans_cost_price as prev_cost_price',
        this.db.raw(
          `CASE WHEN other_trans_vendor_id IS NOT NULL THEN CONCAT('vendor-', other_trans_vendor_id) ELSE CONCAT('combined-', other_trans_combined_id) END AS prevCombvendor`
        )
      )
      .where('other_trans_id', other_trans_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertTourGuide = async (data: ITourGuideDB) => {
    await this.query().insert(data).into('trabill_invoice_tour_guide');
  };

  getTourGuideInfo = async (guide_id: idType) => {
    return (await this.db('trabill_invoice_tour_guide')
      .select(
        'guide_vendor_id as vendor_id',
        'guide_combined_id as combined_id',
        'guide_vtrxnid as prevTrxnId',
        'guide_cost_price as prev_cost_price',
        this.db.raw(
          `CASE WHEN guide_vendor_id IS NOT NULL THEN CONCAT('vendor-', guide_vendor_id) ELSE CONCAT('combined-', guide_combined_id) END AS prevCombvendor`
        )
      )
      .where('guide_id', guide_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertTourFoods = async (data: ITourFoodDB) => {
    await this.query().insert(data).into('trabill_invoice_tour_food');
  };

  updateTourFoods = async (data: ITourFoodDB, food_id: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_food')
      .where('food_id', food_id);
  };

  deleteTourFoods = async (food_id: idType, food_deleted_by: idType) => {
    await this.query()
      .update({ food_is_deleted: 1, food_deleted_by })
      .into('trabill_invoice_tour_food')
      .where('food_id', food_id);
  };

  getTourFoodInfo = async (food_id: idType) => {
    return (await this.db('trabill_invoice_tour_food')
      .select(
        'food_vendor_id as vendor_id',
        'food_combined_id as combined_id',
        'food_cost_price as prev_cost_price',
        'food_vtrxnid as prevTrxnId',
        this.db.raw(
          `CASE WHEN food_vendor_id IS NOT NULL THEN CONCAT('vendor-', food_vendor_id) ELSE CONCAT('combined-', food_combined_id) END AS prevCombvendor`
        )
      )
      .where('food_id', food_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertTourAccm = async (data: ITourAccmDB) => {
    await this.query().insert(data).into('trabill_invoice_tour_accm');
  };

  updateTourAccm = async (data: ITourAccmDB, accm_id: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_accm')
      .where('accm_id', accm_id);
  };

  deleteTourAccm = async (accm_id: idType, accm_deleted_by: idType) => {
    await this.query()
      .update({ accm_is_deleted: 1, accm_deleted_by })
      .into('trabill_invoice_tour_accm')
      .where('accm_id', accm_id);
  };

  getTourAccmInfo = async (accm_id: idType) => {
    return (await this.db('trabill_invoice_tour_accm')
      .select(
        'accm_vendor_id as vendor_id',
        'accm_combined_id as combined_id',
        'accm_vtrxnid as prevTrxnId',
        this.db.raw(
          `CASE WHEN accm_vendor_id IS NOT NULL THEN CONCAT('vendor-', accm_vendor_id) ELSE CONCAT('combined-', accm_combined_id) END AS prevCombvendor`
        ),
        'accm_cost_price as prev_cost_price'
      )
      .where('accm_id', accm_id)) as {
      vendor_id: number;
      combined_id: number;
      prevTrxnId: number;
      prevCombvendor: string;
      prev_cost_price: number;
    }[];
  };

  insertTourBilling = async (data: ITourBilling) => {
    await this.query().insert(data).into('trabill_invoice_tour_billing');
  };

  deleteTourBilling = async (
    billing_id: idType,
    billing_deleted_by: idType
  ) => {
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_tour_billing')
      .where('billing_id', billing_id);
  };

  updateTourBilling = async (data: ITourBilling, billing_id: idType) => {
    return await this.query()
      .update(data)
      .into('trabill_invoice_tour_billing')
      .where('billing_id', billing_id);
  };

  // GET INVOICE TOUR INFOS
  getTourTicketInfo = async (tourInvoiceId: idType) => {
    const tourTicket = await this.query()
      .select(
        'ticket_id',
        'ticket_invoice_id',
        'ticket_cost_price',
        'ticket_airline_id',
        this.db.raw(
          "CASE WHEN ticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',ticket_vendor_id) ELSE CONCAT('combined-',ticket_combined_id) END AS ticket_comvendor_id"
        ),
        'ticket_no',
        'ticket_pnr',
        'ticket_journey_date',
        'ticket_return_date'
      )
      .from('trabill_invoice_tour_ticket')
      .where('ticket_invoice_id', tourInvoiceId)
      .andWhereNot('ticket_is_deleted', 1);

    let data: any[] = [];
    for (const item of tourTicket) {
      await this.query()
        .from('trabill_invoice_airticket_routes')
        .select('airoute_route_sector_id')
        .join('trabill_airports', { airline_id: 'airoute_route_sector_id' })
        .where('airoute_invoice_id', item.ticket_invoice_id)
        .andWhereNot('airoute_is_deleted', 1)
        .then((rows) => {
          const ticket_route = rows.map((row) => row.airoute_route_sector_id);
          data.push({ ...item, ticket_route });
        });
    }

    return data[0];
  };

  public async getTourRefunds(invoice_id: idType) {
    const client_refund = await this.query()
      .select(
        'crefund_total_amount',
        'crefund_charge_amount',
        'crefund_return_amount',
        'crefund_vouchar_number',
        this.db.raw(`COALESCE(client_name, combine_name) as client_name`)
      )
      .from('trabill_tour_refunds_to_clients')
      .leftJoin('trabill_clients', { client_id: 'crefund_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'crefund_combined_id',
      })
      .where('crefund_invoice_id', invoice_id)
      .andWhereNot('crefund_is_deleted', 1);

    const vendor_refund = await this.query()
      .select(
        'vrefund_total_amount',
        'vrefund_charge_amount',
        'vrefund_return_amount',
        'vrefund_vouchar_number',
        this.db.raw(`COALESCE(vendor_name, combine_name) as vendor_name`)
      )
      .from('trabill_tour_refunds_to_vendors')
      .leftJoin('trabill_vendors', { vendor_id: 'vrefund_vendor_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'vrefund_vendor_combined_id',
      })
      .where('vrefund_invoice_id', invoice_id)
      .andWhereNot('vrefund_is_deleted', 1);

    return { client_refund, vendor_refund };
  }

  getTourTransport = async (tourInvoiceId: idType) => {
    return await this.query()
      .select(
        'transport_id',
        'transport_itinerary_id',
        'transport_cost_price',
        'transport_description',
        this.db.raw(
          "CASE WHEN transport_vendor_id IS NOT NULL THEN CONCAT('vendor-',transport_vendor_id) ELSE CONCAT('combined-',transport_combined_id) END AS transport_comvendor_id"
        ),
        'transport_type_id',
        'transport_picup_place',
        'transport_picup_time',
        'transport_dropoff_place',
        'transport_dropoff_time'
      )
      .from('trabill_invoice_tour_transport')
      .where('transport_invoice_id', tourInvoiceId)
      .andWhereNot('transport_is_deleted', 1);
  };

  getTourOtherTrans = async (tourInvoiceId: idType) => {
    return await this.query()
      .select(
        'other_trans_id',
        'other_trans_itinerary_id',
        'other_trans_cost_price',
        'other_trans_description',
        this.db.raw(
          "CASE WHEN other_trans_vendor_id IS NOT NULL THEN CONCAT('vendor-',other_trans_vendor_id) ELSE CONCAT('combined-',other_trans_combined_id) END AS other_trans_comvendor_id"
        )
      )
      .from('trabill_invoice_tour_other_trans')
      .where('other_trans_invoice_id', tourInvoiceId)
      .andWhereNot('other_trans_is_deleted', 1);
  };

  getTourGuide = async (tourInvoiceId: idType) => {
    const data = await this.query()
      .select(
        'guide_id',
        'guide_itinerary_id',
        'guide_cost_price',
        'guide_description',
        this.db.raw(
          "CASE WHEN guide_vendor_id IS NOT NULL THEN CONCAT('vendor-',guide_vendor_id) ELSE CONCAT('combined-',guide_combined_id) END AS guide_comvendor_id"
        )
      )
      .from('trabill_invoice_tour_guide')
      .where('guide_invoice_id', tourInvoiceId)
      .andWhereNot('guide_is_deleted', 1);

    return data[0];
  };

  getTourFoods = async (tourInvoiceId: idType) => {
    return await this.query()
      .select(
        'food_id',
        'food_itinerary_id',
        'food_description',
        'food_cost_price',
        this.db.raw(
          "CASE WHEN food_vendor_id IS NOT NULL THEN CONCAT('vendor-',food_vendor_id) ELSE CONCAT('combined-',food_combined_id) END AS food_comvendor_id"
        ),
        'food_menu',
        'food_place',
        'food_time'
      )
      .from('trabill_invoice_tour_food')
      .where('food_invoice_id', tourInvoiceId)
      .andWhereNot('food_is_deleted', 1);
  };

  getClientId = async (invoiceId: idType) => {
    const data = await this.query()
      .select(
        this.db.raw(
          "CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"
        )
      )
      .from('trabill_invoices')
      .where('invoice_id', invoiceId);

    return data[0] as { invoice_combclient_id: number };
  };

  getTourAccm = async (tourInvoiceId: idType) => {
    return await this.query()
      .select(
        'accm_id',
        'accm_itinerary_id',
        'accm_vendor_id',
        'accm_cost_price',
        'accm_description',
        this.db.raw(
          "CASE WHEN accm_vendor_id IS NOT NULL THEN CONCAT('vendor-',accm_vendor_id) ELSE CONCAT('combined-',accm_combined_id) END AS accm_comvendor_id"
        ),
        'rtype_name',
        'accm_room_type_id',
        'accm_place',
        'accm_num_of_room',
        'accm_checkin_date',
        'accm_checkout_date'
      )
      .from('trabill_invoice_tour_accm')
      .leftJoin('trabill_room_types', { rtype_id: 'accm_room_type_id' })
      .where('accm_invoice_id', tourInvoiceId)
      .andWhereNot('accm_is_deleted', 1);
  };

  getTourBilling = async (tourInvoiceId: idType) => {
    return await this.query()
      .select(
        'billing_id',
        'billing_cost_price',
        'billing_product_id',
        'billing_profit',
        'billing_pax_name',
        'billing_numof_room',
        'billing_total_pax',
        'billing_total_sales',
        'country_name',
        'billing_country_id'
      )
      .from('trabill_invoice_tour_billing')
      .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
      .where('billing_invoice_id', tourInvoiceId)
      .andWhereNot('billing_is_deleted', 1);
  };

  getTourExtraInfo = async (id: idType) => {
    const data = await this.query()
      .select('*')
      .from('trabill_invoice_tour_item')
      .where('itour_invoice_id', id)
      .andWhereNot('itour_is_deleted', 1);

    return data[0];
  };

  viewTourInvoiceData = async (invoiceId: idType) => {
    const tourAccms = await this.query()
      .select(
        'accm_id as refund_item_id',

        'accommodation_hotel_name as itinerary_particular',
        'accm_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),
        'accm_description',
        'accm_cost_price',

        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'accm_is_refunded as is_refund'
      )

      .from('trabill_invoice_tour_accm')

      .leftJoin('trabill_tours_accommodations', {
        accm_itinerary_id: 'accommodation_id',
      })

      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'accm_vendor_id',
      })
      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'accm_combined_id',
      })
      .where('accm_invoice_id', invoiceId)
      .andWhereNot('accm_is_deleted', 1);

    const tourFoods = await this.query()
      .select(
        'food_id as refund_item_id',
        'food_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),
        'itinerary_particular',
        'food_description',
        'food_cost_price',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'food_is_refunded as is_refund'
      )
      .from('trabill_invoice_tour_food')

      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'food_combined_id',
      })
      .leftJoin('trabill_tours_itineraries', {
        itinerary_id: 'food_itinerary_id',
      })
      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'food_vendor_id',
      })
      .where('food_invoice_id', invoiceId)
      .andWhereNot('food_is_deleted', 1);

    const tourGuide = await this.query()
      .select(
        'guide_id as refund_item_id',
        'guide_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),
        'itinerary_particular',
        'guide_description',
        'guide_cost_price',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'guide_is_refunded as is_refund'
      )
      .from('trabill_invoice_tour_guide')

      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'guide_combined_id',
      })
      .leftJoin('trabill_tours_itineraries', {
        itinerary_id: 'guide_itinerary_id',
      })
      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'guide_vendor_id',
      })
      .where('guide_invoice_id', invoiceId)
      .andWhereNot('guide_is_deleted', 1);

    const tourOtherTrans = await this.query()
      .select(
        'other_trans_id as refund_item_id',
        'other_trans_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),
        'itinerary_particular',
        'other_trans_description',
        'other_trans_cost_price',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'other_trans_is_refunded as is_refund'
      )
      .from('trabill_invoice_tour_other_trans')

      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'other_trans_combined_id',
      })
      .leftJoin('trabill_tours_itineraries', {
        itinerary_id: 'other_trans_itinerary_id',
      })
      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'other_trans_vendor_id',
      })
      .where('other_trans_invoice_id', invoiceId)
      .andWhereNot('other_trans_is_deleted', 1);

    const tourTicketinfo = await this.query()
      .select(
        'ticket_invoice_id',
        'ticket_id as refund_item_id',
        'ticket_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),

        'ticket_no as itinerary_particular',
        'ticket_description',
        'ticket_cost_price',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'ticket_is_refunded as is_refund'
      )
      .from('trabill_invoice_tour_ticket')

      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'ticket_combined_id',
      })
      .leftJoin('trabill_tours_itineraries', {
        itinerary_id: 'ticket_itinerary_id',
      })
      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'ticket_vendor_id',
      })
      .where('ticket_invoice_id', invoiceId)
      .andWhereNot('ticket_is_deleted', 1);

    const tourTicket: any[] = [];
    // get tour routes
    for (const item of tourTicketinfo) {
      const routes = await this.query()
        .select(
          this.db.raw(
            "CONCAT(airline_iata_code,' ', airline_airport) as airticket_route"
          )
        )
        .from('trabill_invoice_airticket_routes')
        .leftJoin('trabill_airports', {
          airline_id: 'airoute_route_sector_id',
        })
        .where('airoute_invoice_id', item.ticket_invoice_id)
        .andWhereNot('airoute_is_deleted', 1);

      tourTicket.push({ ...item, routes });
    }

    const tourTransports = await this.query()
      .select(
        'transport_id as refund_item_id',
        'transport_itinerary_id as itinerary_id',
        this.db.raw(
          'COALESCE(CONCAT("vendor-",tv.vendor_id), CONCAT("combined-",tcc.combine_id)) AS vendor_id'
        ),

        'itinerary_particular',
        'transport_description',
        'transport_cost_price',
        this.db.raw(
          'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
        ),
        this.db.raw(
          'CAST(COALESCE(tv.vendor_lbalance, tcc.combine_lbalance) AS DECIMAL(15,2)) AS vendor_last_balance'
        ),
        'transport_is_refunded as is_refund'
      )
      .from('trabill_invoice_tour_transport')

      .leftJoin('trabill_combined_clients as tcc', {
        combine_id: 'transport_combined_id',
      })
      .leftJoin('trabill_tours_itineraries', {
        itinerary_id: 'transport_itinerary_id',
      })
      .leftJoin('trabill_vendors as tv', {
        vendor_id: 'transport_vendor_id',
      })
      .where('transport_invoice_id', invoiceId)
      .andWhereNot('transport_is_deleted', 1);

    const billing_information = await this.query()
      .select(
        'billing_id',
        'product_name',
        'billing_pax_name',
        'billing_total_pax',
        'billing_numof_room',
        'billing_total_sales',
        'billing_cost_price',
        'billing_profit',
        'billing_create_date',
        'country_name',
        'billing_country_id'
      )
      .from('trabill_invoice_tour_billing')
      .leftJoin('trabill_products', {
        billing_product_id: 'product_id',
      })
      .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
      .where('billing_invoice_id', invoiceId)
      .andWhereNot('billing_is_deleted', 1);

    return {
      tourAccms,
      tourFoods,
      tourGuide,
      tourOtherTrans,
      tourTicket,
      tourTransports,
      billing_information,
    };
  };

  getInvoiceClientlBalance = async (invoiceId: idType) => {
    const data = await this.query()
      .from('trabill_invoices as i')
      .select(
        this.db.raw(
          'CAST(COALESCE(client.client_lbalance, comb.combine_lbalance) AS DECIMAL(15,2)) AS client_last_balance'
        )
      )
      .leftJoin('trabill_clients AS client', {
        'client.client_id': 'i.invoice_client_id',
      })
      .leftJoin('trabill_combined_clients as  comb', {
        'comb.combine_id': 'i.invoice_combined_id',
      })
      .where('invoice_id', invoiceId);

    return data[0];
  };

  getPrevBillingCost = async (invoiceId: idType) => {
    const tourAccms = await this.query()
      .select(
        'accm_vendor_id as vendor_id',
        'accm_combined_id as combined_id',
        'accm_cost_price as prev_cost_price',
        'accm_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_accm')
      .where('accm_invoice_id', invoiceId)
      .andWhereNot('accm_is_deleted', 1);

    const tourFoods = await this.query()
      .select(
        'food_vendor_id as vendor_id',
        'food_combined_id as combined_id',
        'food_cost_price as prev_cost_price',
        'food_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_food')

      .where('food_invoice_id', invoiceId)
      .andWhereNot('food_is_deleted', 1);

    const tourGuide = await this.query()
      .select(
        'guide_vendor_id as vendor_id',
        'guide_combined_id as combined_id',
        'guide_cost_price as prev_cost_price',
        'guide_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_guide')
      .where('guide_invoice_id', invoiceId)
      .andWhereNot('guide_is_deleted', 1);

    const tourOtherTrans = await this.query()
      .select(
        'other_trans_vendor_id as vendor_id',
        'other_trans_combined_id as combined_id',
        'other_trans_cost_price as prev_cost_price',
        'other_trans_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_other_trans')
      .where('other_trans_invoice_id', invoiceId)
      .andWhereNot('other_trans_is_deleted', 1);

    const tourTicket = await this.query()
      .select(
        'ticket_vendor_id as vendor_id',
        'ticket_combined_id as combined_id',
        'ticket_cost_price as prev_cost_price',
        'ticket_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_ticket')
      .where('ticket_invoice_id', invoiceId)
      .andWhereNot('ticket_is_deleted', 1);

    const tourTransports = await this.query()
      .select(
        'transport_vendor_id as vendor_id',
        'transport_combined_id as combined_id',
        'transport_cost_price as prev_cost_price',
        'transport_vtrxnid as prevTrxnId'
      )
      .from('trabill_invoice_tour_transport')
      .where('transport_invoice_id', invoiceId)
      .andWhereNot('transport_is_deleted', 1);

    return [
      ...tourAccms,
      ...tourFoods,
      ...tourGuide,
      ...tourOtherTrans,
      ...tourTicket,
      ...tourTransports,
    ] as IDeletePreviousVendor[];
  };

  deletePrevBillingCost = async (invoiceId: idType, deleted_by: idType) => {
    await this.query()
      .update({ accm_is_deleted: 1, accm_deleted_by: deleted_by })
      .into('trabill_invoice_tour_accm')
      .where('accm_invoice_id', invoiceId);

    await this.query()
      .update({ food_deleted_by: deleted_by, food_is_deleted: 1 })
      .into('trabill_invoice_tour_food')
      .where('food_invoice_id', invoiceId);

    await this.query()
      .update({ guide_is_deleted: 1, guide_deleted_by: deleted_by })
      .into('trabill_invoice_tour_guide')
      .where('guide_invoice_id', invoiceId);

    await this.query()
      .update({ other_trans_is_deleted: 1, other_trans_deleted_by: deleted_by })
      .into('trabill_invoice_tour_other_trans')
      .where('other_trans_invoice_id', invoiceId);

    await this.query()
      .update({ ticket_is_deleted: 1, ticket_deleted_by: deleted_by })
      .into('trabill_invoice_tour_ticket')
      .where('ticket_invoice_id', invoiceId);

    await this.query()
      .update({ transport_is_deleted: 1, transport_deleted_by: deleted_by })
      .from('trabill_invoice_tour_transport')
      .where('transport_invoice_id', invoiceId);

    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by: deleted_by })
      .into('trabill_invoice_tour_billing')
      .where('billing_invoice_id', invoiceId);
  };

  deleteBillingOnly = async (invoiceId: idType, billing_deleted_by: idType) => {
    await this.query()
      .update({ billing_is_deleted: 1, billing_deleted_by })
      .into('trabill_invoice_tour_billing')
      .where('billing_invoice_id', invoiceId);
  };

  // UPDATE TOUR INVOICE INFOS
  updateTourTicketInfo = async (data: ITourTicketDB, tourInvoiceId: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_ticket')
      .where('ticket_invoice_id', tourInvoiceId);
  };

  updateTourGuide = async (data: ITourGuideDB, guide_id: idType) => {
    await this.query()
      .update(data)
      .into('trabill_invoice_tour_guide')
      .where('guide_id', guide_id);
  };

  deleteTourGuide = async (guide_id: idType, guide_deleted_by: idType) => {
    await this.query()
      .update({ guide_is_deleted: 1, guide_deleted_by })
      .into('trabill_invoice_tour_guide')
      .where('guide_id', guide_id);
  };

  public async insertAirticketRoute(routeData: IAirticketroute[]) {
    const data = await this.query()
      .insert(routeData)
      .into('trabill_invoice_airticket_routes');

    return data;
  }
  public async deletePrevAirticketRoute(
    invoice_id: idType,
    airoute_deleted_by: idType
  ) {
    const data = await this.query()
      .update({ airoute_is_deleted: 1, airoute_deleted_by })
      .into('trabill_invoice_airticket_routes')
      .where('airoute_invoice_id', invoice_id);
    return data;
  }
}

export default invoiceTourModels;
