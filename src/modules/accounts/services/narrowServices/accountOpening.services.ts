import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';

import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import {
  IAccountOpeningBalanceReqBody,
  IOpeningBalance,
} from '../../types/account.interfaces';

class AddAccountOpeningService extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * add account opening balance
   */
  public addAccountOpeningBalance = async (req: Request) => {
    const {
      account_id,
      account_created_by,
      amount,
      date,
      note,
      transaction_type,
    } = req.body as IAccountOpeningBalanceReqBody;

    return this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const AccTrxnBodyTo: IAcTrxn = {
        acctrxn_ac_id: account_id,
        acctrxn_type: transaction_type,
        acctrxn_voucher: '',
        acctrxn_amount: amount,
        acctrxn_created_at: date as string,
        acctrxn_created_by: account_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 41,
        acctrxn_pay_type: 'CASH',
      };

      const op_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBodyTo);

      const openingBalData: IOpeningBalance = {
        op_acctype: 'ACCOUNT',
        op_amount: amount,
        op_trxn_type: transaction_type,
        op_acc_id: account_id,
        op_acctrxn_id,
        op_note: note,
        op_date: date,
      };

      const data = await conn.insertOpeningBal(openingBalData);

      const message = 'Account opening balance has been added';
      await this.insertAudit(
        req,
        'create',
        message,
        account_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Account opening balance added successfully',
        data,
      };
    });
  };
}

export default AddAccountOpeningService;
