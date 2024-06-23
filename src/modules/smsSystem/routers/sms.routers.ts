import AbstractRouter from '../../../abstracts/abstract.routers';
import SmsControllers from '../controllers/sms.controllers';

class SmsRouter extends AbstractRouter {
  private controllers = new SmsControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    // create sms
    this.routers.route('/').post(this.controllers.createSms);

    this.routers.get('/all', this.controllers.getSms);

    this.routers.get('/balance', this.controllers.getSmsBalance);
  }
}

export default SmsRouter;
