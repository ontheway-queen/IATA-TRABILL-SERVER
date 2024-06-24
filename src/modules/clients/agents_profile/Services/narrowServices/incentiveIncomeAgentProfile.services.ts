import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import {
  IAcTrxn,
  IAcTrxnUpdate,
} from '../../../../../common/interfaces/Trxn.interfaces';
import {
  IAgentIncentiveIncome,
  IAgentIncentiveReqBody,
  IAgentProfileTransaction,
} from '../../Type/agent_profile.interfaces';

class IncentiveIncomeAgentProfile extends AbstractServices {
  constructor() {
    super();
  }

  public create = async (req: Request) => {
    const {
      agent_id,
      account_id,
      type_id,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IAgentIncentiveReqBody;

    return await this.models.db.transaction(async (trx) => {
      const agent_conn = this.models.agentProfileModel(req, trx);
      const acc_conn = this.models.accountsModel(req, trx);

      const vouchar_no = await this.generateVoucher(req, 'ICI');

      const agentLBalance = await agent_conn.getAgentLastBalance(agent_id);

      const updatedAgentLBalance = agentLBalance + Number(amount);

      const agentTransactionData: IAgentProfileTransaction = {
        agtrxn_particular_id: 26,
        agtrxn_type: 'DEBIT',
        agtrxn_agent_id: agent_id,
        agtrxn_amount: amount,
        agtrxn_created_by: incentive_created_by,
        agtrxn_particular_type: 'INCENTIVE_INCOME',
        agtrxn_note: note,
        agtrxn_voucher: '',
        agtrxn_agency_id: req.agency_id,
      };

      const agent_trxn_id = await agent_conn.insertAgentTransaction(
        agentTransactionData
      );

      const AccTrxnBody: IAcTrxn = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_voucher: vouchar_no,
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: incentive_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 31,
        acctrxn_pay_type: 'CASH',
      };

      const incentive_acctrxn_id = await new Trxns(req, trx).AccTrxnInsert(
        AccTrxnBody
      );

      const incentiveInfo: IAgentIncentiveIncome = {
        incentive_vouchar_no: vouchar_no,
        incentive_type: 'AGENT',
        incentive_agent_id: agent_id,
        incentive_agent_trxn_id: agent_trxn_id,
        incentive_account_id: account_id,
        incentive_actransaction_id: incentive_acctrxn_id as number,
        incentive_trnxtype_id: 26,
        incentive_account_category_id: type_id,
        incentive_amount: amount,
        incentive_created_by: incentive_created_by as number,
        incentive_date: date,
        incentive_note: note,
      };

      const incentive_id = await acc_conn.addIncentiveInc(incentiveInfo);

      await this.updateVoucher(req, 'ICI');

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
        message: 'Agent Incentive Income Created Successfully!',
        incentive_id,
      };
    });
  };

  public editAgentIncentive = async (req: Request) => {
    const { incentive_id } = req.params as { incentive_id: string };
    const {
      agent_id,
      account_id,
      type_id,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IAgentIncentiveReqBody;

    return await this.models.db.transaction(async (trx) => {
      const agent_conn = this.models.agentProfileModel(req, trx);
      const acc_conn = this.models.accountsModel(req, trx);

      const { prev_incentive_agent_trxn_id, prev_incentive_trxn_id } =
        await acc_conn.viewPrevIncentiveInfo(incentive_id);

      const agentTransactionData: IAgentProfileTransaction = {
        agtrxn_particular_id: 26,
        agtrxn_type: 'DEBIT',
        agtrxn_agent_id: agent_id,
        agtrxn_amount: amount,
        agtrxn_created_by: incentive_created_by,
        agtrxn_particular_type: 'INCENTIVE_INCOME',
        agtrxn_note: note,
        agtrxn_agency_id: req.agency_id,
        agtrxn_voucher: '',
      };

      const AccTrxnBody: IAcTrxnUpdate = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: incentive_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 31,
        acctrxn_pay_type: 'CASH',
        trxn_id: prev_incentive_trxn_id,
      };

      const incentive_acctrxn_id = await new Trxns(req, trx).AccTrxnUpdate(
        AccTrxnBody
      );

      const incentiveInfo: IAgentIncentiveIncome = {
        incentive_type: 'AGENT',
        incentive_account_id: account_id,
        incentive_actransaction_id: incentive_acctrxn_id,
        incentive_agent_id: agent_id,
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
        message: 'Incentive Income Edit Successfully!',
        incentive_id: id,
      };
    });
  };

  public deleteIncentiveIncome = async (req: Request) => {
    const { incentive_id } = req.params as { incentive_id: string };

    const { incentive_deleted_by } = req.body as {
      incentive_deleted_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const agent_conn = this.models.agentProfileModel(req, trx);
      const acc_conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      await acc_conn.deleteIncentive(incentive_id, incentive_deleted_by);

      const {
        prev_incentive_agent_trxn_id,
        prev_incentive_amount,
        prev_incentive_trxn_id,
      } = await acc_conn.viewPrevIncentiveInfo(incentive_id);

      await trxns.deleteAccTrxn(prev_incentive_trxn_id);

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
        message: 'Agent incentive deleted successfully!',
      };
    });
  };
}
export default IncentiveIncomeAgentProfile;
