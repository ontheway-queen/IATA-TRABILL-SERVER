import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceNonCommissionController from '../controllers/invoiceNonCommission.controllers';

class InvoiceNonCommission extends AbstractRouter {
  private controllers = new InvoiceNonCommissionController();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.put('/void/:invoice_id', this.controllers.voidNonCommission);

    this.routers
      .route('/')
      .post(this.controllers.addInvoiceNonCommission)
      .get(this.controllers.getAllInvoices);

    this.routers
      .route('/:invoice_id')
      .patch(this.controllers.editInvoiceNonCommission)
      .get(this.controllers.getDataForEdit)
      .delete(this.controllers.deleteNonComInvoice);

    this.routers.get('/view/:id', this.controllers.viewNoncommissioinDetails);
  }
}

export default InvoiceNonCommission;
