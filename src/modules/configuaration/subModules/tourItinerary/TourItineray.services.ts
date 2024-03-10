import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import CustomError from '../../../../common/utils/errors/customError';
import {
  IAccmmdtinsReq,
  ICities,
  IITineraries,
  IitinerariesAccmVendors,
  itineraryType,
  ITourGroups,
  ITourPlaces,
  IToursAccommodations,
  ITourTicketReq,
} from '../../types/configuration.interfaces';
import { idType } from '../../../../common/types/common.types';

class TourItinerayServices extends AbstractServices {
  constructor() {
    super();
  }

  public createTourGroups = async (req: Request) => {
    const insertBody = req.body as ITourGroups[];

    const data = await this.models
      .TourItinerayModels(req)
      .insertTourGroups(insertBody);

    return { success: true, data };
  };

  public updateTourGroups = async (req: Request) => {
    const insertBody = req.body as ITourGroups[];
    const groupId = req.params.id;

    await this.models
      .TourItinerayModels(req)
      .editTourGroups(insertBody, groupId);

    return { success: true, data: 'tour group updated successfully' };
  };

  public deleteTourGroups = async (req: Request) => {
    const groupId = req.params.id;
    const { deleted_by } = req.body as { deleted_by: number };
    await this.models
      .TourItinerayModels(req)
      .deleteTourGroups(groupId, deleted_by);
    return { success: true, data: 'tour group deleted successfully' };
  };

  public viewTourGroups = async (req: Request) => {
    const { page, size, search } = req.query;

    const data = await this.models
      .TourItinerayModels(req)
      .viewTourGroups(
        Number(page) || 1,
        Number(size) || 20,
        String(search || '')
      );

    const count = await this.models.TourItinerayModels(req).countTourGroup();

    return { success: true, count, data };
  };

  public getAllTourGroups = async (req: Request) => {
    const data = await this.models.TourItinerayModels(req).getAllTourGroups();
    return { success: true, data };
  };

  public getTourGroupById = async (req: Request) => {
    const groupId = req.params.id;
    const data = await this.models
      .TourItinerayModels(req)
      .getByIdTourGroup(groupId);
    return { success: true, data };
  };

  public getTourVendorsInfo = async (req: Request) => {
    const itinararyId = req.params.id;
    const data = await this.models
      .TourItinerayModels(req)
      .getTourVendorByItineraryId(itinararyId);
    return { success: true, data };
  };

  public getTourVendorByAccmId = async (req: Request) => {
    const itinararyId = req.params.id;
    const data = await this.models
      .TourItinerayModels(req)
      .getTourVendorByAccmId(itinararyId);
    return { success: true, data };
  };

  // =============CITIES==============
  public createCities = async (req: Request) => {
    const insertBody = req.body as ICities[];

    const data = await this.models
      .TourItinerayModels(req)
      .insertToursCities(insertBody);

    return { success: true, data };
  };

  public updateCities = async (req: Request) => {
    const insertBody = req.body as ICities;
    const cityId = req.params.id;

    await this.models
      .TourItinerayModels(req)
      .updateToursCities(insertBody, cityId);

    return { success: true, data: 'City updated successfully' };
  };

  public deleteCities = async (req: Request) => {
    const cityId = req.params.id;

    const { deleted_by } = req.body as { deleted_by: number };

    await this.models
      .TourItinerayModels(req)
      .deleteToursCities(cityId, deleted_by);

    return { success: true, data: 'City deleted successfully' };
  };

  public viewToursCities = async (req: Request) => {
    const { page, size, search } = req.query;

    const data = await this.models
      .TourItinerayModels(req)
      .viewToursCities(
        Number(page) || 1,
        Number(size) || 20,
        String(search || '')
      );

    const count = await this.models
      .TourItinerayModels(req)
      .countTourCitiesDataRow();

    return { success: true, count, data };
  };

