import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { numRound } from '../../../../../common/utils/libraries/lib';
import {
  IVoidReqBody,
  IVoidVendorInfo,
} from '../../types/invoiceAirticket.interface';

class VoidInvoice extends AbstractServices {
  constructor() {
    super();
  }

  // VOID INVOICES
  public voidInvoice = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);

    const body = req.body as IVoidReqBody;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const conn = this.models.invoiceAirticketModel(req, trx);
      const trxns = new Trxns(req, trx);

      const previousInv = await conn.getInvoiceData(invoice_id);

      const content = `VOID TKT FARE BDT ${body.void_amount}/- \nCHARGE BDT ${
        body.client_charge || 0
      }/-`;

      const ticket_nos = body.invoice_vendors
        .map((item) => item.airticket_ticket_no)
        .join(',');

      // CLIENT TRANSACTION
      const clientNetTotalTrans: IClTrxnBody = {
        ctrxn_type: 'CREDIT',
        ctrxn_amount: body.void_amount,
        ctrxn_cl: body.comb_client,
        ctrxn_voucher: body.invoice_no,
        ctrxn_particular_id: 56,
        ctrxn_created_at: body.invoice_void_date,
        ctrxn_note: content,
        ctrxn_airticket_no: ticket_nos,
      };

      await trxns.clTrxnInsert(clientNetTotalTrans);

      let void_charge_ctrxn_id = null;

      if (body.client_charge) {
        const voidChargeClTrans: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: body.client_charge,
          ctrxn_cl: body.comb_client,
          ctrxn_voucher: body.invoice_no,
          ctrxn_particular_id: 59,
          ctrxn_created_at: body.invoice_void_date,
          ctrxn_note: '',
          ctrxn_airticket_no: ticket_nos,
        };
        void_charge_ctrxn_id = await trxns.clTrxnInsert(voidChargeClTrans);
      }

      // Initialize a result object
      const reducedData: any = {};

      // Process each ticket
      for (const ticket of body.invoice_vendors) {
        const vendorId = ticket.comb_vendor;
        if (!reducedData[vendorId]) {
          reducedData[vendorId] = {
            comb_vendor: vendorId,
            vendor_charge: 0,
            cost_price: 0,
            airticket_ticket_no: [],
          };
        }
        reducedData[vendorId].vendor_charge += ticket.vendor_charge;
        reducedData[vendorId].cost_price += ticket.cost_price;
        reducedData[vendorId].airticket_ticket_no.push(
          ticket.airticket_ticket_no
        );

        if (body.cate_id === 1) {
          await conn.voidAirticketItems(
            ticket.airticket_id,
            invoice_id,
            req.user_id
          );
        } else if (body.cate_id === 2) {
        } else if (body.cate_id === 3) {
        } else if (body.cate_id === 5) {
        }
      }

      // Convert lists to comma-separated strings
      for (const vendorId in reducedData) {
        reducedData[vendorId].airticket_ticket_no =
          reducedData[vendorId].airticket_ticket_no.join(', ');
      }

      // Convert the object to an array
      const resultArray = Object.values(reducedData) as IVoidVendorInfo[];

      let return_vendor_price = 0;
      let return_client_price = 0;
      let return_profit = 0;

      //   VENDOR TRANSACTIONS
      for (const item of resultArray) {
        const { vendor_id } = separateCombClientToId(item.comb_vendor);

        const vendorPurchaseVoidTrans: IVTrxn = {
          comb_vendor: item.comb_vendor,
          vtrxn_amount: item.cost_price,
          vtrxn_created_at: body.invoice_void_date,
          vtrxn_note: `BDT ${item.cost_price}/- \nCHARGE BDT ${item.vendor_charge}/-`,
          vtrxn_particular_id: 56,
          vtrxn_type: vendor_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: req.user_id,
          vtrxn_voucher: body.invoice_no,
          vtrxn_airticket_no: item.airticket_ticket_no,
        };

        await trxns.VTrxnInsert(vendorPurchaseVoidTrans);

        if (item.vendor_charge) {
          const vendorVoidCharge: IVTrxn = {
            comb_vendor: item.comb_vendor,
            vtrxn_amount: item.vendor_charge,
            vtrxn_created_at: body.invoice_void_date,
            vtrxn_note: ``,
            vtrxn_particular_id: 59,
            vtrxn_type: vendor_id ? 'DEBIT' : 'CREDIT',
            vtrxn_user_id: req.user_id,
            vtrxn_airticket_no: item.airticket_ticket_no,
            vtrxn_voucher: body.invoice_no,
          };

          await trxns.VTrxnInsert(vendorVoidCharge);
        }

        return_vendor_price += numRound(item.cost_price);
        return_client_price += numRound(item.sales_price);
        return_profit += numRound(item.cost_price) - numRound(item.sales_price);
      }

      // UPDATED VOID INFORMATION
      await common_conn.updateIsVoid(
        invoice_id,
        body.client_charge || 0,
        void_charge_ctrxn_id,
        body.invoice_void_date,
        numRound(previousInv.invoice_sub_total) - return_client_price,
        numRound(previousInv.invoice_discount) - body.void_discount,
        numRound(previousInv.invoice_net_total) - body.void_discount,
        numRound(previousInv.invoice_total_vendor_price) - return_vendor_price,
        numRound(previousInv.invoice_total_profit) - return_profit
      );

      await this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');

      return { success: true, message: content };
    });
  };
}

export default VoidInvoice;
