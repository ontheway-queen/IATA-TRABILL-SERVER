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
        // GET PNR DETAILS
        this.pnrDetails = (req, pnrNo) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const pnr = req.params.pnr || pnrNo;
                if (pnr.trim().length !== 6) {
                    throw new customError_1.default('RESOURCE_NOT_FOUND', 404, 'Invalid pnr no.');
                }
                const conn = this.models.PnrDetailsModels(req, trx);
                const ota_info = yield conn.getOtaInfo(req.agency_id);
                const api_url = ota_info.ota_api_url + '/' + pnr;
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
                    throw new customError_1.default('BOOKING_NOT_FOUND', 404, 'Booking cannot be found');
                }
            }));
        });
    }
}
exports.default = PnrDetailsService;
//# sourceMappingURL=pnr_details.service.js.map