  public getAllCitites = async (req: Request) => {
    const data = await this.models.TourItinerayModels(req).getAllToursCities();
    return { success: true, data };
  };

  public getByIdCity = async (req: Request) => {
    const cityId = req.params.id;
    const data = await this.models
      .TourItinerayModels(req)
      .getByIdToursCities(cityId);
    return { success: true, data };
  };

  // ==================== ITINERARIES - TICKETS , GUIDES, TRANSPORT, FOOD
  public createTourTicket = async (req: Request) => {
    const reqBody = req.body as ITourTicketReq[];
    const itineraryType = req.params.type;
    let itinerary_type: itineraryType;
    if (itineraryType === 'ticket') {
      itinerary_type = 'TICKETS';
    } else if (itineraryType === 'guide') {
      itinerary_type = 'GUIDES';
    } else if (itineraryType === 'transport') {
      itinerary_type = 'TRANSPORTS';
    } else if (itineraryType === 'other-transport') {
      itinerary_type = 'OTHER_TRANSPORTS';
    } else if (itineraryType === 'food') {
      itinerary_type = 'FOODS';
    } else {
      throw new CustomError('Provide itinarary type', 400, 'Invalid type');
    }
    const conn = this.models.TourItinerayModels(req);
    let itineraryId;

    for (const item of reqBody) {
      const {
        itinerary_place_id,
        itinerary_particular,
        itinerary_created_by,
        itinerary_status,
        vendors,
      } = item;

      const itineryData = {
        itinerary_place_id,
        itinerary_particular,
        itinerary_created_by,
        itinerary_type,
        itinerary_status,
      };

      itineraryId = await conn.insertToursItineraries(
        itineryData as IITineraries
      );

      for (const item of vendors) {
        const { itnrvendor_vendor_id } = item;

        const { combined_id, vendor_id } =
          separateCombClientToId(itnrvendor_vendor_id);

        await conn.insertToursItinerariesVendor({
          ...item,
          itnrvendor_itinerary_id: itineraryId,
          itnrvendor_vendor_id: vendor_id,
          itnrvendor_combined_id: combined_id,
        });
      }
    }

    return {
      success: true,
      message: itineraryType + ' inserted successfully',
      data: itineraryId,
    };
  };

  public updateTourTicket = async (req: Request) => {
    const {
      itinerary_place_id,
      itinerary_particular,
      itinerary_updated_by,
      itinerary_status,
      vendors,
    } = req.body as ITourTicketReq;
    const itinerary_id = req.params.id;
    const conn = this.models.TourItinerayModels(req);
    const itineryData = {
      itinerary_place_id,
      itinerary_particular,
      itinerary_updated_by,
      itinerary_status,
    };
    await conn.updateToursItineraries(
      itineryData as IITineraries,
      itinerary_id
    );
    // DELETE PREVIOUS ITINERARY VENDOR
    await conn.deleteToursItinerariesVendor(
      itinerary_id,
      itinerary_updated_by as number
    );

    for (const item of vendors) {
      const { itnrvendor_vendor_id } = item;

      const { combined_id, vendor_id } =
        separateCombClientToId(itnrvendor_vendor_id);

      await conn.insertToursItinerariesVendor({
        ...item,
        itnrvendor_itinerary_id: itinerary_id,
        itnrvendor_vendor_id: vendor_id,
        itnrvendor_combined_id: combined_id,
      });
    }

    return { success: true, data: 'Data updated successfully' };
  };

