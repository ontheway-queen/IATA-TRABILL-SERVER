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
                var _a, _b;
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
                // 'http://192.168.0.158:9008/api/v1/public/get-booking' + '/' + pnr;
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${ota_info.ota_token}`,
                };
                try {
                    const response = yield axios_1.default.get(api_url, { headers });
                    const pnrResponse = response.data.data;
                    if (response.data.success &&
                        (pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.flights) &&
                        (pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.fares)) {
                        const creationDetails = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.creationDetails;
                        const iata_vendor = yield conn.getIataVendorId();
                        const invoice_sales_man_id = yield conn.getEmployeeByCreationSign(creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine);
                        const ticket_details = [];
                        for (const ticket of pnrResponse.flightTickets) {
                            const flightsId = (_a = ticket.flightCoupons) === null || _a === void 0 ? void 0 : _a.map((item) => item.itemId);
                            if (!flightsId) {
                                throw new customError_1.default('The ticket has already been refunded or reissued.', 400, 'Invalid PNR');
                            }
                            // TRAVELERS
                            const travelers = pnrResponse.travelers.filter((item) => Number(item.nameAssociationId) === Number(ticket.travelerIndex));
                            const pax_passports = travelers === null || travelers === void 0 ? void 0 : travelers.map((traveler) => {
                                var _a;
                                const mobile_no = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => {
                                    var _a;
                                    return item.code === 'CTCM' &&
                                        ((_a = item.travelerIndices) === null || _a === void 0 ? void 0 : _a.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                                });
                                const email = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => {
                                    var _a;
                                    return item.code === 'CTCE' &&
                                        ((_a = item.travelerIndices) === null || _a === void 0 ? void 0 : _a.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                                });
                                return {
                                    passport_no: (traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments)
                                        ? (_a = traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments[0]) === null || _a === void 0 ? void 0 : _a.documentNumber
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
                            });
                            // FLIGHT DETAILS
                            const flights = pnrResponse.flights.filter((item) => flightsId === null || flightsId === void 0 ? void 0 : flightsId.includes(item.itemId));
                            const { flight_details, airticket_route_or_sector, route_sectors } = yield (0, pnr_lib_1.formatFlightDetailsRoute)(flights, conn);
                            // TAX BREAKDOWN
                            const taxBreakdown = pnrResponse.fares.find((item) => { var _a; return (_a = item.travelerIndices) === null || _a === void 0 ? void 0 : _a.includes(ticket.travelerIndex); });
                            const breakdown = taxBreakdown === null || taxBreakdown === void 0 ? void 0 : taxBreakdown.taxBreakdown.reduce((acc, current) => {
                                acc[current.taxCode] = Number(current.taxAmount.amount);
                                return acc;
                            }, {});
                            let totalCountryTax = 0;
                            for (const taxType in breakdown) {
                                if ((_b = ['BD', 'UT', 'E5']) === null || _b === void 0 ? void 0 : _b.includes(taxType)) {
                                    totalCountryTax += breakdown[taxType];
                                }
                            }
                            const baseFareCommission = (0, lib_1.numRound)(ticket.commission.commissionAmount);
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
                            const ticketData = Object.assign(Object.assign({}, breakdown), { airticket_ticket_no: ticket.number, airticket_gross_fare: ticket.payment.total, airticket_base_fare: ticket.payment.subtotal, airticket_comvendor: iata_vendor, airticket_commission_percent, airticket_commission_percent_total: baseFareCommission, airticket_ait,
                                airticket_net_commssion, airticket_airline_id: owningAirline, airticket_route_or_sector, airticket_pnr: pnrResponse.bookingId, airticket_gds_id: 'Sabre', airticket_tax: ticket.payment.taxes, airticket_segment, airticket_issue_date: ticket.date, airticket_journey_date: pnrResponse.startDate, airticket_return_date, airticket_classes: flights[0].cabinTypeName, airticket_client_price: ticket.payment.total, airticket_purchase_price, airticket_profit: airticket_net_commssion, flight_details,
                                pax_passports,
                                route_sectors });
                            ticket_details.push(ticketData);
                        }
                        return {
                            success: true,
                            data: {
                                ticket_details,
                                invoice_sales_date: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationDate,
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