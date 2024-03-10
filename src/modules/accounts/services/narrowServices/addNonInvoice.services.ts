import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import {
  INonInvoiceIncome,
  INonInvoiceIncomeReqBody,
} from '../../types/account.interfaces';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../common/helpers/Trxns';

class AddNonInvoice extends AbstractServices {
  constructor() {
    super();
  }

  public addNonInvoice = async (req: Request) => {
    const {
      company_id,
      type_id,
      account_id,
      amount,
      noninvoice_created_by,
      cheque_no,
      receipt_no,
      date,
      note,
    } = req.body as INonInvoiceIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'NII');

      const AccTrxnBody: IAcTrxn = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_voucher: vouchar_no,
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: noninvoice_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 10,
        acctrxn_particular_type: 'Noninvoice income',
        acctrxn_pay_type: 'CASH',
      };

      const acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

      const nonInvoiceincomeInfo: INonInvoiceIncome = {
        nonincome_vouchar_no: vouchar_no,
        nonincome_actransaction_id: acc_trxn_id,
        nonincome_amount: amount,
        nonincome_company_id: company_id,
        nonincome_cheque_no: cheque_no,
        nonincome_created_by: noninvoice_created_by,
        nonincome_created_date: date,
        nonincome_receipt_no: receipt_no,
        nonincome_note: note,
      };

      await conn.addNonInvoice(nonInvoiceincomeInfo);

      await this.updateVoucher(req, 'NII');

      const message = `Non invoice income has been added ${amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        noninvoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Non invoice created successfully',
      };
    });
  };
}

export default AddNonInvoice;