  public viewToursItineraries = async (req: Request) => {
    const itineraryType = req.params.type;

    const { page, size } = req.query;

    let itinerary_type: itineraryType;
    if (itineraryType === 'ticket') {
      itinerary_type = 'TICKETS';
    } else if (itineraryType === 'guide') {
      itinerary_type = 'GUIDES';
    } else if (itineraryType === 'other-transport') {
      itinerary_type = 'OTHER_TRANSPORTS';
    } else if (itineraryType === 'transport') {
      itinerary_type = 'TRANSPORTS';
    } else if (itineraryType === 'food') {
      itinerary_type = 'FOODS';
    } else {
      throw new CustomError('Provide itinarary type', 400, 'Invalid type');
    }

    const data = await this.models
      .TourItinerayModels(req)
      .viewToursItineraries(
        itinerary_type,
        Number(page) || 1,
        Number(size) || 20
      );

    const count = await this.models
      .TourItinerayModels(req)
      .countTourItinerariesDataRow(itinerary_type);

    return { success: true, count, data };
  };

  public getAllTourTicket = async (req: Request) => {
    const itineraryType = req.params.type;

    const { page, size } = req.query as { page: idType; size: idType };

    let itinerary_type: itineraryType;
    if (itineraryType === 'ticket') {
      itinerary_type = 'TICKETS';
    } else if (itineraryType === 'guide') {
      itinerary_type = 'GUIDES';
    } else if (itineraryType === 'other-transport') {
      itinerary_type = 'OTHER_TRANSPORTS';
    } else if (itineraryType === 'transport') {
      itinerary_type = 'TRANSPORTS';
    } else if (itineraryType === 'food') {
      itinerary_type = 'FOODS';
    } else {
      throw new CustomError('Provide itinarary type', 400, 'Invalid type');
    }

    const data = await this.models
      .TourItinerayModels(req)
      .getAllToursItineraries(itinerary_type, page as number, size as number);
    return { success: true, ...data };
  };

  public deleteTourTicket = async (req: Request) => {
    const id = req.params.id;
    const { deleted_by } = req.body as { deleted_by: number };

    await this.models
      .TourItinerayModels(req)
      .deleteToursItineraries(id, deleted_by);
    return { success: true, data: 'Data deleted successfully' };
  };

  // =================== ACCOMMODATIONS

  public createTourAccmmdtoins = async (req: Request) => {
    const body = req.body as IAccmmdtinsReq[];
    const conn = this.models.TourItinerayModels(req);

    return await this.models.db.transaction(async (trx) => {
      let accommodation_id: number = 0;

      for (const item of body) {
        const {
          accommodation_city_id,
          accommodation_country_id,
          accommodation_hotel_name,
          accommodation_room_type_id,
          accommodation_pax_name,
          accommodation_created_by,
          vendors,
          accommodation_status,
        } = item;

        const accommodation_data: IToursAccommodations = {
          accommodation_city_id,
          accommodation_country_id,
          accommodation_hotel_name,
          accommodation_room_type_id,
          accommodation_pax_name,
          accommodation_created_by,
          accommodation_status,
        };

        accommodation_id = await conn.insertAccommodatioiins(
          accommodation_data
        );

        const accommodation_acc_vendor = vendors.map((item) => {
          const { combined_id, vendor_id } = separateCombClientToId(
            item.accmvendor_vendor_id as string
          );

          const data: IitinerariesAccmVendors = {
            accmvendor_accommodation_id: accommodation_id,
            accmvendor_vendor_id: vendor_id as number,
            accmvendor_combined_id: combined_id,
            accmvendor_cost_price: item.accmvendor_cost_price,
          };

          return data;
        });

        await conn.insertItinerariesAccmVendor(accommodation_acc_vendor);
      }

      return {
        success: true,
        message: 'Tour accomodation inserted successfully',
        data: accommodation_id,
      };
    });
  };

