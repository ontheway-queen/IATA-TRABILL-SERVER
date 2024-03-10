import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersAirports from './airports.controllers';

class RoutersAirports extends AbstractRouter {
  private controllersAirports = new ControllersAirports();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersAirports.viewAirports);

    this.routers.post('/create', this.controllersAirports.createAirports);

    this.routers.get(
      '/view-one/:id',
      this.controllersAirports.viewAirportsById
    );

    this.routers.get('/view-all', this.controllersAirports.viewAllAirports);

    this.routers.delete(
      '/delete/:airline_id',
      this.controllersAirports.deleteAirportsById
    );

    this.routers.get(
      '/view-all-countries',
      this.controllersAirports.viewAllCountries
    );

    this.routers.patch('/:id', this.controllersAirports.editAirportsById);
  }
}

export default RoutersAirports;
