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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class TourItinerayServices extends abstract_services_1.default {
    constructor() {
        super();
        this.createTourGroups = (req) => __awaiter(this, void 0, void 0, function* () {
            const insertBody = req.body;
            const data = yield this.models
                .TourItinerayModels(req)
                .insertTourGroups(insertBody);
            return { success: true, data };
        });
        this.updateTourGroups = (req) => __awaiter(this, void 0, void 0, function* () {
            const insertBody = req.body;
            const groupId = req.params.id;
            yield this.models
                .TourItinerayModels(req)
                .editTourGroups(insertBody, groupId);
            return { success: true, data: 'tour group updated successfully' };
        });
        this.deleteTourGroups = (req) => __awaiter(this, void 0, void 0, function* () {
            const groupId = req.params.id;
            const { deleted_by } = req.body;
            yield this.models
                .TourItinerayModels(req)
                .deleteTourGroups(groupId, deleted_by);
            return { success: true, data: 'tour group deleted successfully' };
        });
        this.viewTourGroups = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const data = yield this.models
                .TourItinerayModels(req)
                .viewTourGroups(Number(page) || 1, Number(size) || 20, String(search || ''));
            const count = yield this.models.TourItinerayModels(req).countTourGroup();
            return { success: true, count, data };
        });
        this.getAllTourGroups = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.TourItinerayModels(req).getAllTourGroups();
            return { success: true, data };
        });
        this.getTourGroupById = (req) => __awaiter(this, void 0, void 0, function* () {
            const groupId = req.params.id;
            const data = yield this.models
                .TourItinerayModels(req)
                .getByIdTourGroup(groupId);
            return { success: true, data };
        });
        this.getTourVendorsInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const itinararyId = req.params.id;
            const data = yield this.models
                .TourItinerayModels(req)
                .getTourVendorByItineraryId(itinararyId);
            return { success: true, data };
        });
        this.getTourVendorByAccmId = (req) => __awaiter(this, void 0, void 0, function* () {
            const itinararyId = req.params.id;
            const data = yield this.models
                .TourItinerayModels(req)
                .getTourVendorByAccmId(itinararyId);
            return { success: true, data };
        });
        // =============CITIES==============
        this.createCities = (req) => __awaiter(this, void 0, void 0, function* () {
            const insertBody = req.body;
            const data = yield this.models
                .TourItinerayModels(req)
                .insertToursCities(insertBody);
            return { success: true, data };
        });
        this.updateCities = (req) => __awaiter(this, void 0, void 0, function* () {
            const insertBody = req.body;
            const cityId = req.params.id;
            yield this.models
                .TourItinerayModels(req)
                .updateToursCities(insertBody, cityId);
            return { success: true, data: 'City updated successfully' };
        });
        this.deleteCities = (req) => __awaiter(this, void 0, void 0, function* () {
            const cityId = req.params.id;
            const { deleted_by } = req.body;
            yield this.models
                .TourItinerayModels(req)
                .deleteToursCities(cityId, deleted_by);
            return { success: true, data: 'City deleted successfully' };
        });
        this.viewToursCities = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const data = yield this.models
                .TourItinerayModels(req)
                .viewToursCities(Number(page) || 1, Number(size) || 20, String(search || ''));
            const count = yield this.models
                .TourItinerayModels(req)
                .countTourCitiesDataRow();
            return { success: true, count, data };
        });
        this.getAllCitites = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.TourItinerayModels(req).getAllToursCities();
            return { success: true, data };
        });
        this.getByIdCity = (req) => __awaiter(this, void 0, void 0, function* () {
            const cityId = req.params.id;
            const data = yield this.models
                .TourItinerayModels(req)
                .getByIdToursCities(cityId);
            return { success: true, data };
        });
        // ==================== ITINERARIES - TICKETS , GUIDES, TRANSPORT, FOOD
        this.createTourTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const reqBody = req.body;
            const itineraryType = req.params.type;
            let itinerary_type;
            if (itineraryType === 'ticket') {
                itinerary_type = 'TICKETS';
            }
            else if (itineraryType === 'guide') {
                itinerary_type = 'GUIDES';
            }
            else if (itineraryType === 'transport') {
                itinerary_type = 'TRANSPORTS';
            }
            else if (itineraryType === 'other-transport') {
                itinerary_type = 'OTHER_TRANSPORTS';
            }
            else if (itineraryType === 'food') {
                itinerary_type = 'FOODS';
            }
            else {
                throw new customError_1.default('Provide itinarary type', 400, 'Invalid type');
            }
            const conn = this.models.TourItinerayModels(req);
            let itineraryId;
            for (const item of reqBody) {
                const { itinerary_place_id, itinerary_particular, itinerary_created_by, itinerary_status, vendors, } = item;
                const itineryData = {
                    itinerary_place_id,
                    itinerary_particular,
                    itinerary_created_by,
                    itinerary_type,
                    itinerary_status,
                };
                itineraryId = yield conn.insertToursItineraries(itineryData);
                for (const item of vendors) {
                    const { itnrvendor_vendor_id } = item;
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(itnrvendor_vendor_id);
                    yield conn.insertToursItinerariesVendor(Object.assign(Object.assign({}, item), { itnrvendor_itinerary_id: itineraryId, itnrvendor_vendor_id: vendor_id, itnrvendor_combined_id: combined_id }));
                }
            }
            return {
                success: true,
                message: itineraryType + ' inserted successfully',
                data: itineraryId,
            };
        });
        this.updateTourTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const { itinerary_place_id, itinerary_particular, itinerary_updated_by, itinerary_status, vendors, } = req.body;
            const itinerary_id = req.params.id;
            const conn = this.models.TourItinerayModels(req);
            const itineryData = {
                itinerary_place_id,
                itinerary_particular,
                itinerary_updated_by,
                itinerary_status,
            };
            yield conn.updateToursItineraries(itineryData, itinerary_id);
            // DELETE PREVIOUS ITINERARY VENDOR
            yield conn.deleteToursItinerariesVendor(itinerary_id, itinerary_updated_by);
            for (const item of vendors) {
                const { itnrvendor_vendor_id } = item;
                const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(itnrvendor_vendor_id);
                yield conn.insertToursItinerariesVendor(Object.assign(Object.assign({}, item), { itnrvendor_itinerary_id: itinerary_id, itnrvendor_vendor_id: vendor_id, itnrvendor_combined_id: combined_id }));
            }
            return { success: true, data: 'Data updated successfully' };
        });
        this.viewToursItineraries = (req) => __awaiter(this, void 0, void 0, function* () {
            const itineraryType = req.params.type;
            const { page, size } = req.query;
            let itinerary_type;
            if (itineraryType === 'ticket') {
                itinerary_type = 'TICKETS';
            }
            else if (itineraryType === 'guide') {
                itinerary_type = 'GUIDES';
            }
            else if (itineraryType === 'other-transport') {
                itinerary_type = 'OTHER_TRANSPORTS';
            }
            else if (itineraryType === 'transport') {
                itinerary_type = 'TRANSPORTS';
            }
            else if (itineraryType === 'food') {
                itinerary_type = 'FOODS';
            }
            else {
                throw new customError_1.default('Provide itinarary type', 400, 'Invalid type');
            }
            const data = yield this.models
                .TourItinerayModels(req)
                .viewToursItineraries(itinerary_type, Number(page) || 1, Number(size) || 20);
            const count = yield this.models
                .TourItinerayModels(req)
                .countTourItinerariesDataRow(itinerary_type);
            return { success: true, count, data };
        });
        this.getAllTourTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const itineraryType = req.params.type;
            const { page, size } = req.query;
            let itinerary_type;
            if (itineraryType === 'ticket') {
                itinerary_type = 'TICKETS';
            }
            else if (itineraryType === 'guide') {
                itinerary_type = 'GUIDES';
            }
            else if (itineraryType === 'other-transport') {
                itinerary_type = 'OTHER_TRANSPORTS';
            }
            else if (itineraryType === 'transport') {
                itinerary_type = 'TRANSPORTS';
            }
            else if (itineraryType === 'food') {
                itinerary_type = 'FOODS';
            }
            else {
                throw new customError_1.default('Provide itinarary type', 400, 'Invalid type');
            }
            const data = yield this.models
                .TourItinerayModels(req)
                .getAllToursItineraries(itinerary_type, page, size);
            return Object.assign({ success: true }, data);
        });
        this.deleteTourTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { deleted_by } = req.body;
            yield this.models
                .TourItinerayModels(req)
                .deleteToursItineraries(id, deleted_by);
            return { success: true, data: 'Data deleted successfully' };
        });
        // =================== ACCOMMODATIONS
        this.createTourAccmmdtoins = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.TourItinerayModels(req);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                let accommodation_id = 0;
                for (const item of body) {
                    const { accommodation_city_id, accommodation_country_id, accommodation_hotel_name, accommodation_room_type_id, accommodation_pax_name, accommodation_created_by, vendors, accommodation_status, } = item;
                    const accommodation_data = {
                        accommodation_city_id,
                        accommodation_country_id,
                        accommodation_hotel_name,
                        accommodation_room_type_id,
                        accommodation_pax_name,
                        accommodation_created_by,
                        accommodation_status,
                    };
                    accommodation_id = yield conn.insertAccommodatioiins(accommodation_data);
                    const accommodation_acc_vendor = vendors.map((item) => {
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(item.accmvendor_vendor_id);
                        const data = {
                            accmvendor_accommodation_id: accommodation_id,
                            accmvendor_vendor_id: vendor_id,
                            accmvendor_combined_id: combined_id,
                            accmvendor_cost_price: item.accmvendor_cost_price,
                        };
                        return data;
                    });
                    yield conn.insertItinerariesAccmVendor(accommodation_acc_vendor);
                }
                return {
                    success: true,
                    message: 'Tour accomodation inserted successfully',
                    data: accommodation_id,
                };
            }));
        });
        this.updateTourAccmmdtoins = (req) => __awaiter(this, void 0, void 0, function* () {
            const { accommodation_city_id, accommodation_country_id, accommodation_hotel_name, accommodation_room_type_id, accommodation_pax_name, vendors, accommodation_updated_by, accommodation_status, } = req.body;
            const accommodation_id = req.params.id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.TourItinerayModels(req);
                const accommodation_data = {
                    accommodation_city_id,
                    accommodation_country_id,
                    accommodation_hotel_name,
                    accommodation_room_type_id,
                    accommodation_pax_name,
                    accommodation_updated_by,
                    accommodation_status,
                };
                // ======= DELETE PREVIOUS ACCMMDTION_ACC_VENDORS
                yield conn.deleteItinerariesAccmVendor(accommodation_id, accommodation_updated_by);
                // ===== INSERT NEW ACCMMDTION_ACC_VENDORS
                yield conn.updateAccommodatioiins(accommodation_data, accommodation_id);
                const accommodation_acc_vendor = vendors.map((item) => {
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(item.accmvendor_vendor_id);
                    const data = {
                        accmvendor_accommodation_id: accommodation_id,
                        accmvendor_vendor_id: vendor_id,
                        accmvendor_combined_id: combined_id,
                        accmvendor_cost_price: item.accmvendor_cost_price,
                    };
                    return data;
                });
                yield conn.insertItinerariesAccmVendor(accommodation_acc_vendor);
                return { success: true, data: 'Data updated successfully' };
            }));
        });
        this.deleteTourAccmmdtoins = (req) => __awaiter(this, void 0, void 0, function* () {
            const accommodation_id = req.params.id;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.TourItinerayModels(req, trx);
                yield conn.deleteItinerariesAccmVendor(accommodation_id, deleted_by);
                yield conn.deleteAccommodatioiins(accommodation_id, deleted_by);
                return { success: true, data: 'Data deleted successfully' };
            }));
        });
        this.viewAccommodatioiins = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models
                .TourItinerayModels(req)
                .viewAccommodatioiins();
            const count = yield this.models
                .TourItinerayModels(req)
                .countAccommodationsDataRow();
            return { success: true, count, data };
        });
        this.getAllAccommodation = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models
                .TourItinerayModels(req)
                .getAllAccommodatioiins();
            return { success: true, data };
        });
        this.getAllCountries = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.TourItinerayModels(req).getAllCountries();
            return { success: true, data };
        });
        this.getAllCityByCountries = (req) => __awaiter(this, void 0, void 0, function* () {
            const country_id = req.params.id;
            const data = yield this.models
                .TourItinerayModels(req)
                .getAllCityByCountries(country_id);
            return { success: true, data };
        });
        // ============= PLACES ============================
        this.insertPlaces = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield this.models.TourItinerayModels(req).insertToursPlaces(body);
            return { success: true, data: 'Data inserted successfully' };
        });
        this.updatePlaces = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = req.params.id;
            yield this.models.TourItinerayModels(req).updateToursPlaces(body, id);
            return { success: true, data: 'Data updated successfully' };
        });
        this.deletePlaces = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { deleted_by } = req.body;
            yield this.models.TourItinerayModels(req).deleteToursPlaces(id, deleted_by);
            return { success: true, data: 'Data deleted successfully' };
        });
        this.viewToursPlaces = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const data = yield this.models
                .TourItinerayModels(req)
                .viewToursPlaces(Number(page) || 1, Number(size) || 20, String(search || ''));
            const count = yield this.models
                .TourItinerayModels(req)
                .countToursPlacesDataRow();
            return { success: true, count, data };
        });
        this.getAllPlaces = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.TourItinerayModels(req).getAllToursPlaces();
            return { success: true, data };
        });
    }
}
exports.default = TourItinerayServices;
//# sourceMappingURL=TourItineray.services.js.map