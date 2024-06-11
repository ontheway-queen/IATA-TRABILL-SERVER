import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import { getClientOrCombId } from '../../../common/helpers/invoice.helpers';
import {
  IAcTrxn,
  IClTrxnBody,
} from '../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../common/types/common.types';
import { IOnlineTrxnCharge } from '../../accounts/types/account.interfaces';
import { IAgentProfileTransaction } from '../../clients/agents_profile/Type/agent_profile.interfaces';
import {
  IAgentComReceipt,
  IInvoiceClPay,
  IMoneyReceiptChequeStatus,
  IMoneyReceiptChequeStatusUpdate,
  IMoneyReceiptCheques,
  IMoneyReceiptDb,
} from '../Type/MoneyReceipt.Interfaces';
import AddAdvanceReturn from './NarrowServices/AddAdvanceReturn';
import AddMoneyReceipt from './NarrowServices/AddMoneyReceipt';
import DeleteAdvanceReturn from './NarrowServices/DeleteAdvanceReturn';
import DeleteMoneyReceipt from './NarrowServices/DeleteMoneyReceipt';
import EditAdvanceReturn from './NarrowServices/EditAdvanceReturn';
import EditMoneyReceipt from './NarrowServices/EditMoneyReceipt';
import { getPaymentType } from '../../../common/utils/libraries/lib';

class MoneyReceiptServices extends AbstractServices {
  constructor() {
    super();
  }

  /* *****************************************
  =============== Narrow Services =============
  ********************************************/
  public addMoneyReceipt = new AddMoneyReceipt().addMoneyReceipt;
  public editMoneyReceipt = new EditMoneyReceipt().editMoneyReceipt;
  public deleteMoneyReceipt = new DeleteMoneyReceipt().deleteMoneyReceipt;

