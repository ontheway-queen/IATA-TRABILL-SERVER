import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import {
  IAcTrxn,
  IAcTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import { getPaymentType } from '../../../common/utils/libraries/lib';
import { IOnlineTrxnCharge } from '../../accounts/types/account.interfaces';
import { InserLoanPayCheque } from '../../cheques/types/cheques.interface';
import {
  ILoanAuthority,
  ILoanAuthorityReqBody,
  ILoanPayment,
  ILoanPaymentReqBody,
  ILoanReceive,
  ILoanReceiveReqBody,
} from '../types/loan.interfaces';
import AddLoan from './narrowServices/addLoan.services';
import EditLoan from './narrowServices/editLoan.services';

class LoanServices extends AbstractServices {
  constructor() {
    super();
  }

  public addLoanAuthrity = async (req: Request) => {
    const { name, contact, address, created_by } =
      req.body as ILoanAuthorityReqBody;

    const authorityData: ILoanAuthority = {
      authority_name: name,
      authority_mobile: contact,
      authority_address: address,
      authority_created_by: created_by,
    };

    const conn = this.models.loanModel(req);

    const authorityId = await conn.createAuthority(authorityData);

    // insert audit
    const message = 'Loan authority has been created';

    await this.insertAudit(req, 'create', message, created_by, 'LOAN');

    return {
      success: true,
      message,
      data: authorityId,
    };
  };

  public editLoanAuthority = async (req: Request) => {
    const { authority_id } = req.params;

    const { name, contact, address, created_by } =
      req.body as ILoanAuthorityReqBody;

    const authorityData: ILoanAuthority = {
      authority_name: name,
      authority_mobile: contact,
      authority_address: address,
      authority_created_by: created_by,
    };

    const conn = this.models.loanModel(req);

    const data = await conn.editAuthority(authorityData, authority_id);

    // insert audit
    const message = 'Loan authority edited successfully';

    await this.insertAudit(req, 'update', message, created_by, 'LOAN');

    return {
      success: true,
      message: 'Loan authority edited successfully',
      data,
    };
  };

  public getLoanAuthorities = async (req: Request) => {
    const { search } = req.query as {
      search: string;
    };

    const conn = this.models.loanModel(req);

    const data = await conn.getLoanAuthorities(search);

    return { success: true, data };
  };

  public getALLLoanAuthority = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.loanModel(req);

    const data = await conn.getALLLoanAuthority(
      Number(page || 1),
      Number(size || 20),
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public deleteAuthority = async (req: Request) => {
    const { authority_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.loanModel(req);

    const authority_used = await conn.checkAuthorityHaveTransaction(
      authority_id
    );

    if (authority_used > 0) {
      throw new CustomError(
        `You can't delete this authority it's used somewhere`,
        400,
        'Bad request'
      );
    }

    await conn.deleteAuthority(authority_id, deleted_by);

    const message = 'Authority deleted successfully';

    await this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');

    return { success: true, message: 'Authority deleted successfully' };
  };

  public getLoans = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.loanModel(req);

    const data = await conn.getLoans(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  /**
   * Get single loan
   */
  public getLoan = async (req: Request) => {
    const { loan_id } = req.params;

    const conn = this.models.loanModel(req);

    const data = await conn.getLoan(+loan_id);

    return { success: true, data };
  };

  /**
   * Delete Loan
   */
  public deleteLoan = async (req: Request) => {
    let { loan_id } = req.params as { loan_id: idType };

    loan_id = Number(loan_id);

    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);

      const { prev_loan_type, prev_pay_type, prevAccTrxnId, loan_charge_id } =
        await conn.getPreviousLoan(loan_id);

      const payment = await conn.getPaymentByLoan(loan_id);

      const received = await conn.getReceivedByLoan(loan_id);

      if (payment || received) {
        throw new CustomError(
          'Loan cannot be deleted if payment/ received exists',
          400,
          'Bad Request'
        );
      }

      await conn.deleteLoanCheque(loan_id, deleted_by);
      await conn.deleteLoan(loan_id, deleted_by);

      if (
        prev_pay_type !== 4 &&
        ['GIVING', 'TAKING'].includes(prev_loan_type)
      ) {
        await new Trxns(req, trx).deleteAccTrxn(prevAccTrxnId);
      }

      // insert audit
      const message = 'Loan deleted successfully';

      await this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');

      if (loan_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(loan_charge_id);
      }

      return { success: true, message: 'Loan deleted successfully' };
    });
  };

  /**
   * Get loans by prev_loan_type: taking, already taken
   */
  public loansForPayment = async (req: Request) => {
    const { authority_id } = req.params;

    const conn = this.models.loanModel(req);

    const data = await conn.loansTaking(+authority_id);

    return { success: true, data };
  };

  /**
   * Add Payment
   */
  public addPayment = async (req: Request) => {
    const {
      authority_id,
      loan_id,
      payment_type,
      charge_amount,
      cheque_no,
      withdraw_date,
      bank_name,
      accategory_id,
      account_id,
      amount,
      payment_date,
      payment_note,
      created_by,
    } = req.body as ILoanPaymentReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const connAccount = this.models.accountsModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'LNP');
      const accPayType = getPaymentType(payment_type);

      let payment_charge_id: null | number = null;
      if (payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_amount: charge_amount,
          charge_purpose: `Loan payment`,
          charge_note: payment_note,
        };
        payment_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const paymentData: ILoanPayment = {
        payment_vouchar_no: vouchar_no,
        payment_authority_id: authority_id,
        payment_loan_id: loan_id,
        payment_type,
        payment_amount: amount,
        payment_date,
        payment_note,
        payment_created_by: created_by,
        payment_charge_amount: charge_amount,
        payment_charge_id,
      };

      const loan = await conn.getLoan(loan_id);

      let due_amount = Number(loan[0].loan_due_amount);

      if (due_amount <= 0) {
        throw new CustomError('This Loan has no due left', 400, 'Bad Request');
      }

      due_amount = due_amount - amount;

      await conn.updateLoanDue(due_amount, loan_id);

      if (payment_type == 4) {
        paymentData.payment_cheque_no = cheque_no;
        paymentData.payment_bank_name = bank_name;
        paymentData.payment_withdraw_date = withdraw_date;
      }

      if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
        let last_balance = await connAccount.getAccountLastBalance(account_id);

        if (Number(last_balance) < amount) {
          throw new CustomError(
            'Account balance insufficient for loan payment',
            400,
            'Bad Request'
          );
        }

        paymentData.payment_accategory_id = accategory_id;
        paymentData.payment_account_id = account_id;

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: amount,
          acctrxn_created_at: payment_date,
          acctrxn_created_by: created_by,
          acctrxn_note: payment_note,
          acctrxn_particular_id: 54,
          acctrxn_pay_type: accPayType,
        };

        const payment_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        paymentData.payment_actransaction_id = payment_acctrxn_id;
      }

      const paymentId = await conn.addPayment(paymentData);

      if (payment_type == 4) {
        const payment_cheque: InserLoanPayCheque = {
          lpcheque_amount: amount,
          lpcheque_number: cheque_no,
          lpcheque_payment_id: paymentId,
          lpcheque_bank_name: bank_name,
          lpcheque_withdraw_date: withdraw_date,
          lpcheque_status: 'PENDING',
        };

        await connCheque.insertLPayChequeStatus(payment_cheque);
      }

      await this.updateVoucher(req, 'LNP');

      // insert audit
      const message = 'Payment added successfully';

      await this.insertAudit(req, 'create', message, created_by, 'LOAN');

      return {
        success: true,
        message: 'Payment added successfully',
      };
    });
  };

  public getPayments = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.loanModel(req);

    const data = await conn.getPayments(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getPayment = async (req: Request) => {
    const { payment_id } = req.params;

    const conn = this.models.loanModel(req);

    const data = await conn.getPayment(+payment_id);

    return { success: true, data };
  };

  public editPayment = async (req: Request) => {
    const { payment_id } = req.params;

    const {
      authority_id,
      loan_id,
      account_id,
      amount,
      payment_type,
      cheque_no,
      bank_name,
      withdraw_date,
      created_by,
      payment_date,
      payment_note,
      charge_amount,
    } = req.body as ILoanPaymentReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const account_conn = this.models.accountsModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);

      const {
        prev_payamount,
        prev_actrxn_id,
        payment_charge_id: prev_payment_charge_id,
      } = await conn.getPrevPaymentData(payment_id);

      let payment_charge_id: null | number = null;
      if (prev_payment_charge_id) {
        await vendor_conn.updateOnlineTrxnCharge(
          { charge_amount: charge_amount, charge_purpose: 'Loan payment' },
          prev_payment_charge_id
        );
      } else {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_amount: charge_amount,
          charge_purpose: `Loan payment`,
          charge_note: payment_note,
        };
        if (charge_amount) {
          payment_charge_id = await this.models
            .vendorModel(req, trx)
            .insertOnlineTrxnCharge(online_charge_trxn);
        }
      }

      const paymentData: ILoanPayment = {
        payment_authority_id: authority_id,
        payment_loan_id: loan_id,
        payment_type,
        payment_amount: amount,
        payment_created_by: created_by,
        payment_date,
        payment_note,
        payment_charge_amount: charge_amount,
        payment_charge_id,
      };

      const loan = await conn.getLoan(loan_id);

      let due_amount = Number(loan[0].loan_due_amount);

      if (due_amount <= 0) {
        throw new CustomError('This Loan has no due left', 400, 'Bad Request');
      }

      due_amount = Number(due_amount) + Number(prev_payamount) - Number(amount);

      await conn.updateLoanDue(due_amount, loan_id);

      if (payment_type == 4) {
        paymentData.payment_cheque_no = cheque_no;
        paymentData.payment_bank_name = bank_name;
        paymentData.payment_withdraw_date = withdraw_date;
      }

      if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
        let last_balance = await account_conn.getAccountLastBalance(account_id);

        if (Number(last_balance) < amount) {
          throw new CustomError(
            'Account balance insufficient for loan payment',
            400,
            'Bad Request'
          );
        }

        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id as number,
          acctrxn_type: 'DEBIT',
          acctrxn_amount: amount,
          acctrxn_created_at: payment_date,
          acctrxn_created_by: created_by,
          acctrxn_note: payment_note,
          acctrxn_particular_id: 54,
          acctrxn_pay_type: 'CASH',
          trxn_id: prev_actrxn_id,
        };

        const payment_trxn_id = await new Trxns(req, trx).AccTrxnUpdate(
          AccTrxnBody
        );

        paymentData.payment_actransaction_id = payment_trxn_id;

        paymentData.payment_account_id = account_id;
      }

      if (payment_type == 4) {
        const payment_cheque = {
          lpcheque_amount: amount,
          lpcheque_number: cheque_no,
          lpcheque_payment_id: +payment_id,
          lpcheque_bank_name: bank_name,
          lpcheque_withdraw_date: withdraw_date,
          lpcheque_status: 'PENDING',
        };
        await connCheque.insertLPayChequeStatus(payment_cheque);
      }

      await conn.editPayment(paymentData, +payment_id);

      // insert audit
      const message = 'Payment edited successfully';

      await this.insertAudit(req, 'update', message, created_by, 'LOAN');

      return {
        success: true,
        message: 'Payment edited successfully',
      };
    });
  };

  public deletePayment = async (req: Request) => {
    const { payment_id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        prev_paytype,
        prev_payamount,
        prev_actrxn_id,
        payment_loan_id,
        payment_charge_id,
      } = await conn.getPrevPaymentData(payment_id);

      const { loanDueAmount } = await conn.getPreviousLoan(payment_loan_id);

      const due_amount = Number(loanDueAmount) + Number(prev_payamount);

      await conn.updateLoanDue(due_amount, payment_loan_id);

      await conn.deletePayment(+payment_id, deleted_by);

      if (prev_paytype !== 4) {
        await trxns.deleteAccTrxn(prev_actrxn_id);
      }

      if (payment_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(payment_charge_id);
      }

      const message = `Loan payment has been deleted ${prev_payamount}/-`;

      await this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');

      return { success: true, message };
    });
  };

  /**
   * Get loans by prev_loan_type: giving, already given
   */
  public loansForReceive = async (req: Request) => {
    const { authority_id } = req.params;

    const conn = this.models.loanModel(req);

    const data = await conn.loansReceived(authority_id);

    return { success: true, data };
  };

  public addRecieved = async (req: Request) => {
    const {
      authority_id,
      loan_id,
      accategory_id,
      account_id,
      amount,
      payment_type,
      charge_amount,
      cheque_no,
      bank_name,
      withdraw_date,
      created_by,
      received_date,
      received_note,
    } = req.body as ILoanReceiveReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'LNR');

      const payMethod = getPaymentType(payment_type);

      let received_charge_id: number | null = null;
      if (payment_type === 3) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_to_acc_id: account_id,
          charge_amount: charge_amount,
          charge_purpose: `Loan receive`,
          charge_note: received_note,
        };
        received_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const receivedData: ILoanReceive = {
        received_vouchar_no: vouchar_no,
        received_authority_id: authority_id,
        received_loan_id: loan_id,
        received_payment_type: payment_type,
        received_amount: amount,
        received_created_by: created_by,
        received_account_id: account_id,
        received_date,
        received_note,
        received_charge_amount: charge_amount,
        received_charge_id,
      };

      const loan = await conn.getLoan(loan_id);

      let due_amount = Number(loan[0].loan_due_amount);

      if (due_amount <= 0) {
        throw new CustomError('This Loan has no due left', 400, 'Bad Request');
      }

      due_amount = due_amount - amount;

      await conn.updateLoanDue(due_amount, loan_id);

      if (payment_type == 4) {
        receivedData.received_cheque_no = cheque_no;
        receivedData.received_bank_name = bank_name;
        receivedData.received_withdraw_date = withdraw_date;
      }

      if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
        receivedData.received_accategory_id = accategory_id;
        receivedData.received_account_id = account_id;

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: amount,
          acctrxn_created_at: received_date,
          acctrxn_created_by: created_by,
          acctrxn_note: received_note,
          acctrxn_particular_id: 55,
          acctrxn_pay_type: payMethod,
        };

        const receipt_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        receivedData.received_actransaction_id = receipt_acctrxn_id;
      }

      const receivedId = await conn.addReceived(receivedData);

      if (payment_type == 4) {
        const received_cheque = {
          lrcheque_amount: amount,
          lrcheque_number: cheque_no,
          lrcheque_received_id: receivedId,
          lrcheque_bank_name: bank_name,
          lrcheque_withdraw_date: withdraw_date,
          lrcheque_status: 'PENDING',
        };

        await connCheque.insertLReceiveChequeStatus(received_cheque);
      }

      const message = `Loan received has been created ${amount}/-`;

      await this.updateVoucher(req, 'LNR');

      await this.insertAudit(req, 'create', message, created_by, 'LOAN');

      return {
        success: true,
        message: 'Received added successfully',
      };
    });
  };

  public getReceived = async (req: Request) => {
    const { trash, page, size, search, from_date, to_date } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.loanModel(req);

    const data = await conn.getReceived(
      Number(trash) || 0,
      Number(page) || 1,
      Number(size) || 10,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getSingleReceived = async (req: Request) => {
    const { received_id } = req.params;

    const conn = this.models.loanModel(req);

    const data = await conn.getSingleReceived(+received_id);

    return { success: true, data };
  };

  public editRecieved = async (req: Request) => {
    const { received_id } = req.params;

    const {
      authority_id,
      loan_id,
      accategory_id,
      account_id,
      amount,
      payment_type,
      cheque_no,
      bank_name,
      withdraw_date,
      created_by,
      received_date,
      received_note,
      charge_amount,
    } = req.body as ILoanReceiveReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req, trx);
      const connAccount = this.models.accountsModel(req, trx);
      const connCheque = this.models.chequesModels(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);

      const payMethod = getPaymentType(payment_type);

      const {
        received_amount,
        received_actransaction_id,
        received_charge_id: prev_received_charge_id,
      } = await conn.getReceivedInfo(received_id);

      let received_charge_id: number | null = null;
      if (prev_received_charge_id) {
        await vendor_conn.updateOnlineTrxnCharge(
          {
            charge_amount,
            charge_purpose: 'Loan Receive',
            charge_note: received_note,
          },
          prev_received_charge_id
        );
      } else {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_amount,
          charge_purpose: `Loan Receive`,
          charge_note: received_note as string,
        };
        received_charge_id = await vendor_conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }

      const receivedData: ILoanReceive = {
        received_authority_id: authority_id,
        received_loan_id: loan_id,
        received_payment_type: payment_type,
        received_amount: amount,
        received_created_by: created_by,
        received_date,
        received_note,
        received_charge_amount: charge_amount,
        received_charge_id,
      };

      const loan = await conn.getLoan(loan_id);

      let due_amount = Number(loan[0].loan_due_amount);

      if (due_amount <= 0) {
        throw new CustomError('This Loan has no due left', 400, 'Bad Request');
      }

      due_amount =
        Number(due_amount) + Number(received_amount) - Number(amount);

      await conn.updateLoanDue(due_amount, loan_id);

      if (payment_type == 4) {
        receivedData.received_cheque_no = cheque_no;
        receivedData.received_bank_name = bank_name;
        receivedData.received_withdraw_date = withdraw_date;
      }

      if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
        let last_balance = await connAccount.getAccountLastBalance(account_id);

        if (Number(last_balance) < amount) {
          throw new CustomError(
            'Account balance insufficient for loan received',
            400,
            'Bad Request'
          );
        }

        receivedData.received_accategory_id = accategory_id;
        receivedData.received_account_id = account_id;

        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: amount,
          acctrxn_created_at: received_date,
          acctrxn_created_by: created_by,
          acctrxn_note: received_note,
          acctrxn_particular_id: 55,
          acctrxn_pay_type: payMethod,
          trxn_id: received_actransaction_id,
        };

        await new Trxns(req, trx).AccTrxnUpdate(AccTrxnBody);
      }

      if (payment_type == 4) {
        const received_cheque = {
          lrcheque_amount: amount,
          lrcheque_number: cheque_no,
          lrcheque_received_id: +received_id,
          lrcheque_bank_name: bank_name,
          lrcheque_withdraw_date: withdraw_date,
          lrcheque_status: 'PENDING',
        };

        await connCheque.insertLReceiveChequeStatus(received_cheque);
      }

      await conn.editReceived(receivedData, +received_id);

      const message = `Loan received has been updated ${amount}/-`;

      await this.insertAudit(req, 'update', message, created_by, 'LOAN');

      return {
        success: true,
        message: 'Received edited successfully',
      };
    });
  };

  public deleteReceived = async (req: Request) => {
    const { received_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.loanModel(req);

      const {
        received_actransaction_id,
        received_amount,
        received_loan_id,
        received_charge_id,
      } = await conn.getReceivedInfo(received_id);

      const { loanDueAmount } = await conn.getPreviousLoan(received_loan_id);

      const due_amount = Number(loanDueAmount) + Number(received_amount);

      await conn.updateLoanDue(due_amount, received_loan_id);

      await conn.deleteReceived(+received_id, deleted_by);

      if (received_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(received_charge_id);
      }

      await new Trxns(req, trx).deleteAccTrxn(received_actransaction_id);

      const message = `Loan received has been deleted ${received_amount}/-`;

      await this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');

      return { success: true, message: 'Received deleted successfully' };
    });
  };

  public addLoan = new AddLoan().addLoan;
  public editLoan = new EditLoan().editLoan;
}

export default LoanServices;
