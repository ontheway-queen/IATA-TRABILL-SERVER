import { Request } from 'express-serve-static-core';
import AbstractServices from '../../abstracts/abstract.services';
import { IFeedback } from './feedback.interfaces';

class feedbackServices extends AbstractServices {
  public createFeedback = async (req: Request) => {
    const body = req.body as IFeedback;

    const conn = this.models.feedbackModels(req);

    const data = await conn.createFeedback(body);

    const message = 'Feedback has been created';
    return {
      success: true,
      message: message,
      id: data,
    };
  };

  public getFeedbacks = async (req: Request) => {
    const { page, size, search } = req.query as {
      page: string;
      size: string;
      search: string;
    };

    const conn = this.models.feedbackModels(req);

    const data = await conn.getFeedbacks(
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    const message = 'All Feedback list';
    return {
      success: true,
      message: message,
      ...data,
    };
  };
}

export default feedbackServices;
