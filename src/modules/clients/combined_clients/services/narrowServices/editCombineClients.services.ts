import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import {
  ICombineClientsEditReqBody,
  ICombinedTransaction,
  IUpdateCombinedTransaction,
} from '../../types/combineClients.interfaces';
import {
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../../../common/interfaces/Trxn.interfaces';
import dayjs from 'dayjs';
import Trxns from '../../../../../common/helpers/Trxns';

class EditCombineClient extends AbstractServices {
  constructor() {
    super();
  }

  public editCombineClient = async (req: Request) => {
    const {
      combine_category_id,
      combine_name,
      combine_company_name,
      combine_gender,
      combine_email,
      combine_designation,
      combine_mobile,
      combine_address,
      combine_client_status,
      combine_commission_rate,
      combine_opening_balance,
      opening_balance_type,
      cproduct_product_id,
      combine_update_by,
      combine_credit_limit,
    } = req.body as ICombineClientsEditReqBody;

    const combine_id = req.params.id as string;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.combineClientModel(req, trx);

      const combineClinetInfo: ICombineClientsEditReqBody = {
        combine_category_id,
        combine_name,
        combine_company_name,
        combine_gender,
        combine_email,
        combine_designation,
        combine_opening_balance,
        combine_mobile,
        combine_address,
        combine_update_by,
        combine_client_status,
        combine_commission_rate,
        combine_credit_limit,
      };

      await conn.updateCombineInformation(combine_id, combineClinetInfo);

      await conn.deletePreviousProduct(combine_id);

      const combineproducts = cproduct_product_id?.map((item) => {
        let cproduct_commission_rate = 0;
        if (item === 106) {
          cproduct_commission_rate = Number(combine_commission_rate);
        }
        return {
          cproduct_combine_id: Number(combine_id),
          cproduct_product_id: item,
          cproduct_commission_rate,
        };
      });

      if (combineproducts?.length) {
        await conn.insertCombineClientProducts(combineproducts);
      }

      const combine_info = await conn.getCombineClientName(combine_id);

      const combine_trxn_id = await conn.getCombineClientOpeningTrxnId(
        combine_id
      );

      const comtransaction_type =
        opening_balance_type?.toLocaleLowerCase() === 'due'
          ? 'DEBIT'
          : 'CREDIT';

      if (combine_trxn_id) {
        const clTrxnBody: IClTrxnUpdate = {
          ctrxn_type: comtransaction_type,
          ctrxn_amount: Number(combine_opening_balance),
          ctrxn_cl: `combined-${combine_id}`,
          ctrxn_voucher: '',
          ctrxn_particular_id: 11,
          ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
          ctrxn_note: combine_designation as string,
          ctrxn_particular_type: 'Opening balance',
          ctrxn_trxn_id: combine_trxn_id,
        };

        await new Trxns(req, trx).clTrxnUpdate(clTrxnBody);
      } else if (combine_opening_balance) {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: comtransaction_type,
          ctrxn_amount: Number(combine_opening_balance),
          ctrxn_cl: `combined-${combine_id}`,
          ctrxn_voucher: '',
          ctrxn_particular_id: 11,
          ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
          ctrxn_note: combine_designation as string,
          ctrxn_particular_type: 'Opening balance',
        };

        const combine_trxn_id = await new Trxns(req, trx).clTrxnInsert(
          clTrxnBody
        );

        await conn.updateCombineClientOpeningTrxnId(
          combine_trxn_id,
          combine_id
        );
      }

      // insert audit
      const message = `Combine client has been update -${combine_info}-`;
      await this.insertAudit(
        req,
        'update',
        message,
        combine_update_by,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Combine client update successfully',
      };
    });
  };
}
export default EditCombineClient;
