import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';

class DeleteAdvanceReturn extends AbstractServices {
  constructor() {
    super();
  }

  public deleteAdvanceReturn = async (req: Request) => {
    const { advr_deleted_by } = req.body as { advr_deleted_by: number };

    const advr_id = req.params.id;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const trxns = new Trxns(req, trx);

      const previous_billing = await conn.getPrevAdvrIfo(advr_id);

      const {
        prevAmoun,
        prevClientId,
        advr_actransaction_id,
        advr_ctrxn_id,
        advr_trxn_charge_id,
      } = previous_billing;

      await trxns.deleteAccTrxn(advr_actransaction_id);

      if (prevClientId) {
        await trxns.deleteClTrxn(advr_ctrxn_id, prevClientId);
      }

      if (advr_trxn_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(advr_trxn_charge_id);
      }

      await conn.deleteAdvanceReturn(1, advr_deleted_by, advr_id);

      await this.insertAudit(
        req,
        'delete',
        `Advance return has been deleted, advr-id:${advr_id} ${prevAmoun}/-`,
        advr_deleted_by,
        'MONEY_RECEIPT_ADVANCE_RETURN'
      );
      return {
        success: true,
        data: 'Advance return has been deleted',
      };
    });
  };
}

export default DeleteAdvanceReturn;
