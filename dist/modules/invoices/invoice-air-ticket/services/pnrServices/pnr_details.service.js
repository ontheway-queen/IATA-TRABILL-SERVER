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
const lib_1 = require("../../../../../common/utils/libraries/lib");
const pnr_lib_1 = require("../../../../../common/utils/libraries/pnr_lib");
class PnrDetailsService extends abstract_services_1.default {
    constructor() {
        super();
        this.pnrDetails = (req, pnrNo) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const pnr = req.params.pnr || pnrNo;
                if (pnr && pnr.trim().length !== 6) {
                    throw new customError_1.default('Invalid pnr no.', 404, 'RESOURCE_NOT_FOUND');
                }
                const conn = this.models.PnrDetailsModels(req, trx);
                const ota_info = yield conn.getOtaInfo(req.agency_id);
                if (!ota_info.ota_api_url && !ota_info.ota_token) {
                    return { success: true, message: 'Empty token and base url' };
                }
                const api_url = ota_info.ota_api_url + '/' + pnr;
                // const api_url =
                //   'http://192.168.0.158:9008/api/v1/public/get-booking' + '/' + pnr;
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${ota_info.ota_token}`,
                };
                try {
                    const response = yield axios_1.default.get(api_url, { headers });
                    const pnrResponse = response.data.data;
                    // ERROR THROW FROM SABRE RESPONSE
                    if ((_a = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.errors) === null || _a === void 0 ? void 0 : _a.length) {
                        throw new customError_1.default(pnrResponse.errors[0].description, 400, pnrResponse.errors[0].category);
                    }
                    if (response.data.success &&
                        (pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.flights) &&
                        (pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.fares)) {
                        const creationDetails = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.creationDetails;
                        const iata_vendor = yield conn.getIataVendorId();
                        const invoice_sales_man_id = yield conn.getEmployeeByCreationSign(creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine);
                        const ticket_details = [];
                        // TICKET DETAILS
                        for (const [index, ticket] of pnrResponse.flightTickets.entries()) {
                            const flightsId = (_b = ticket.flightCoupons) === null || _b === void 0 ? void 0 : _b.map((item) => item.itemId);
                            if (!flightsId) {
                                throw new customError_1.default('The ticket has already been refunded or reissued.', 400, 'Invalid PNR');
                            }
                            // TRAVELERS
                            const traveler = pnrResponse.travelers[Number(ticket.travelerIndex) - 1];
                            const mobile_no = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => {
                                var _a;
                                return item.code === 'CTCM' &&
                                    ((_a = item.travelerIndices) === null || _a === void 0 ? void 0 : _a.includes(ticket.travelerIndex));
                            });
                            const email = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => {
                                var _a;
                                return item.code === 'CTCE' &&
                                    ((_a = item.travelerIndices) === null || _a === void 0 ? void 0 : _a.includes(ticket.travelerIndex));
                            });
                            const pax_passports = {
                                passport_no: (traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments)
                                    ? (_c = traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments[0]) === null || _c === void 0 ? void 0 : _c.documentNumber
                                    : undefined,
                                passport_name: traveler.givenName + ' ' + traveler.surname,
                                passport_person_type: (0, pnr_lib_1.capitalize)(traveler === null || traveler === void 0 ? void 0 : traveler.type),
                                passport_mobile_no: (traveler === null || traveler === void 0 ? void 0 : traveler.phones)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.phones[0].number
                                    : (0, pnr_lib_1.extractPaxStr)(mobile_no === null || mobile_no === void 0 ? void 0 : mobile_no.message),
                                passport_email: (traveler === null || traveler === void 0 ? void 0 : traveler.emails)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.emails[0]
                                    : (0, pnr_lib_1.extractPaxStr)(email === null || email === void 0 ? void 0 : email.message),
                                identityDocuments: (traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments[0]
                                    : undefined,
                            };
                            // FLIGHT DETAILS
                            const flights = pnrResponse.flights.filter((item) => flightsId === null || flightsId === void 0 ? void 0 : flightsId.includes(item.itemId));
                            const { flight_details, airticket_route_or_sector, route_sectors } = yield (0, pnr_lib_1.formatFlightDetailsRoute)(flights, conn);
                            const taxBreakdown = ((_d = pnrResponse.fares) === null || _d === void 0 ? void 0 : _d.find((item) => {
                                return ((item === null || item === void 0 ? void 0 : item.travelerIndices) &&
                                    (item === null || item === void 0 ? void 0 : item.travelerIndices.includes(ticket.travelerIndex)));
                            })) ||
                                ((_e = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.fares) === null || _e === void 0 ? void 0 : _e.find((item) => item.airlineCode === flights[0].airlineCode));
                            const breakdown = taxBreakdown === null || taxBreakdown === void 0 ? void 0 : taxBreakdown.taxBreakdown.reduce((acc, current) => {
                                acc[current.taxCode] = Number(current.taxAmount.amount);
                                return acc;
                            }, {});
                            let totalCountryTax = 0;
                            for (const taxType in breakdown) {
                                if ((_f = ['BD', 'UT', 'E5']) === null || _f === void 0 ? void 0 : _f.includes(taxType)) {
                                    totalCountryTax += breakdown[taxType];
                                }
                            }
                            // TAXES COMMISSION
                            let taxesCommission;
                            if (['TK', 'CZ'].includes(flights[0].airlineCode)) {
                                taxesCommission = (_g = taxBreakdown === null || taxBreakdown === void 0 ? void 0 : taxBreakdown.taxBreakdown) === null || _g === void 0 ? void 0 : _g.filter((item) => item.taxCode === 'YQ');
                            }
                            else if (['MH', 'AI'].includes(flights[0].airlineCode)) {
                                taxesCommission = (_h = taxBreakdown === null || taxBreakdown === void 0 ? void 0 : taxBreakdown.taxBreakdown) === null || _h === void 0 ? void 0 : _h.filter((item) => item.taxCode === 'YR');
                            }
                            const baseFareCommission = (0, lib_1.numRound)((_j = ticket === null || ticket === void 0 ? void 0 : ticket.commission) === null || _j === void 0 ? void 0 : _j.commissionAmount);
                            const countryTaxAit = Number(1 || 0) * 0.003;
                            const grossAit = Number(ticket.payment.total || 0) * 0.003;
                            const airticket_ait = Math.round(grossAit - countryTaxAit);
                            const airticket_net_commssion = baseFareCommission - airticket_ait;
                            const airticket_purchase_price = Number(ticket.payment.total || 0) - airticket_net_commssion;
                            const airticket_segment = pnrResponse.allSegments.length;
                            const airticket_commission_percent = (0, lib_1.numRound)(((0, lib_1.numRound)(baseFareCommission) /
                                (0, lib_1.numRound)(ticket.payment.subtotal)) *
                                100);
                            const owningAirline = yield conn.airlineIdByCode(flights[0].airlineCode);
                            const airticket_return_date = airticket_segment > 1
                                ? pnrResponse.allSegments[airticket_segment - 1].endDate
                                : undefined;
                            const taxes_commission = taxesCommission === null || taxesCommission === void 0 ? void 0 : taxesCommission.map((item) => {
                                return {
                                    airline_taxes: item.taxAmount.amount,
                                    airline_commission: (0, lib_1.numRound)(item.taxAmount.amount) *
                                        (airticket_commission_percent / 100),
                                    airline_tax_type: item.taxCode,
                                };
                            });
                            const ticketData = Object.assign(Object.assign({}, breakdown), { airticket_ticket_no: ticket.number, airticket_gross_fare: ticket.payment.total, airticket_base_fare: ticket.payment.subtotal, airticket_comvendor: iata_vendor, airticket_commission_percent, airticket_commission_percent_total: baseFareCommission, airticket_ait,
                                airticket_net_commssion, airticket_airline_id: owningAirline, airticket_route_or_sector, airticket_pnr: pnrResponse.bookingId, airticket_gds_id: 'Sabre', airticket_tax: ticket.payment.taxes, airticket_segment, airticket_issue_date: ticket.date, airticket_journey_date: pnrResponse.startDate, airticket_return_date, airticket_classes: flights[0].cabinTypeName, airticket_client_price: ticket.payment.total, airticket_purchase_price, airticket_profit: airticket_net_commssion, flight_details, pax_passports: [pax_passports], taxes_commission,
                                route_sectors });
                            ticket_details.push(ticketData);
                        }
                        return {
                            success: true,
                            data: {
                                ticket_details,
                                invoice_sales_date: pnrResponse.flightTickets[0].date,
                                invoice_sales_man_id,
                                creation_sign: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine,
                            },
                        };
                    }
                    return { success: true, data: [] };
                }
                catch (error) {
                    throw new customError_1.default(error.message || 'Booking cannot be found', 404, error.type + '. pnr_details.service');
                }
            }));
        });
    }
}
exports.default = PnrDetailsService;
//# sourceMappingURL=pnr_details.service.js.map