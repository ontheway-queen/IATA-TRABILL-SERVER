import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersAgency from './agency.controllers';

class RoutersAgency extends AbstractRouter {
  private controllersAgency = new ControllersAgency();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersAgency.viewAgencies);

    this.routers.post('/create', this.controllersAgency.createControllerAgency);

    this.routers.get('/view-all', this.controllersAgency.getAgencies);

    this.routers.patch(
      '/update/:agency_id',
      this.controllersAgency.updateControllerAgency
    );

    this.routers.delete(
      '/delete/:agency_id',
      this.controllersAgency.deleteControllerAgency
    );
  }
}

export default RoutersAgency;