  public agentCommissionReceiptAdd = async (req: Request) => {
    const {
      account_id,
      receipt_agent_amount,
      receipt_agent_id,
      receipt_created_by,
      receipt_payment_date,
      receipt_payment_type,
      cheque_bank_name,
      cheque_number,
      cheque_withdraw_date,
      receipt_note,
      receipt_money_receipt_no,
      invoice_id,
      charge_amount,
      receipt_payment_to,
      receipt_trxn_no,
    } = req.body as IAgentComReceipt;

    return await this.models.db.transaction(async (trx) => {
      const agent_conn = this.models.agentProfileModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const conn = this.models.MoneyReceiptModels(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'AGP');

      let receipt_actransaction_id;
      let receipt_agent_trxn_id;
      let receipt_id;

      if (receipt_payment_type !== 4) {
        const agentLBalance = await agent_conn.getAgentLastBalance(
          receipt_agent_id
        );

        const agentTransactionData: IAgentProfileTransaction = {
          agtrxn_agency_id: req.agency_id,
          agtrxn_voucher: vouchar_no,
          agtrxn_created_by: receipt_created_by,
          agtrxn_particular_id: 62,
          agtrxn_type: 'CREDIT',
          agtrxn_agent_id: receipt_agent_id,
          agtrxn_amount: receipt_agent_amount,
          agtrxn_particular_type: 'AGENT_COMMISSION',
          agtrxn_note: receipt_note,
        };

        receipt_agent_trxn_id = await agent_conn.insertAgentTransaction(
          agentTransactionData
        );

        let accPayType = getPaymentType(receipt_payment_type);

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: receipt_agent_amount,
          acctrxn_created_at: receipt_payment_date,
          acctrxn_created_by: receipt_created_by,
          acctrxn_note: receipt_note,
          acctrxn_particular_id: 62,
          acctrxn_particular_type: 'Agent commission',
          acctrxn_pay_type: accPayType,
        };

        receipt_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);
      }

      let receipt_trxn_charge_id: number | null = null;
      if (receipt_payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_amount: Number(charge_amount),
          charge_purpose: 'Invoice agent commission',
          charge_note: receipt_note,
        };

        receipt_trxn_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const receiptInfo: IMoneyReceiptDb = {
        receipt_trnxtype_id: 62,
        receipt_vouchar_no: vouchar_no,
        receipt_note,
        receipt_actransaction_id,
        receipt_total_amount: receipt_agent_amount,
        receipt_payment_type,
        receipt_payment_date,
        receipt_created_by,
        receipt_payment_status: 'SUCCESS',
        receipt_agent_amount,
        receipt_agent_id,
        receipt_agent_trxn_id,
        receipt_payment_to,
        receipt_invoice_id: invoice_id,
        receipt_money_receipt_no,
        receipt_client_id: null,
        receipt_combined_id: null,
        receipt_trxn_charge: charge_amount,
        receipt_trxn_charge_id,
        receipt_account_id: account_id,
        receipt_trxn_no,
        receipt_received_by: null,
      };

      receipt_id = await conn.insertMoneyReceipt(receiptInfo);

      if (receipt_payment_type == 4) {
        const moneyReceiptChequeData: IMoneyReceiptCheques = {
          cheque_receipt_id: receipt_id,
          cheque_number: cheque_number as number,
          cheque_withdraw_date: cheque_withdraw_date as string,
          cheque_bank_name: cheque_bank_name as string,
          cheque_status: 'PENDING',
        };
        await conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
      }

      if (invoice_id) {
        const history_data: InvoiceHistory = {
          history_activity_type: 'INVOICE_AGENT_COMMISSION',
          history_invoice_id: invoice_id,
          history_created_by: receipt_created_by,
          history_invoice_payment_amount: receipt_agent_amount,
          invoicelog_content: `Payment added to Agent commission (Amount = ${receipt_agent_amount})/-`,
        };

        await common_conn.insertInvoiceHistory(history_data);

        await conn.updateAgentAmountPaid(invoice_id, 1);
      }

      await this.updateVoucher(req, 'AGP');

      await this.insertAudit(
        req,
        'create',
        `Agent commission has been added ${receipt_agent_amount}/-`,
        receipt_created_by,
        'MONEY_RECEIPT'
      );

      return {
        success: true,
        message: `Payment has been added to Agent commission (Amount = ${receipt_agent_amount})/-`,
        data: { receipt_id },
      };
    });
  };

  public deleteAgentMoneyRecipt = async (req: Request) => {
    const { receipt_id } = req.params as { receipt_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const agent_conn = this.models.agentProfileModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      let previousData = await conn.getPrevAgentCommissionInfo(receipt_id);
      let chequeInfo = await conn.getMoneyReceiptChequeInfo(receipt_id);

      await conn.deletePrevMoneyReceiptChequeInfo(receipt_id, deleted_by);
      await conn.deleteMoneyreceipt(receipt_id, deleted_by);
      if (
        previousData?.receipt_payment_type !== 4 ||
        (previousData?.receipt_payment_type === 4 &&
          chequeInfo?.cheque_status === 'DEPOSIT')
      ) {
        await new Trxns(req, trx).deleteAccTrxn(
          previousData?.prevAccTrxnId as number
        );
      }

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_PAYMENT_DELETED',
        history_invoice_id: previousData?.prevInvoiceId,
        history_created_by: deleted_by,
        history_invoice_payment_amount: previousData?.prevReceiptTotal,
        invoicelog_content: `Payment deleted to Invoice (Amount = ${previousData?.prevReceiptTotal})/-`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await conn.updateAgentAmountPaid(previousData?.prevInvoiceId, 0);

      await this.insertAudit(
        req,
        'delete',
        `Money receipt has been deleted `,
        deleted_by,
        'MONEY_RECEIPT'
      );

      return { success: true, message: 'Agent Payment deleted successfully' };
    });
  };

  // @VIEW_MONEY_RECEIPT
  public viewMoneyReceipt = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.getViewMoneyReceipt(id);
    return {
      success: true,
      data,
    };
  };

  public viewMoneyReceiptDetails = async (req: Request) => {
    const id = Number(req.params.receipt_id);

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewMoneyReceiptDetails(id);
    return {
      success: true,
      data,
    };
  };

  // @GET_INVOICE_DUE
  public getInvoiceDue = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.getInvoiceDue(id);

    return {
      success: true,
      data,
    };
  };

  // @GET_DATA_FOR_EDIT
  public getDataForEdit = async (req: Request) => {
    const conn = this.models.MoneyReceiptModels(req);
    const id = Number(req.params.id);

    const moneyReceipt = await conn.getMoneyReceiptById(id);

    return {
      success: true,
      data: moneyReceipt,
    };
  };

  // view agent profile
  public viewAgentCommission = async (req: Request) => {
    const { receipt_id } = req.params;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewAgentCommission(receipt_id);

    return {
      success: true,
      data,
    };
  };
  // view money receipts invoices
  public viewMoneyReceiptsInvoices = async (req: Request) => {
    const { receipt_id } = req.params;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewMoneyReceiptsInvoices(receipt_id);

    return {
      success: true,
      data,
    };
  };

  //
  public viewAgentInvoiceById = async (req: Request) => {
    const { id } = req.params;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewAgentInvoiceById(id);

    return {
      success: true,
      data,
    };
  };

  //============================= @GET_ALL_MONEY_RECEIPT
  public getAllMoneyReceipt = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const data = await this.models
      .MoneyReceiptModels(req)
      .getAllMoneyReceipt(
        Number(page) || 1,
        Number(size) || 20,
        search,
        from_date,
        to_date
      );

    const total = await this.models
      .MoneyReceiptModels(req)
      .sumMoneyReceiptAmount(search, from_date, to_date);

    return {
      success: true,
      message: 'All Money Receipt',
      count: data.count,
      data: { data: data.data, ...total },
    };
  };

  public getAllAgentMoneyReceipt = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const data = await this.models
      .MoneyReceiptModels(req)
      .getAllAgentMoneyReceipt(
        Number(page) || 1,
        Number(size) || 20,
        search,
        from_date,
        to_date
      );

    return {
      success: true,
      message: 'All Agent Money Receipt',
      ...data,
    };
  };

  public getInvoiceAndTicketNoByClient = async (req: Request) => {
    const client_id = req.params.clientId;
    const conn = this.models.MoneyReceiptModels(req);

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      client_id
    );

    const pay_to = req.params.payment_to as 'INVOICE' | 'TICKET';

    const client_lbalance = await this.models
      .combineClientModel(req)
      .getClientLastBalanceById(
        invoice_client_id as number,
        invoice_combined_id as number
      );

    // ================= @PAY TO INVOICE=====================
    if (pay_to === 'INVOICE') {
      let money_receipt: {
        invoice_id: number;
        invoice_net_total: number;
        total_pay_amount: number;
      }[] = [];

      const data = await conn.getInvoiceByClientCombined(
        invoice_client_id as number,
        invoice_combined_id as number
      );
      money_receipt = data;

      return {
        success: true,
        data: { client_lbalance, money_receipt },
      };
    } else if (pay_to === 'TICKET') {
      let money_receipt: {
        invoice_id: number;
        invoice_net_total: number;
        total_pay_amount: number;
      }[] = [];

      const data = await conn.getSpecificTicketByClient(
        invoice_client_id as number,
        invoice_combined_id as number
      );
      money_receipt = data;

      return {
        success: true,
        data: { client_lbalance, money_receipt },
      };
    }

    return {
      success: true,
      data: { client_lbalance, money_receipt: [] },
    };
  };
  public getInvoiceByClientCombinedForEdit = async (req: Request) => {
    const client_id = req.params.clientId;
    const conn = this.models.MoneyReceiptModels(req);

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      client_id
    );

    const pay_to = req.params.payment_to as 'INVOICE' | 'TICKET';

    const client_lbalance = await this.models
      .combineClientModel(req)
      .getClientLastBalanceById(
        Number(invoice_client_id),
        Number(invoice_combined_id)
      );

    // ================= @PAY TO INVOICE=====================
    if (pay_to === 'INVOICE') {
      let money_receipt: {
        invoice_id: number;
        invoice_net_total: number;
        total_pay_amount: number;
      }[] = [];

      const data = await conn.getInvoiceByClientCombinedForEdit(
        invoice_client_id as number,
        invoice_combined_id as number
      );
      money_receipt = data;

      return {
        success: true,
        data: { client_lbalance, money_receipt },
      };
    } else if (pay_to === 'TICKET') {
      let money_receipt: {
        invoice_id: number;
        invoice_net_total: number;
        total_pay_amount: number;
      }[] = [];

      const data = await conn.getSpecificTicketByClientForEdit(
        invoice_client_id as number,
        invoice_combined_id as number
      );
      money_receipt = data;

      return {
        success: true,
        data: { client_lbalance, money_receipt },
      };
    }

    return {
      success: true,
      data: { client_lbalance, money_receipt: [] },
    };
  };

  // ADD_INVOICE_MONEY_RECEIPT
  addInvoiceMoneyReceipt = async (req: Request) => {
    const invoice_id = Number(req.params.id);

    const { invoice_combclient_id, invoice_created_by } = req.body as {
      invoice_combclient_id: string;
      invoice_created_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const { invoice_client_id, invoice_combined_id } = getClientOrCombId(
        invoice_combclient_id
      );

      // MONEY RECEIPT
      const moneyReceiptInvoice: ICommonMoneyReceiptInvoiceData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id,
      };
      const data = await new CommonAddMoneyReceipt().commonAddMoneyReceipt(
        req,
        moneyReceiptInvoice,
        trx
      );

      await this.insertAudit(
        req,
        'create',
        `Invoice money receipt has been added`,
        invoice_created_by,
        'MONEY_RECEIPT'
      );
      return {
        success: true,
        message: 'Invoice money receipt has been added',
        data,
      };
    });
  };

  // UPATE MONEY RECEIPT CHEQUE STATUS
  updateMoneyReceiptChequeStatus = async (req: Request) => {
    const {
      comb_client,
      receipt_total_amount,
      created_by,
      invoice_id,
      account_id,
      receipt_id,
      payment_date,
      cheque_status,
      cheque_note,
    } = req.body as IMoneyReceiptChequeStatus;

    return await this.models.db.transaction(async (trx) => {
      const { client_id, combined_id } = separateCombClientToId(comb_client);

      const client_conn = this.models.clientModel(req);
      const combined_conn = this.models.combineClientModel(req);
      const trxns = new Trxns(req, trx);
      const conn_acc = this.models.accountsModel(req);
      const conn = this.models.MoneyReceiptModels(req);

      let chequeMessage: string = '';

      let chequeStatusData: IMoneyReceiptChequeStatusUpdate = {};

      if (cheque_status === 'BOUNCE') {
        chequeStatusData = {
          cheque_bounce_date: payment_date,
          cheque_bounce_note: cheque_note,
        };

        chequeMessage = `Money receipt cheque has been bounced`;
      } else if (cheque_status === 'DEPOSIT') {
        chequeStatusData = {
          cheque_deposit_date: payment_date,
          cheque_deposit_note: cheque_note,
        };
      } else if (cheque_status === 'RETURN') {
        chequeStatusData = {
          cheque_return_date: payment_date,
          cheque_return_note: cheque_note,
        };

        chequeMessage = `MONEY receipt cheque has been return`;
      }

      await this.insertAudit(
        req,
        'update',
        chequeMessage,
        created_by,
        'MONEY_RECEIPT'
      );

      await conn.MoneyReceiptChequeStatus(chequeStatusData, receipt_id);

      if (['BOUNCE', 'RETURN'].includes(cheque_status)) {
        return {
          success: true,
          message: 'Money receipt cheque has been bounced or returned',
        };
      }

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'CREDIT',
        ctrxn_amount: receipt_total_amount,
        ctrxn_cl: comb_client,
        ctrxn_voucher: '',
        ctrxn_particular_id: 29,
        ctrxn_created_at: payment_date,
        ctrxn_note: cheque_note,
        ctrxn_particular_type: 'Money receipt',
      };

      const clientTrxnId = await trxns.clTrxnInsert(clTrxnBody);

      const AccTrxnBody: IAcTrxn = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_voucher: '',
        acctrxn_amount: receipt_total_amount,
        acctrxn_created_at: payment_date,
        acctrxn_created_by: created_by,
        acctrxn_note: cheque_note,
        acctrxn_particular_id: 2,
        acctrxn_particular_type: 'Money receipt cheque',
        acctrxn_pay_type: 'CASH',
      };

      await trxns.AccTrxnInsert(AccTrxnBody);

      const invoiceClientPaymentInfo: IInvoiceClPay = {
        invclientpayment_moneyreceipt_id: receipt_id,
        invclientpayment_invoice_id: invoice_id,
        invclientpayment_client_id: client_id,
        invclientpayment_combined_id: combined_id,
        invclientpayment_cltrxn_id: clientTrxnId as number,
        invclientpayment_amount: receipt_total_amount,
        invclientpayment_date: payment_date,
        invclientpayment_collected_by: created_by as number,
      };
      await conn.insertInvoiceClPay(invoiceClientPaymentInfo);

      await this.insertAudit(
        req,
        'update',
        `Money receipt has been deposit ${receipt_total_amount}/-`,
        created_by,
        'MONEY_RECEIPT'
      );
      return {
        success: true,
        message: 'Money receipt cheque has been deposit',
      };
    });
  };

  public viewChequeInfoById = async (req: Request) => {
    const { cheque_id } = req.params;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewChequeInfoById(cheque_id);

    return {
      success: true,
      data,
    };
  };

  // ===================== @ ADVANCE RETURN @ ===================
  public addAdvanceReturn = new AddAdvanceReturn().addAdvanceReturn;
  public editAdvanceReturn = new EditAdvanceReturn().editAdvanceReturn;
  public deleteAdvanceReturn = new DeleteAdvanceReturn().deleteAdvanceReturn;

  public getAllAdvanceReturn = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.getAllAdvr(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Advance Return',
      ...data,
    };
  };
  public getAdvrForEdit = async (req: Request) => {
    const id = req.params.id;
    const conn = this.models.MoneyReceiptModels(req);
    const data = await conn.getAdvrForEdit(id);

    return {
      success: true,
      data,
    };
  };

  // get all agent invoice by id
  public getAllAgentInvoiceById = async (req: Request) => {
    const id = req.params.invoice_id;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.getAllAgentInvoiceById(id);

    return {
      success: true,
      data,
    };
  };

  public viewAllAgentInvoice = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.MoneyReceiptModels(req);

    const data = await conn.viewAllAgentInvoice(search as string);

    return {
      success: true,
      data,
    };
  };
}

export default MoneyReceiptServices;
