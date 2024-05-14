import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import CustomError from '../../../../../common/utils/errors/customError';
import { TaxBreakdown } from '../../../invoice_ummrah/Type/invoiceUmmrah.Interfaces';
import { pnrDetails3 } from '../../demo/data';

class PnrDetailsService extends AbstractServices {
  constructor() {
    super();
  }

  // GET PNR DETAILS
  pnrDetails = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const pnr = req.params.pnr;

      if (pnr.trim().length !== 6) {
        throw new CustomError('No data found', 404, 'Bad request');
      }

      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const conn = this.models.PnrDetailsModels(req, trx);

      const iata_vendor = await common_conn.getIataVendorId();

      const pax_passports = pnrDetails3.travelers.map((traveler: any) => {
        return {
          passport_name: traveler.givenName + ' ' + traveler.surname,
          passport_person_type: traveler.type,
          passport_mobile_no: traveler?.phones
            ? traveler?.phones[0].number
            : null,
          passport_email: traveler?.emails ? traveler?.emails[0] : null,
        };
      });

      // =============

      async function asyncMap() {
        const route_or_sector: number[] = [];

        const flight_details: any[] = [];

        for (const [index, flight] of pnrDetails3.flights.entries()) {
          const fltdetails_from_airport_id = await conn.airportIdByCode(
            flight.fromAirportCode
          );
          const fltdetails_to_airport_id = await conn.airportIdByCode(
            flight.toAirportCode
          );

          if (index === 0) {
            route_or_sector.push(fltdetails_from_airport_id);
          } else {
            route_or_sector.push(fltdetails_to_airport_id);
          }

          flight_details.push({
            fltdetails_from_airport_id,
            fltdetails_to_airport_id,
            fltdetails_flight_no: flight.flightNumber,
            fltdetails_fly_date: flight.departureDate,
            fltdetails_departure_time: flight.departureTime,
            fltdetails_arrival_time: flight.arrivalDate,
            fltdetails_airline_id: await conn.airlineIdByCode(
              flight.airlineCode
            ),
          });
        }

        return { route_or_sector, flight_details };
      }

      // const flight_details = pnrDetails3.flights.map(async (flight, index) => {
      //   const fltdetails_from_airport_id = await conn.airportIdByCode(
      //     flight.fromAirportCode
      //   );
      //   const fltdetails_to_airport_id = await conn.airportIdByCode(
      //     flight.toAirportCode
      //   );

      //   if (index === 0) {
      //     route_or_sector.push(fltdetails_from_airport_id);
      //   } else {
      //     route_or_sector.push(fltdetails_to_airport_id);
      //   }

      //   return {
      //     fltdetails_from_airport_id,
      //     fltdetails_to_airport_id,
      //     fltdetails_flight_no: flight.flightNumber,
      //     fltdetails_fly_date: flight.departureDate,
      //     fltdetails_departure_time: flight.departureTime,
      //     fltdetails_arrival_time: flight.arrivalDate,
      //     fltdetails_airline_id: await conn.airlineIdByCode(flight.airlineCode),
      //   };
      // });

      const airticket_route_or_sector = pnrDetails3.journeys.map(
        (journey) => journey.firstAirportCode
      );
      airticket_route_or_sector.push(
        pnrDetails3.journeys[pnrDetails3.journeys.length - 1].lastAirportCode
      );

      // TAXES BREAKDOWN
      const taxesBreakdown: TaxBreakdown[] = pnrDetails3.fares.map((tax) => {
        const breakdown: TaxBreakdown = tax.taxBreakdown.reduce(
          (acc: TaxBreakdown, current) => {
            acc[current.taxCode] = Number(current.taxAmount.amount);
            return acc;
          },
          {}
        );

        return breakdown;
      });

      let totalCountryTax = 0;

      for (const taxType in taxesBreakdown[0]) {
        if (['BD', 'UT', 'E5'].includes(taxType)) {
          totalCountryTax += taxesBreakdown[0][taxType];
        }
      }

      const { flight_details, route_or_sector } = await asyncMap();

      // FLIGHT TICKET NUMBER
      const airticket_classes = pnrDetails3.flights[0].cabinTypeName;
      const cabin_type = pnrDetails3.flights[0].cabinTypeCode;
      const owningAirline = await conn.airlineIdByCode(
        pnrDetails3.fareRules[0].owningAirlineCode
      );

      const ticket_details = pnrDetails3.flightTickets.map(
        async (ticket, index) => {
          const baseFareCommission = Number(ticket.payment.subtotal) * 0.07;
          const countryTaxAit = Number(totalCountryTax || 0) * 0.003;
          const grossAit = Number(ticket.payment.total || 0) * 0.003;
          const airticket_ait = Math.round(grossAit - countryTaxAit);
          const airticket_net_commssion = baseFareCommission - airticket_ait;

          const airticket_purchase_price =
            Number(ticket.payment.total || 0) - airticket_net_commssion;

          return {
            airticket_comvendor: iata_vendor,
            airticket_ticket_no: ticket.number,
            airticket_issue_date: ticket.date,
            airticket_base_fare: ticket.payment.subtotal,
            airticket_gross_fare: ticket.payment.total,
            airticket_classes,
            cabin_type,
            airticket_tax: ticket.payment.taxes,
            currency: ticket.payment.currencyCode,
            airticket_segment: pnrDetails3.allSegments.length,
            airticket_journey_date: pnrDetails3.startDate,
            airticket_commission_percent_total: baseFareCommission,
            airticket_route_or_sector: route_or_sector, // add later
            airticket_airline_id: owningAirline,
            airticket_ait, // ==============
            airticket_client_price: ticket.payment.total,
            airticket_purchase_price, // ==============
            airticket_profit: airticket_net_commssion, // ==============
            ...taxesBreakdown[index],
          };
        }
      );

      const data = {
        pax_passports,
        ticket_details,
        flight_details,
      };

      return { success: true, data };

      // ===================
      const pnrId = req.params.pnr;

      const apiUrl = `http://192.168.0.235:9008/api/v1/btob/flight/booking-details/${pnrId}`;

      try {
        const response = await axios.get(apiUrl);

        const data = response.data;

        if (data.success) {
          return data;
        }
        return { success: true, data: [] };
      } catch (error: any) {
        throw new CustomError('PNR details not found!', 404, error.message);
      }
    });
  };
}

export default PnrDetailsService;
