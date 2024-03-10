import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesExpenseHead extends AbstractServices {
  constructor() {
    super();
  }

  public CreateExpenseHead = async (req: Request) => {
    const data = await this.models.configModel
      .expenseHeadModel(req)
      .createExpenseHead(req.body);

    return { success: true, data: { head_id: data } };
  };

  public UpdateExpenseHead = async (req: Request) => {
    const { head_id } = req.params;

    const data = await this.models.configModel
      .expenseHeadModel(req)
      .editExpenseHead(req.body, head_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }

    return { success: true, data };
  };

  public viewExpenseHeads = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .expenseHeadModel(req)
      .viewExpenseHeads(Number(page) || 1, Number(size) || 20);

    return { success: true, ...data };
  };
  public getAllExpenseHeads = async (req: Request) => {
    const data = await this.models.configModel
      .expenseHeadModel(req)
      .getAllExpenseHeads();

    return { success: true, data };
  };

  public DeleteExpenseHead = async (req: Request) => {
    const { head_id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .expenseHeadModel(req)
      .deleteExpenseHead(head_id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesExpenseHead;
