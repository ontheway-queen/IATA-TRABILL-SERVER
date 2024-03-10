import { idType } from '../../../../common/types/common.types';
import {
  IIncentiveIncomeDetails,
  IIncentiveIncomeReqBody,
} from '../../../accounts/types/account.interfaces';

export interface IAgentProfileReqBody {
  agent_name: string;
  agent_email: string;
  agent_mobile: idType;
  agent_commission_rate?: idType;
  agent_last_balance?: idType;
  agent_created_by?: number;
  agent_updated_by?: number;

  agent_address: string;
  agent_nid_no: string;
  agent_image_copy?: string;
  agent_nid_front?: string;
  agent_nid_back?: string;
  agent_date_of_birth: string;
  agent_op_balance_type: 'Advance | Due';
  agent_op_amount: Number;
}

export interface IAgentProfileTransaction {
  agtrxn_agency_id: idType;
  agtrxn_invoice_id?: idType;
  agtrxn_agent_id: number;
  agtrxn_pay_type?: number;
  agtrxn_voucher: string;
  agtrxn_particular_id: number;
  agtrxn_particular_type: string;
  agtrxn_type: 'CREDIT' | 'DEBIT';
  agtrxn_amount: number;
  agtrxn_note: string;
  agtrxn_created_by: number;
}

export interface IAgentDeleteInfo {
  agent_is_deleted: number;
  agent_deleted_by: number;
}

export interface IAgentIncentiveReqBody
  extends Omit<
    IIncentiveIncomeReqBody,
    'vendor_id' | 'comb_client' | 'adjust_with_bill'
  > {}

export interface IAgentIncentiveIncome
  extends Omit<
    IIncentiveIncomeDetails,
    | 'incentive_vendor_id'
    | 'incentive_vtrxn_id'
    | 'incentive_combine_id'
    | 'incentive_client_id'
    | 'incentive_ctrxn_id'
    | 'incentive_adjust_bill'
  > {
  incentive_created_by: number;
}

export interface AgentImagesTypes {
  agent_image_copy: string;
  agent_nid_front: string;
  agent_nid_back: string;
}
