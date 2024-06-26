import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import { IUpdateLoanCheque } from '../../cheques/types/cheques.interface';
import {
  IUpdateAdvrCheque,
  IUpdateExpenceCheque,
  IUpdateLPayCheque,
  IUpdateLReceiveCheque,
  IUpdateRefundCheque,
} from '../Interfaces/Notification.Interfaces';

class NotificationModals extends AbstractModels {
  // UPDATE VENDOR ADVR CHEQUE STATUS
  updateVendorAdvrChequeStatus = async (
    updatedData: IUpdateAdvrCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_vendor_advance_return_cheque_details')
      .where('cheque_id', chequeId);
  };

  // UPDATE MONEY RECEIPT CHEQUE STATUS
  updateMoneyReceiptCheque = async (
    updatedData: IUpdateAdvrCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_money_receipts_cheque_details')
      .where('cheque_id', chequeId);
  };

  // UPDATE CLIENT REFUND CHEQUE
  updateClientRefundChequ = async (
    updatedData: IUpdateRefundCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .from('trabill_airticket_refund_client_cheque_details')
      .where('rcheque_id', chequeId);
  };
  // UPDATE VENDOR REFUND CHEQUE
  updateVendorRefundChequ = async (
    updatedData: IUpdateRefundCheque,
    chequeId: idType
  ) => {
    return await this.query()
      .update(updatedData)
      .into('trabill_airticket_refund_vendor_cheque_details')
      .where('rcheque_id', chequeId);
  };

  // LOAN CHEQUE UPDATE
  updateLChequeStatus = async (
    updatedData: IUpdateLoanCheque,
    chequeId: idType
  ) => {
    await this.query()
      .update(updatedData)
      .into('trabill_loan_cheque_details')
      .where('lcheque_id', chequeId);
  };

  updateExpenceChequeStatus = async (
    updatedData: IUpdateExpenceCheque,
    chequeId: idType
  ) => {
    const success = await this.query()
      .update(updatedData)
      .into('trabill_expense_cheque_details')
      .where('expcheque_id', chequeId);

    if (success) {
      return success;
    } else {
      throw new CustomError(
        'Please provide valid data and valid id',
        400,
        'Invalid id'
      );
    }
  };

  public getExpirePassport = async (today: Date, priorDate: Date) => {
    const passports = await this.query()
      .select(
        'passport_passport_no',
        'passport_name',
        'passport_mobile_no',
        'passport_email',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'passport_create_date',
        'passport_client_id'
      )
      .from('trabill_passport_details')
      .where('passport_org_agency', this.org_agency)
      .andWhereNot('passport_is_deleted', 1)
      .whereBetween('passport_date_of_expire', [today, priorDate])
      .orderBy('passport_date_of_expire');

    const countPassport = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_passport_details')
      .where('passport_org_agency', this.org_agency)
      .andWhereNot('passport_is_deleted', 1)
      .whereBetween('passport_date_of_expire', [today, priorDate])
      .orderBy('passport_date_of_expire');

    return { count: countPassport[0].total, passports };
  };

