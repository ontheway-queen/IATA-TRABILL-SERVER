import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import {
  IAcTrxn,
  IVTrxnDb,
} from '../../../../common/interfaces/Trxn.interfaces';
import {
  IVendorBillAdjust,
  IVendorIncentiveIncome,
  IVendorIncentiveIncomeReqBody,
} from '../../types/account.interfaces';

class AddIncentiveService extends AbstractServices {
  constructor() {
    super();
  }

  public addIncentiveIncomeService = async (req: Request) => {
    const {
      vendor_id,
      type_id,
      account_id,
      adjust_with_bill,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IVendorIncentiveIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxn_conn = this.models.trxnModels(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'ICI');

      const incentiveInfo: IVendorIncentiveIncome = {
        incentive_vouchar_no: vouchar_no,
        incentive_type: 'VENDOR',
        incentive_vendor_id: +vendor_id,
        incentive_account_id: account_id,
        incentive_adjust_bill: adjust_with_bill,
        incentive_trnxtype_id: 124,
        incentive_account_category_id: type_id,
        incentive_amount: +amount,
        incentive_created_by: incentive_created_by,
        incentive_date: date,
        incentive_note: note,
      };

      if (adjust_with_bill === 'YES') {
        const VTrxnBody: IVTrxnDb = {
          vtrxn_voucher: vouchar_no,
          vtrxn_type: 'CREDIT',
          vtrxn_particular_type: 'Incentive income',
          vtrxn_amount: amount,
          vtrxn_particular_id: 124,
          vtrxn_note: note,
          vtrxn_user_id: incentive_created_by,
          vtrxn_created_at: date,
          vtrxn_v_id: vendor_id,
        };

        const vbilladjust_vtrxn_id = await trxn_conn.insertVTrxn(VTrxnBody);

        incentiveInfo.incentive_vtrxn_id = vbilladjust_vtrxn_id;

        const vendorBillInfo: IVendorBillAdjust = {
          vbilladjust_vendor_id: vendor_id,
          vbilladjust_type: 'INCREASE',
          vbilladjust_amount: amount,
          vbilladjust_create_date: date,
          vbilladjust_note: note,
          vbilladjust_vtrxn_id,
          vbilladjust_created_by: incentive_created_by,
        };

        await conn.addVendorBill(vendorBillInfo);
      } else {
        const AccTrxnBodyTo: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: amount,
          acctrxn_created_at: date as string,
          acctrxn_created_by: incentive_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 26,
          acctrxn_particular_type: 'Incentive income',
          acctrxn_pay_type: 'CASH',
        };

        const incentive_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBodyTo);

        incentiveInfo.incentive_actransaction_id = incentive_acctrxn_id;
      }

      const data = await conn.addIncentiveInc(incentiveInfo);

      await this.updateVoucher(req, 'ICI');

      const message = `Vendor incentive has been created ${amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        incentive_created_by,
        'OTHERS'
      );

      return {
        success: true,
        message: 'Incentive income added successfully',
        data,
      };
    });
  };
}

export default AddIncentiveService;
