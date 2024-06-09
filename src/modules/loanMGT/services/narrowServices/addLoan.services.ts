import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import { ILoans, ILoansReqBody } from '../../types/loan.interfaces';
import { IAcTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../common/helpers/Trxns';

class AddLoan extends AbstractServices {
  constructor() {
    super();
  }

  public addLoan = async (req: Request) => {
    const {
      authority_id,
      name,
      type,
      amount,
      interest_percent,
      pay_amount,
      receive_amount,
      installment,
      installment_type,
      installment_duration,
      installment_per_month,
      installment_per_day,
      payment_type,
      charge_amount,
      accategory_id,
      account_id,
      cheque_no,
      withdraw_date,
      bank_name,
      date,
      note,
      loan_created_by,
    } = req.body as ILoansReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'LN');

      const takingLoan = type === 'TAKING';

      let loan_actransaction_id;

      if (payment_type !== 4 && ['TAKING', 'GIVING'].includes(type)) {
        let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
        if (payment_type === 1) {
          accPayType = 'CASH';
        } else if (payment_type === 2) {
          accPayType = 'BANK';
        } else if (payment_type === 3) {
          accPayType = 'MOBILE BANKING';
        } else {
          accPayType = 'CASH';
        }

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: takingLoan ? 'CREDIT' : 'DEBIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: Number(amount),
          acctrxn_created_at: date as string,
          acctrxn_created_by: loan_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: takingLoan ? 46 : 47,
          acctrxn_particular_type: 'Loan create',
          acctrxn_pay_type: accPayType,
        };

        loan_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);
      }

      const loan_vouchar = generateVoucherNumber(4, 'LN');

      let loan_charge_id: number | null = null;
      if (payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_amount: charge_amount,
          charge_purpose: `${type} loan`,
          charge_note: note as string,
        };
        loan_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const loanData: ILoans = {
        loan_vouchar_no: vouchar_no,
        loan_authority_id: authority_id,
        loan_name: name,
        loan_type: type,
        loan_amount: Number(amount),
        loan_due_amount: pay_amount || receive_amount,
        loan_interest_percent: interest_percent,
        loan_payment_type: payment_type,
        loan_date: date,
        loan_note: note,
        loan_created_by,
        loan_actransaction_id,
        loan_accategory_id: accategory_id,
        loan_account_id: account_id,
        loan_cheque_no: cheque_no,
        loan_withdraw_date: withdraw_date,
        loan_bank_name: bank_name,
        loan_vouchar,
        loan_charge_amount: charge_amount,
        loan_charge_id,
      };

      if (installment == 'YES') {
        loanData.loan_installment = 'YES';

        if (installment_type == 'MONTHLY') {
          loanData.loan_installment_type = 'MONTHLY';
          loanData.loan_installment_duration = installment_duration;
          loanData.loan_installment_per_month = installment_per_month;
        } else {
          loanData.loan_installment_type = 'DAILY';
          loanData.loan_installment_duration = installment_duration;
          loanData.loan_installment_per_day = installment_per_day;
        }
      }

      if (takingLoan) {
        loanData.loan_payable_amount = pay_amount;
      } else {
        loanData.loan_receivable_amount = receive_amount;
      }

      const loanId = await conn.createLoan(loanData);

      if (payment_type == 4) {
        const loanCheque = {
          lcheque_amount: Number(amount),
          lcheque_bank_name: bank_name,
          lcheque_loan_id: loanId,
          lcheque_number: cheque_no,
          lcheque_withdraw_date: withdraw_date,
          lcheque_status: 'PENDING',
          lcheque_create_date: date,
        };

        await connCheque.insertLoanCheque(loanCheque);
      }

      this.updateVoucher(req, 'LN');

      const message = `Loan ${type} with ${amount}/- BDT`;

      await this.insertAudit(req, 'create', message, loan_created_by, 'LOAN');

      return {
        success: true,
        message,
        loanId,
      };
    });
  };
}

export default AddLoan;
