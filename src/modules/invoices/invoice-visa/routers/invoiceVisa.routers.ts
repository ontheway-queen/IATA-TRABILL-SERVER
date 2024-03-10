import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceVisa from '../controllers/invoiceVisa.controllers';

class InvoiceVisaRouters extends AbstractRouter {
  private controllers = new InvoiceVisa();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceVisa);

    this.routers
      .route('/')
      .post(this.controllers.addInvoiceVisa)
      .get(this.controllers.getAllInvoiceVisa);

    this.routers
      .route('/:invoice_id')
      .get(this.controllers.getForEdit)
      .patch(this.controllers.editInvoiceVisa)
      .delete(this.controllers.deleteInvoiceVisa);

    this.routers.patch(
      '/status/:billing_id',
      this.controllers.updateBillingStatus
    );

    this.routers.get('/view/:invoice_id', this.controllers.viewInvoiceVisa);
  }
}

export default InvoiceVisaRouters;
