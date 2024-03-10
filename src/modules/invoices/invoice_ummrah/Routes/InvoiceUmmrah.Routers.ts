import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceHajjControllers from '../Controllers/InvoiceUmmrah.Controllers';

class InvoiceUmmrah extends AbstractRouter {
  private controllers = new InvoiceHajjControllers();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/view/:invoice_id', this.controllers.viewInvoiceUmmrah);
    this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceUmmrah);

    this.routers
      .route('/')
      .post(this.controllers.postInvoiceUmmrah)
      .get(this.controllers.getAllInvoiceUmmrah);

    this.routers.get(
      '/billing_info/:invoice_id',
      this.controllers.getBillingInfo
    );

    this.routers.post('/refund', this.controllers.createUmmrahRefund);

    this.routers.get('/refund/:invoice_id', this.controllers.getUmmrahRefund);

    this.routers
      .route('/:invoice_id')
      .get(this.controllers.getDataForEdit)
      .patch(this.controllers.editInvoiceUmmrah)
      .delete(this.controllers.deleteInvoiceUmmrah);
  }
}

export default InvoiceUmmrah;
