import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceOther from '../controllers/invoiceOther.controllers';

class InivoiceOtherRouters extends AbstractRouter {
  private controllers = new InvoiceOther();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.get('/all', this.controllers.getAllInvoiceOther);
    this.routers.get('/view/:id', this.controllers.viewInvoiceOther);

    this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceOther);

    this.routers.post('/post', this.controllers.postInvoiceOther);
    this.routers.get('/transport-type', this.controllers.getTransportType);
    this.routers.get(
      '/refund-others/:id',
      this.controllers.getAllInvoiceOthersByClientId
    );

    this.routers.get(
      '/view/invoice-all-data-by-id/:id',
      this.controllers.getForEdit
    );

    this.routers.patch('/edit/:id', this.controllers.editInvoiceOther);
    this.routers.delete(
      '/delete/:invoice_id',
      this.controllers.deleteInvoiceOther
    );
  }
}

export default InivoiceOtherRouters;
