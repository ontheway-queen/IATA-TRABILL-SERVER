import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import {
  IUpdateAdvrCheque,
  IUpdateExpenceCheque,
  IUpdateLPayCheque,
  IUpdateLReceiveCheque,
  IUpdateMoneyReceiptCheque,
  InsertLPayCheque,
  InsertReceived,
} from '../../Notifications/Interfaces/Notification.Interfaces';

import {
  IPayrollChequeStatus,
  IUpdateAdvrAccountClinetInfo,
  IUpdateLoanCheque,
  IVendorAdvrCheque,
  IVendorPayCheque,
  InsertLCheque,
  TChequeStatus,
} from '../types/cheques.interface';

class chequesModels extends AbstractModels {
  // get all cheques
  public async getAllCheques(
    status: TChequeStatus,
    page: number,
    size: number
  ) {
    const result = await this.db.transaction(async (trx) => {
      const query1 = trx.raw(
        `CALL get_all_cheques('${status}','${this.org_agency}', ${page}, ${size}, @total_rows);`
      );
      const query2 = trx.raw('SELECT @total_rows AS total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { count: totalCount, data };
    });

    return result;
  }

  updateExpenceChequeStatus = async (
    updatedData: IUpdateExpenceCheque,
    chequeId: idType
  ) => {
    const success = await this.query()
      .update(updatedData)
      .into('trabill_expense_cheque_details')
      .where('expcheque_id', chequeId);

    return success;
  };

  updateExpenseAccoutInfo = async (
    data: {
      expense_accounts_id: number;
      expense_acctrxn_id: number;
    },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_expenses')
      .leftJoin('trabill_expense_cheque_details', {
        'trabill_expense_cheque_details.expcheque_expense_id':
          'trabill_expenses.expense_id',
      })
      .where('expcheque_id', cheque_id);
  };

  getExpenseInfoForCheque = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select('expense_vouchar_no')
      .from('trabill_expense_cheque_details')
      .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
      .where('expcheque_id', cheque_id)) as { expense_vouchar_no: string }[];

