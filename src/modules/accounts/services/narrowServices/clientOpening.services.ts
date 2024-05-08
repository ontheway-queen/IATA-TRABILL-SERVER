import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { IClTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import {
  IClientOpeningBalanceReqBody,
  IOpeningBalance,
} from '../../types/account.interfaces';

class AddClientOpeningService extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * add client opening balance
   */
  public addClientOpeningBalance = async (req: Request) => {
    const {
      amount,
      client_id,
      transaction_created_by,
      transaction_type,
      note,
      date,
    } = req.body as IClientOpeningBalanceReqBody;

    return this.models.db.transaction(async (trx) => {
      const conn_acc = this.models.accountsModel(req, trx);
      const trxn_conn = this.models.trxnModels(req, trx);

      const clTrxnBody: IClTrxn = {
        ctrxn_amount: amount,
        ctrxn_cl_id: client_id,
        ctrxn_created_at: date,
        ctrxn_note: note,
        ctrxn_particular_id: 12,
        ctrxn_particular_type: 'Client opening balance',
        ctrxn_type: transaction_type,
        ctrxn_voucher: '',
        ctrxn_user_id: req.user_id,
      };

      const op_cltrxn_id = await trxn_conn.insertClTrxn(clTrxnBody);

      const openingBalData: IOpeningBalance = {
        op_acctype: 'CLIENT',
        op_amount: amount,
        op_trxn_type: transaction_type,
        op_cl_id: client_id,
        op_cltrxn_id,
        op_note: note,
        op_date: date,
      };

      const data = await conn_acc.insertOpeningBal(openingBalData);

      const message =
        'Client opening balance has been added ' +
        note +
        ` amount - ${amount}/- , opening balance id-${data}`;
      await this.insertAudit(
        req,
        'create',
        message,
        transaction_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Client opening balance added successfully!',
        data,
      };
    });
  };
}

export default AddClientOpeningService;
