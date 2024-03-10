import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import {
  ICities,
  IITineraries,
  IitinerariesAccmVendors,
  IITinerariesVendorDb,
  itineraryType,
  ITourGroups,
  ITourPlaces,
  IToursAccommodations,
} from '../../types/configuration.interfaces';

class TourItinerayModels extends AbstractModels {
  // ====================== GROUPS ============================
  public async insertTourGroups(datas: ITourGroups[]) {
    for (const data of datas) {
      const [id] = await this.query()
        .insert({ ...data, group_org_agency: this.org_agency })
        .into('trabill_tours_groups');

      return id;
    }
  }

  public async editTourGroups(data: ITourGroups[], groupId: idType) {
    const tourGroup = await this.query()
      .update(data)
      .into('trabill_tours_groups')
      .where('group_id', groupId)
      .whereNot('group_org_agency', null);

    if (!tourGroup) {
      throw new CustomError(
        'Pleace provide valid id for edit tour gorup',
        400,
        'Invalid group id'
      );
    }
  }
  public async deleteTourGroups(groupId: idType, group_deleted_by: idType) {
    const tourGroup = await this.query()
      .update({ group_is_deleted: 1, group_deleted_by })
      .into('trabill_tours_groups')
      .where('group_id', groupId)
      .whereNot('group_org_agency', null);

    if (!tourGroup) {
      throw new CustomError(
        'Pleace provide valid id for edit tour gorup',
        400,
        'Invalid group id'
      );
    }
  }

  public async viewTourGroups(page: number, size: number, search: string) {
    const page_number = (page - 1) * size;

    return await this.query()
      .select(
        'group_id',
        'group_name',
        'group_maximum_pax_allowed',
        'group_create_date',
        'group_update_date',
        'group_created_by',
        'group_updated_by',
        'group_status',
        'group_org_agency as agency_id'
      )
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
  }

  public async countTourGroup() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_tours_groups')
      .where('group_is_deleted', 0)
      .andWhere('group_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllTourGroups() {
    return await this.query()
      .select(
        'group_id',
        'group_name',
        'group_maximum_pax_allowed',
        'group_create_date',
        'group_update_date',
        'group_created_by',
        'group_updated_by',
        'group_status',
        'group_org_agency as agency_id'
      )
      .from('trabill_tours_groups')
      .whereNot('group_is_deleted', 1)
      .andWhere('group_org_agency', this.org_agency)
      .orderBy('group_id', 'desc');
  }

  public async getByIdTourGroup(groupId: idType) {
    const tourGroup = await this.query()
      .select('*')
      .from('trabill_tours_groups')
      .where('group_id', groupId);

    if (!tourGroup) {
      throw new CustomError(
        'Pleace provide valid id for edit tour gorup',
        400,
        'Invalid group id'
      );
    }

    return tourGroup[0];
  }

  // ====================== PLACES =========================
  public async insertToursPlaces(datas: ITourPlaces[]) {
    for (const data of datas) {
      const [id] = await this.query()
        .insert({ ...data, place_org_agency: this.org_agency })
        .into('trabill_tours_places');
      return id;
    }
  }
  public async updateToursPlaces(data: ITourPlaces, placeId: idType) {
    await this.query()
      .update(data)
      .into('trabill_tours_places')
      .where('place_id', placeId)
      .whereNot('place_org_agency', null);
  }
  public async deleteToursPlaces(placeId: idType, place_deleted_by: idType) {
    await this.query()
      .update({ place_is_deleted: 1, place_deleted_by })
      .into('trabill_tours_places')
      .where('place_id', placeId)
      .whereNotNull('place_org_agency');
  }

  public async viewToursPlaces(page: number, size: number, search: string) {
    const page_number = (page - 1) * size;
    return await this.query()
      .select(
        'place_id',
        'place_country_id',
        'place_city_id',
        'place_name',
        'place_create_date',
        'place_status',
        'country_name',
        'city_name',
        'place_org_agency as agency_id'
      )
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
  }

