import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClientBillAdjust,
  IClientIncentiveIncome,
  IClientIncentiveIncomeReqBody,
} from '../../../../accounts/types/account.interfaces';
import {
  IAcTrxn,
  IAcTrxnUpdate,
  IClTrxnBody,
  IClTrxnUpdate,
} from '../../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../../common/helpers/Trxns';

class IncentiveIncomeClientServices extends AbstractServices {
  constructor() {
    super();
  }

  public addIncentiveIncomeClient = async (req: Request) => {
    const {
      comb_client,
      account_id,
      adjust_with_bill,
      type_id,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IClientIncentiveIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const acc_conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'ICI');

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      let ctrxn_id;
      let incentive_acctrxn_id;

      if (adjust_with_bill === 'YES') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: vouchar_no,
          ctrxn_particular_id: 26,
          ctrxn_created_at: date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Incentive income',
        };

        ctrxn_id = await trxns.clTrxnInsert(clTrxnBody);

        const clientBillInfo: IClientBillAdjust = {
          cbilladjust_client_id: client_id,
          cbilladjust_combined_id: combined_id,
          cbilladjust_type: 'INCREASE',
          cbilladjust_amount: amount,
          cbilladjust_create_date: date,
          cbilladjust_created_by: incentive_created_by,
          cbilladjust_note: note,
          cbilladjust_ctrxn_id: ctrxn_id,
        };

        await acc_conn.addClientBill(clientBillInfo);
      } else {
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: vouchar_no,
          acctrxn_amount: amount,
          acctrxn_created_at: date,
          acctrxn_created_by: incentive_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 26,
          acctrxn_particular_type: 'Incentive income detail',
          acctrxn_pay_type: 'CASH',
        };

        incentive_acctrxn_id = await new Trxns(req, trx).AccTrxnInsert(
          AccTrxnBody
        );
      }

      const incentiveInfo: IClientIncentiveIncome = {
        incentive_vouchar_no: vouchar_no,
        incentive_type: 'COMB_CLIENT',
        incentive_client_id: client_id as number,
        incentive_combine_id: combined_id as number,
        incentive_ctrxn_id: ctrxn_id as number,
        incentive_account_id: account_id,
        incentive_actransaction_id: incentive_acctrxn_id as number,
        incentive_adjust_bill: adjust_with_bill,
        incentive_trnxtype_id: 26,
        incentive_account_category_id: type_id,
        incentive_amount: amount,
        incentive_created_by: incentive_created_by,
        incentive_date: date,
        incentive_note: note,
      };

      const incentive_id = await acc_conn.addIncentiveInc(incentiveInfo);

      await this.updateVoucher(req, 'ICI');

      const message = `Investment has been created ${amount}/-`;
      await this.insertAudit(
        req,
        'create',
        message,
        incentive_created_by,
        'OTHERS'
      );

      return {
        success: true,
        message: 'Add client incentive income successfully!',
        incentive_id,
      };
    });
  };

  public editIncentiveIncomeCombClient = async (req: Request) => {
    const { incentive_id } = req.params;

    const {
      comb_client,
      type_id,
      account_id,
      adjust_with_bill,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IClientIncentiveIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const acc_conn = this.models.accountsModel(req, trx);

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      const {
        prev_incentive_acc_id,
        prev_incentive_adjust_bill,
        prev_incentive_amount,
        prev_incentive_trxn_id,
        prev_incentive_comb_client,
        prev_incentive_ctrxn_id,
        prev_voucher_no,
      } = await acc_conn.viewPrevIncentiveInfo(incentive_id);

      let ctrxn_id;
      let incentive_acctrxn_id;

      const updateCombClientBalance = async () => {
        const clTrxnBody: IClTrxnUpdate = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: prev_voucher_no,
          ctrxn_particular_id: 26,
          ctrxn_created_at: date,
          ctrxn_note: note as string,
          ctrxn_particular_type: 'Opening balance',
          ctrxn_trxn_id: prev_incentive_ctrxn_id,
        };

        ctrxn_id = await new Trxns(req, trx).clTrxnUpdate(clTrxnBody);
      };

      const updateAccountBalance = async () => {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: amount,
          acctrxn_created_at: date,
          acctrxn_created_by: incentive_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 26,
          acctrxn_particular_type: 'Incentive income client',
          acctrxn_pay_type: 'CASH',
          trxn_id: prev_incentive_trxn_id,
        };

        incentive_acctrxn_id = await new Trxns(req, trx).AccTrxnUpdate(
          AccTrxnBody
        );
      };

      if (adjust_with_bill === prev_incentive_adjust_bill) {
        if (adjust_with_bill === 'YES') {
          await updateCombClientBalance();
        } else {
          await updateAccountBalance();
        }
      } else {
        if (adjust_with_bill === 'YES') {
          await updateCombClientBalance();
        } else {
          await updateAccountBalance();
        }
      }

      const incentiveInfo: IClientIncentiveIncome = {
        incentive_type: 'COMB_CLIENT',
        incentive_client_id: client_id as number,
        incentive_combine_id: combined_id as number,
        incentive_ctrxn_id: ctrxn_id,
        incentive_account_id: account_id,
        incentive_actransaction_id: incentive_acctrxn_id,
        incentive_adjust_bill: adjust_with_bill,
        incentive_trnxtype_id: 26,
        incentive_account_category_id: type_id,
        incentive_amount: amount,
        incentive_created_by: incentive_created_by,
        incentive_date: date,
        incentive_note: note,
      };

      const id = await acc_conn.updateIncentiveIncome(
        incentive_id,
        incentiveInfo
      );

      const message = `Investment has been updated ${amount}/-`;
      await this.insertAudit(
        req,
        'update',
        message,
        incentive_created_by,
        'OTHERS'
      );

      return {
        success: true,
        message: 'Client & combined incentive income edit successfully!',
        incentive_id: id,
      };
    });
  };

  public deleteIncentiveIncomeCombClient = async (req: Request) => {
    const { incentive_id } = req.params;

    const { incentive_deleted_by } = req.body as {
      incentive_deleted_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const acc_conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        prev_incentive_adjust_bill,
        prev_incentive_amount,
        prev_incentive_trxn_id,
        prev_incentive_comb_client,
        prev_incentive_ctrxn_id,
      } = await acc_conn.viewPrevIncentiveInfo(incentive_id);

      await acc_conn.deleteIncentive(incentive_id, incentive_deleted_by);

      if (prev_incentive_adjust_bill == 'YES') {
        await trxns.deleteClTrxn(
          prev_incentive_ctrxn_id,
          prev_incentive_comb_client
        );
      } else {
        await new Trxns(req, trx).deleteAccTrxn(prev_incentive_trxn_id);
      }

      const message = `Investment has been deleted ${prev_incentive_amount}/-`;
      await this.insertAudit(
        req,
        'delete',
        message,
        incentive_deleted_by,
        'OTHERS'
      );

      return {
        success: true,
        message: 'Incentive income deleted successfully!',
      };
    });
  };
}
export default IncentiveIncomeClientServices;
