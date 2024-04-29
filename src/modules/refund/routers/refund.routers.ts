import AbstractRouter from '../../../abstracts/abstract.routers';
import RefundController from '../controllers/refund.controllers';

class RefundRouter extends AbstractRouter {
  private controllers = new RefundController();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    // air ticket refund
    this.routers
      .route('/air-ticket-refund')
      .post(this.controllers.addAirTicketRefund)
      .get(this.controllers.getAllAirTicketRefund);

    this.routers
      .route('/air-ticket-refund/:refund_id')
      .delete(this.controllers.deleteAirTicketRefund)
      .get(this.controllers.singleAirTicketRefund);

    this.routers.get(
      '/iat-description/:refund_id',
      this.controllers.getRefundDescription
    );

    this.routers.post('/ticket-infos', this.controllers.airTicketInfos);

    this.routers.get('/ticket-no/:id', this.controllers.getTicketNo);

    // client refund
    this.routers.get(
      '/other-refund-client/:client_id',
      this.controllers.invoiceOtherByClient
    );
    this.routers.get(
      '/other-billing-info/:invoice_id',
      this.controllers.getBillingInfo
    );

    // Other refund
    this.routers
      .route('/other-refund')
      .post(this.controllers.addOtherRefund)
      .get(this.controllers.getAllRefunds);

    this.routers
      .route('/other-refund/:refund_id')
      .get(this.controllers.singleOtherRefund)
      .delete(this.controllers.deleteOtherRefund);
    // PARTIAL REFUND
    this.routers
      .route('/partial-refund')
      .post(this.controllers.addPartialRefund)
      .get(this.controllers.getPersialRefund);

    this.routers
      .route('/partial-refund/:refund_id')
      .delete(this.controllers.DeletePartialRefund)
      .get(this.controllers.getSinglePersialRefund);

    this.routers.get(
      '/partial-refundable-ticket/:comb_client',
      this.controllers.getPersialRefundTickets
    );

    this.routers.post(
      '/get_partial_refund_info',
      this.controllers.getPartialAirticketInfo
    );

    this.routers.get(
      '/get_partial_ticket_by_invoice/:invoice_id',
      this.controllers.getPersialRefundTicketsByInvoice
    );

    // vendor refund
    this.routers.get(
      '/other-refund/vendor/:vendor_id',
      this.controllers.invoiceOtherByVendor
    );
    this.routers.get(
      '/other-refund-info/vendor/:vendor_id',
      this.controllers.getRefundInfoVendor
    );

    this.routers.get('/tax-refunds', this.controllers.allTaxRefund);
    this.routers.get(
      '/tax-refunds/:refund_id',
      this.controllers.viewAirTicketTaxRefund
    );
    this.routers.delete(
      '/tax-refunds/:refund_id',
      this.controllers.deleteAirTicketTaxRefund
    );
    // tour refund
    this.routers.get('/invoice-tour/:client', this.controllers.getTourInvoice);
    this.routers
      .route('/invoice-tour-refund')
      .post(this.controllers.addTourPackRefund)
      .get(this.controllers.getAllTourPackRefund);

    this.routers
      .route('/invoice-tour-refund/:refund_id')
      .delete(this.controllers.deleteTourPackRefund)
      .get(this.controllers.viewTourForEdit);
  }
}

export default RefundRouter;
