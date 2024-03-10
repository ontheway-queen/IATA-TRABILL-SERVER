import AbstractRouter from '../../../../abstracts/abstract.routers';
import ReIssueAirticket from '../controllers/invoiceReissue.controllers';

class ReIssueAirticketRoutes extends AbstractRouter {
  private controllers = new ReIssueAirticket();

  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    this.routers.put('/void/:invoice_id', this.controllers.voidReissue);

    // GET REISSUE TICKET INFO FOR REFUND REISSUE
    this.routers.get(
      '/ticket-info/:invoice_id',
      this.controllers.getReissueTicketInfo
    );
    this.routers.post('/refund', this.controllers.reissueRefund);
    this.routers.get(
      '/refund/:invoice_id',
      this.controllers.getReissueRefundInfo
    );

    this.routers.post('/post/existing', this.controllers.addExistingClient);
    this.routers.get('/view/:invoice_id', this.controllers.viewReissue);

    this.routers.get(
      '/existing-client/:client_id',
      this.controllers.getExistingClientAirticket
    );

    this.routers.patch(
      '/post/existing-edit/:invoice_id',
      this.controllers.editExistingCl
    );

    this.routers
      .route('/')
      .post(this.controllers.addReissueAirticket)
      .get(this.controllers.getAllReissue);

    this.routers
      .route('/:invoice_id')
      .get(this.controllers.getDataForEdit)
      .patch(this.controllers.editReissueAirticket)
      .delete(this.controllers.deleteReissue);
  }
}

export default ReIssueAirticketRoutes;
