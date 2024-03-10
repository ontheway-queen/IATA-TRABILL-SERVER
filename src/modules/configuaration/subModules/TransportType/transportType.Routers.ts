import AbstractRouter from '../../../../abstracts/abstract.routers';
import TransportTypeControllers from './transportType.controllers';

class TransportTypeRouter extends AbstractRouter {
  private controller = new TransportTypeControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controller.viewTransportTypes);

    this.routers.post('/create', this.controller.createTransportType);

    this.routers.get('/all', this.controller.getAllTransportTypes);

    this.routers.delete('/delete/:id', this.controller.deleteTransportType);

    this.routers.patch('/update/:id', this.controller.updateTransportType);
  }
}

export default TransportTypeRouter;
