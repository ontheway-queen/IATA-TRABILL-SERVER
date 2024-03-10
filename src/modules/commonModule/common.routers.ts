import AbstractRouter from '../../abstracts/abstract.routers';
import CommonControllers from './common.controllers';

class CommonRouters extends AbstractRouter {
  public conroller = new CommonControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/voucher/:type', this.conroller.generateVoucher);
  }
}

export default CommonRouters;