  public async countToursPlacesDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_tours_places')
      .whereNot('place_is_deleted', 1)
      .andWhere('place_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllToursPlaces() {
    return await this.query()
      .select(
        'place_id',
        'place_country_id',
        'place_city_id',
        'place_name',
        'place_create_date',
        'place_status',
        'country_name',
        'city_name',
        'place_org_agency as agency_id'
      )
      .from('trabill_tours_places')
      .leftJoin('trabill_countries', { place_country_id: 'country_id' })
      .leftJoin('trabill_cities', { place_city_id: 'city_id' })
      .whereNot('place_is_deleted', 1)
      .andWhere('place_org_agency', this.org_agency)
      .orderBy('place_id', 'desc');
  }

  public async getByIdToursPlaces(placeId: idType) {
    const data = await this.query()
      .select('*')
      .from('trabill_tours_places')
      .where('place_id', placeId);

    return data[0];
  }

  // ====================== CITIES =========================
  public async insertToursCities(datas: ICities[]) {
    for (const data of datas) {
      const [id] = await this.query()
        .insert({ ...data, city_org_agency: this.org_agency })
        .into('trabill_cities');
      return id;
    }
  }
  public async updateToursCities(data: ICities, cityId: idType) {
    await this.query()
      .update(data)
      .into('trabill_cities')
      .where('city_id', cityId)
      .andWhereNot('city_org_agency', null);
  }

  public async deleteToursCities(cityId: idType, city_deleted_by: idType) {
    await this.query()
      .update({ city_is_deleted: 1, city_deleted_by })
      .into('trabill_cities')
      .where('city_id', cityId)
      .whereNot('city_org_agency', null);
  }

  public async viewToursCities(page: number, size: number, search: string) {
    const page_number = (page - 1) * size;

    return await this.query()
      .select(
        'city_id',
        'city_country_id',
        'city_name',
        'city_country_id',
        'country_name',
        'city_create_date',
        'city_status',
        'city_org_agency as agency_id'
      )
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
  }

  public async countTourCitiesDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_cities')
      .where('city_org_agency', null)
      .orWhere('city_org_agency', this.org_agency)
      .andWhereNot('city_is_deleted', 1);

