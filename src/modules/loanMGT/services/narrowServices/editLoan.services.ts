import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { IAcTrxnUpdate } from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import { InsertLCheque } from '../../../cheques/types/cheques.interface';
import { ILoans, ILoansReqBody } from '../../types/loan.interfaces';

class EditLoan extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * Edit Loan
   */
  public editLoan = async (req: Request) => {
    const loan_id = Number(req.params.loan_id);

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
      accategory_id,
      account_id,
      cheque_no,
      charge_amount,
      withdraw_date,
      bank_name,
      date,
      note,
      loan_created_by,
    } = req.body as ILoansReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);

      const {
        prev_account_id,
        prevAccTrxnId,
        loan_charge_id: prev_loan_charge_id,
      } = await conn.getPreviousLoan(loan_id);

      let loan_charge_id: number | null = null;
      if (charge_amount) {
        if (prev_loan_charge_id) {
          await vendor_conn.updateOnlineTrxnCharge(
            {
              charge_amount,
              charge_purpose: `${type} loan`,
              charge_note: note,
            },
            prev_loan_charge_id
          );
        } else {
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
      }

      const loanData: ILoans = {
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
        loan_charge_amount: charge_amount,
        loan_charge_id: null,
      };

      const takingLoan = type === 'TAKING' || type === 'ALREADY_TAKEN';
      const givingLoan = type === 'GIVING' || type === 'ALREADY_GIVEN';

      if (takingLoan) {
        loanData.loan_payable_amount = pay_amount;
      }

      if (givingLoan) {
        loanData.loan_receivable_amount = receive_amount;
      }

      if (payment_type == 4) {
        loanData.loan_cheque_no = cheque_no;
        loanData.loan_withdraw_date = withdraw_date;
        loanData.loan_bank_name = bank_name;
      }

      if (payment_type !== 4 && ['TAKING', 'GIVING'].includes(type)) {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: takingLoan ? 'CREDIT' : 'DEBIT',
          acctrxn_amount: Number(amount),
          acctrxn_created_at: date as string,
          acctrxn_created_by: loan_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: takingLoan ? 52 : 53,
          acctrxn_pay_type: 'CASH',
          trxn_id: prevAccTrxnId,
        };

        const acc_trxn_id = await new Trxns(req, trx).AccTrxnUpdate(
          AccTrxnBody
        );

        loanData.loan_actransaction_id = acc_trxn_id;
        loanData.loan_payment_type = payment_type;
        loanData.loan_accategory_id = accategory_id;
        loanData.loan_account_id = account_id;
      }
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

      await conn.editLoan(loanData, loan_id);

      if (payment_type == 4) {
        const loanCheque: InsertLCheque = {
          lcheque_amount: Number(amount),
          lcheque_bank_name: bank_name,
          lcheque_loan_id: loan_id,
          lcheque_number: cheque_no,
          lcheque_withdraw_date: withdraw_date,
          lcheque_status: 'PENDING',
          lcheque_create_date: date,
        };

        await connCheque.insertLoanCheque(loanCheque);
      }

      const message = `Loan has been update ${amount}/- BDT`;

      await this.insertAudit(req, 'update', message, loan_created_by, 'LOAN');

      return {
        success: true,
        message: 'Loan edited successfully',
      };
    });
  };
}

export default EditLoan;
