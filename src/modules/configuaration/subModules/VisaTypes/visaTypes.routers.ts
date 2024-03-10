import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersVisaTypes from './visaTypes.controllers';

class RoutersVisaTypes extends AbstractRouter {
  private controllersVisaTypes = new ControllersVisaTypes();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersVisaTypes.viewVisaType);

    this.routers.post('/create', this.controllersVisaTypes.createVisaType);

    this.routers.get('/view-all', this.controllersVisaTypes.getAllVisaType);

    this.routers.patch('/edit/:id', this.controllersVisaTypes.editVisaType);

    this.routers.delete(
      '/delete/:type_id',
      this.controllersVisaTypes.deleteVisaType
    );
  }
}

export default RoutersVisaTypes;
