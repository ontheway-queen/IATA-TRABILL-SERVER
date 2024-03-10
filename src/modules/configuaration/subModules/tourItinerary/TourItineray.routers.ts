import AbstractRouter from '../../../../abstracts/abstract.routers';
import TourItinerayControllers from './TourItineray.controllers';

class TourItinerayRouters extends AbstractRouter {
  private controller = new TourItinerayControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    // =============== GROUP ====================
    this.routers.get('/vendor/info/:id', this.controller.getTourVendorsInfo);
    this.routers.get(
      '/accm-vendor/info/:id',
      this.controller.getTourVendorByAccmId
    );

    this.routers.get('/group', this.controller.viewTourGroups);
    this.routers.post('/group/create', this.controller.createTourGroups);
    this.routers.patch('/group/update/:id', this.controller.updateTourGroups);
    this.routers.delete('/group/delete/:id', this.controller.deleteTourGroups);
    this.routers.get('/group/get-all', this.controller.getAllTourGroups);
    this.routers.get('/group/get/:id', this.controller.getByIdTourGorup);
    // =============== PLACE ====================
    this.routers.get('/places', this.controller.viewToursPlaces);
    this.routers.post('/places/create', this.controller.insertPlaces);
    this.routers.patch('/places/update/:id', this.controller.updatePlaces);
    this.routers.delete('/places/delete/:id', this.controller.deletePlaces);
    this.routers.get('/places/get-all', this.controller.getAllPlaces);
    this.routers.get('/places/get/:id', this.controller.getByIdTourGorup);
    // =============== CITIES ====================
    this.routers.get('/cities', this.controller.viewToursCities);
    this.routers.post('/cities/create', this.controller.createTourCities);
    this.routers.patch('/cities/update/:id', this.controller.updateTourCity);
    this.routers.delete('/cities/delete/:id', this.controller.deleteTourCity);
    this.routers.get('/cities/get-all', this.controller.getAllCitites);
    this.routers.get('/cities/get/:id', this.controller.getByIdCity);
    this.routers.get(
      '/cities/by-country/:id',
      this.controller.getAllCityByCountries
    );

    // =============== ACCOMMODATION ====================
    this.routers.post(
      '/accommodation/create',
      this.controller.createTourAccmmdtoins
    );
    this.routers.get('/all-countries', this.controller.getAllCountries);
    this.routers.patch(
      '/accommodation/update/:id',
      this.controller.updateTourAccmmdtoins
    );
    this.routers.delete(
      '/accommodation/delete/:id',
      this.controller.deleteTourAccmmdtoins
    );
    this.routers.get(
      '/accommodation/get-all',
      this.controller.getAllAccommodation
    );
    this.routers.get('/accommodation', this.controller.viewAccommodatioiins);

    // =============== TICKETS ====================
    this.routers.post('/:type/create', this.controller.createTourTicket);
    this.routers.patch('/:type/update/:id', this.controller.updateTourTicket);
    this.routers.delete('/:type/delete/:id', this.controller.deleteTourTicket);
    this.routers.get('/:type/get-all', this.controller.getAllTourTicket);
    this.routers.get('/:type/get/:id', this.controller.getByIdCity);

    // PAGINATION ADDED TICKET
    this.routers.get('/:type', this.controller.viewToursItineraries);
  }
}

export default TourItinerayRouters;
