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
import DeleteTourPackRefund from '../../../../refund/services/narrowServices/tourPackRefundSubServices/deleteTourPackRefund';
import DeleteInvoiceVisa from '../../../invoice-visa/services/narrowServices/deleteinvoicevisa.services';
import DeleteNonComInvoice from '../../../invoice_airticket_non_commission/services/narrowServices/deleteInvoiceNonCom';
import DeleteReissue from '../../../invoice_airticket_reissue/services/narrowServices/deleteInvoiceReissue';
import DeleteInvoiceHajjPreReg from '../../../invoice_hajj_pre_reg/Services/NarrowServices/DeleteInvoiceHajjPreReg';
import DeleteInvoiceHajj from '../../../invoice_hajji/Services/NarrowServices/DeleteInvoiceHajjServices';
import DeleteInvoiceOther from '../../../invoice_other/services/narrowServices/deleteInvoiceOther';
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

  public voidInvoice = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);

    const { client_charge, invoice_vendors } = req.body as {
      client_charge: number;
      invoice_vendors: {
        comb_vendor: string;
        vendor_charge: number;
      }[];
    };

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { comb_client, prevInvoiceNo, invoice_category_id } =
        await common_conn.getPreviousInvoices(invoice_id);

      await common_conn.updateIsVoid(invoice_id, client_charge || 0);

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: client_charge || 0,
        ctrxn_cl: comb_client,
        ctrxn_voucher: prevInvoiceNo,
        ctrxn_particular_id: 161,
        ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
        ctrxn_note: '',
        ctrxn_particular_type: 'invoice void charge',
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
        await new DeleteInvoiceOther().deleteInvoiceOther(req, trx);
      } else if (invoice_category_id === 10) {
        await new DeleteInvoiceVisa().deleteInvoiceVisa(req, trx);
      } else if (invoice_category_id === 26) {
        await new DeleteInvoiceUmmrah().deleteInvoiceUmmrah(req, trx);
      } else if (invoice_category_id === 30) {
        await new DeleteInvoiceHajjPreReg().deleteInvoiceHajjPre(req, trx);
      } else if (invoice_category_id === 31) {
        await new DeleteInvoiceHajj().deleteInvoiceHajj(req, trx);
      }

      const { combined_id } = separateCombClientToId(comb_client);

      for (const info of invoice_vendors) {
        if (info.vendor_charge) {
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

          await trxns.VTrxnInsert(VTrxnBody);
        }
      }

      await this.insertAudit(
        req,
        'delete',
        'Invoice has been voided!',
        req.user_id,
        'INVOICES'
      );

      return { success: true, message: 'Invoice has been voided!' };
    });
  };
}

export default DeleteAirTicket;
