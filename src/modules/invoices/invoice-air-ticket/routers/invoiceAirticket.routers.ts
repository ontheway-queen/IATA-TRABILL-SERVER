import AbstractRouter from '../../../../abstracts/abstract.routers';
import InvoiceAirticketController from '../controllers/invoiceAirticket.controllers';

class InvoiceAirTicketRouter extends AbstractRouter {
  private controllers = new InvoiceAirticketController();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.get('/pnr-details/:pnr', this.controllers.pnrDetails);
    this.routers.post('/pnr', this.controllers.addInvoiceWithPnr);

    this.routers.get(
      '/all-invoiceno-and-id',
      this.controllers.getAllInvoicesNumAndId
    );

    this.routers.get('/client-due/:id', this.controllers.getClientDue);

    this.routers.get(
      '/is-exist/:ticket',
      this.controllers.isTicketAlreadyExist
    );

    this.routers.get(
      '/view-invoice-activity/:id',
      this.controllers.getInvoiceAcitivity
    );

    // ========= INVOICE AIR TICKET ==============

    this.routers.get(
      '/invoice-details-for-void/:invoice_id',
      this.controllers.getInvoiceInfoForVoid
    );

    this.routers.get(
      '/payment/:invoice_id',
      this.controllers.getInvoiceClientPayment
    );

    this.routers.put(
      '/void/:invoice_id',
      this.controllers.voidInvoiceAirticket
    );

    this.routers
      .route('/')
      .post(this.controllers.postInvoiceAirticket)
      .get(this.controllers.getAllInvoices);

    this.routers
      .route('/:invoice_id')
      .get(this.controllers.getDataForEdit)
      .patch(this.controllers.eidtInvioceAirticket)
      .delete(this.controllers.deleteInvoiceAirTicket);

    this.routers.get(
      '/view/:invoice_id',
      this.controllers.viewCommonInvoiceDetails
    );

    this.routers.post('/send-email/:invoice_id', this.controllers.sendEmail);

    // AIR TICKET CUSTOM REPORT GENERATE
    this.routers.post('/custom-report', this.controllers.airTicketCustomReport);

    // AIR TICKET TAX REFUND
    this.routers.get(
      '/tax-refund/:invoice_id',
      this.controllers.selectAirTicketTax
    );
    this.routers.post('/tax-refund', this.controllers.addAirTicketTax);

    this.routers.get(
      '/discount/:invoice_id',
      this.controllers.getInvoiceDiscount
    );

    this.routers
      .route('/info/:invoice_id')
      .get(this.controllers.getInvoiceInfo)
      .delete(this.controllers.deleteInvoiceInfo);
    this.routers.post('/info', this.controllers.addInvoiceInfo);
  }
}

export default InvoiceAirTicketRouter;
