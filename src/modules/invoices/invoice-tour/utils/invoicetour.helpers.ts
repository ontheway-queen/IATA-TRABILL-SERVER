import { Request } from 'express';
import { Knex } from 'knex';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { isNotEmpty } from '../../../../common/helpers/invoice.helpers';
import { IVTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import invoiceTourModels from '../models/invoiceTour.models';
import {
  IAirticketroute,
  ICommonBillingType,
  ITourAccmDB,
  ITourFoodDB,
  ITourGuideDB,
  ITourOtherTranDB,
  ITourRequest,
  ITourTicketDB,
  ITourTransDB,
} from '../types/invouceTour.interfaces';

export const calculateTotalProfit = async (
  tourBilling: { billing_profit: number }[]
) => {
  let invoice_total_profit = 0;

  tourBilling?.map((item) => {
    if (item.billing_profit) {
      invoice_total_profit += Number(item.billing_profit);
    }
  });

  return invoice_total_profit;
};

/**
 * addVendorCostBilling
 */
class InvoiceTourHelpers {
  public static addVendorCostBilling = async (
    req: Request,
    conn: invoiceTourModels,
    invoice_id: number,
    trx: Knex.Transaction
  ) => {
    const trxns = new Trxns(req, trx);
    const {
      tourTransports,
      tourFoods,
      tourAccms,
      tourBilling,
      tourOtherTrans,
      invoice_created_by,
      guide_id,
      guide_comvendor_id,
      guide_cost_price,
      guide_description,
      guide_itinerary_id,
      guide_is_deleted,
      ticket_id,
      ticket_comvendor_id,
      ticket_cost_price,
      ticket_description,
      ticket_itinerary_id,
      ticket_no,
      ticket_route,
      ticket_airline_id,
      ticket_pnr,
      ticket_journey_date,
      ticket_return_date,
      ticket_is_deleted,
      invoice_sales_date,
      invoice_no,
    } = req.body as ITourRequest;

    // tour_transport
    if (isNotEmpty(tourTransports)) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      for (const item of tourTransports) {
        const {
          transport_id,
          transport_comvendor_id,
          transport_cost_price,
          transport_description,
          transport_itinerary_id,
          transport_type_id,
          transport_picup_place,
          transport_picup_time,
          transport_dropoff_place,
          transport_dropoff_time,
          transport_is_deleted,
        } = item;

        const { combined_id, vendor_id } = separateCombClientToId(
          transport_comvendor_id
        );

        let previousBillingInfo: ICommonBillingType[] = [];

        if (transport_id) {
          previousBillingInfo = await conn.getTransportData(
            transport_id as number
          );
        }

        const VTrxnBody: IVTrxn = {
          comb_vendor: transport_comvendor_id,
          vtrxn_amount: transport_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: transport_description,
          vtrxn_particular_id: 17,
          vtrxn_pax: ctrxn_pax,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: ticket_pnr,
          vtrxn_airticket_no: ticket_no,
        };

        const transportData: ITourTransDB = {
          transport_cost_price,
          transport_description,
          transport_itinerary_id,
          transport_vendor_id: vendor_id,
          transport_combined_id: combined_id,
          transport_invoice_id: invoice_id,
          transport_type_id,
          transport_picup_place,
          transport_picup_time,
          transport_dropoff_place,
          transport_dropoff_time,
        };

        if (transport_is_deleted && transport_id) {
          await conn.deleteTourTransport(transport_id, invoice_created_by);

          await trxns.deleteInvVTrxn(previousBillingInfo);
        }

        if (!transport_id) {
          const transport_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

          await conn.insertTourTransport({
            ...transportData,
            transport_vtrxnid,
          });
        } else {
          await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: previousBillingInfo[0]?.prevTrxnId,
          });

          await conn.updateTourTransport(transportData, transport_id);
        }
      }
    }
    // FOODS
    if (isNotEmpty(tourFoods)) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      for (const item of tourFoods) {
        const {
          food_id,
          food_comvendor_id,
          food_cost_price,
          food_description,
          food_itinerary_id,
          food_menu,
          food_place,
          food_time,
          food_is_deleted,
        } = item;

        const { combined_id, vendor_id } =
          separateCombClientToId(food_comvendor_id);

        let prevFoodBillingInfo: ICommonBillingType[] = [];
        if (food_id) {
          prevFoodBillingInfo = await conn.getTourFoodInfo(food_id as number);
        }

        const foodData: ITourFoodDB = {
          food_combined_id: combined_id,
          food_vendor_id: vendor_id,
          food_cost_price,
          food_description,
          food_itinerary_id,
          food_invoice_id: invoice_id,
          food_menu,
          food_place,
          food_time,
        };

        const VTrxnBody: IVTrxn = {
          comb_vendor: food_comvendor_id,
          vtrxn_amount: food_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: food_description,
          vtrxn_particular_id: 17,
          vtrxn_pax: ctrxn_pax,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: ticket_pnr,
          vtrxn_airticket_no: ticket_no,
        };

        if (food_is_deleted && food_id) {
          await conn.deleteTourFoods(food_id, invoice_created_by);

          await trxns.deleteInvVTrxn(prevFoodBillingInfo);
        }

        if (!food_id) {
          const food_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

          await conn.insertTourFoods({ ...foodData, food_vtrxnid });
        } else {
          await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: prevFoodBillingInfo[0].prevTrxnId,
          });

          await conn.updateTourFoods(foodData, food_id);
        }
      }
    }

    // ACCOMMODATION
    if (isNotEmpty(tourAccms)) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      for (const item of tourAccms) {
        const {
          accm_id,
          accm_comvendor_id,
          accm_cost_price,
          accm_description,
          accm_itinerary_id,
          accm_room_type_id,
          accm_place,
          accm_num_of_room,
          accm_checkin_date,
          accm_checkout_date,
          accm_is_deleted,
        } = item;

        const { combined_id, vendor_id } =
          separateCombClientToId(accm_comvendor_id);

        let prevTourAccmBilling: ICommonBillingType[] = [];
        if (accm_id) {
          prevTourAccmBilling = await conn.getTourAccmInfo(accm_id as number);
        }

        const accmData: ITourAccmDB = {
          accm_invoice_id: invoice_id,
          accm_combined_id: combined_id,
          accm_vendor_id: vendor_id,
          accm_cost_price,
          accm_description,
          accm_itinerary_id,
          accm_room_type_id,
          accm_place,
          accm_num_of_room,
          accm_checkin_date,
          accm_checkout_date,
        };

        const VTrxnBody: IVTrxn = {
          comb_vendor: accm_comvendor_id,
          vtrxn_amount: accm_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: accm_description,
          vtrxn_particular_id: 17,
          vtrxn_pax: ctrxn_pax,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: ticket_pnr,
          vtrxn_airticket_no: ticket_no,
        };

        if (accm_is_deleted && accm_id) {
          await conn.deleteTourAccm(accm_id, invoice_created_by);

          await trxns.deleteInvVTrxn(prevTourAccmBilling);
        }

        if (!accm_id) {
          const accm_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

          await conn.insertTourAccm({ ...accmData, accm_vtrxnid });
        } else {
          await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: prevTourAccmBilling[0].prevTrxnId,
          });

          await conn.updateTourAccm(accmData, accm_id);
        }
      }
    }

    // OTHER TRANSPORT
    if (isNotEmpty(tourOtherTrans)) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      for (const item of tourOtherTrans) {
        const {
          other_trans_id,
          other_trans_comvendor_id,
          other_trans_cost_price,
          other_trans_description,
          other_trans_itinerary_id,
          other_trans_is_deleted,
        } = item;
        const { combined_id, vendor_id } = separateCombClientToId(
          other_trans_comvendor_id
        );

        let prevOtherTransInfo: ICommonBillingType[] = [];
        if (other_trans_id) {
          prevOtherTransInfo = await conn.getTourOtherTransportInfo(
            other_trans_id as number
          );
        }

        const VTrxnBody: IVTrxn = {
          comb_vendor: other_trans_comvendor_id,
          vtrxn_amount: other_trans_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: other_trans_description,
          vtrxn_particular_id: 17,
          vtrxn_pax: ctrxn_pax,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
          vtrxn_pnr: ticket_pnr,
          vtrxn_airticket_no: ticket_no,
        };

        const otherTrans: ITourOtherTranDB = {
          other_trans_invoice_id: invoice_id,
          other_trans_combined_id: combined_id,
          other_trans_vendor_id: vendor_id,
          other_trans_cost_price,
          other_trans_description,
          other_trans_itinerary_id,
        };

        if (other_trans_is_deleted && other_trans_id) {
          await conn.deleteTourOtherTrans(other_trans_id, invoice_created_by);

          await trxns.deleteInvVTrxn(prevOtherTransInfo);
        }

        if (!other_trans_id) {
          const other_trans_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

          await conn.insertTourOtherTrans({
            ...otherTrans,
            other_trans_vtrxnid,
          });
        } else {
          await trxns.VTrxnUpdate({
            ...VTrxnBody,
            trxn_id: prevOtherTransInfo[0]?.prevTrxnId,
          });

          await conn.updateTourOtherTrans(otherTrans, other_trans_id);
        }
      }
    }

    // TOUR GUIDE
    if (guide_comvendor_id) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      const { combined_id, vendor_id } =
        separateCombClientToId(guide_comvendor_id);

      let prevGuideBillingInfo: ICommonBillingType[] = [];

      if (guide_id) {
        prevGuideBillingInfo = await conn.getTourGuideInfo(guide_id as number);
      }

      const VTrxnBody: IVTrxn = {
        comb_vendor: guide_comvendor_id,
        vtrxn_amount: guide_cost_price,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: guide_description,
        vtrxn_particular_id: 17,
        vtrxn_pax: ctrxn_pax,
        vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
        vtrxn_user_id: invoice_created_by,
        vtrxn_voucher: invoice_no,
        vtrxn_pnr: ticket_pnr,
        vtrxn_airticket_no: ticket_no,
      };

      const guideData: ITourGuideDB = {
        guide_combined_id: combined_id,
        guide_vendor_id: vendor_id,
        guide_cost_price,
        guide_invoice_id: invoice_id,
        guide_description,
        guide_itinerary_id,
      };

      if (guide_is_deleted && guide_id) {
        await conn.deleteTourGuide(guide_id, invoice_created_by);

        await trxns.deleteInvVTrxn(prevGuideBillingInfo);
      }

      if (!guide_id) {
        const guide_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

        await conn.insertTourGuide({ ...guideData, guide_vtrxnid });
      } else {
        await trxns.VTrxnUpdate({
          ...VTrxnBody,
          trxn_id: prevGuideBillingInfo[0]?.prevTrxnId,
        });

        await conn.updateTourGuide(guideData, guide_id);
      }
    }

    // TOUR TICKET
    if (ticket_comvendor_id) {
      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

      const { combined_id, vendor_id } =
        separateCombClientToId(ticket_comvendor_id);

      let prevTourTicketInfo: ICommonBillingType[] = [];
      if (ticket_id) {
        prevTourTicketInfo = await conn.getSignleTourTicketInfo(
          ticket_id as number
        );
      }

      const VTrxnBody: IVTrxn = {
        comb_vendor: ticket_comvendor_id,
        vtrxn_amount: ticket_cost_price,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: ticket_description,
        vtrxn_particular_id: 17,
        vtrxn_pax: ctrxn_pax,
        vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
        vtrxn_user_id: invoice_created_by,
        vtrxn_voucher: invoice_no,
        vtrxn_pnr: ticket_pnr,
        vtrxn_airticket_no: ticket_no,
      };

      const ticketData: ITourTicketDB = {
        ticket_invoice_id: invoice_id,
        ticket_combined_id: combined_id,
        ticket_vendor_id: vendor_id,
        ticket_cost_price,
        ticket_description,
        ticket_itinerary_id,
        ticket_airline_id,
        ticket_no,
        ticket_pnr,
        ticket_journey_date,
        ticket_return_date,
      };

      if (ticket_is_deleted && ticket_id) {
        await conn.deleteTourTicketInfo(ticket_id, invoice_created_by);

        await trxns.deleteInvVTrxn(prevTourTicketInfo);
      }

      if (!ticket_id) {
        const ticket_vtrxnid = await trxns.VTrxnInsert(VTrxnBody);

        await conn.insertTourTicketInfo({ ...ticketData, ticket_vtrxnid });
      } else {
        await trxns.VTrxnUpdate({
          ...VTrxnBody,
          trxn_id: prevTourTicketInfo[0]?.prevTrxnId,
        });

        await conn.updateTourTicketInfo(ticketData, ticket_id);
      }

      // delete previous route id
      await conn.deletePrevAirticketRoute(invoice_id, invoice_created_by);

      // insert new airticket route
      if (isNotEmpty(ticket_route)) {
        const ticketRoute: IAirticketroute[] = [];
        ticket_route.forEach((element) => {
          ticketRoute.push({
            airoute_invoice_id: invoice_id,
            airoute_route_sector_id: element,
          });
        });

        await conn.insertAirticketRoute(ticketRoute);
      }
    }

    // BILLING
    if (isNotEmpty(tourBilling)) {
      for (const item of tourBilling) {
        const {
          billing_id,
          billing_cost_price,
          billing_product_id,
          billing_profit,
          billing_pax_name,
          billing_country_id,
          billing_numof_room,
          billing_total_pax,
          billing_total_sales,
          is_deleted,
        } = item;

        const tourBillingData = {
          billing_cost_price,
          billing_product_id,
          billing_profit,
          billing_pax_name,
          billing_country_id,
          billing_numof_room,
          billing_total_pax,
          billing_total_sales,
          billing_invoice_id: invoice_id,
        };

        if (is_deleted && billing_id) {
          await conn.deleteTourBilling(billing_id, invoice_created_by);
        }

        if (!billing_id) {
          await conn.insertTourBilling(tourBillingData);
        } else {
          await conn.updateTourBilling(tourBillingData, billing_id);
        }
      }
    }
  };
}

export default InvoiceTourHelpers;
