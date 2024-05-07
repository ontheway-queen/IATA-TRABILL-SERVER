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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../../../common/utils/errors/customError"));
const data_1 = require("../../demo/data");
class PnrDetailsService extends abstract_services_1.default {
    constructor() {
        super();
        // GET PNR DETAILS
        this.pnrDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const pnr = req.params.pnr;
                if (pnr !== 'SQBSCN') {
                    throw new customError_1.default('No data found', 404, 'Bad request');
                }
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const iata_vendor = yield common_conn.getIataVendorId();
                const pax_passports = data_1.pnrDetails.travelers.map((traveler) => {
                    return {
                        passport_name: traveler.givenName + ' ' + traveler.surname,
                        passport_person_type: traveler.type,
                        passport_mobile_no: (traveler === null || traveler === void 0 ? void 0 : traveler.phones)
                            ? traveler === null || traveler === void 0 ? void 0 : traveler.phones[0].number
                            : null,
                        passport_email: (traveler === null || traveler === void 0 ? void 0 : traveler.emails) ? traveler === null || traveler === void 0 ? void 0 : traveler.emails[0] : null,
                    };
                });
                const flight_details = data_1.pnrDetails.flights.map((flight) => {
                    return {
                        fltdetails_from_airport_id: 2061,
                        fltdetails_to_airport_id: 210,
                        fltdetails_airline_id: 63,
                        fltdetails_flight_no: flight.flightNumber,
                        fltdetails_fly_date: flight.departureDate,
                        fltdetails_departure_time: flight.departureTime,
                        fltdetails_arrival_time: flight.arrivalDate,
                    };
                });
                const airticket_route_or_sector = data_1.pnrDetails.journeys.map((journey) => journey.firstAirportCode);
                airticket_route_or_sector.push(data_1.pnrDetails.journeys[data_1.pnrDetails.journeys.length - 1].lastAirportCode);
                // TAXES BREAKDOWN
                const taxesBreakdown = data_1.pnrDetails.fares.map((tax) => {
                    const breakdown = tax.taxBreakdown.reduce((acc, current) => {
                        acc[current.taxCode] = Number(current.taxAmount.amount);
                        return acc;
                    }, {});
                    return breakdown;
                });
                let totalCountryTax = 0;
                for (const taxType in taxesBreakdown[0]) {
                    totalCountryTax += taxesBreakdown[0][taxType];
                }
                // FLIGHT TICKET NUMBER
                const airticket_classes = data_1.pnrDetails.flights[0].cabinTypeName;
                const cabin_type = data_1.pnrDetails.flights[0].cabinTypeCode;
                const ticket_details = data_1.pnrDetails.flightTickets.map((ticket, index) => {
                    const baseFareCommission = Number(ticket.payment.subtotal) * 0.07;
                    const countryTaxAit = Number(totalCountryTax || 0) * 0.003;
                    const grossAit = Number(ticket.payment.total || 0) * 0.003;
                    const airticket_ait = Math.round(grossAit - countryTaxAit);
                    const airticket_net_commssion = baseFareCommission - airticket_ait;
                    const airticket_purchase_price = Number(ticket.payment.total || 0) - airticket_net_commssion;
                    return Object.assign({ airticket_comvendor: iata_vendor, airticket_ticket_no: ticket.number, airticket_issue_date: ticket.date, airticket_base_fare: ticket.payment.subtotal, airticket_gross_fare: ticket.payment.total, airticket_classes,
                        cabin_type, airticket_tax: ticket.payment.taxes, currency: ticket.payment.currencyCode, airticket_segment: data_1.pnrDetails.allSegments.length, airticket_journey_date: data_1.pnrDetails.startDate, airticket_commission_percent_total: baseFareCommission, airticket_route_or_sector: [210, 2061, 210], airticket_airline_id: 63, // add later
                        airticket_ait, airticket_client_price: ticket.payment.total, airticket_purchase_price, airticket_profit: airticket_net_commssion }, taxesBreakdown[index]);
                });
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
                    const response = yield axios_1.default.get(apiUrl);
                    const data = response.data;
                    if (data.success) {
                        return data;
                    }
                    return { success: true, data: [] };
                }
                catch (error) {
                    throw new customError_1.default('PNR details not found!', 404, error.message);
                }
            }));
        });
    }
}
exports.default = PnrDetailsService;
//# sourceMappingURL=pnr_details.service.js.map