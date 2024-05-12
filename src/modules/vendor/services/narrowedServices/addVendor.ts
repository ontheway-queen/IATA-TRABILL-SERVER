import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../common/interfaces/Trxn.interfaces';
import { IOpeningBalance } from '../../../accounts/types/account.interfaces';
import { IAddVendorReqBody, IVendors } from '../../types/vendor.interfaces';
import VendorLib from '../../utils/lib';

class AddVendorServices extends AbstractServices {
  constructor() {
    super();
  }

  public addVendor = async (req: Request) => {
    const {
      vendor_address,
      vendor_registration_date,
      vendor_name,
      dailCode,
      number,
      vendor_email,
      vendor_opening_balance,
      vendor_opening_balance_pay_type,
      vendor_commission_rate,
      vendor_products_id,
      vendor_created_by,
      vendor_fixed_advance,
      vendor_credit_limit,
      vendor_bank_guarantee,
      vendor_start_date,
      vendor_end_date,
    } = req.body as IAddVendorReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const acc_conn = this.models.accountsModel(req, trx);

      const temp = number ? dailCode + '-' + number : undefined;

      //save vendor
      const vendorInfo: IVendors = {
        vendor_name,
        vendor_email,
        vendor_mobile: temp,
        vendor_address,
        vendor_registration_date,
        vendor_created_by,
        vendor_fixed_advance,
        vendor_credit_limit,
        vendor_bank_guarantee,
        vendor_end_date,
        vendor_start_date,
      };

      const vendor_id = await conn.insertVendor(vendorInfo);

      //format existing vendor working categories, working countries and product data
      await conn.formatVendorDetailForUpdate(vendor_id, vendor_created_by);
      //Save vendor products
      await VendorLib.insertProducts(
        conn,
        vendor_products_id,
        vendor_commission_rate,
        vendor_id
      );

      let vtrxn_type: 'DEBIT' | 'CREDIT' =
        vendor_opening_balance_pay_type?.toLowerCase() === 'due'
          ? 'DEBIT'
          : 'CREDIT';
      // @Save Vendor opening balance
      if (vendor_opening_balance) {
        const VTrxnBody: IVTrxn = {
          comb_vendor: `vendor-${vendor_id}`,
          vtrxn_amount: vendor_opening_balance,
          vtrxn_created_at: dayjs().format('YYYY-MM-DD'),
          vtrxn_note: '',
          vtrxn_particular_id: 11,
          vtrxn_particular_type: 'Opening Balance',
          vtrxn_type: vtrxn_type,
          vtrxn_user_id: vendor_created_by,
          vtrxn_voucher: '',
        };

        const vendor_trxn_id = await new Trxns(req, trx).VTrxnInsert(VTrxnBody);

        await conn.updateVendorOpeningTrxnId(vendor_trxn_id, vendor_id);

        const openingBalData: IOpeningBalance = {
          op_acctype: 'VENDOR',
          op_amount: vendor_opening_balance,
          op_trxn_type: vtrxn_type,
          op_ven_id: vendor_id,
          op_ventrxn_id: vendor_trxn_id,
          op_note: '',
          op_date: dayjs().format('YYYY-MM-DD'),
        };

        await acc_conn.insertOpeningBal(openingBalData);
      }

      const message = `ADDED VENDOR, NAME ${vendor_name}`;

      await this.insertAudit(
        req,
        'create',
        message,
        vendor_created_by,
        'VENDOR'
      );

      return {
        success: true,
        message,
        data: { vendor_id },
      };
    });
  };
}

export default AddVendorServices;