    return count.row_count;
  }

  public async getAllToursCities() {
    return await this.query()
      .select(
        'city_id',
        'city_country_id',
        'city_name',
        'city_country_id',
        'country_name',
        'city_create_date',
        'city_status',
        'city_org_agency as agency_id'
      )
      .from('trabill_cities')
      .leftJoin('trabill_countries', { city_country_id: 'country_id' })
      .where('city_org_agency', null)
      .orWhere('city_org_agency', this.org_agency)
      .andWhereNot('city_is_deleted', 1)
      .orderBy('city_id', 'desc');
  }

  public async getByIdToursCities(cityId: idType) {
    const data = await this.query()
      .select('*')
      .from('trabill_cities')
      .where('city_id', cityId)
      .andWhereNot('city_is_deleted', 1);

    return data[0];
  }
  // ====================== ITINERARY =========================
  public async insertToursItineraries(data: IITineraries) {
    const id = await this.query()
      .insert({ ...data, itinerary_org_agency: this.org_agency })
      .into('trabill_tours_itineraries');
    return id[0];
  }
  public async updateToursItineraries(data: IITineraries, ticketId: idType) {
    await this.query()
      .update(data)
      .into('trabill_tours_itineraries')
      .where('itinerary_id', ticketId)
      .whereNotNull('itinerary_org_agency');
  }
  public async deleteToursItineraries(
    ticketId: idType,
    itinerary_deleted_by: idType
  ) {
    const data = await this.query()
      .update({ itinerary_is_deleted: 1, itinerary_deleted_by })
      .into('trabill_tours_itineraries')
      .where('itinerary_id', ticketId)
      .whereNotNull('itinerary_org_agency');

    if (data) {
      return data;
    } else {
      throw new CustomError(
        `You can't delete this itinerary provide that id you was created`,
        400,
        'Bad ID'
      );
    }
  }
  public async viewToursItineraries(
    itinerary_type: itineraryType,
    page: number,
    size: number
  ) {
    const page_number = (page - 1) * size;

    const itinerary = await this.query()
      .select(
        'itinerary_id',
        'itinerary_type',
        'itinerary_place_id',
        'itinerary_particular',
        'itinerary_create_date',
        'itinerary_status',
        'place_name',
        'itinerary_org_agency as agency_id'
      )
      .from('trabill_tours_itineraries')
      .where('itinerary_org_agency', this.org_agency)
      .andWhere('itinerary_type', itinerary_type)
      .andWhereNot('itinerary_is_deleted', 1)
      .leftJoin('trabill_tours_places', { itinerary_place_id: 'place_id' })
      .orderBy('itinerary_id', 'desc')
      .limit(size)
      .offset(page_number);

    const data: { itinerary_id: number }[] = [];

    for (const item of itinerary) {
      const itineraryVedor = await this.query()
        .select(
          'vendor_id',
          this.db.raw(
            'COALESCE(tcl.combine_name, tv.vendor_name) AS vendor_name'
          ),
          'vendor_mobile',
          'itnrvendor_cost_price'
        )
        .from('trabill_tours_itineraries_vendors')
        .leftJoin(
          'trabill_combined_clients as tcl',
          'tcl.combine_id',
          'itnrvendor_combined_id'
        )
        .whereNot('itnrvendor_is_deleted', 1)
        .andWhere('itnrvendor_itinerary_id', item.itinerary_id)
        .leftJoin('trabill_vendors as tv', {
          'tv.vendor_id': 'itnrvendor_vendor_id',
        });

      data.push({ ...item, itinerary_vendor: itineraryVedor });
    }

    return data;
  }

  public async countTourItinerariesDataRow(itinerary_type: itineraryType) {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_tours_itineraries')
      .where('itinerary_type', itinerary_type)
      .andWhereNot('itinerary_is_deleted', 1)
      .andWhere('itinerary_org_agency', null)
      .orWhere('itinerary_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllToursItineraries(
    itinerary_type: itineraryType,
    page: number = 1,
    size: number = 20
  ) {
    const offset = (page - 1) * size;
    const itinerary = await this.query()
      .select(
        'itinerary_id',
        'itinerary_type',
        'itinerary_place_id',
        'itinerary_particular',
        'itinerary_create_date',
        'itinerary_status',
        'place_name',
        'itinerary_org_agency as agency_id'
      )
      .from('trabill_tours_itineraries')
      .whereNot('itinerary_is_deleted', 1)
      .leftJoin('trabill_tours_places', { itinerary_place_id: 'place_id' })
      .andWhere('itinerary_type', itinerary_type)
      .andWhere('itinerary_org_agency', this.org_agency)
      .orderBy('itinerary_id', 'desc')
      .limit(size)
      .offset(offset);

    const data: { itinerary_id: number }[] = [];

    for (const item of itinerary) {
      const itineraryVedor = await this.query()
        .select(
          'vendor_id',
          this.db.raw(
            'COALESCE(tcl.combine_name, tv.vendor_name) AS vendor_name'
          ),
          'vendor_mobile',
          'itnrvendor_cost_price'
        )
        .from('trabill_tours_itineraries_vendors')
        .leftJoin(
          'trabill_combined_clients as tcl',
          'tcl.combine_id',
          'itnrvendor_combined_id'
        )
        .whereNot('itnrvendor_is_deleted', 1)
        .andWhere('itnrvendor_itinerary_id', item.itinerary_id)
        .leftJoin('trabill_vendors as tv', {
          'tv.vendor_id': 'itnrvendor_vendor_id',
        });

      data.push({ ...item, itinerary_vendor: itineraryVedor });
    }

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_tours_itineraries')
      .whereNot('itinerary_is_deleted', 1)
      .andWhere('itinerary_type', itinerary_type)
      .andWhere('itinerary_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  // TOUR ITINERARIES VENDOR
  public async insertToursItinerariesVendor(
    data: IITinerariesVendorDb[] | IITinerariesVendorDb
  ) {
    const id = await this.query()
      .insert({ ...data, itnrvendor_org_agency: this.org_agency })
      .into('trabill_tours_itineraries_vendors');
    return id[0];
  }

  public async deleteToursItinerariesVendor(
    itinrVendorId: idType,
    itnrvendor_deleted_by: idType
  ) {
    await this.query()
      .update({ itnrvendor_is_deleted: 1, itnrvendor_deleted_by })
      .into('trabill_tours_itineraries_vendors')
      .where('itnrvendor_itinerary_id', itinrVendorId);
  }

  public async getTourVendorByItineraryId(itineraryId: idType) {
    const data = await this.query()
      .select('trabill_tours_itineraries_vendors.*', 'vendor_name')
      .from('trabill_tours_itineraries_vendors')
      .leftJoin('trabill_vendors', { vendor_id: 'itnrvendor_vendor_id' })
      .where('itnrvendor_itinerary_id', itineraryId)
      .andWhereNot('itnrvendor_is_deleted', 1);

    return data;
  }

  public async getTourVendorByAccmId(accmId: idType) {
    const data = await this.query()
      .select('trabill_tours_itineraries_accm_vendors.*', 'vendor_name')
      .from('trabill_tours_itineraries_accm_vendors')
      .leftJoin('trabill_vendors', { vendor_id: 'accmvendor_vendor_id' })
      .where('accmvendor_accommodation_id', accmId)
      .andWhereNot('accmvendor_is_deleted', 1);

    return data;
  }

  // ========================== ACCOMMODATIONS
  public async insertAccommodatioiins(data: IToursAccommodations) {
    const id = await this.query()
      .insert({ ...data, accommodation_org_agency: this.org_agency })
      .into('trabill_tours_accommodations');
    return id[0];
  }

  public async updateAccommodatioiins(
    data: IToursAccommodations,
    accommodation_id: idType
  ) {
    const itenary = await this.query()
      .update(data)
      .into('trabill_tours_accommodations')
      .where('accommodation_id', accommodation_id)
      .whereNotNull('accommodation_org_agency');

    if (itenary) {
      return itenary;
    } else {
      throw new CustomError(
        `You can't update this accommodation provide that id you was created`,
        400,
        'Bad ID'
      );
    }
  }

  public async deleteAccommodatioiins(
    accommodation_id: idType,
    accommodation_deleted_by: idType
  ) {
    const data = await this.query()
      .update({ accommodation_is_deleted: 1, accommodation_deleted_by })
      .into('trabill_tours_accommodations')
      .where('accommodation_id', accommodation_id)
      .whereNotNull('accommodation_org_agency');

    if (data) {
      return data;
    } else {
      throw new CustomError(
        `You can't delete this accommodation provide that id you was created`,
        400,
        'Bad ID'
      );
    }
  }
  public async getByIdAccommodatioiins(accommodation_id: idType) {
    await this.query()
      .select('*')
      .from('trabill_tours_accommodations')
      .where('accommodation_id', accommodation_id)
      .andWhereNot('accommodation_is_deleted', 1);
  }

  public async viewAccommodatioiins() {
    const accommodations = await this.query()
      .select(
        'accommodation_id',
        'accommodation_hotel_name',
        'accommodation_pax_name',
        'accommodation_create_date',
        'accommodation_status',
        'city_name',
        'country_name',
        'accommodation_country_id',
        'accommodation_city_id',
        'accommodation_room_type_id',
        'rtype_name'
      )
      .from('trabill_tours_accommodations')
      .orderBy('accommodation_id', 'desc')
      .leftJoin('trabill_cities', { accommodation_city_id: 'city_id' })
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id':
          'trabill_tours_accommodations.accommodation_country_id',
      })

      .leftJoin('trabill_room_types', {
        'trabill_room_types.rtype_id':
          'trabill_tours_accommodations.accommodation_room_type_id',
      })
      .whereNot('accommodation_is_deleted', 1)
      .andWhere('accommodation_org_agency', this.org_agency);

    const data: { itinerary_id: number }[] = [];

    // ========== VENDORS

    for (const item of accommodations) {
      const itineraryVedor = await this.query()
        .select(
          this.db.raw(
            "IF(accmvendor_vendor_id IS NOT NULL, CONCAT('vendor-', accmvendor_vendor_id), CONCAT('combine-', accmvendor_combined_id)) AS vendor_id"
          ),
          this.db.raw(
            'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
          ),

          'vendor_mobile',
          'accmvendor_accommodation_id',
          'accmvendor_cost_price',
          'accmvendor_vendor_id'
        )
        .from('trabill_tours_itineraries_accm_vendors as accm')
        .where('accmvendor_accommodation_id', item.accommodation_id)
        .andWhereNot('accmvendor_is_deleted', 1)
        .leftJoin('trabill_combined_clients as tcc', {
          combine_id: 'accm.accmvendor_combined_id',
        })
        .leftJoin('trabill_vendors as tv', {
          'tv.vendor_id': 'accm.accmvendor_vendor_id',
        });

      data.push({ ...item, itinerary_vendor: itineraryVedor });
    }

    return data;
  }

  public async countAccommodationsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_tours_accommodations')
      .whereNot('accommodation_is_deleted', 1)
      .andWhere('accommodation_org_agency', null)
      .orWhere('accommodation_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllAccommodatioiins() {
    const accommodations = await this.query()
      .select(
        'accommodation_id',
        'accommodation_hotel_name',
        'accommodation_pax_name',
        'accommodation_create_date',
        'accommodation_status',
        'city_name',
        'country_name',
        'accommodation_country_id',
        'accommodation_city_id',
        'accommodation_room_type_id',
        'rtype_name'
      )
      .from('trabill_tours_accommodations')
      .orderBy('accommodation_id', 'desc')
      .leftJoin('trabill_cities', { accommodation_city_id: 'city_id' })
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id':
          'trabill_tours_accommodations.accommodation_country_id',
      })

      .leftJoin('trabill_room_types', {
        'trabill_room_types.rtype_id':
          'trabill_tours_accommodations.accommodation_room_type_id',
      })
      .whereNot('accommodation_is_deleted', 1)
      .andWhere('accommodation_org_agency', this.org_agency);

    const data: { itinerary_id: number }[] = [];

    // ========== VENDORS

    for (const item of accommodations) {
      const itineraryVedor = await this.query()
        .select(
          this.db.raw(
            "IF(accmvendor_vendor_id IS NOT NULL, CONCAT('vendor-', accmvendor_vendor_id), CONCAT('combine-', accmvendor_combined_id)) AS vendor_id"
          ),
          this.db.raw(
            'COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'
          ),

          'vendor_mobile',
          'accmvendor_accommodation_id',
          'accmvendor_cost_price',
          'accmvendor_vendor_id'
        )
        .from('trabill_tours_itineraries_accm_vendors as accm')
        .where('accmvendor_accommodation_id', item.accommodation_id)
        .andWhereNot('accmvendor_is_deleted', 1)
        .leftJoin('trabill_combined_clients as tcc', {
          combine_id: 'accm.accmvendor_combined_id',
        })
        .leftJoin('trabill_vendors as tv', {
          'tv.vendor_id': 'accm.accmvendor_vendor_id',
        });

      data.push({ ...item, itinerary_vendor: itineraryVedor });
    }

    return data;
  }

  public async insertItinerariesAccmVendor(data: IitinerariesAccmVendors[]) {
    return await this.query()
      .insert(data)
      .into('trabill_tours_itineraries_accm_vendors');
  }
  public async deleteItinerariesAccmVendor(
    accmmdId: idType,
    accmvendor_deleted_by: idType
  ) {
    return await this.query()
      .update({ accmvendor_is_deleted: 1, accmvendor_deleted_by })
      .into('trabill_tours_itineraries_accm_vendors')
      .where('accmvendor_accommodation_id', accmmdId);
  }
  // COUNTRIES
  public async getAllCountries() {
    return await this.query()
      .select('*')
      .from('trabill_countries')
      .where('countries_org_agency', null)
      .orWhere('countries_org_agency', this.org_agency)
      .andWhereNot('country_is_deleted', 1)
      .orderBy('country_id', 'desc');
  }
  public async getAllCityByCountries(countryId: idType) {
    return await this.query()
      .select('*')
      .from('trabill_cities')
      .where('city_country_id', countryId)
      .andWhere('city_org_agency', null)
      .orWhere('city_org_agency', this.org_agency)
      .andWhereNot('city_is_deleted', 1)
      .orderBy('city_id', 'desc');
  }
}

export default TourItinerayModels;
