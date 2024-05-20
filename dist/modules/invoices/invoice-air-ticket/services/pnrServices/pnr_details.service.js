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
const data_1 = require("../../demo/data");
class PnrDetailsService extends abstract_services_1.default {
    constructor() {
        super();
        // GET PNR DETAILS
        this.pnrDetails = (req, pnrNo) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const pnr = req.params.pnr || pnrNo;
                if (pnr.trim().length !== 6) {
                    throw new customError_1.default('Invalid pnr no.', 404, 'RESOURCE_NOT_FOUND');
                }
                const conn = this.models.PnrDetailsModels(req, trx);
                const ota_info = yield conn.getOtaInfo(req.agency_id);
                // const api_url = ota_info.ota_api_url + '/' + pnr;
                const api_url = 'http://192.168.0.158:9008/api/v1/public/get-booking' + '/' + pnr;
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
                        const invoice_sales_man_id = yield conn.getEmployeeByCreationSign(creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine);
                        const pax_passports = (_a = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.travelers) === null || _a === void 0 ? void 0 : _a.map((traveler) => {
                            var _a;
                            const mobile_no = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => item.code === 'CTCM' &&
                                item.travelerIndices.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                            const email = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => item.code === 'CTCE' &&
                                item.travelerIndices.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                            return {
                                passport_no: (_a = traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments[0]) === null || _a === void 0 ? void 0 : _a.documentNumber,
                                passport_name: traveler.givenName + ' ' + traveler.surname,
                                passport_person_type: (0, pnr_lib_1.capitalize)(traveler === null || traveler === void 0 ? void 0 : traveler.type),
                                passport_mobile_no: (traveler === null || traveler === void 0 ? void 0 : traveler.phones)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.phones[0].number
                                    : (0, pnr_lib_1.extractPaxStr)(mobile_no === null || mobile_no === void 0 ? void 0 : mobile_no.message),
                                passport_email: (traveler === null || traveler === void 0 ? void 0 : traveler.emails)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.emails[0]
                                    : (0, pnr_lib_1.extractPaxStr)(email === null || email === void 0 ? void 0 : email.message),
                            };
                        });
                        const flightRoute = yield (0, pnr_lib_1.formatFlightDetailsRoute)(pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.flights, conn);
                        const ticket_details = yield (0, pnr_lib_1.formatTicketDetails)(conn, pnrResponse, flightRoute.route_or_sector);
                        const data = Object.assign(Object.assign({}, flightRoute), { pax_passports,
                            ticket_details, invoice_sales_date: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationDate, invoice_sales_man_id, creation_sign: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine });
                        return { success: true, data };
                    }
                    return { success: true, data: [] };
                }
                catch (error) {
                    throw new customError_1.default('Booking cannot be found', 404, 'BOOKING_NOT_FOUND');
                }
            }));
        });
        // TEST ========================
        this.testPnrDetails = (req, pnrNo) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const conn = this.models.PnrDetailsModels(req, trx);
                try {
                    const pnrResponse = data_1.staticPnrData;
                    if ((pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.flights) && (pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.fares)) {
                        const creationDetails = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.creationDetails;
                        const invoice_sales_man_id = yield conn.getEmployeeByCreationSign(creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine);
                        const airticket_classes = pnrResponse.flights[0].cabinTypeName;
                        const cabin_type = pnrResponse.flights[0].cabinTypeCode;
                        const owningAirline = yield conn.airlineIdByCode(pnrResponse.fareRules[0].owningAirlineCode);
                        const ticket_details = pnrResponse.flightTickets.map((ticket) => {
                            const taxBreakdown = pnrResponse.fares.find((item) => item.travelerIndices.includes(ticket.travelerIndex));
                            console.log(taxBreakdown);
                            const baseFareCommission = Number(ticket.commission.commissionAmount);
                            const countryTaxAit = Number(1 || 0) * 0.003;
                            const grossAit = Number(ticket.payment.total || 0) * 0.003;
                            const airticket_ait = Math.round(grossAit - countryTaxAit);
                            const airticket_net_commssion = baseFareCommission - airticket_ait;
                            const airticket_purchase_price = Number(ticket.payment.total || 0) - airticket_net_commssion;
                            const ticketData = {
                                airticket_comvendor: 'iata_vendor',
                                airticket_gds_id: 'Sabre',
                                airticket_ticket_no: ticket.number,
                                airticket_issue_date: ticket.date,
                                airticket_base_fare: ticket.payment.subtotal,
                                airticket_gross_fare: ticket.payment.total,
                                airticket_classes,
                                cabin_type,
                                airticket_tax: ticket.payment.taxes,
                                currency: ticket.payment.currencyCode,
                                airticket_segment: pnrResponse.allSegments.length,
                                airticket_journey_date: pnrResponse.startDate,
                                airticket_commission_percent_total: (0, lib_1.numRound)(baseFareCommission),
                                // airticket_route_or_sector: route_or_sector,
                                airticket_airline_id: owningAirline,
                                airticket_ait,
                                airticket_client_price: ticket.payment.total,
                                airticket_purchase_price,
                                airticket_net_commssion,
                                airticket_profit: airticket_net_commssion,
                                airticket_commission_percent: (0, lib_1.numRound)(((0, lib_1.numRound)(baseFareCommission) /
                                    (0, lib_1.numRound)(ticket.payment.subtotal)) *
                                    100),
                                // ...taxesBreakdown[index],
                            };
                        });
                        const pax_passports = (_b = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.travelers) === null || _b === void 0 ? void 0 : _b.map((traveler) => {
                            var _a;
                            const mobile_no = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => item.code === 'CTCM' &&
                                item.travelerIndices.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                            const email = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.specialServices.find((item) => item.code === 'CTCE' &&
                                item.travelerIndices.includes((0, lib_1.numRound)(traveler.nameAssociationId)));
                            return {
                                passport_no: (_a = traveler === null || traveler === void 0 ? void 0 : traveler.identityDocuments[0]) === null || _a === void 0 ? void 0 : _a.documentNumber,
                                passport_name: traveler.givenName + ' ' + traveler.surname,
                                passport_person_type: (0, pnr_lib_1.capitalize)(traveler === null || traveler === void 0 ? void 0 : traveler.type),
                                passport_mobile_no: (traveler === null || traveler === void 0 ? void 0 : traveler.phones)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.phones[0].number
                                    : (0, pnr_lib_1.extractPaxStr)(mobile_no === null || mobile_no === void 0 ? void 0 : mobile_no.message),
                                passport_email: (traveler === null || traveler === void 0 ? void 0 : traveler.emails)
                                    ? traveler === null || traveler === void 0 ? void 0 : traveler.emails[0]
                                    : (0, pnr_lib_1.extractPaxStr)(email === null || email === void 0 ? void 0 : email.message),
                            };
                        });
                        const flightRoute = yield (0, pnr_lib_1.formatFlightDetailsRoute)(pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.flights, conn);
                        const ticket_details12 = yield (0, pnr_lib_1.formatTicketDetails)(conn, pnrResponse, flightRoute.route_or_sector);
                        const data = Object.assign(Object.assign({}, flightRoute), { pax_passports,
                            ticket_details, invoice_sales_date: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationDate, invoice_sales_man_id, creation_sign: creationDetails === null || creationDetails === void 0 ? void 0 : creationDetails.creationUserSine });
                        return { success: true, data };
                    }
                    return { success: true, data: [] };
                }
                catch (error) {
                    throw new customError_1.default('Booking cannot be found', 404, error.message);
                }
            }));
        });
    }
}
exports.default = PnrDetailsService;
//# sourceMappingURL=pnr_details.service.js.map