import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import {
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { IClientBody, IUpdateClient } from '../../types/client.interfaces';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';

class EditClientService extends AbstractServices {
  constructor() {
    super();
  }

  public editClient = async (req: Request) => {
    const {
      client_designation,
      client_created_by,
      opening_balance,
      opening_balance_type,
      client_address,
      client_category_id,
      client_credit_limit,
      client_email,
      client_gender,
      client_mobile,
      client_name,
      client_trade_license,
      client_type,
      client_walking_customer,
      client_source,
    } = req.body as IClientBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.clientModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { client_id } = separateCombClientToId(req.params.client_id) as {
        client_id: number;
      };

      const clientInfo: IUpdateClient = {
        client_address,
        client_category_id,
        client_credit_limit,
        client_email,
        client_gender,
        client_mobile,
        client_name,
        client_trade_license,
        client_type,
        client_updated_by: client_created_by,
        client_designation,
        client_walking_customer,
        client_source,
      };

      await conn.updateClient(client_id, clientInfo);

      if (opening_balance_type) {
        const clTrxnId = await conn.getClientOpeningTrxnInfo(client_id);

        if (clTrxnId) {
          const clTrxnBody: IClTrxnUpdate = {
            ctrxn_type: opening_balance_type,
            ctrxn_amount: opening_balance,
            ctrxn_cl: req.params.client_id,
            ctrxn_particular_id: 11,
            ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
            ctrxn_note: client_designation as string,
            ctrxn_particular_type: 'Opening balance',
            ctrxn_trxn_id: clTrxnId,
          };

          await trxns.clTrxnUpdate(clTrxnBody);
        } else if (opening_balance) {
          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: opening_balance_type,
            ctrxn_amount: opening_balance,
            ctrxn_cl: req.params.client_id,
            ctrxn_voucher: '',
            ctrxn_particular_id: 11,
            ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
            ctrxn_note: client_designation as string,
            ctrxn_particular_type: 'Client opening balance ',
            ctrxn_user_id: client_created_by,
          };

          const clTrxnId = await trxns.clTrxnInsert(clTrxnBody);

          await conn.updateClientOpeningTransactions(clTrxnId, client_id);
        }
      }

      const message = `Client has been updated`;
      await this.insertAudit(
        req,
        'update',
        message,
        client_created_by,
        'ACCOUNTS'
      );

      return { success: true, message: 'Client updated successfully' };
    });
  };
}

export default EditClientService;
