import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { IVTrxnUpdate } from '../../../../common/interfaces/Trxn.interfaces';
import {
  IEditVendorReqBody,
  IEditVendors,
} from '../../types/vendor.interfaces';
import VendorLib from '../../utils/lib';

class EditVendorService extends AbstractServices {
  constructor() {
    super();
  }

  public editVendor = async (req: Request) => {
    const {
      vendor_address,
      vendor_registration_date,
      vendor_name,
      dailCode,
      vendor_opening_balance,
      vendor_opening_balance_pay_type,
      number,
      vendor_commission_rate,
      vendor_email,
      vendor_fixed_advance,
      vendor_credit_limit,
      vendor_updated_by,
      vendor_products_id,
      vendor_bank_guarantee,
      vendor_start_date,
      vendor_end_date,
    } = req.body as IEditVendorReqBody;

    const temp = number ? dailCode + '-' + number : null;
    const mail = vendor_email ? vendor_email : null;
    const vendor_id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      //edit vendor table
      const vendorInfo: IEditVendors = {
        vendor_name,
        vendor_email: mail,
        vendor_mobile: temp,
        vendor_address,
        vendor_registration_date,
        vendor_updated_by,
        vendor_fixed_advance,
        vendor_credit_limit,
        vendor_bank_guarantee,
        vendor_start_date,
        vendor_end_date,
      };

      await conn.updateVendor(vendorInfo, vendor_id);

      const vendor_opening_trxn_id = await conn.getVendorOpeningTrxnId(
        vendor_id
      );

      let vtrxn_type: 'DEBIT' | 'CREDIT' =
        vendor_opening_balance_pay_type?.toLowerCase() === 'due'
          ? 'DEBIT'
          : 'CREDIT';

      const VTrxnBody: IVTrxnUpdate = {
        comb_vendor: `vendor-${vendor_id}`,
        vtrxn_amount: vendor_opening_balance,
        vtrxn_created_at: dayjs().format('YYYY-MM-DD'),
        vtrxn_note: '',
        vtrxn_particular_id: 34,
        vtrxn_type: vtrxn_type,
        vtrxn_user_id: vendor_updated_by,
        vtrxn_voucher: '',
        trxn_id: vendor_opening_trxn_id,
      };

      if (vendor_opening_trxn_id) {
        await trxns.VTrxnUpdate(VTrxnBody);
      } else if (vendor_opening_balance) {
        const vendor_trxn_id = await trxns.VTrxnInsert(VTrxnBody);

        await conn.updateVendorOpeningTrxnId(vendor_trxn_id, vendor_id);
      }

      //format existing vendor working categories, working countries and product data
      await conn.formatVendorDetailForUpdate(vendor_id, vendor_updated_by);

      await VendorLib.insertProducts(
        conn,
        vendor_products_id,
        vendor_commission_rate,
        vendor_id
      );

      const message = `UPDATED VENDOR, NAME ${vendor_name}`;

      await this.insertAudit(
        req,
        'update',
        message,
        vendor_updated_by,
        'VENDOR'
      );

      return { success: true, message };
    });
  };
}

export default EditVendorService;
