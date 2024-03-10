import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  IGetLoans,
  ILoanAuthority,
  ILoanPayment,
  ILoanReceive,
  ILoans,
} from '../types/loan.interfaces';

class LoanModel extends AbstractModels {
  public async createAuthority(data: ILoanAuthority) {
    const authority = await this.query()
      .into('trabill_loan_authorities')
      .insert({ ...data, authority_org_agency: this.org_agency });

    return authority[0];
  }

  public async editAuthority(
    data: Partial<ILoanAuthority>,
    authority_id: string
  ) {
    const authority = await this.query()
      .into('trabill_loan_authorities')
      .update(data)
      .where('authority_id', authority_id);

    return authority;
  }

  public async getLoanAuthorities(search: string) {
    search && search.toLowerCase();
    const data = await this.query()
      .from('trabill_loan_authorities')
      .select(
        'authority_id',
        'authority_name',
        'authority_mobile',
        'authority_address',
        'authority_create_date',
        'authority_created_by'
      )
      .whereNot('authority_is_deleted', 1)
      .andWhere('authority_org_agency', this.org_agency)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
            .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
        }
      })
      .orderBy('authority_id', 'desc');

    return data;
  }

  public async getALLLoanAuthority(
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const offset = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;
    const data = await this.db('trabill_loan_authorities')
      .select(
        'authority_id',
        'authority_name',
        'authority_mobile',
        'authority_address',
        'authority_create_date',
        'authority_created_by'
      )
      .whereNot('authority_is_deleted', 1)
      .andWhere('authority_org_agency', this.org_agency)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
            .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(authority_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      })
      .orderBy('authority_id', 'desc')
      .limit(size)
      .offset(offset);

    const [{ row_count }] = await this.db('trabill_loan_authorities')
      .count('* as row_count')
      .whereNot('authority_is_deleted', 1)
      .andWhere('authority_org_agency', this.org_agency)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
            .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(authority_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      });

    return { count: row_count, data };
  }

  public async deleteAuthority(
    authority_id: string,
    authority_deleted_by: idType
  ) {
    const authority = await this.query()
      .into('trabill_loan_authorities')
      .update({ authority_is_deleted: 1, authority_deleted_by })
      .where('authority_id', authority_id);

    return authority;
  }

  public async checkAuthorityHaveTransaction(authority_id: idType) {
    const [{ loan_count }] = await this.db('trabill_loans')
      .count('* as loan_count')
      .andWhere('loan_authority_id', authority_id)
      .andWhereNot('loan_is_deleted', 1);

    const [{ payment_count }] = await this.db('trabill_loan_payment')
      .count('* as payment_count')
      .andWhere('payment_authority_id', authority_id)
      .andWhereNot('payment_is_deleted', 1);

    const [{ receive_count }] = await this.db('trabill_loan_received')
      .count('* as loan_count')
      .andWhere('received_authority_id', authority_id)
      .andWhereNot('received_is_deleted', 1);

    const authority_used_count =
      Number(loan_count || 0) +
      Number(payment_count || 0) +
      Number(receive_count || 0);

    return authority_used_count;
  }

  public async createLoan(data: ILoans) {
    const loan = await this.query()
      .into('trabill_loans')
      .insert({ ...data, loan_org_agency: this.org_agency });

    return loan[0];
  }

  public async getLoans(
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .from('trabill_loans')
      .select(
        'loan_id',
        'authority_name',
        'loan_name',
        'loan_type',
        'loan_amount',
        'loan_due_amount',
        'loan_interest_percent',
        'loan_payable_amount',
        'account_name',
        'loan_cheque_no',
        'loan_withdraw_date',
        'loan_bank_name',
        'loan_receivable_amount',
        'loan_payment_type',
        'loan_installment',
        'loan_installment_type',
        'loan_installment_per_day',
        'loan_installment_per_month',
        'loan_installment_duration',
        'loan_date',
        'loan_note',
        this.db.raw('IFNULL(account_name, lcheque_status) as pay_details')
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loans.loan_authority_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loans.loan_account_id'
      )
      .leftJoin('trabill_loan_cheque_details', { lcheque_loan_id: 'loan_id' })

      .where((builder) => {
        builder.andWhere('loan_org_agency', this.org_agency).modify((e) => {
          if (search) {
            builder
              .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(loan_name) LIKE ?', [`%${search}%`])
              .where('loan_org_agency', this.org_agency);
          }
          if (from_date && to_date) {
            builder
              .andWhereRaw(
                `DATE_FORMAT(loan_date, '%Y-%m-%d') BETWEEN ? AND ? `,
                [from_date, to_date]
              )
              .where('loan_org_agency', this.org_agency);
          }
        });
      })

      .andWhere('loan_org_agency', this.org_agency)
      .whereNot('loan_is_deleted', 1)
      .orderBy('loan_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_loans')
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loans.loan_account_id'
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loans.loan_authority_id'
      )
      .where((builder) => {
        builder.andWhere('loan_org_agency', this.org_agency).modify((e) => {
          if (search) {
            builder
              .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(loan_name) LIKE ?', [`%${search}%`])
              .where('loan_org_agency', this.org_agency);
          }
          if (from_date && to_date) {
            builder
              .andWhereRaw(
                `DATE_FORMAT(loan_date, '%Y-%m-%d') BETWEEN ? AND ? `,
                [from_date, to_date]
              )
              .where('loan_org_agency', this.org_agency);
          }
        });
      })

      .andWhere('loan_org_agency', this.org_agency)
      .whereNot('loan_is_deleted', 1);

    return { count: row_count, data };
  }

  public async getLoan(loan_id: idType) {
    const loan = await this.query()
      .from('trabill_loans')
      .select(
        'loan_id',
        'loan_account_id',
        'loan_actransaction_id',
        'loan_vouchar',
        'authority_name',
        'loan_amount',
        'loan_name',
        'loan_type',
        'loan_payment_type',
        'loan_payable_amount',
        'loan_receivable_amount',
        'loan_due_amount',
        'loan_interest_percent',
        'loan_installment',
        'loan_installment_type',
        'loan_installment_per_day',
        'loan_installment_per_month',
        'loan_installment_duration',
        'loan_date',
        'loan_note'
      )
      .leftJoin('trabill_loan_authorities', {
        authority_id: 'loan_authority_id',
      })
      .where('loan_id', loan_id);

    if (loan[0]) {
      return loan as IGetLoans[];
    }

    throw new CustomError(
      'Please provide a valid loan Id',
      400,
      'Invalid Loan'
    );
  }

  public async getPreviousLoan(loan_id: idType) {
    const [loan] = await this.query()
      .from('trabill_loans')
      .select(
        'loan_account_id as prev_account_id',
        'loan_amount as prev_amount',
        'loan_type as prev_loan_type',
        'loan_payment_type as prev_pay_type',
        'loan_actransaction_id as prevAccTrxnId',
        'loan_due_amount as loanDueAmount',
        'loan_charge_id'
      )

      .where('loan_id', loan_id);

    return loan as {
      prev_account_id: number;
      prev_amount: string;
      prev_loan_type: 'GIVING' | 'TAKING' | 'ALREADY_TAKEN' | 'ALREADY_GIVEN';
      prev_pay_type: 1 | 2 | 3 | 4;
      prevAccTrxnId: number;
      loanDueAmount: number;
      loan_charge_id: number;
    };
  }

  public async editLoan(data: Partial<ILoans>, loan_id: number) {
    const loan = await this.query()
      .into('trabill_loans')
      .update(data)
      .where('loan_id', loan_id);

    return loan;
  }

  public async deleteLoanCheque(loan_id: idType, lcheque_deleted_by: idType) {
    const loan = await this.query()
      .into('trabill_loan_cheque_details')
      .update({ lcheque_is_deleted: 1, lcheque_deleted_by })
      .where('lcheque_loan_id', loan_id);

    return loan;
  }

  public async deleteLoan(loan_id: idType, loan_deleted_by: idType) {
    const loan = await this.query()
      .into('trabill_loans')
      .update({ loan_is_deleted: 1, loan_deleted_by })
      .where('loan_id', loan_id);

    return loan;
  }

  public async updateLoanDue(amount: number, loan_id: number) {
    const update = await this.query()
      .into('trabill_loans')
      .update({ loan_due_amount: amount })
      .where('loan_id', loan_id);

    return update;
  }

  public async loansTaking(authority_id: number) {
    const loans = await this.query()
      .select(
        'loan_id',
        'loan_name',
        'loan_type',
        'loan_payable_amount',
        'loan_is_deleted',
        'loan_receivable_amount'
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loans.loan_authority_id'
      )
      .from('trabill_loans')
      .where('loan_org_agency', this.org_agency)
      .andWhere('loan_authority_id', authority_id)
      .andWhereNot('loan_is_deleted', 1)
      .orderBy('loan_name');

    return loans;
  }

  public async loansReceived(authority_id: idType) {
    const loans = await this.query()
      .select(
        'loan_id',
        'loan_name',
        'loan_type',
        'loan_payable_amount',
        'loan_is_deleted',
        'loan_receivable_amount',
        'loan_org_agency'
      )
      .from('trabill_loans')
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loans.loan_authority_id'
      )
      .where('loan_org_agency', this.org_agency)
      .andWhere('loan_authority_id', authority_id)
      .whereIn('loan_type', ['GIVING', 'ALREADY_GIVEN'])
      .andWhereNot('loan_is_deleted', 1)
      .orderBy('loan_name');

    return loans;
  }

  public async addPayment(data: ILoanPayment) {
    const payment = await this.query()
      .into('trabill_loan_payment')
      .insert({ ...data, payment_org_agency: this.org_agency });

    return payment[0];
  }

  public async getPayments(
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .from('trabill_loan_payment')
      .select(
        'payment_id',
        'authority_id',
        'authority_name',
        'loan_id',
        'loan_name',
        'payment_amount',
        'payment_type',
        'account_id',
        'account_acctype_id as type_id',
        'account_name',
        'payment_cheque_no',
        'payment_bank_name',
        'payment_withdraw_date',
        'payment_date',
        'payment_note',
        this.db.raw(
          'CASE WHEN payment_type = 4 THEN "Cheque" WHEN payment_type = 1 THEN "Cash" WHEN payment_type = 2 THEN "Bank" WHEN payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS loan_pay_type'
        ),
        this.db.raw('IFNULL(account_name, lpcheque_status) as pay_details')
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_payment.payment_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_payment.payment_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_payment.payment_account_id'
      )
      .leftJoin(
        this.db.raw(
          `trabill_loan_payment_cheque_details ON lpcheque_payment_id = payment_id AND lpcheque_is_deleted = 0`
        )
      )
      .where('payment_org_agency', this.org_agency)
      .andWhereNot('payment_is_deleted', 1)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw('LOWER(authority_name) LIKE ? ', [`%${search}%`])
            .orWhereRaw('LOWER(loan_name) LIKE ? ', [`%${search}%`])
            .orWhereRaw('LOWER(account_name) LIKE ? ', [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      })
      .orderBy('payment_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_loan_payment')
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_payment.payment_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_payment.payment_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_payment.payment_account_id'
      )
      .where('payment_org_agency', this.org_agency)
      .andWhereNot('payment_is_deleted', 1)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw('LOWER(authority_name) LIKE ? ', [`%${search}%`])
            .orWhereRaw('LOWER(loan_name) LIKE ? ', [`%${search}%`])
            .orWhereRaw('LOWER(account_name) LIKE ? ', [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      });

    return { count: row_count, data };
  }

  public async getPayment(payment_id: number) {
    const payments = await this.query()
      .from('trabill_loan_payment')
      .select(
        'authority_name',
        'loan_amount',
        'loan_name',
        'loan_due_amount',
        'payment_amount',
        'loan_type',
        'account_name',
        'payment_date'
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_payment.payment_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_payment.payment_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_payment.payment_account_id'
      )
      .where('payment_id', payment_id);

    return payments;
  }

  public async getPaymentByLoan(loan_id: idType) {
    const payments = await this.query()
      .select('payment_id')
      .from('trabill_loan_payment')
      .where('payment_loan_id', loan_id)
      .andWhereNot('payment_is_deleted', 1);

    return payments[0];
  }

  public async editPayment(data: Partial<ILoanPayment>, payment_id: number) {
    const payment = await this.query()
      .into('trabill_loan_payment')
      .update(data)
      .where('payment_id', payment_id);

    return payment;
  }
  public async getPrevPaymentData(payment_id: idType) {
    const payment = await this.query()
      .from('trabill_loan_payment')
      .select(
        'payment_amount as prev_payamount',
        'payment_type as prev_paytype',
        'payment_account_id as prev_accountid',
        'payment_actransaction_id as prev_actrxn_id',
        'payment_loan_id',
        'payment_charge_id'
      )
      .where('payment_id', payment_id);

    return payment[0] as {
      prev_paytype: 1 | 2 | 3 | 4;
      prev_payamount: string;
      prev_accountid: number;
      prev_actrxn_id: number;
      payment_loan_id: number;
      payment_charge_id: number;
    };
  }

  public async deletePayment(payment_id: number, payment_deleted_by: idType) {
    const payment = await this.query()
      .into('trabill_loan_payment')
      .update({ payment_is_deleted: 1, payment_deleted_by })
      .where('payment_id', payment_id);

    return payment;
  }

  public async addReceived(data: ILoanReceive) {
    const received = await this.query()
      .into('trabill_loan_received')
      .insert({ ...data, received_org_agency: this.org_agency });

    return received[0];
  }

  public async getReceived(
    is_deleted: idType,
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .from('trabill_loan_received')
      .select(
        'received_id',
        'authority_id',
        'authority_name',
        'loan_id',
        'loan_name',
        'received_amount',
        'received_payment_type as payment_type',
        'account_id',
        'account_acctype_id as type_id',
        'account_name',
        'received_cheque_no',
        'received_bank_name',
        'received_withdraw_date',
        'received_date',
        'received_note',
        this.db.raw(
          'CASE WHEN received_payment_type = 4 THEN "Cheque" WHEN received_payment_type = 1 THEN "Cash" WHEN received_payment_type = 2 THEN "Bank" WHEN received_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS loan_pay_type'
        ),
        this.db.raw('IFNULL(account_name, lrcheque_status) as pay_details')
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_received.received_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_received.received_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_received.received_account_id'
      )
      .leftJoin(
        this.db.raw(
          `trabill_loan_received_cheque_details ON lrcheque_received_id = received_id AND lrcheque_is_deleted = 0`
        )
      )
      .where('received_org_agency', this.org_agency)
      .andWhereNot('received_is_deleted', 1)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw(`LOWER(authority_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(loan_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(received_bank_name) LIKE ?`, [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(received_date,'%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      })
      .orderBy('received_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_loan_received')
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_received.received_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_received.received_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_received.received_account_id'
      )
      .where('received_org_agency', this.org_agency)
      .andWhereNot('received_is_deleted', 1)
      .modify((event) => {
        if (search) {
          event
            .andWhereRaw(`LOWER(authority_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(loan_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
            .orWhereRaw(`LOWER(received_bank_name) LIKE ?`, [`%${search}%`]);
        }
        if (from_date && to_date) {
          event.andWhereRaw(
            `DATE_FORMAT(received_date,'%Y-%m-%d') BETWEEN ? AND ?`,
            [from_date, to_date]
          );
        }
      });

    return { count: row_count, data };
  }

  public async getSingleReceived(received_id: number) {
    const received = await this.query()
      .from('trabill_loan_received')
      .select(
        'trabill_loan_received.received_payment_type',
        'authority_name',
        'loan_name',
        'trabill_loan_received.received_amount',
        'loan_type',
        'account_name',
        'trabill_loan_received.received_date',
        'loan_amount',
        'loan_due_amount'
      )
      .leftJoin(
        'trabill_loan_authorities',
        'trabill_loan_authorities.authority_id',
        'trabill_loan_received.received_authority_id'
      )
      .leftJoin(
        'trabill_loans',
        'trabill_loans.loan_id',
        'trabill_loan_received.received_loan_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_loan_received.received_account_id'
      )
      .where('trabill_loan_received.received_id', received_id);

    return received;
  }

  public async getReceivedByLoan(loan_id: idType) {
    const payments = await this.query()
      .select('received_id')
      .from('trabill_loan_received')
      .where('received_loan_id', loan_id)
      .andWhereNot('received_is_deleted', 1);

    return payments[0];
  }

  public async editReceived(data: Partial<ILoanReceive>, received_id: number) {
    const received = await this.query()
      .into('trabill_loan_received')
      .update(data)
      .where('received_id', received_id);

    return received;
  }

  public async getReceivedInfo(received_id: idType) {
    const loan_received = await this.query()
      .select(
        'received_amount',
        'received_account_id',
        'received_actransaction_id',
        'received_payment_type',
        'received_loan_id',
        'received_charge_id'
      )
      .from('trabill_loan_received')
      .where('received_id', received_id);

    if (loan_received[0]) {
      const received = loan_received[0] as {
        received_amount: number;
        received_account_id: number;
        received_actransaction_id: number;
        received_payment_type: number;
        received_loan_id: number;
        received_charge_id: number;
      };
      return received;
    } else {
      throw new CustomError(
        'Please provide a valid received Id ',
        400,
        'Bad ID'
      );
    }
  }

  public async deleteReceived(
    received_id: number,
    received_deleted_by: idType
  ) {
    const received = await this.query()
      .into('trabill_loan_received')
      .update({ received_is_deleted: 1, received_deleted_by })
      .where('received_id', received_id);

    return received;
  }
}

export default LoanModel;
