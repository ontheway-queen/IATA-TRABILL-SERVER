import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import { TChequeStatus } from '../../cheques/types/cheques.interface';
import AddAdvanceReturn from './narrowedServices/addAdvanceReturn';
import AddVendorServices from './narrowedServices/addVendor';
import AddVendorPayment from './narrowedServices/addVendorPayment';
import EditAdvanceReturn from './narrowedServices/editAdvanceReturn';
import EditVendorService from './narrowedServices/editVendor';
import EditVendorPayment from './narrowedServices/editVendorPayment';

class ServicesVendor extends AbstractServices {
  constructor() {
    super();
  }

  // INVOICE INFO BY VENDOR
  public getInvoiceVendors = async (req: Request) => {
    const { invoice_id } = req.params;

    const conn = this.models.vendorModel(req);

    const data = await conn.getInvoiceVendors(invoice_id);

    return { success: true, data };
  };

  // GET VENDOR PAYMENT FOR EDIT
  public getVendorPayForEditById = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.vendorModel(req);
    const vendor_payment = await conn.getVendorPayForEditById(id);

    const specific_inv_vendors: any[] = await conn.getInvoiceVendorInfo(id);

    const data = {
      ...vendor_payment,
      specific_inv_vendors,
    };
    return { success: true, data };
  };

  // all vendor excel report
  public getVendorExcelReport = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const vendor = await conn.getVendorExcelReport();
    const data = vendor.map((item, index) => {
      const status = item.status === 1 ? 'Active' : 'Inactive';
      return { SL: index + 1, ...item, status: status };
    });

    return { success: true, data };
  };

  public getVendorInvoiceDue = async (req: Request) => {
    const invoice_id = req.params.invoice_id;
    const conn = this.models.vendorModel(req);
    const vendor_due = await conn.getVendorInvoiceDue(invoice_id);
    const billing_info = await conn.getInvoiceBilling(invoice_id);

    return { success: true, data: { vendor_due, billing_info } };
  };

  vendorLastBalance = async (req: Request) => {
    const comb_vendor = req.params.vendor;

    const { combined_id, vendor_id } = separateCombClientToId(comb_vendor);
    if (vendor_id) {
      const data = await this.models
        .vendorModel(req)
        .getVendorLastBalance(vendor_id);

      return { success: true, data };
    } else {
      const data = await this.models
        .combineClientModel(req)
        .getCombinedLastBalance(combined_id as number);

      return { success: true, data: data.client_last_balance };
    }
  };

  public getAllVendorsAndCombined = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.vendorModel(req);

    const data = await conn.getAllVendorsAndCombined(search as string);

    return { success: true, data };
  };

  public getAllVendors = async (req: Request) => {
    const { size, page, search } = req.query as {
      size: string;
      page: string;
      search: string;
    };

    const conn = this.models.vendorModel(req);

    const data = await conn.getAllVendors(
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    return { success: true, ...data };
  };

  public getVendorById = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.vendorModel(req);

    const vendor = await conn.getVendorById(id);

    const vendor_commission_rate = await conn.getVendorCommission(id);

    const vendor_products = await conn.getVendorProductName(id);

    const data = {
      ...vendor,
      vendor_products,
      ...vendor_commission_rate,
    };

    if (vendor) {
      return { success: true, data };
    } else {
      throw new CustomError('Please provide a valid id', 400, 'Invalid Id');
    }
  };

  public getForEdit = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const id = req.params.id;
      const vendor = await conn.getForEdit(id);

      const vendor_products = await conn.getVendorProduct(id);

      const vendor_commission_rate = await conn.getVendorCommission(id);

      const data = {
        ...vendor,
        vendor_products,
        ...vendor_commission_rate,
      };

      return {
        success: true,
        data,
      };
    });
  };

  public updateVendorStatusById = async (req: Request) => {
    const id = req.params.id;

    const { vendor_activity_status, updated_by } = req.body;

    const conn = this.models.vendorModel(req);

    const data = await conn.updateVendorStatus(vendor_activity_status, id);

    const message = `UPDATED VENDOR STATUS/:${id}`;

    await this.insertAudit(req, 'update', message, updated_by, 'VENDOR');

    return { success: true, data };
  };

  public deleteVendor = async (req: Request) => {
    const id = req.params.id;

    if (!id) {
      throw new CustomError('Please provide vendor id', 400, 'Empty vendor id');
    }

    const { vendor_deleted_by } = req.body;

    const conn = this.models.vendorModel(req);

    const vendorTrxn = await conn.getTraxn(id);

    if (vendorTrxn === 0) {
      await conn.deleteVendor(id, vendor_deleted_by);
    } else {
      throw new CustomError(
        'Account has a valid transaction',
        400,
        'Bad Request'
      );
    }

    const message = `DELETED A VENDOR/:${id}`;

    await this.insertAudit(req, 'delete', message, vendor_deleted_by, 'VENDOR');
    return { success: true, message };
  };

  //   ==================== advance returns ============================

  public getAdvanceReturn = async (req: Request) => {
    const { page, size } = req.query;

    const conn = this.models.vendorModel(req);

    const data = await conn.getAdvanceReturn(
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public deleteAdvanceReturn = async (req: Request) => {
    const id = Number(req.params.id);
    const { deleted_by } = req.body;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);

      await conn.deleteAdvanceReturn(id, deleted_by);
      await conn.deleteAdvrCheque(id, deleted_by);

      const {
        prevCombVendor,
        prevVendorTrxnId,
        prevPayType,
        prevAccTrxnId,
        prev_return_amount,
        prev_transaction_charge_id,
      } = await conn.getAdvancePrevAccId(id as number);

      if (prevPayType !== 4) {
        // ACCOUNT TRANSACTION
        await new Trxns(req, trx).deleteAccTrxn(prevAccTrxnId);

        // VENDOR TRANSACTION
        await new Trxns(req, trx).deleteVTrxn(prevVendorTrxnId, prevCombVendor);
      }

      if (prev_transaction_charge_id) {
        await conn.deleteOnlineTrxnCharge(prev_transaction_charge_id);
      }
      // insert audit
      const message = `DELETED VENDOR ADVANCE RETURN/:${id}, BDT ${prev_return_amount}/-`;

      await this.insertAudit(
        req,
        'delete',
        message,
        deleted_by,
        'VENDOR_ADVANCE_RETURN'
      );
      return {
        success: true,
        message,
      };
    });
  };

  public getVendorPayments = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.vendorModel(req);

    const vendorsPayment = await conn.getVendorPayments(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    let data: any[] = [];
    for (const item of vendorsPayment) {
      const getInvoiceVendors = await conn.getVendorInvoicePayment(
        item.vpay_id
      );

      const invoice_vendors = { getInvoiceVendors, ...item };
      data.push(invoice_vendors);
    }
    const count = await conn.countVPaymentsDataRow(search, from_date, to_date);

    return { success: true, count, data };
  };

  public getAllVendorsAndCombinedByProductId = async (req: Request) => {
    const product_id = req.params.product_id;

    const conn = this.models.vendorModel(req);
    const data = await conn.getAllVendorsAndCombinedByProductId(product_id);
    return { success: true, data };
  };

  public getCountryCode = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const data = await conn.getCountryCode();
    return { success: true, data };
  };

  public getPrevPayBalance = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const data = await conn.getPreviousPaymentAmount(Number(req.params.id));
    return { success: true, data };
  };

  // DELETE VENDOR PAYMENT
  public deleteVendorPayment = async (req: Request) => {
    const vpay_id = Number(req.params.id);
    const { updated_by } = req.body;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { invoice_vendor_pay, vendor_pay_data } =
        await conn.getPreviousPaymentAmount(vpay_id);
      const {
        prevAccTrxnId,
        prevPayMethod,
        previousPaymentAmount,
        prevCombVendor,
        prevVendorTrxn,
        vpay_payment_to,
        has_refer_passport,
        online_charge_id,
      } = vendor_pay_data;

      if (has_refer_passport === 'YES') {
        await conn.deleteVendorPaymentPassport(vpay_id, updated_by);
      }

      if (prevPayMethod === 4) {
        await conn.deleteVendorPaymentCheque(vpay_id, updated_by);
      }
      await conn.deleteInvoiceVendorPaymentPermanent(vpay_id, updated_by);
      await conn.deleteVendorPayment(vpay_id, updated_by);

      if (online_charge_id) {
        await conn.deleteOnlineTrxnCharge(online_charge_id);
      }

      if (prevAccTrxnId) {
        await trxns.deleteAccTrxn(prevAccTrxnId);
      }

      if (prevVendorTrxn) {
        await trxns.deleteVTrxn(prevVendorTrxn, prevCombVendor);
      }

      if (prevPayMethod !== 4) {
        if (vpay_payment_to === 'INVOICE') {
          for (const item of invoice_vendor_pay) {
            const { prevInvCombVendor, prevInvTrxnId } = item;

            await trxns.deleteVTrxn(prevInvTrxnId, prevInvCombVendor);
          }
        }
      }

      const message = `DELETED VENDOR PAP/:${vpay_id}, BDT ${previousPaymentAmount}/-`;

      await this.insertAudit(
        req,
        'delete',
        message,
        updated_by,
        'VENDOR_PAYMENT'
      );

      return { success: true, message };
    });
  };

  public getPaymentMethod = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const data = await conn.getPaymentMethod();
    return { success: true, data };
  };

  public getNonPaidVendorInvoice = async (req: Request) => {
    const conn = this.models.vendorModel(req);

    const data = await conn.getNonPaidVendorInvoice();

    return {
      success: true,
      data,
    };
  };
  public getNonPaidVendorInvoiceForEdit = async (req: Request) => {
    const conn = this.models.vendorModel(req);

    const data = await conn.getNonPaidVendorInvoiceForEdit();

    return {
      success: true,
      data,
    };
  };

  public viewVendorPayment = async (req: Request) => {
    const id = req.params.id as idType;

    const conn = this.models.vendorModel(req);
    const data = await conn.viewVendorPayment(id);

    return { success: true, data };
  };

  public viewVendorPaymentDetails = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.vendorModel(req);
    const data = await conn.viewVendorPaymentDetails(id);
    return { success: true, data };
  };

  public getAdvanceReturnForEdit = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const id = Number(req.params.id);
    const data = await conn.getAdvanceReturnForEdit(id);
    return { success: true, data };
  };

  public getAdvanceReturnDetails = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const id = Number(req.params.id);
    const data = await conn.getAdvanceReturnDetails(id);

    return { success: true, data };
  };

  public getVendorPaymentCheque = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const data = await conn.getVendorPaymentCheque();

    return { success: true, data };
  };

  // ================== @GET_ALL_VENDOR_ADVR_CHEQUE_STATUS
  public getVendorAdvrCheque = async (req: Request) => {
    const conn = this.models.vendorModel(req);
    const data = await conn.getVendorAdvrCheque(req.query.status as string);

    return { success: true, data };
  };

  // ================== @GET_ALL_VENDOR_PAY_CHEQUE_STATUS
  public allVendorPaymentChecque = async (req: Request) => {
    const { status } = req.query;

    const conn = this.models.vendorModel(req);

    const data = await conn.allVendorPaymentChecque(status as TChequeStatus);

    return { success: true, data };
  };

  // ===================== @UPDATE_VENDOR_PAY_CHEQUE_STATUS

  getInvoiceByVendorId = async (req: Request) => {
    const conn = this.models.vendorModel(req);

    const comb_vendor = req.params.comb_vendor;

    if (!comb_vendor) {
      throw new CustomError(
        'Please provide vendor as params',
        400,
        'Empty vendor'
      );
    }
    const { vendor_id, combined_id } = separateCombClientToId(comb_vendor);

    const data = await conn.getInvoiceByVendorId(vendor_id, combined_id);

    return { success: true, data };
  };

  public viewAllVendors = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.vendorModel(req);

    const data = await conn.viewAllVendors(search as string);

    return { success: true, data };
  };

  public addVendor = new AddVendorServices().addVendor;
  public editVendor = new EditVendorService().editVendor;
  public addVendorPayment = new AddVendorPayment().addVendorPayment;
  public editVendorPayment = new EditVendorPayment().editVendorPayment;
  public addAdvanceReturn = new AddAdvanceReturn().addAdvanceReturn;
  public editAdvanceReturn = new EditAdvanceReturn().editAdvanceReturn;
}

export default ServicesVendor;
