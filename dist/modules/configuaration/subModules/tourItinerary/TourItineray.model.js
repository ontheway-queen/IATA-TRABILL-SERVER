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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class TourItinerayModels extends abstract_models_1.default {
    // ====================== GROUPS ============================
    insertTourGroups(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const data of datas) {
                const [id] = yield this.query()
                    .insert(Object.assign(Object.assign({}, data), { group_org_agency: this.org_agency }))
                    .into('trabill_tours_groups');
                return id;
            }
        });
    }
    editTourGroups(data, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tourGroup = yield this.query()
                .update(data)
                .into('trabill_tours_groups')
                .where('group_id', groupId)
                .whereNot('group_org_agency', null);
            if (!tourGroup) {
                throw new customError_1.default('Pleace provide valid id for edit tour gorup', 400, 'Invalid group id');
            }
        });
    }
    deleteTourGroups(groupId, group_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const tourGroup = yield this.query()
                .update({ group_is_deleted: 1, group_deleted_by })
                .into('trabill_tours_groups')
                .where('group_id', groupId)
                .whereNot('group_org_agency', null);
            if (!tourGroup) {
                throw new customError_1.default('Pleace provide valid id for edit tour gorup', 400, 'Invalid group id');
            }
        });
    }
    viewTourGroups(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('group_id', 'group_name', 'group_maximum_pax_allowed', 'group_create_date', 'group_update_date', 'group_created_by', 'group_updated_by', 'group_status', 'group_org_agency as agency_id')
                .from('trabill_tours_groups')
                .where('group_is_deleted', 0)
                .modify((event) => {
                if (search) {
                    event.andWhereILike('group_name', `%${search}%`);
                }
            })
                .andWhere('group_org_agency', this.org_agency)
                .orderBy('group_id', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countTourGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_tours_groups')
                .where('group_is_deleted', 0)
                .andWhere('group_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllTourGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('group_id', 'group_name', 'group_maximum_pax_allowed', 'group_create_date', 'group_update_date', 'group_created_by', 'group_updated_by', 'group_status', 'group_org_agency as agency_id')
                .from('trabill_tours_groups')
                .whereNot('group_is_deleted', 1)
                .andWhere('group_org_agency', this.org_agency)
                .orderBy('group_id', 'desc');
        });
    }
    getByIdTourGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tourGroup = yield this.query()
                .select('*')
                .from('trabill_tours_groups')
                .where('group_id', groupId);
            if (!tourGroup) {
                throw new customError_1.default('Pleace provide valid id for edit tour gorup', 400, 'Invalid group id');
            }
            return tourGroup[0];
        });
    }
    // ====================== PLACES =========================
    insertToursPlaces(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const data of datas) {
                const [id] = yield this.query()
                    .insert(Object.assign(Object.assign({}, data), { place_org_agency: this.org_agency }))
                    .into('trabill_tours_places');
                return id;
            }
        });
    }
    updateToursPlaces(data, placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_tours_places')
                .where('place_id', placeId)
                .whereNot('place_org_agency', null);
        });
    }
    deleteToursPlaces(placeId, place_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ place_is_deleted: 1, place_deleted_by })
                .into('trabill_tours_places')
                .where('place_id', placeId)
                .whereNotNull('place_org_agency');
        });
    }
    viewToursPlaces(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('place_id', 'place_country_id', 'place_city_id', 'place_name', 'place_create_date', 'place_status', 'country_name', 'city_name', 'place_org_agency as agency_id')
                .from('trabill_tours_places')
                .leftJoin('trabill_countries', { place_country_id: 'country_id' })
                .leftJoin('trabill_cities', { place_city_id: 'city_id' })
                .whereNot('place_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event.andWhereILike('group_name', `%${search}%`);
                }
            })
                .andWhere('place_org_agency', this.org_agency)
                .orderBy('place_id', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countToursPlacesDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_tours_places')
                .whereNot('place_is_deleted', 1)
                .andWhere('place_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllToursPlaces() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('place_id', 'place_country_id', 'place_city_id', 'place_name', 'place_create_date', 'place_status', 'country_name', 'city_name', 'place_org_agency as agency_id')
                .from('trabill_tours_places')
                .leftJoin('trabill_countries', { place_country_id: 'country_id' })
                .leftJoin('trabill_cities', { place_city_id: 'city_id' })
                .whereNot('place_is_deleted', 1)
                .andWhere('place_org_agency', this.org_agency)
                .orderBy('place_id', 'desc');
        });
    }
    getByIdToursPlaces(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_tours_places')
                .where('place_id', placeId);
            return data[0];
        });
    }
    // ====================== CITIES =========================
    insertToursCities(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const data of datas) {
                const [id] = yield this.query()
                    .insert(Object.assign(Object.assign({}, data), { city_org_agency: this.org_agency }))
                    .into('trabill_cities');
                return id;
            }
        });
    }
    updateToursCities(data, cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_cities')
                .where('city_id', cityId)
                .andWhereNot('city_org_agency', null);
        });
    }
    deleteToursCities(cityId, city_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ city_is_deleted: 1, city_deleted_by })
                .into('trabill_cities')
                .where('city_id', cityId)
                .whereNot('city_org_agency', null);
        });
    }
    viewToursCities(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('city_id', 'city_country_id', 'city_name', 'city_country_id', 'country_name', 'city_create_date', 'city_status', 'city_org_agency as agency_id')
                .from('trabill_cities')
                .leftJoin('trabill_countries', { city_country_id: 'country_id' })
                .where('city_org_agency', null)
                .modify((event) => {
                if (search) {
                    event.andWhereILike('trabill_cities.city_name', `%${search}%`);
                }
            })
                .orWhere('city_org_agency', this.org_agency)
                .andWhereNot('city_is_deleted', 1)
                .orderBy('city_id', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countTourCitiesDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_cities')
                .where('city_org_agency', null)
                .orWhere('city_org_agency', this.org_agency)
                .andWhereNot('city_is_deleted', 1);
            return count.row_count;
        });
    }
    getAllToursCities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('city_id', 'city_country_id', 'city_name', 'city_country_id', 'country_name', 'city_create_date', 'city_status', 'city_org_agency as agency_id')
                .from('trabill_cities')
                .leftJoin('trabill_countries', { city_country_id: 'country_id' })
                .where('city_org_agency', null)
                .orWhere('city_org_agency', this.org_agency)
                .andWhereNot('city_is_deleted', 1)
                .orderBy('city_id', 'desc');
        });
    }
    getByIdToursCities(cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_cities')
                .where('city_id', cityId)
                .andWhereNot('city_is_deleted', 1);
            return data[0];
        });
    }
    // ====================== ITINERARY =========================
    insertToursItineraries(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { itinerary_org_agency: this.org_agency }))
                .into('trabill_tours_itineraries');
            return id[0];
        });
    }
    updateToursItineraries(data, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_tours_itineraries')
                .where('itinerary_id', ticketId)
                .whereNotNull('itinerary_org_agency');
        });
    }
    deleteToursItineraries(ticketId, itinerary_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ itinerary_is_deleted: 1, itinerary_deleted_by })
                .into('trabill_tours_itineraries')
                .where('itinerary_id', ticketId)
                .whereNotNull('itinerary_org_agency');
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't delete this itinerary provide that id you was created`, 400, 'Bad ID');
            }
        });
    }
    viewToursItineraries(itinerary_type, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const itinerary = yield this.query()
                .select('itinerary_id', 'itinerary_type', 'itinerary_place_id', 'itinerary_particular', 'itinerary_create_date', 'itinerary_status', 'place_name', 'itinerary_org_agency as agency_id')
                .from('trabill_tours_itineraries')
                .where('itinerary_org_agency', this.org_agency)
                .andWhere('itinerary_type', itinerary_type)
                .andWhereNot('itinerary_is_deleted', 1)
                .leftJoin('trabill_tours_places', { itinerary_place_id: 'place_id' })
                .orderBy('itinerary_id', 'desc')
                .limit(size)
                .offset(page_number);
            const data = [];
            for (const item of itinerary) {
                const itineraryVedor = yield this.query()
                    .select('vendor_id', this.db.raw('COALESCE(tcl.combine_name, tv.vendor_name) AS vendor_name'), 'vendor_mobile', 'itnrvendor_cost_price')
                    .from('trabill_tours_itineraries_vendors')
                    .leftJoin('trabill_combined_clients as tcl', 'tcl.combine_id', 'itnrvendor_combined_id')
                    .whereNot('itnrvendor_is_deleted', 1)
                    .andWhere('itnrvendor_itinerary_id', item.itinerary_id)
                    .leftJoin('trabill_vendors as tv', {
                    'tv.vendor_id': 'itnrvendor_vendor_id',
                });
                data.push(Object.assign(Object.assign({}, item), { itinerary_vendor: itineraryVedor }));
            }
            return data;
        });
    }
    countTourItinerariesDataRow(itinerary_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_tours_itineraries')
                .where('itinerary_type', itinerary_type)
                .andWhereNot('itinerary_is_deleted', 1)
                .andWhere('itinerary_org_agency', null)
                .orWhere('itinerary_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllToursItineraries(itinerary_type, page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const itinerary = yield this.query()
                .select('itinerary_id', 'itinerary_type', 'itinerary_place_id', 'itinerary_particular', 'itinerary_create_date', 'itinerary_status', 'place_name', 'itinerary_org_agency as agency_id')
                .from('trabill_tours_itineraries')
                .whereNot('itinerary_is_deleted', 1)
                .leftJoin('trabill_tours_places', { itinerary_place_id: 'place_id' })
                .andWhere('itinerary_type', itinerary_type)
                .andWhere('itinerary_org_agency', this.org_agency)
                .orderBy('itinerary_id', 'desc')
                .limit(size)
                .offset(offset);
            const data = [];
            for (const item of itinerary) {
                const itineraryVedor = yield this.query()
                    .select('vendor_id', this.db.raw('COALESCE(tcl.combine_name, tv.vendor_name) AS vendor_name'), 'vendor_mobile', 'itnrvendor_cost_price')
                    .from('trabill_tours_itineraries_vendors')
                    .leftJoin('trabill_combined_clients as tcl', 'tcl.combine_id', 'itnrvendor_combined_id')
                    .whereNot('itnrvendor_is_deleted', 1)
                    .andWhere('itnrvendor_itinerary_id', item.itinerary_id)
                    .leftJoin('trabill_vendors as tv', {
                    'tv.vendor_id': 'itnrvendor_vendor_id',
                });
                data.push(Object.assign(Object.assign({}, item), { itinerary_vendor: itineraryVedor }));
            }
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_tours_itineraries')
                .whereNot('itinerary_is_deleted', 1)
                .andWhere('itinerary_type', itinerary_type)
                .andWhere('itinerary_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    // TOUR ITINERARIES VENDOR
    insertToursItinerariesVendor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { itnrvendor_org_agency: this.org_agency }))
                .into('trabill_tours_itineraries_vendors');
            return id[0];
        });
    }
    deleteToursItinerariesVendor(itinrVendorId, itnrvendor_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ itnrvendor_is_deleted: 1, itnrvendor_deleted_by })
                .into('trabill_tours_itineraries_vendors')
                .where('itnrvendor_itinerary_id', itinrVendorId);
        });
    }
    getTourVendorByItineraryId(itineraryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('trabill_tours_itineraries_vendors.*', 'vendor_name')
                .from('trabill_tours_itineraries_vendors')
                .leftJoin('trabill_vendors', { vendor_id: 'itnrvendor_vendor_id' })
                .where('itnrvendor_itinerary_id', itineraryId)
                .andWhereNot('itnrvendor_is_deleted', 1);
            return data;
        });
    }
    getTourVendorByAccmId(accmId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('trabill_tours_itineraries_accm_vendors.*', 'vendor_name')
                .from('trabill_tours_itineraries_accm_vendors')
                .leftJoin('trabill_vendors', { vendor_id: 'accmvendor_vendor_id' })
                .where('accmvendor_accommodation_id', accmId)
                .andWhereNot('accmvendor_is_deleted', 1);
            return data;
        });
    }
    // ========================== ACCOMMODATIONS
    insertAccommodatioiins(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { accommodation_org_agency: this.org_agency }))
                .into('trabill_tours_accommodations');
            return id[0];
        });
    }
    updateAccommodatioiins(data, accommodation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const itenary = yield this.query()
                .update(data)
                .into('trabill_tours_accommodations')
                .where('accommodation_id', accommodation_id)
                .whereNotNull('accommodation_org_agency');
            if (itenary) {
                return itenary;
            }
            else {
                throw new customError_1.default(`You can't update this accommodation provide that id you was created`, 400, 'Bad ID');
            }
        });
    }
    deleteAccommodatioiins(accommodation_id, accommodation_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ accommodation_is_deleted: 1, accommodation_deleted_by })
                .into('trabill_tours_accommodations')
                .where('accommodation_id', accommodation_id)
                .whereNotNull('accommodation_org_agency');
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't delete this accommodation provide that id you was created`, 400, 'Bad ID');
            }
        });
    }
    getByIdAccommodatioiins(accommodation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .select('*')
                .from('trabill_tours_accommodations')
                .where('accommodation_id', accommodation_id)
                .andWhereNot('accommodation_is_deleted', 1);
        });
    }
    viewAccommodatioiins() {
        return __awaiter(this, void 0, void 0, function* () {
            const accommodations = yield this.query()
                .select('accommodation_id', 'accommodation_hotel_name', 'accommodation_pax_name', 'accommodation_create_date', 'accommodation_status', 'city_name', 'country_name', 'accommodation_country_id', 'accommodation_city_id', 'accommodation_room_type_id', 'rtype_name')
                .from('trabill_tours_accommodations')
                .orderBy('accommodation_id', 'desc')
                .leftJoin('trabill_cities', { accommodation_city_id: 'city_id' })
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_tours_accommodations.accommodation_country_id',
            })
                .leftJoin('trabill_room_types', {
                'trabill_room_types.rtype_id': 'trabill_tours_accommodations.accommodation_room_type_id',
            })
                .whereNot('accommodation_is_deleted', 1)
                .andWhere('accommodation_org_agency', this.org_agency);
            const data = [];
            // ========== VENDORS
            for (const item of accommodations) {
                const itineraryVedor = yield this.query()
                    .select(this.db.raw("IF(accmvendor_vendor_id IS NOT NULL, CONCAT('vendor-', accmvendor_vendor_id), CONCAT('combine-', accmvendor_combined_id)) AS vendor_id"), this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'vendor_mobile', 'accmvendor_accommodation_id', 'accmvendor_cost_price', 'accmvendor_vendor_id')
                    .from('trabill_tours_itineraries_accm_vendors as accm')
                    .where('accmvendor_accommodation_id', item.accommodation_id)
                    .andWhereNot('accmvendor_is_deleted', 1)
                    .leftJoin('trabill_combined_clients as tcc', {
                    combine_id: 'accm.accmvendor_combined_id',
                })
                    .leftJoin('trabill_vendors as tv', {
                    'tv.vendor_id': 'accm.accmvendor_vendor_id',
                });
                data.push(Object.assign(Object.assign({}, item), { itinerary_vendor: itineraryVedor }));
            }
            return data;
        });
    }
    countAccommodationsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_tours_accommodations')
                .whereNot('accommodation_is_deleted', 1)
                .andWhere('accommodation_org_agency', null)
                .orWhere('accommodation_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllAccommodatioiins() {
        return __awaiter(this, void 0, void 0, function* () {
            const accommodations = yield this.query()
                .select('accommodation_id', 'accommodation_hotel_name', 'accommodation_pax_name', 'accommodation_create_date', 'accommodation_status', 'city_name', 'country_name', 'accommodation_country_id', 'accommodation_city_id', 'accommodation_room_type_id', 'rtype_name')
                .from('trabill_tours_accommodations')
                .orderBy('accommodation_id', 'desc')
                .leftJoin('trabill_cities', { accommodation_city_id: 'city_id' })
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_tours_accommodations.accommodation_country_id',
            })
                .leftJoin('trabill_room_types', {
                'trabill_room_types.rtype_id': 'trabill_tours_accommodations.accommodation_room_type_id',
            })
                .whereNot('accommodation_is_deleted', 1)
                .andWhere('accommodation_org_agency', this.org_agency);
            const data = [];
            // ========== VENDORS
            for (const item of accommodations) {
                const itineraryVedor = yield this.query()
                    .select(this.db.raw("IF(accmvendor_vendor_id IS NOT NULL, CONCAT('vendor-', accmvendor_vendor_id), CONCAT('combine-', accmvendor_combined_id)) AS vendor_id"), this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'vendor_mobile', 'accmvendor_accommodation_id', 'accmvendor_cost_price', 'accmvendor_vendor_id')
                    .from('trabill_tours_itineraries_accm_vendors as accm')
                    .where('accmvendor_accommodation_id', item.accommodation_id)
                    .andWhereNot('accmvendor_is_deleted', 1)
                    .leftJoin('trabill_combined_clients as tcc', {
                    combine_id: 'accm.accmvendor_combined_id',
                })
                    .leftJoin('trabill_vendors as tv', {
                    'tv.vendor_id': 'accm.accmvendor_vendor_id',
                });
                data.push(Object.assign(Object.assign({}, item), { itinerary_vendor: itineraryVedor }));
            }
            return data;
        });
    }
    insertItinerariesAccmVendor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(data)
                .into('trabill_tours_itineraries_accm_vendors');
        });
    }
    deleteItinerariesAccmVendor(accmmdId, accmvendor_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ accmvendor_is_deleted: 1, accmvendor_deleted_by })
                .into('trabill_tours_itineraries_accm_vendors')
                .where('accmvendor_accommodation_id', accmmdId);
        });
    }
    // COUNTRIES
    getAllCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('trabill_countries')
                .where('countries_org_agency', null)
                .orWhere('countries_org_agency', this.org_agency)
                .andWhereNot('country_is_deleted', 1)
                .orderBy('country_id', 'desc');
        });
    }
    getAllCityByCountries(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('trabill_cities')
                .where('city_country_id', countryId)
                .andWhere('city_org_agency', null)
                .orWhere('city_org_agency', this.org_agency)
                .andWhereNot('city_is_deleted', 1)
                .orderBy('city_id', 'desc');
        });
    }
}
exports.default = TourItinerayModels;
//# sourceMappingURL=TourItineray.model.js.map