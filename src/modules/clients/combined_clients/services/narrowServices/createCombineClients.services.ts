import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import {
  ICombineClient,
  ICombineClientsCreateReqBody,
} from '../../types/combineClients.interfaces';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import dayjs from 'dayjs';
import Trxns from '../../../../../common/helpers/Trxns';
import { IOpeningBalance } from '../../../../accounts/types/account.interfaces';

class CreateCombineClients extends AbstractServices {
  constructor() {
    super();
  }

  public createCombineClient = async (req: Request) => {
    const {
      combine_category_id,
      combine_name,
      combine_company_name,
      combine_gender,
      combine_email,
      combine_designation,
      combine_mobile,
      combine_address,
      combine_opening_balance,
      opening_balance_type,
      combine_create_by,
      combine_commission_rate,
      cproduct_product_id,
      combine_credit_limit,
    } = req.body as ICombineClientsCreateReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.combineClientModel(req, trx);
      const acc_conn = this.models.accountsModel(req, trx);

      const combine_entry_id = await this.generateVoucher(req, 'CL');

      let combine_id: any;
      const combineClientInfo: ICombineClient = {
        combine_category_id: combine_category_id,
        combine_entry_id,
        combine_name: combine_name,
        combine_company_name: combine_company_name,
        combine_gender: combine_gender,
        combine_email: combine_email,
        combine_commission_rate,
        combine_designation: combine_designation,
        combine_mobile: combine_mobile,
        combine_address: combine_address,
        combine_opening_balance:
          Number(
            opening_balance_type?.toLocaleLowerCase() === 'due'
              ? '-'
              : '' + combine_opening_balance
          ) || 0,
        combine_balance_type: opening_balance_type as string,
        combine_create_by: combine_create_by,
        combine_credit_limit: combine_credit_limit,
      };
      combine_id = await conn.insertCombineClient(combineClientInfo);

      const comtransaction_type =
        opening_balance_type?.toLocaleLowerCase() === 'due'
          ? 'DEBIT'
          : 'CREDIT';

      if (combine_opening_balance) {
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

        const openingBalData: IOpeningBalance = {
          op_acctype: 'COMBINED',
          op_amount: combine_opening_balance,
          op_trxn_type: comtransaction_type,
          op_com_id: combine_id,
          op_comtrxn_id: combine_trxn_id,
          op_note: combine_designation as string,
          op_date: dayjs().format('YYYY-MM-DD'),
        };

        await acc_conn.insertOpeningBal(openingBalData);
      }

      const combineproducts = cproduct_product_id?.map((item) => {
        let cproduct_commission_rate = 0;
        if (item === 106) {
          cproduct_commission_rate = Number(combine_commission_rate);
        }

        return {
          cproduct_combine_id: combine_id,
          cproduct_product_id: item,
          cproduct_commission_rate,
        };
      });

      if (combineproducts?.length) {
        await conn.insertCombineClientProducts(combineproducts);
      }

      await this.updateVoucher(req, 'CL');

      // insert audit
      const message = `Combine client has been created -${combine_name}-`;
      await this.insertAudit(
        req,
        'create',
        message,
        combine_create_by as number,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Combine client created successfully',
      };
    });
  };
}
export default CreateCombineClients;
