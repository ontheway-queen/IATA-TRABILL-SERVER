import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { IAddClient, IClientBody } from '../../types/client.interfaces';

class AddClientService extends AbstractServices {
  constructor() {
    super();
  }

  public addClient = async (req: Request) => {
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

      const client_entry_id = await this.generateVoucher(req, 'CL');

      const clientInfo: IAddClient = {
        client_address,
        client_category_id,
        client_credit_limit,
        client_email,
        client_gender,
        client_mobile,
        client_name,
        client_trade_license,
        client_type,
        client_org_agency: req.agency_id,
        client_entry_id,
        client_created_by,
        client_designation,
        client_walking_customer,
        client_source,
      };

      const clientId = await conn.insertClient(clientInfo);

      if (opening_balance) {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: opening_balance_type,
          ctrxn_amount: opening_balance,
          ctrxn_cl: `client-${clientId}`,
          ctrxn_voucher: '',
          ctrxn_particular_id: 11,
          ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
          ctrxn_note: client_designation as string,
          ctrxn_particular_type: 'Client opening balance ',
          ctrxn_user_id: client_created_by,
        };

        const clTrxnId = await trxns.clTrxnInsert(clTrxnBody);

        await conn.updateClientOpeningTransactions(clTrxnId, clientId);
      }

      await this.updateVoucher(req, 'CL');

      // insert audit
      const message = `Client has been created,cl-id:${clientId}`;
      await this.insertAudit(
        req,
        'create',
        message,
        client_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Client successfully created',
        data: {
          client_id: clientId,
          client_entry_id,
        },
      };
    });
  };
}

export default AddClientService;
