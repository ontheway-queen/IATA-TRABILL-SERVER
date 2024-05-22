"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPaxStr = exports.capitalize = exports.formatTicketDetails = exports.formatFlightDetailsRoute = void 0;
const lib_1 = require("./lib");
const formatFlightDetailsRoute = (flights, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const airticket_route_or_sector = [];
    const route_sectors = [];
    const flight_details = [];
    for (const [index, flight] of flights === null || flights === void 0 ? void 0 : flights.entries()) {
        const fltdetails_from_airport_id = yield conn.airportIdByCode(flight.fromAirportCode);
        const fltdetails_to_airport_id = yield conn.airportIdByCode(flight.toAirportCode);
        if (index === 0) {
            airticket_route_or_sector.push(fltdetails_from_airport_id);
            airticket_route_or_sector.push(fltdetails_to_airport_id);
            route_sectors.push(flight.fromAirportCode);
            route_sectors.push(flight.toAirportCode);
        }
        else {
            airticket_route_or_sector.push(fltdetails_to_airport_id);
            route_sectors.push(flight.toAirportCode);
        }
        flight_details.push({
            fltdetails_from_airport_id,
            fltdetails_to_airport_id,
            fltdetails_flight_no: flight.flightNumber,
            fltdetails_fly_date: flight.departureDate,
            fltdetails_departure_time: flight.departureTime,
            fltdetails_arrival_time: flight.arrivalTime,
            fltdetails_airline_id: yield conn.airlineIdByCode(flight.airlineCode),
        });
    }
    return { airticket_route_or_sector, flight_details, route_sectors };
});
exports.formatFlightDetailsRoute = formatFlightDetailsRoute;
const formatTicketDetails = (conn, pnrData, airticket_route_or_sector) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const iata_vendor = yield conn.getIataVendorId();
    const airticket_classes = pnrData.flights[0].cabinTypeName;
    const cabin_type = pnrData.flights[0].cabinTypeCode;
    const owningAirline = yield conn.airlineIdByCode(pnrData.fareRules[0].owningAirlineCode);
    // TAXES BREAKDOWN
    const taxesBreakdown = (_a = pnrData === null || pnrData === void 0 ? void 0 : pnrData.fares) === null || _a === void 0 ? void 0 : _a.map((tax) => {
        const breakdown = tax.taxBreakdown.reduce((acc, current) => {
            acc[current.taxCode] = Number(current.taxAmount.amount);
            return acc;
        }, {});
        return breakdown;
    });
    let totalCountryTax = 0;
    for (const taxType in taxesBreakdown[0]) {
        if (['BD', 'UT', 'E5'].includes(taxType)) {
            totalCountryTax += taxesBreakdown[0][taxType];
        }
    }
    const ticket_details = [];
    for (const [index, ticket] of (_b = pnrData.flightTickets) === null || _b === void 0 ? void 0 : _b.entries()) {
        const baseFareCommission = Number(ticket.commission.commissionAmount);
        const countryTaxAit = Number(totalCountryTax || 0) * 0.003;
        const grossAit = Number(ticket.payment.total || 0) * 0.003;
        const airticket_ait = Math.round(grossAit - countryTaxAit);
        const airticket_net_commssion = baseFareCommission - airticket_ait;
        const airticket_purchase_price = Number(ticket.payment.total || 0) - airticket_net_commssion;
        ticket_details.push(Object.assign({ airticket_comvendor: iata_vendor, airticket_gds_id: 'Sabre', airticket_ticket_no: ticket.number, airticket_issue_date: ticket.date, airticket_base_fare: ticket.payment.subtotal, airticket_gross_fare: ticket.payment.total, airticket_classes,
            cabin_type, airticket_tax: ticket.payment.taxes, currency: ticket.payment.currencyCode, airticket_segment: pnrData.allSegments.length, airticket_journey_date: pnrData.startDate, airticket_commission_percent_total: (0, lib_1.numRound)(baseFareCommission), airticket_route_or_sector: airticket_route_or_sector, airticket_airline_id: owningAirline, airticket_ait, airticket_client_price: ticket.payment.total, airticket_purchase_price,
            airticket_net_commssion, airticket_profit: airticket_net_commssion, airticket_commission_percent: (0, lib_1.numRound)(((0, lib_1.numRound)(baseFareCommission) / (0, lib_1.numRound)(ticket.payment.subtotal)) * 100) }, taxesBreakdown[index]));
    }
    return ticket_details;
});
exports.formatTicketDetails = formatTicketDetails;
const capitalize = (str) => {
    return str.toLowerCase().replace(/(^|\s)\S/g, function (firstLetter) {
        return firstLetter.toUpperCase();
    });
};
exports.capitalize = capitalize;
const extractPaxStr = (input) => {
    if (!input) {
        return undefined;
    }
    const regex1 = /\/([A-Z0-9.]+)\/\/([A-Z0-9.]+)$/i;
    const regex2 = /\/(\d+)$/;
    const match1 = input.match(regex1);
    const match2 = input.match(regex2);
    if (match1) {
        return `${match1[1]}@${match1[2]}`;
    }
    else if (match2) {
        return match2[1];
    }
    else {
        return null;
    }
};
exports.extractPaxStr = extractPaxStr;
//# sourceMappingURL=pnr_lib.js.map