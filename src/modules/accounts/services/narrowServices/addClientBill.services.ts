import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import {
  IClientBillAdjust,
  IClientBillAdjustReqBody,
} from '../../types/account.interfaces';
import { IClTrxnBody } from '../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../common/helpers/Trxns';

class AddClientBillAdjustment extends AbstractServices {
  constructor() {
    super();
  }

  public clientBillAdj = async (req: Request) => {
    const {
      bill_client_id,
      bill_type,
      bill_amount,
      bill_create_date,
      bill_created_by,
      bill_note,
    } = req.body as IClientBillAdjustReqBody;

    const { client_id, combined_id } = separateCombClientToId(bill_client_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const voucher_no = generateVoucherNumber(7, 'CB');

      let trxn_type: 'CREDIT' | 'DEBIT' =
        bill_type === 'INCREASE' ? 'CREDIT' : 'DEBIT';

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: trxn_type,
        ctrxn_amount: bill_amount,
        ctrxn_cl: bill_client_id,
        ctrxn_voucher: voucher_no,
        ctrxn_particular_id: 126,
        ctrxn_created_at: bill_create_date as string,
        ctrxn_note: bill_note as string,
        ctrxn_particular_type: 'Client Bill Adjustment',
      };

      const cbilladjust_ctrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const clientBillInfo: IClientBillAdjust = {
        cbilladjust_ctrxn_id,
        cbilladjust_client_id: client_id,
        cbilladjust_combined_id: combined_id,
        cbilladjust_type: bill_type,
        cbilladjust_amount: bill_amount,
        cbilladjust_create_date: bill_create_date,
        cbilladjust_created_by: bill_created_by,
        cbilladjust_note: bill_note,
        cbilladjust_vouchar_no: voucher_no,
      };

      const cbilladjust_id = await conn.addClientBill(clientBillInfo);

      const message = `Client bill adjust has been created ${bill_amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        bill_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Client bill adjusted successfully',
        data: { cbilladjust_id },
      };
    });
  };
}

export default AddClientBillAdjustment;
