import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { IInvoiceVoidDetails } from '../../../../../common/interfaces/commonInterfaces';
import DeleteOtherRefund from '../../../../refund/services/narrowServices/otherRefundSubServices/deleteOtherRefund';
import DeleteTourPackRefund from '../../../../refund/services/narrowServices/tourPackRefundSubServices/deleteTourPackRefund';
import DeleteInvoiceVisa from '../../../invoice-visa/services/narrowServices/deleteinvoicevisa.services';
import DeleteNonComInvoice from '../../../invoice_airticket_non_commission/services/narrowServices/deleteInvoiceNonCom';
import DeleteReissue from '../../../invoice_airticket_reissue/services/narrowServices/deleteInvoiceReissue';
import DeleteInvoiceHajjPreReg from '../../../invoice_hajj_pre_reg/Services/NarrowServices/DeleteInvoiceHajjPreReg';
import DeleteInvoiceHajj from '../../../invoice_hajji/Services/NarrowServices/DeleteInvoiceHajjServices';
import DeleteInvoiceUmmrah from '../../../invoice_ummrah/Services/NarrowServices/DeleteInvoiceUmmrah';

class DeleteAirTicket extends AbstractServices {
  constructor() {
    super();
  }

  public deleteAirTicket = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);

    const { invoice_has_deleted_by } = req.body as {
      invoice_has_deleted_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.invoiceAirticketModel(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const prevBillingInfo = await conn.getPrevAirticketVendor(invoice_id);

      await trxns.deleteInvVTrxn(prevBillingInfo);

      await conn.deleteAirticketItems(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      // @invoice history
      const content = `Invoice air ticket has been deleted`;

      await this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');
      return {
        success: true,
        message: 'invoice has been deleted',
      };
    });
  };

  public voidAirticket = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice_id = Number(req.params.invoice_id);
    const { client_charge, invoice_vendors } = req.body as {
      client_charge: number;
      invoice_vendors: {
        comb_vendor: string;
        vendor_charge: number;
      }[];
    };

    return await this.models.db.transaction(async (trx) => {
      const trxns = new Trxns(req, trx);

      const { comb_client, prevInvoiceNo, invoice_category_id } =
        await common_conn.getPreviousInvoices(invoice_id);

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: client_charge || 0,
        ctrxn_cl: comb_client,
        ctrxn_voucher: prevInvoiceNo,
        ctrxn_particular_id: 161,
        ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
        ctrxn_note: '',
        ctrxn_particular_type: 'invoice void charge',
        ctrxn_user_id: req.user_id,
      };

      let void_charge_ctrxn_id: number = 0;
      if (client_charge && client_charge > 0) {
        void_charge_ctrxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      // delete invoice;
      if (invoice_category_id === 1) {
        await this.deleteAirTicket(req, trx);
      } else if (invoice_category_id === 2) {
        await new DeleteNonComInvoice().deleteNonComInvoice(req, trx);
      } else if (invoice_category_id === 3) {
        await new DeleteReissue().deleteReissue(req, trx);
      } else if (invoice_category_id === 4) {
        await new DeleteTourPackRefund().delete(req, trx);
      } else if (invoice_category_id === 5) {
        await new DeleteOtherRefund().deleteOtherRefund(req, trx);
      } else if (invoice_category_id === 10) {
        await new DeleteInvoiceVisa().deleteInvoiceVisa(req, trx);
      } else if (invoice_category_id === 26) {
        await new DeleteInvoiceUmmrah().deleteInvoiceUmmrah(req, trx);
      } else if (invoice_category_id === 30) {
        await new DeleteInvoiceHajjPreReg().deleteInvoiceHajjPre(req, trx);
      } else if (invoice_category_id === 31) {
        await new DeleteInvoiceHajj().deleteInvoiceHajj(req, trx);
      }

      await common_conn.transferInvoiceInfoToVoid(invoice_id, client_charge);

      const voidDetailsInfo: IInvoiceVoidDetails[] = [];

      const { client_id, combined_id } = separateCombClientToId(comb_client);
      for (const info of invoice_vendors) {
        const VTrxnBody: IVTrxn = {
          comb_vendor: info.comb_vendor,
          vtrxn_amount: info.vendor_charge,
          vtrxn_created_at: dayjs().format('YYYY-MM-DD'),
          vtrxn_note: '',
          vtrxn_particular_id: 1,
          vtrxn_particular_type: 'Vendor Payment',
          vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
          vtrxn_user_id: req.user_id,
        };

        const vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const { vendor_id, combined_id: invoice_combine_id } =
          separateCombClientToId(info.comb_vendor);
        const voidInfo: IInvoiceVoidDetails = {
          void_charge_ctrxn_id,
          void_invoice_id: invoice_id,
          void_client_charge: client_charge,
          void_client_id: client_id as number,
          void_combine_id: combined_id as number,
          void_vendor_id: vendor_id as number,
          void_vendor_combine_id: invoice_combine_id as number,
          void_vendor_charge: info.vendor_charge,
          void_charge_vtrxn_id: vtrxn_id,
        };

        voidDetailsInfo.push(voidInfo);
      }

      if (voidDetailsInfo && voidDetailsInfo.length)
        await common_conn.createInvoiceVoidDetails(voidDetailsInfo);

      await this.insertAudit(
        req,
        'delete',
        'Invoice air ticket has been voided',
        req.user_id,
        'INVOICES'
      );

      return { success: true, message: 'Invoice air ticket has been voided' };
    });
  };
}

export default DeleteAirTicket;
