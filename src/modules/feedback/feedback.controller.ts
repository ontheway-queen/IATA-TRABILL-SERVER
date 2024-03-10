import { Request, Response } from 'express';
import AbstractController from '../../abstracts/abstract.controllers';
import feedbackServices from './feedback.services';
import FeedbackValidator from './feedback.validators';

class FeedbackController extends AbstractController {
  private services = new feedbackServices();
  private validator = new FeedbackValidator();

  public createFeedback = this.assyncWrapper.wrap(
    this.validator.createFeedback,
    async (req: Request, res: Response) => {
      const data = await this.services.createFeedback(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Create Feedback');
      }
    }
  );

  public getFeedbacks = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getFeedbacks(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Get all feedback');
      }
    }
  );
}

export default FeedbackController;