  public updateTourAccmmdtoins = async (req: Request) => {
    const {
      accommodation_city_id,
      accommodation_country_id,
      accommodation_hotel_name,
      accommodation_room_type_id,
      accommodation_pax_name,
      vendors,
      accommodation_updated_by,
      accommodation_status,
    } = req.body as IAccmmdtinsReq;
    const accommodation_id = req.params.id;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.TourItinerayModels(req);

      const accommodation_data: IToursAccommodations = {
        accommodation_city_id,
        accommodation_country_id,
        accommodation_hotel_name,
        accommodation_room_type_id,
        accommodation_pax_name,
        accommodation_updated_by,
        accommodation_status,
      };

      // ======= DELETE PREVIOUS ACCMMDTION_ACC_VENDORS
      await conn.deleteItinerariesAccmVendor(
        accommodation_id,
        accommodation_updated_by as number
      );

      // ===== INSERT NEW ACCMMDTION_ACC_VENDORS
      await conn.updateAccommodatioiins(accommodation_data, accommodation_id);

      const accommodation_acc_vendor: IitinerariesAccmVendors[] = vendors.map(
        (item) => {
          const { combined_id, vendor_id } = separateCombClientToId(
            item.accmvendor_vendor_id as string
          );
          const data = {
            accmvendor_accommodation_id: accommodation_id,
            accmvendor_vendor_id: vendor_id as number,
            accmvendor_combined_id: combined_id as number,
            accmvendor_cost_price: item.accmvendor_cost_price as number,
          };

          return data;
        }
      );

      await conn.insertItinerariesAccmVendor(accommodation_acc_vendor);

      return { success: true, data: 'Data updated successfully' };
    });
  };
  public deleteTourAccmmdtoins = async (req: Request) => {
    const accommodation_id = req.params.id;
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.TourItinerayModels(req, trx);
      await conn.deleteItinerariesAccmVendor(accommodation_id, deleted_by);
      await conn.deleteAccommodatioiins(accommodation_id, deleted_by);

      return { success: true, data: 'Data deleted successfully' };
    });
  };

  public viewAccommodatioiins = async (req: Request) => {
    const data = await this.models
      .TourItinerayModels(req)
      .viewAccommodatioiins();

    const count = await this.models
      .TourItinerayModels(req)
      .countAccommodationsDataRow();

    return { success: true, count, data };
  };

  public getAllAccommodation = async (req: Request) => {
    const data = await this.models
      .TourItinerayModels(req)
      .getAllAccommodatioiins();
    return { success: true, data };
  };

  public getAllCountries = async (req: Request) => {
    const data = await this.models.TourItinerayModels(req).getAllCountries();
    return { success: true, data };
  };
  public getAllCityByCountries = async (req: Request) => {
    const country_id = req.params.id;
    const data = await this.models
      .TourItinerayModels(req)
      .getAllCityByCountries(country_id);
    return { success: true, data };
  };

  // ============= PLACES ============================
  public insertPlaces = async (req: Request) => {
    const body = req.body as ITourPlaces[];
    await this.models.TourItinerayModels(req).insertToursPlaces(body);
    return { success: true, data: 'Data inserted successfully' };
  };
  public updatePlaces = async (req: Request) => {
    const body = req.body as ITourPlaces;
    const id = req.params.id;
    await this.models.TourItinerayModels(req).updateToursPlaces(body, id);
    return { success: true, data: 'Data updated successfully' };
  };
  public deletePlaces = async (req: Request) => {
    const id = req.params.id;
    const { deleted_by } = req.body as { deleted_by: number };
    await this.models.TourItinerayModels(req).deleteToursPlaces(id, deleted_by);
    return { success: true, data: 'Data deleted successfully' };
  };

  public viewToursPlaces = async (req: Request) => {
    const { page, size, search } = req.query;

    const data = await this.models
      .TourItinerayModels(req)
      .viewToursPlaces(
        Number(page) || 1,
        Number(size) || 20,
        String(search || '')
      );

    const count = await this.models
      .TourItinerayModels(req)
      .countToursPlacesDataRow();

    return { success: true, count, data };
  };

  public getAllPlaces = async (req: Request) => {
    const data = await this.models.TourItinerayModels(req).getAllToursPlaces();
    return { success: true, data };
  };
}

export default TourItinerayServices;
