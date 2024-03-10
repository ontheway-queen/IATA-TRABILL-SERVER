import AbstractRouter from '../../abstracts/abstract.routers';
import FeedbackController from './feedback.controller';

class FeedbackRouter extends AbstractRouter {
  private controllers = new FeedbackController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers
      .route('/')
      .post(this.controllers.createFeedback)
      .get(this.controllers.getFeedbacks);
  }
}

export default FeedbackRouter;
