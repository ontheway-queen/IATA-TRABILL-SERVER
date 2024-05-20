import AgentProfileModels from '../../modules/clients/agents_profile/Models/agent_profile.models';
import { IAgentProfileTransaction } from '../../modules/clients/agents_profile/Type/agent_profile.interfaces';
import CommonInvoiceModel from '../model/CommonInvoice.models';
import {
  ClientComType,
  InvoiceMoneyReceiptType,
  idType,
} from '../types/common.types';
import CustomError from '../utils/errors/customError';

class InvoiceHelpers {
  public static invoiceAgentTransactions = async (
    models: AgentProfileModels,
    agtrxn_agency_id: idType,
    agent_id: number,
    invoice_id: idType,
    invoice_no: string,
    user_id: number,
    commission_amount: number,
    transaction: 'CREATE' | 'UPDATE' | 'DELETE',
    agtransaction_trnxtype_id: number,
    particular: string,
    note?: string
  ) => {
    if (!agent_id || !commission_amount || Number(commission_amount) === 0) {
      return;
    }

    const agent_last_balance = await models.getAgentLastBalance(agent_id);

    const agentTransactionData: IAgentProfileTransaction = {
      agtrxn_agency_id,
      agtrxn_invoice_id: invoice_id,
      agtrxn_agent_id: agent_id,
      agtrxn_voucher: invoice_no,
      agtrxn_particular_id: agtransaction_trnxtype_id,
      agtrxn_particular_type: particular || 'INVOICE',
      agtrxn_type: 'DEBIT',
      agtrxn_amount: commission_amount,
      agtrxn_note: note || '',
      agtrxn_created_by: user_id,
    };

    if (transaction === 'CREATE') {
      await models.insertAgentTransaction(agentTransactionData);

      return;
    } else if (transaction === 'UPDATE') {
      await models.updateAgentTransaction(agentTransactionData);

      return;
    } else if (transaction === 'DELETE') {
      await models.deleteAgentTransaction(invoice_id, user_id);
    }
  };

  public static deleteAgentTransactions = async (
    models: AgentProfileModels,
    invoice_id: idType,
    user_id: idType
  ) => {
    await models.deleteAgentTransaction(invoice_id, user_id);
  };
}

export default InvoiceHelpers;

export const _ = require('lodash');

export const isNotEmpty = (data: any) => {
  return !_.isEmpty(data);
};
export const isEmpty = (data: any) => {
  return _.isEmpty(data);
};

// CHECK IS CLIENT OR COMBINED ACCOUNT AND RETURN THOSE VALUE
export const getClientOrCombId = (invoice_combclient_id: string) => {
  const clientCom = invoice_combclient_id.split('-');

  const client_type = clientCom[0] as ClientComType;

  if (!['client', 'combined'].includes(client_type)) {
    throw new CustomError(
      'Client type must be client or combined',
      400,
      'Invalid type'
    );
  }

  let invoice_client_id: number | null = null;
  let invoice_combined_id: number | null = null;

  if (client_type === 'client') {
    invoice_client_id = Number(clientCom[1]);
  } else {
    invoice_combined_id = Number(clientCom[1]);
  }

  return { invoice_client_id, invoice_combined_id };
};

export const ValidateClientAndVendor = async (
  vendor: string,
  client: string
) => {
  if (vendor === client) {
    throw new CustomError(
      'Vendor and client can not be same combined',
      400,
      'bad request'
    );
  }
};

export const InvoiceClientAndVendorValidate = async (
  vendors: {
    billing_comvendor: string;
    billing_profit: number;
    billing_product_id: number;
    pax_name: string;
    billing_quantity: number;
    billing_unit_price: number;
    billing_cost_price?: number;
  }[],
  client: string
) => {
  let invoice_total_vendor_price = 0;
  let invoice_total_profit = 0;
  let pax_name = '';

  for (const item of vendors) {
    const vendor = item.billing_comvendor;

    // IF QUANTITY AND COST PRICE EXIST
    if (item.billing_quantity && item.billing_cost_price) {
      invoice_total_vendor_price +=
        item.billing_cost_price * item.billing_quantity;
    }

    // IF QUANTITY AND PROFIT EXIST
    if (item.billing_profit && item.billing_quantity) {
      invoice_total_profit += item.billing_profit * item.billing_quantity;
    }

    // IF PAX NAME EXISTS
    if (item.pax_name) {
      pax_name += item.pax_name;
    }

    if (vendor === client) {
      throw new CustomError(
        'Vendor and client can not be same combined',
        400,
        'bad request'
      );
    }
  }

  return { invoice_total_vendor_price, invoice_total_profit, pax_name };
};

// INVOICE MONEY RECEIPT CHECK VALIDATOR
export const MoneyReceiptAmountIsValid = (
  money_receipt: InvoiceMoneyReceiptType,
  invoice_net_total: number
) => {
  let receipt_total_amount = 0;

  if (money_receipt) {
    receipt_total_amount = money_receipt.receipt_total_amount;
  }

  if (receipt_total_amount > invoice_net_total) {
    throw new CustomError(
      'Money receipt amount cannot be more than invoice net total',
      400,
      'Invalid amount'
    );
  }
};

export const generateVoucherNumber = (length: number, title?: string) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return title ? title + '-' + result : result;
};

export const ValidateCreditLimit = async (vendor_id: string) => {
  // throw new CustomError(
  //   'Vendor and client can not be same combined',
  //   400,
  //   'bad request'
  // );
  return true;
};

// ADD ADVANCE MONEY RECEIPT
export const addAdvanceMr = async (
  common_conn: CommonInvoiceModel,
  inv_id: number,
  cl_id: number | null,
  com_id: number | null,
  net_total: number,
  advance_amount: number
) => {
  const data = await common_conn.getAdvanceMrById(cl_id, com_id);

  let need_to_payment = Number(net_total);
  let able_to_payment = Number(advance_amount);

  if (data?.length) {
    for (const item of data) {
      if (need_to_payment === 0) {
        break;
      }

      const payment_amount =
        need_to_payment > item.payable_amount
          ? item.payable_amount
          : need_to_payment;

      const invClPay = {
        invclientpayment_moneyreceipt_id: item.receipt_id,
        invclientpayment_amount: payment_amount,
        invclientpayment_invoice_id: inv_id,
        invclientpayment_client_id: cl_id,
        invclientpayment_combined_id: com_id,
      };

      await common_conn.insertAdvanceMr(invClPay);

      need_to_payment -= Number(payment_amount);
      able_to_payment -= Number(payment_amount);
    }
  }

  const clHaveAdvance =
    able_to_payment > need_to_payment ? need_to_payment : able_to_payment;

  console.log({ need_to_payment, advance_amount, clHaveAdvance });

  if (clHaveAdvance > 0) {
    const invClPay = {
      invclientpayment_moneyreceipt_id: null,
      invclientpayment_amount: clHaveAdvance,
      invclientpayment_invoice_id: inv_id,
      invclientpayment_client_id: cl_id,
      invclientpayment_combined_id: com_id,
      invclientpayment_purpose: 'ADVANCE PAY',
    };

    console.log({ invClPay });

    await common_conn.insertAdvanceMr(invClPay);
  }
};
