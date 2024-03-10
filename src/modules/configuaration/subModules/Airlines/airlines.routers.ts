import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersAirlines from './airlines.controllers';

class RoutersAirlines extends AbstractRouter {
  private controllersAirlines = new ControllersAirlines();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersAirlines.viewAirlines);

    this.routers.post(
      '/create',
      this.controllersAirlines.createControllerAirlines
    );

    this.routers.get('/read', this.controllersAirlines.readControllerAirline);

    this.routers.patch(
      '/update/:airline_id',
      this.controllersAirlines.updateControllerAirline
    );

    this.routers.delete(
      '/delete/:airline_id',
      this.controllersAirlines.deleteControllerAirLines
    );
  }
}

export default RoutersAirlines;
