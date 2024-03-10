import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteCombineClient extends AbstractServices {
  constructor() {
    super();
  }

  public deleteCombineClient = async (req: Request) => {
    const { combine_update_by } = req.body as { combine_update_by: number };

    const combine_id = req.params.id as string;

    if (!combine_id) {
      throw new CustomError(
        'Empty combined id',
        400,
        'Please provide a combined id'
      );
    }

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.combineClientModel(req, trx);

      const combine_info = await conn.getCombineClientName(combine_id);

      const clientTrxnCount = await conn.getTraxn(combine_id);

      if (clientTrxnCount === 0) {
        await conn.deleteCombineClients(combine_id, combine_update_by);
      } else {
        throw new CustomError(
          'Account has a valid transaction',
          400,
          'Bad Request'
        );
      }

      // insert audit
      const message = `Combine client has been deleted -${combine_info}-`;
      await this.insertAudit(
        req,
        'delete',
        message,
        combine_update_by,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Combine client delete successfuly',
      };
    });
  };
}
export default DeleteCombineClient;
