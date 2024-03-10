import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { ICombinedTransaction } from '../../../clients/combined_clients/types/combineClients.interfaces';
import {
  ICombineOpeningBalanceReqBody,
  IOpeningBalance,
} from '../../types/account.interfaces';
import Trxns from '../../../../common/helpers/Trxns';
import { IComTrxn } from '../../../../common/interfaces/Trxn.interfaces';

class AddCombineOpeningBalanceService extends AbstractServices {
  constructor() {
    super();
  }

  public addCombineOpeningBalance = async (req: Request) => {
    const {
      combine_id,
      transaction_created_by,
      amount,
      date,
      note,
      transaction_type,
    } = req.body as ICombineOpeningBalanceReqBody;

    return this.models.db.transaction(async (trx) => {
      const conn_acc = this.models.accountsModel(req, trx);
      const trxn_conn = this.models.trxnModels(req, trx);

      const comTrxnBody: IComTrxn = {
        comtrxn_voucher_no: '',
        comtrxn_type: transaction_type,
        comtrxn_comb_id: combine_id as number,
        comtrxn_particular_id: 126,
        comtrxn_particular_type: 'Combine Opening Balance',
        comtrxn_amount: amount,
        comtrxn_note: note,
        comtrxn_create_at: date,
        comtrxn_user_id: transaction_created_by,
      };

      const op_comtrxn_id = await trxn_conn.insertComTrxn(comTrxnBody);

      const openingBalData: IOpeningBalance = {
        op_acctype: 'COMBINED',
        op_amount: amount,
        op_trxn_type: transaction_type,
        op_com_id: combine_id,
        op_comtrxn_id,
        op_note: note,
        op_date: date,
      };

      const data = await conn_acc.insertOpeningBal(openingBalData);

      const message = 'Combine opening balance has been added';
      await this.insertAudit(
        req,
        'create',
        message,
        transaction_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Combine Client Opening Balance Add Successfuly!',
        data,
      };
    });
  };
}
export default AddCombineOpeningBalanceService;