  public getCollectionCheque = async (chequeStatus: string) => {
    const loanCheques = await this.query()
      .select(
        'lcheque_number as cheque_number',
        'lcheque_amount as amount',
        'lcheque_withdraw_date as cheque_withdraw_date',
        'lcheque_bank_name as cheque_bank_name',
        'lcheque_status as cheque_status',
        'lcheque_account_id as account_id',
        'account_name',
        'lcheque_id'
      )
      .from('trabill_loan_cheque_details')
      .leftJoin('trabill_accounts', { lcheque_account_id: 'account_id' })
      .leftJoin('trabill_loans', { loan_id: 'lcheque_loan_id' })
      .where('loan_org_agency', this.org_agency)
      .andWhere('lcheque_status', chequeStatus)
      .andWhereNot('lcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const moneyReciptCheques = await this.query()
      .from('trabill_money_receipts_cheque_details')
      .leftJoin('trabill_money_receipts', { receipt_id: 'cheque_receipt_id' })
      .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
      .where('cheque_status', chequeStatus)
      .andWhere('receipt_org_agency', this.org_agency)
      .andWhereNot('receipt_has_deleted', 1)
      .andWhereNot('cheque_is_deleted', 1)
      .select(
        'cheque_number',
        'receipt_total_amount as amount',
        'cheque_withdraw_date',
        'cheque_bank_name',
        'cheque_status',
        'receipt_client_id as client_id',
        'client_name',
        'cheque_receipt_id',
        'cheque_id'
      );

    const refundClientCheques = await this.query()
      .from('trabill_airticket_refund_client_cheque_details')
      .leftJoin('trabill_clients', { client_id: 'rcheque_client_id' })
      .where('rcheque_status', chequeStatus)
      .leftJoin('trabill_airticket_refunds', {
        atrefund_id: 'rcheque_atrefund_id',
      })
      .where('atrefund_org_agency', this.org_agency)
      .select(
        'rcheque_cheque_no as cheque_number',
        'rcheque_amount as amount',
        'rcheque_withdraw_date as cheque_withdraw_date',
        'rcheque_bank_name as cheque_bank_name',
        'rcheque_status as cheque_status',
        'rcheque_client_id as client_id',
        'client_name',
        'rcheque_crefund_id',
        'rcheque_id as cheque_id'
      );

    const refundVendorCheques = await this.query()
      .from('trabill_airticket_refund_vendor_cheque_details')
      .where('rcheque_status', chequeStatus)
      .leftJoin('trabill_vendors', { rcheque_vendor_id: 'vendor_id' })
      .leftJoin('trabill_airticket_refunds', {
        atrefund_id: 'rcheque_atrefund_id',
      })
      .where('atrefund_org_agency', this.org_agency)
      .select(
        'rcheque_cheque_no as cheque_number',
        'rcheque_amount as amount',
        'rcheque_withdraw_date as cheque_withdraw_date',
        'rcheque_bank_name as cheque_bank_name',
        'rcheque_status as cheque_status',
        'rcheque_vendor_id as vendor_id',
        'rcheque_vendor_id',
        'vendor_name',
        'rcheque_id as cheque_id'
      );

    const VendorAdvrCheque = await this.query()
      .select(
        'cheque_number',
        'advr_amount as amount',
        'cheque_withdraw_date',
        'cheque_bank_name',
        'cheque_status',
        'cheque_vendor_id as vendor_id',
        'vendor_name',
        'cheque_advr_id',
        'cheque_id'
      )
      .from('trabill_vendor_advance_return_cheque_details')
      .leftJoin('trabill_vendor_advance_return', { advr_id: 'cheque_advr_id' })
      .leftJoin('trabill_vendors', { cheque_vendor_id: 'vendor_id' })
      .where('vendor_org_agency', this.org_agency)
      .andWhere('cheque_status', chequeStatus)
      .andWhereNot('cheque_is_deleted', 1);

    return [
      ...loanCheques,
      ...moneyReciptCheques,
      ...refundClientCheques,
      ...refundVendorCheques,
      ...VendorAdvrCheque,
    ];
  };

  getCollectionChequeCount = async (chequeStatus: string) => {
    const loanCheque = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_loan_cheque_details')
      .leftJoin('trabill_loans', { loan_id: 'lcheque_loan_id' })
      .where('loan_org_agency', this.org_agency)
      .andWhere('lcheque_status', chequeStatus)
      .andWhereNot('lcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const VendorAdvrCheque = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_vendor_advance_return_cheque_details')
      .leftJoin('trabill_vendors', { vendor_id: 'cheque_vendor_id' })
      .where('vendor_org_agency', this.org_agency)
      .where('cheque_status', chequeStatus)
      .andWhereNot('cheque_is_deleted', 1);

    const moneyReceiptCheque = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_money_receipts_cheque_details')
      .leftJoin('trabill_money_receipts', { receipt_id: 'cheque_receipt_id' })
      .where('receipt_org_agency', this.org_agency)
      .where('cheque_status', chequeStatus)
      .andWhereNot('receipt_has_deleted', 1)
      .andWhereNot('cheque_is_deleted', 1);

    const refundClientCheques = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_airticket_refund_client_cheque_details')
      .leftJoin('trabill_airticket_refunds', {
        atrefund_id: 'rcheque_atrefund_id',
      })
      .where('atrefund_org_agency', this.org_agency)
      .where('rcheque_status', chequeStatus);

    const refundVendorCheques = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_airticket_refund_vendor_cheque_details')
      .leftJoin('trabill_airticket_refunds', {
        atrefund_id: 'rcheque_atrefund_id',
      })
      .where('atrefund_org_agency', this.org_agency)
      .where('rcheque_status', chequeStatus);

    const payrollCheques = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_payroll_cheque_details')
      .leftJoin('trabill_payroll', { payroll_id: 'pcheque_payroll_id' })
      .where('payroll_org_agency', this.org_agency)
      .where('pcheque_status', chequeStatus)
      .andWhereNot('pcheque_is_deleted', 1);

    return (
      loanCheque[0].total +
      moneyReceiptCheque[0].total +
      refundClientCheques[0].total +
      refundVendorCheques[0].total +
      VendorAdvrCheque[0].total +
      payrollCheques[0].total
    );
  };

  getPendingPaymentCheque = async (chequeStatus: string) => {
    const advrCheques = await this.query()
      .select(
        'cheque_number',
        'advr_amount as amount',
        'cheque_withdraw_date',
        'cheque_bank_name',
        'cheque_status',
        'advr_create_date as create_date',
        'advr_client_id as client_id',
        'client_name',
        'cheque_id'
      )
      .from('trabill_advance_return_cheque_details')
      .leftJoin('trabill_advance_return', { advr_id: 'cheque_advr_id' })
      .leftJoin('trabill_clients', { client_id: 'advr_client_id' })
      .where('cheque_status', chequeStatus)
      .andWhere('advr_org_agency', this.org_agency)
      .andWhereNot('cheque_is_deleted', 1);

    const loanPCheques = await this.query()
      .select(
        'lpcheque_number as cheque_number',
        'lpcheque_amount as amount',
        'lpcheque_withdraw_date as cheque_withdraw_date',
        'lpcheque_bank_name as cheque_bank_name',
        'lpcheque_status as cheque_status',
        'lpcheque_account_id as account_id',
        'lpcheque_id',
        'lpcheque_create_date as create_date'
      )
      .from('trabill_loan_payment_cheque_details')
      .leftJoin('trabill_loans', { loan_id: 'lpcheque_id' })
      .where('loan_org_agency', this.org_agency)
      .andWhere('lpcheque_status', chequeStatus)
      .andWhereNot('lpcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const loanRCheques = await this.query()
      .select(
        'lrcheque_number as cheque_number',
        'lrcheque_amount as amount',
        'lrcheque_withdraw_date as cheque_withdraw_date',
        'lrcheque_bank_name as cheque_bank_name',
        'lrcheque_status as cheque_status',
        'lrcheque_account_id as account_id',
        'lrcheque_id',
        'lrcheque_create_date as create_date'
      )
      .from('trabill_loan_received_cheque_details')
      .leftJoin('trabill_loan_received', {
        received_id: 'lrcheque_received_id',
      })
      .leftJoin('trabill_loans', { loan_id: 'received_loan_id' })
      .where('loan_org_agency', this.org_agency)
      .andWhere('lrcheque_status', chequeStatus)
      .andWhereNot('lrcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const expenceCheques = await this.query()
      .select(
        'expcheque_number as cheque_number',
        'expcheque_amount as amount',
        'expcheque_withdraw_date as cheque_withdraw_date',
        'expcheque_bank_name as cheque_bank_name',
        'expcheque_status as cheque_status',
        'expense_accounts_id as account_id',
        'expcheque_id',
        'expcheque_create_date as create_date'
      )
      .from('trabill_expense_cheque_details')
      .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
      .where('expense_org_agency', this.org_agency)
      .andWhere('expcheque_status', chequeStatus)
      .andWhereNot('expcheque_is_deleted', 1);

    const payrollCheques = await this.query()
      .select(
        'pcheque_payroll_id',
        'pcheque_number as cheque_number',
        'pcheque_amount as amount',
        'pcheque_withdraw_date as cheque_withdraw_date',
        'pcheque_bank_name as cheque_bank_name',
        'pcheque_status as cheque_status',
        'pcheque_id as cheque_id',
        'pcheque_create_date as create_date'
      )
      .from('trabill_payroll_cheque_details')
      .leftJoin('trabill_payroll', { payroll_id: 'pcheque_payroll_id' })
      .where('payroll_org_agency', this.org_agency)
      .andWhere('pcheque_status', chequeStatus)
      .andWhere('pcheque_is_deleted', 0);

    return [
      ...advrCheques,
      ...loanPCheques,
      ...loanRCheques,
      ...expenceCheques,
      ...payrollCheques,
    ];
  };

  getPendingPaymentChequeCount = async (chequeStatus: string) => {
    const advrCheque = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_advance_return_cheque_details')
      .leftJoin('trabill_advance_return', { advr_id: 'cheque_advr_id' })
      .where('cheque_status', chequeStatus)
      .andWhere('advr_org_agency', this.org_agency)
      .andWhereNot('cheque_is_deleted', 1);

    const loanPCheque = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_loan_payment_cheque_details')
      .leftJoin('trabill_loans', { loan_id: 'lpcheque_id' })
      .where('loan_org_agency', this.org_agency)
      .where('lpcheque_status', chequeStatus)
      .andWhereNot('lpcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const loanRCheques = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_loan_received_cheque_details')
      .leftJoin('trabill_loan_received', {
        received_id: 'lrcheque_received_id',
      })
      .leftJoin('trabill_loans', { loan_id: 'received_loan_id' })
      .where('loan_org_agency', this.org_agency)
      .where('lrcheque_status', chequeStatus)
      .andWhereNot('lrcheque_is_deleted', 1)
      .andWhereNot('loan_is_deleted', 1);

    const expenceCheques = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_expense_cheque_details')
      .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
      .where('expense_org_agency', this.org_agency)
      .andWhere('expcheque_status', chequeStatus)
      .andWhereNot('expcheque_is_deleted', 1);

    const [payroll] = await this.query()
      .select(this.db.raw("count('*') as total"))
      .from('trabill_payroll_cheque_details')
      .leftJoin('trabill_payroll', { payroll_id: 'pcheque_payroll_id' })
      .where('payroll_org_agency', this.org_agency)
      .andWhere('pcheque_status', chequeStatus)
      .andWhere('pcheque_is_deleted', 0);

    return (
      advrCheque[0].total +
      loanPCheque[0].total +
      loanRCheques[0].total +
      +expenceCheques[0].total +
      payroll.total
    );
  };

  // INVOICE DUE
  getDueInvoiceData = async (page: number = 1, size: number = 20) => {
    const agency = this.org_agency;

    const offset = (page - 1) * size;

    const invoice = await this.query()
      .select(
        'invoice_id',
        'invclientpayment_amount as total_payment',
        'invoice_category_id',
        'comb_client',
        'invoice_no',
        'invoice_create_date',
        'net_total as invoice_net_total',
        'sales_by',
        'client_name',
        'mobile as client_mobile',
        'invoice_date',
        'invoice_create_date'
      )
      .from('v_all_inv')
      .where(function () {
        this.whereRaw('(net_total - invclientpayment_amount) > 0')
          .andWhereNot('invoice_is_refund', 1)
          .andWhere('invoice_org_agency', agency);
      })
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('v_all_inv')
      .where(function () {
        this.whereRaw('(net_total - invclientpayment_amount) > 0')
          .andWhereNot('invoice_is_refund', 1)
          .andWhere('invoice_org_agency', agency);
      })) as { count: number }[];

    return { count, data: invoice };
  };

  getVisaDeliveryData = async (today: Date) => {
    const data = await this.query()
      .select(
        'trabill_invoice_visa_billing_infos.*',
        'invoice_no',
        this.db.raw('COALESCE(client_name, combine_name) AS client_name'),
        'client_id',
        'product_name',
        'country_name as visiting_country_name',
        'client_email',
        'client_mobile'
      )
      .from('trabill_invoice_visa_billing_infos')
      .join('trabill_invoices', { billing_invoice_id: 'invoice_id' })
      .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'invoice_combined_id',
      })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_countries', {
        country_id: 'billing_visiting_country_id',
      })
      .where('invoice_org_agency', this.org_agency)
      .andWhereNot('billing_is_deleted', 1);

    const invoices = [];

    for (const item of data) {
      const deliveryDate =
        item.billing_delivery_date &&
        item?.billing_delivery_date.toLocaleDateString();

      if (deliveryDate === today) {
        invoices.push(item);
      }
    }

    const visa_pending = await this.query()
      .select(
        'trabill_invoice_visa_billing_infos.*',
        'invoice_no',
        this.db.raw('COALESCE(client_name, ccl.combine_name) AS client_name'),
        'client_id',
        'product_name',
        'country_name as visiting_country_name',
        'client_email',
        'client_mobile',
        'vendor_name'
      )
      .from('trabill_invoice_visa_billing_infos')
      .join('trabill_invoices', { billing_invoice_id: 'invoice_id' })
      .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
      .leftJoin('trabill_combined_clients AS ccl', {
        'ccl.combine_id': 'invoice_combined_id',
      })
      .leftJoin('trabill_vendors', { vendor_id: 'billing_vendor_id' })
      .leftJoin('trabill_combined_clients AS vcl', {
        'vcl.combine_id': 'billing_combined_id',
      })
      .leftJoin('trabill_products', { product_id: 'billing_product_id' })
      .leftJoin('trabill_countries', {
        country_id: 'billing_visiting_country_id',
      })
      .where('invoice_org_agency', this.org_agency)
      .andWhere('billing_status', 'Pending')
      .andWhereNot('billing_is_deleted', 1);

    return {
      visa_delivery: { count: invoices.length, invoices },
      visa_pending: { count: visa_pending.length, invoices: visa_pending },
    };
  };

  public async getNextExpirePassport(page: number, size: number) {
    const offset = (page - 1) * size;

    const data = await this.query()
      .select(
        'passport_id',
        this.db.raw(`COALESCE(client_name, combine_name) AS client_name`),
        'passport_name',
        'passport_passport_no',
        'passport_email',
        'passport_nid_no',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'passport_create_date'
      )
      .from('trabill_passport_details')
      .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'passport_combined_id',
      })
      .where('passport_org_agency', this.org_agency)
      .andWhereNot('passport_is_deleted', 1)
      .andWhereBetween('passport_date_of_expire', [
        this.db.raw(`NOW()`),
        this.db.raw(`NOW() + INTERVAL 6 MONTH`),
      ])
      .orderBy('passport_date_of_expire', 'desc')
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_passport_details')
      .where('passport_org_agency', this.org_agency)
      .andWhereNot('passport_is_deleted', 1)
      .andWhereBetween('passport_date_of_expire', [
        this.db.raw(`NOW()`),
        this.db.raw(`NOW() + INTERVAL 6 MONTH`),
      ])) as { count: number }[];

    return { count, data };
  }
}

export default NotificationModals;
