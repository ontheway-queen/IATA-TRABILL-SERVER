import AbstractRouter from '../../../abstracts/abstract.routers';
import chequesControllers from '../controllers/cheques.controllers';

class chequesRoutes extends AbstractRouter {
  private controllers = new chequesControllers();
  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers
      .route('/')
      .get(this.controllers.getAllCheques)
      .patch(this.controllers.updateChequeStatus);
  }
}
export default chequesRoutes;
