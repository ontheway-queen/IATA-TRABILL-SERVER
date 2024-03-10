import { idType } from '../../../../common/types/common.types';

export interface IUpdateClientCategoryPrefix {
  category_prefix: string;
  category_starting_from: number;
}

export interface IClientBody {
  client_category_id: number;
  client_type: 'INDIVIDUAL' | 'CORPORATE';
  client_gender: 'Male' | 'Female';
  opening_balance_type: 'DEBIT' | 'CREDIT';
  client_name: string;
  client_email: string;
  client_mobile: string;
  client_address: string;
  client_designation: string;
  client_trade_license: string;
  client_credit_limit: number;
  client_created_by: number;
  opening_balance: number;
  client_walking_customer: 0 | 1;
  client_source: string;
}

export interface IAddClient
  extends Omit<IClientBody, 'opening_balance' | 'opening_balance_type'> {
  client_org_agency: idType;
  client_entry_id: string;
}

export interface IUpdateClient
  extends Omit<
    IClientBody,
    'opening_balance' | 'opening_balance_type' | 'client_created_by'
  > {
  client_updated_by: number;
}

interface ITempClientInfo {
  client_email?: string;
  client_address?: string;
  client_category_id: idType;
  client_designation?: string;
  client_trade_license?: string;
  client_name: string;
  client_gender?: string;
  client_mobile: string | null;
  client_credit_limit?: number;
}

export interface IAddClientInfo extends ITempClientInfo {
  client_entry_id: string;
  client_created_by: number;
  client_type: string;
}

export interface IEditClientInfo extends ITempClientInfo {
  client_activity_status: number;
  client_updated_by: number;
}

export interface ICompanyContactPerson {
  company_contact_company_id: idType;
  company_contact_person: string;
  company_contact_gender: string;
  company_contact_mobile: string;
  name?: string;
  gender?: string;
  dialCode?: string;
  number?: string;
}

export interface IClientLastBalance {
  lbalance_client_id: idType;
  lbalance_amount: number;
}
