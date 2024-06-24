import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import {
  IInvestmentReqBody,
  IInvestments,
} from '../../types/account.interfaces';
import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';

class AddInvestment extends AbstractServices {
  constructor() {
    super();
  }

  public addInvestment = async (req: Request) => {
    const {
      company_id,
      type_id,
      amount,
      investment_created_by,
      account_id,
      cheque_no,
      receipt_no,
      date,
      note,
    } = req.body as IInvestmentReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);
      const vouchar_no = await this.generateVoucher(req, 'IVT');

      const AccTrxnBody: IAcTrxn = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_voucher: vouchar_no,
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: investment_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 36,
        acctrxn_pay_type: 'CASH',
      };

      const acc_trxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

      const investmentInfo: IInvestments = {
        investment_vouchar_no: vouchar_no,
        investment_actransaction_id: acc_trxn_id,
        investment_company_id: company_id,
        investment_cheque_no: cheque_no,
        investment_created_by: investment_created_by,
        investment_created_date: date,
        investment_receipt_no: receipt_no,
        investment_note: note,
      };

      await conn.addInvestments(investmentInfo);
      await this.updateVoucher(req, 'IVT');
      const message = `Investment has been created ${amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        investment_created_by,
        'OTHERS'
      );

      return {
        success: true,
        message,
      };
    });
  };
}

export default AddInvestment;
