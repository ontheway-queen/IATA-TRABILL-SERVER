import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';

import { IVendorTransactions } from '../../../../common/interfaces/commonInterfaces';
import {
  IOpeningBalance,
  IVendorOpeningBalanceReqBody,
} from '../../types/account.interfaces';
import { IVTrxnDb } from '../../../../common/interfaces/Trxn.interfaces';

class AddVendorOpeningService extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * add client opening balance
   */
  public addVendorOpeningBalance = async (req: Request) => {
    const {
      amount,
      vendor_id,
      transaction_created_by,
      date,
      note,
      transaction_type,
    } = req.body as IVendorOpeningBalanceReqBody;

    return this.models.db.transaction(async (trx) => {
      const conn_acc = this.models.accountsModel(req, trx);
      const trxn_conn = this.models.trxnModels(req, trx);

      const VTrxnBody: IVTrxnDb = {
        vtrxn_voucher: '',
        vtrxn_type: transaction_type,
        vtrxn_amount: amount,
        vtrxn_particular_id: 41,
        vtrxn_note: note as string,
        vtrxn_user_id: transaction_created_by,
        vtrxn_created_at: date as string,
        vtrxn_v_id: vendor_id,
      };

      const op_ventrxn_id = await trxn_conn.insertVTrxn(VTrxnBody);

      const openingBalData: IOpeningBalance = {
        op_acctype: 'VENDOR',
        op_amount: amount,
        op_trxn_type: transaction_type,
        op_ven_id: vendor_id,
        op_ventrxn_id,
        op_note: note,
        op_date: date,
      };

      const data = await conn_acc.insertOpeningBal(openingBalData);

      const message = 'Vendor opening balance has been added';
      await this.insertAudit(
        req,
        'create',
        message,
        transaction_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Vendor opening balance added successfully!',
        data,
      };
    });
  };
}

export default AddVendorOpeningService;
