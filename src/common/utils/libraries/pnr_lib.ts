import PnrDetailsModels from '../../../modules/invoices/invoice-air-ticket/models/pnr_details.models';
import { TaxBreakdown } from '../../../modules/invoices/invoice_ummrah/Type/invoiceUmmrah.Interfaces';
import { numRound } from './lib';

export const formatFlightDetailsRoute = async (
  flights: any,
  conn: PnrDetailsModels
) => {
  const route_or_sector: number[] = [];
  const route_sectors: string[] = [];

  const flight_details: any[] = [];

  for (const [index, flight] of flights?.entries()) {
    const fltdetails_from_airport_id = await conn.airportIdByCode(
      flight.fromAirportCode
    );
    const fltdetails_to_airport_id = await conn.airportIdByCode(
      flight.toAirportCode
    );

    if (index === 0) {
      route_or_sector.push(fltdetails_from_airport_id);
      route_or_sector.push(fltdetails_to_airport_id);

      route_sectors.push(flight.fromAirportCode);
      route_sectors.push(flight.toAirportCode);
    } else {
      route_or_sector.push(fltdetails_to_airport_id);
      route_sectors.push(flight.toAirportCode);
    }

    flight_details.push({
      fltdetails_from_airport_id,
      fltdetails_to_airport_id,
      fltdetails_flight_no: flight.flightNumber,
      fltdetails_fly_date: flight.departureDate,
      fltdetails_departure_time: flight.departureTime,
      fltdetails_arrival_time: flight.arrivalTime,
      fltdetails_airline_id: await conn.airlineIdByCode(flight.airlineCode),
    });
  }

  return { route_or_sector, flight_details, route_sectors };
};

export const formatTicketDetails = async (
  conn: PnrDetailsModels,
  pnrData: any,
  route_or_sector: number[]
) => {
  const iata_vendor = await conn.getIataVendorId();
  const airticket_classes = pnrData.flights[0].cabinTypeName;
  const cabin_type = pnrData.flights[0].cabinTypeCode;
  const owningAirline = await conn.airlineIdByCode(
    pnrData.fareRules[0].owningAirlineCode
  );

  // TAXES BREAKDOWN
  const taxesBreakdown: TaxBreakdown[] = pnrData?.fares?.map((tax: any) => {
    const breakdown: TaxBreakdown = tax.taxBreakdown.reduce(
      (acc: TaxBreakdown, current: any) => {
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

  const ticket_details: any[] = [];

  for (const [index, ticket] of pnrData.flightTickets?.entries()) {
    const baseFareCommission = Number(ticket.commission.commissionAmount);
    const countryTaxAit = Number(totalCountryTax || 0) * 0.003;
    const grossAit = Number(ticket.payment.total || 0) * 0.003;
    const airticket_ait = Math.round(grossAit - countryTaxAit);
    const airticket_net_commssion = baseFareCommission - airticket_ait;

    const airticket_purchase_price =
      Number(ticket.payment.total || 0) - airticket_net_commssion;

    ticket_details.push({
      airticket_comvendor: iata_vendor,
      airticket_gds_id: 'Sabre',
      airticket_ticket_no: ticket.number,
      airticket_issue_date: ticket.date,
      airticket_base_fare: ticket.payment.subtotal,
      airticket_gross_fare: ticket.payment.total,
      airticket_classes,
      cabin_type,
      airticket_tax: ticket.payment.taxes,
      currency: ticket.payment.currencyCode,
      airticket_segment: pnrData.allSegments.length,
      airticket_journey_date: pnrData.startDate,
      airticket_commission_percent_total: numRound(baseFareCommission),
      airticket_route_or_sector: route_or_sector,
      airticket_airline_id: owningAirline,
      airticket_ait,
      airticket_client_price: ticket.payment.total,
      airticket_purchase_price,
      airticket_net_commssion,
      airticket_profit: airticket_net_commssion,
      airticket_commission_percent: numRound(
        (numRound(baseFareCommission) / numRound(ticket.payment.subtotal)) * 100
      ),
      ...taxesBreakdown[index],
    });
  }

  return ticket_details;
};

export const capitalize = (str: string) => {
  return str.toLowerCase().replace(/(^|\s)\S/g, function (firstLetter) {
    return firstLetter.toUpperCase();
  });
};

export const extractPaxStr = (input: string) => {
  const regex1 = /\/([A-Z0-9.]+)\/\/([A-Z0-9.]+)$/i;
  const regex2 = /\/(\d+)$/;

  const match1 = input.match(regex1);
  const match2 = input.match(regex2);

  if (match1) {
    return `${match1[1]}@${match1[2]}`;
  } else if (match2) {
    return match2[1];
  } else {
    return null;
  }
};
