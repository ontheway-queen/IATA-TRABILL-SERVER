import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { generateVoucherNumber } from '../../../../common/helpers/invoice.helpers';
import { IVendorTransactions } from '../../../../common/interfaces/commonInterfaces';
import {
  IVendorBillAdjust,
  IVendorBillAdjustReqBody,
} from '../../types/account.interfaces';
import { IVTrxnDb } from '../../../../common/interfaces/Trxn.interfaces';

class AddVendorBillAdjustment extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * add Vendor bill adjustment
   */
  public vendorBillAdj = async (req: Request) => {
    const {
      vendor_id,
      bill_type,
      bill_amount,
      bill_create_date,
      bill_created_by,
      bill_note,
    } = req.body as IVendorBillAdjustReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxn_conn = this.models.trxnModels(req, trx);

      const voucher_no = generateVoucherNumber(4, 'VB');

      let trxType: 'DEBIT' | 'CREDIT' = 'CREDIT';
      if (bill_type === 'INCREASE') {
        trxType = 'CREDIT';
      }

      if (bill_type === 'DECREASE') {
        trxType = 'DEBIT';
      }

      const VTrxnBody: IVTrxnDb = {
        vtrxn_voucher: voucher_no,
        vtrxn_type: trxType,
        vtrxn_particular_type: 'Vendor bill adjustment',
        vtrxn_amount: bill_amount,
        vtrxn_particular_id: 126,
        vtrxn_note: bill_note as string,
        vtrxn_user_id: bill_created_by,
        vtrxn_created_at: bill_create_date as string,
        vtrxn_v_id: vendor_id,
      };

      const trxnId = await trxn_conn.insertVTrxn(VTrxnBody);

      const vendorBillInfo: IVendorBillAdjust = {
        vbilladjust_vendor_id: vendor_id,
        vbilladjust_type: bill_type,
        vbilladjust_amount: bill_amount,
        vbilladjust_create_date: bill_create_date,
        vbilladjust_note: bill_note,
        vbilladjust_vouchar_no: voucher_no,
        vbilladjust_vtrxn_id: trxnId,
        vbilladjust_created_by: bill_created_by,
      };

      await conn.addVendorBill(vendorBillInfo);

      const message = `Vendor bill adjustment has been created ${bill_amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        bill_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Vendor bill adjusted successfully',
      };
    });
  };
}

export default AddVendorBillAdjustment;
