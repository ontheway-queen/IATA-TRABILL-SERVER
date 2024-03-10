import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceHajjControllers from '../Controllers/InvoiceHajj.Controllers';

class InvoiceHajjRouters extends AbstractRouter {
  private controllers = new InvoiceHajjControllers();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/all/:id', this.controllers.getAllInvoiceHajj);
    this.routers.get('/view/:id', this.controllers.viewInvoiceHajj);

    this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceHajj);

    this.routers.get('/billing_info/:invoice_id', this.controllers.getHajjInfo);

    this.routers.route('/refund').post(this.controllers.createHajjRefund);
    this.routers.get(
      '/refund/:invoice_id',
      this.controllers.getHajjInvoiceRefund
    );

    this.routers.post('/post', this.controllers.postInvoiceHajj);
    this.routers.patch('/edit/:id', this.controllers.editInvoiceHajj);
    this.routers.delete(
      '/:type/:invoice_id',
      this.controllers.deleteInvoiceHajj
    );
    this.routers.get('/get-for-edit/:id', this.controllers.getDataForEdit);
  }
}

export default InvoiceHajjRouters;
