import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceTourController from '../controllers/InvoiceTour.controllers';

class InvoiceTourRouters extends AbstractRouter {
  private controllers = new InvoiceTourController();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceTour);

    this.routers.get('/costing/:invoice_id', this.controllers.viewITourPackage);

    this.routers.get(
      '/tour/billing/:invoice_id',
      this.controllers.getTourBillingInfo
    );

    this.routers.get('/view/:invoice_id', this.controllers.viewITourPackage);

    this.routers.post(
      '/costing/add/:invoice_id',
      this.controllers.addCostingTourPackage
    );
    this.routers
      .route('/')
      .post(this.controllers.createInvoiceTour)
      .get(this.controllers.getAllInvoiceTour);

    this.routers
      .route('/:invoice_id')
      .get(this.controllers.getForEdit)
      .patch(this.controllers.editInvoiceTour)
      .delete(this.controllers.deleteResetInvoiceTour);
  }
}

export default InvoiceTourRouters;