    return data;
  };

  updateAdvrChequeStatus = async (
    updatedData: IUpdateAdvrCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_advance_return_cheque_details')
      .where('cheque_id', chequeId);
  };

  updateAdvrChequeAccountClientInfo = async (
    data: IUpdateAdvrAccountClinetInfo,
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_advance_return')
      .leftJoin('trabill_advance_return_cheque_details', {
        'trabill_advance_return.advr_id':
          'trabill_advance_return_cheque_details.cheque_advr_id',
      })
      .where('cheque_id', cheque_id)
      .andWhere('advr_org_agency', this.org_agency);
  };

  async getAdvChequeInfo(cheque_id: idType) {
    const [data] = (await this.query()
      .select('advr_vouchar_no')
      .from('trabill_advance_return_cheque_details')
      .leftJoin('trabill_advance_return', { advr_id: 'cheque_advr_id' })
      .where('cheque_id', cheque_id)) as { advr_vouchar_no: string }[];

    return data;
  }

  public async singleLoanCheque(cheque_id: idType) {
    const [cheque] = (await this.query()
      .from('trabill_loan_cheque_details')
      .select('lcheque_amount', 'loan_type', 'loan_vouchar_no')
      .where('lcheque_id', cheque_id)
      .andWhereNot('lcheque_is_deleted', 1)
      .leftJoin('trabill_loans', { loan_id: 'lcheque_loan_id' })) as {
      loan_vouchar_no: string;
      loan_type: 'TAKING';
      lcheque_amount: number;
    }[];

    return cheque;
  }

  loanChequeUpdate = async (
    updatedData: IUpdateLoanCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_loan_cheque_details')
      .where('lcheque_id', chequeId);
  };

  updateLoanAccountInfo = async (
    data: {
      loan_account_id: number;
      loan_actransaction_id: number;
    },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_loans')
      .leftJoin('trabill_loan_cheque_details', {
        'trabill_loan_cheque_details.lcheque_loan_id': 'trabill_loans.loan_id',
      })
      .where('lcheque_id', cheque_id);
  };

  insertLoanCheque = async (updatedData: InsertLCheque) => {
    return await this.query()
      .insert(updatedData)
      .into('trabill_loan_cheque_details')
      .onConflict('lcheque_id')
      .merge();
  };

  updateLPayChequeStatus = async (
    updatedData: IUpdateLPayCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_loan_payment_cheque_details')
      .where('lpcheque_id', chequeId);
  };

  updateLoanPaymentAccountInfo = async (
    data: { payment_actransaction_id: number; payment_account_id: number },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_loan_payment')
      .leftJoin('trabill_loan_payment_cheque_details', {
        'trabill_loan_payment_cheque_details.lpcheque_payment_id':
          'trabill_loan_payment.payment_id',
      })
      .where('lpcheque_id', cheque_id);
  };

  getLoanPaymentInfoForChq = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select('payment_vouchar_no')
      .from('trabill_loan_payment_cheque_details')
      .leftJoin('trabill_loan_payment', { payment_id: 'lpcheque_payment_id' })
      .where('lpcheque_id', cheque_id)) as { payment_vouchar_no: string }[];

    return data;
  };

  insertLPayChequeStatus = async (updatedData: InsertLPayCheque) => {
    return await this.query()
      .insert(updatedData)
      .into('trabill_loan_payment_cheque_details')
      .onConflict('lpcheque_id')
      .merge();
  };

  updateLReceiveChequeStatus = async (
    updatedData: IUpdateLReceiveCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_loan_received_cheque_details')
      .where('lrcheque_id', chequeId);
  };

  updateLoanReceiveAccountInfo = async (
    data: { received_actransaction_id: number; received_account_id: number },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_loan_received')
      .leftJoin('trabill_loan_received_cheque_details', {
        'trabill_loan_received_cheque_details.lrcheque_received_id':
          'trabill_loan_received.received_id',
      })
      .where('lrcheque_id', cheque_id);
  };

  getLoanReciveInfoForChq = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select('received_vouchar_no')
      .from('trabill_loan_received_cheque_details')
      .leftJoin('trabill_loan_received', {
        received_id: 'lrcheque_received_id',
      })
      .where('lrcheque_id', cheque_id)) as { received_vouchar_no: string }[];

    return data;
  };

  insertLReceiveChequeStatus = async (updatedData: InsertReceived) => {
    return await this.query()
      .insert(updatedData)
      .into('trabill_loan_received_cheque_details')
      .onConflict('lrcheque_id')
      .merge();
  };

  updateMoneyReceiptCheque = async (
    updatedData: IUpdateMoneyReceiptCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_money_receipts_cheque_details')
      .where('cheque_id', chequeId);
  };

  updateMoneyReceiptAccountInfo = async (
    data: { receipt_actransaction_id: number; receipt_ctrxn_id: number },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_money_receipts')
      .leftJoin('trabill_money_receipts_cheque_details', {
        'trabill_money_receipts_cheque_details.cheque_receipt_id':
          'trabill_money_receipts.receipt_id',
      })
      .where('cheque_id', cheque_id);
  };

  public async updatePayrollCheque(
    chequeData: IPayrollChequeStatus,
    cheque_id: idType
  ) {
    const data = await this.query()
      .update(chequeData)
      .into('trabill_payroll_cheque_details')
      .where('pcheque_id', cheque_id);

    return data;
  }

  updatePayrollAccountInfo = async (
    data: { payroll_account_id: number; payroll_acctrxn_id: number },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_payroll')
      .leftJoin('trabill_payroll_cheque_details', {
        'trabill_payroll_cheque_details.pcheque_payroll_id':
          'trabill_payroll.payroll_id',
      })
      .where('pcheque_id', cheque_id);
  };

  getPayrollInfoForChq = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select('payroll_vouchar_no')
      .from('trabill_payroll_cheque_details')
      .leftJoin('trabill_payroll', { payroll_id: 'pcheque_payroll_id' })
      .where('pcheque_id', cheque_id)) as { payroll_vouchar_no: string }[];

    return data;
  };

  public async updateVendorAdvrCheque(
    chequeInfo: IVendorAdvrCheque,
    cheque_id: idType
  ) {
    const data = await this.query()
      .update(chequeInfo)
      .into('trabill_vendor_advance_return_cheque_details')
      .where('cheque_id', cheque_id);

    return data;
  }

  updateVendorAdvrAccountInfo = async (
    data: {
      advr_vtrxn_id: number;
      advr_account_id: number;
      advr_actransaction_id: number;
    },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_vendor_advance_return')
      .leftJoin('trabill_vendor_advance_return_cheque_details', {
        'trabill_vendor_advance_return_cheque_details.cheque_advr_id':
          'trabill_vendor_advance_return.advr_id',
      })
      .where('cheque_id', cheque_id);
  };

  getVAdvrInfoForChq = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select('advr_vouchar_no')
      .from('trabill_vendor_advance_return_cheque_details')
      .leftJoin('trabill_vendor_advance_return', { advr_id: 'cheque_advr_id' })
      .where({ cheque_id })) as { advr_vouchar_no: string }[];

    return data;
  };

  public async updateVendorPaymentCheque(
    chequeInfo: IVendorPayCheque,
    cheque_id: idType
  ) {
    const data = await this.query()
      .update(chequeInfo)
      .into('trabill_vendor_payments_cheques')
      .where('vpcheque_id', cheque_id);

    return data;
  }

  updateVendorPaymentAccountInfo = async (
    data: {
      vpay_account_id: number;
      vpay_acctrxn_id: number;
      vpay_vtrxn_id: number;
    },
    cheque_id: idType
  ) => {
    return await this.query()
      .update(data)
      .into('trabill_vendor_payments')
      .leftJoin('trabill_vendor_payments_cheques', {
        'trabill_vendor_payments_cheques.vpcheque_vpay_id':
          'trabill_vendor_payments.vpay_id',
      })
      .where('vpcheque_id', cheque_id);
  };

  getMoneyReceiptChequeInfo = async (cheque_id: idType) => {
    const [data] = (await this.query()
      .select(
        'receipt_agent_id as prevAgentId',
        'agent_last_balance',
        'receipt_vouchar_no'
      )
      .from('trabill_money_receipts_cheque_details')
      .leftJoin('trabill_money_receipts', { receipt_id: 'cheque_receipt_id' })
      .leftJoin('trabill_agents_profile', { agent_id: 'receipt_agent_id' })
      .where('cheque_id', cheque_id)
      .andWhereNot('cheque_is_deleted', 1)) as {
      prevAgentId: number;
      agent_last_balance: number;
      receipt_vouchar_no: string;
    }[];

    return data;
  };
}

export default chequesModels;
