import AbstractRouter from '../../../abstracts/abstract.routers';
import QuotationControllers from '../controllers/quotation.controllers';

class QuotationRouter extends AbstractRouter {
  private controllers = new QuotationControllers();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.route('/products').get(this.controllers.products);

    this.routers
      .route('/')
      .post(this.controllers.createQuotation)
      .get(this.controllers.allQuotations);

    this.routers
      .route('/:quotation_id')
      .post(this.controllers.postQuotationOnConfirm)
      .get(this.controllers.singleQuotation)
      .patch(this.controllers.editQuotation)
      .delete(this.controllers.deleteQuotation);

    this.routers.get('/bill-infos/:quotation_id', this.controllers.billInfos);
  }
}

export default QuotationRouter;
