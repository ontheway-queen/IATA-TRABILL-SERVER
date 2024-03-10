import { idType } from '../../../common/types/common.types';

export interface IModules {
  module_name: number;
  module_created_by: number;
  module_status: 0 | 1;
}

export interface ISalesInfo {
  subcript_org_agency: number;
  subcript_salesman: number;
  subcript_type: string;
  subcript_amount: number;
  sbcript_sales_date?: string;
}

export interface IAgencyOrgBody extends IAgencyOrganization {
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  password: string;
  current_password: string;
  modules_id: string;
  subcript_amount: number;
  subcript_type: 'yearly' | 'monthly' | 'quarterly';
  air_ticket_type: 'IATA' | 'NON_IATA' | null;
  org_trabill_salesman_id: number;
}
export interface IAgencyOrganization {
  org_name: string;
  org_owner_full_name: string;
  org_owner_email: string;
  org_logo: string;
  org_address1: string;
  org_address2?: string | null;
  org_facebook?: string | null;
  org_website?: string | null;
  org_mobile_number: string;
  org_subscription_expired: any;
  org_sms_api_key?: string | null;
  org_sms_client_id?: string | null;
  org_extra_info: string | null;
  org_logo_width: number;
  org_logo_height?: number;
  org_currency: string;
  org_module_type?: 'TRABILL' | 'REC';
}

export interface IUpdateAgencyOrgBody
  extends Omit<IAgencyOrgBody, 'modules_id'> {
  modules_id: number[];
}

export interface IUpdateAgencyOrganization
  extends Omit<IAgencyOrganization, 'org_logo'> {}

export interface IClientCategory {
  category_title: string;
  category_prefix: string;
}

export interface IAirportData {
  airline_country_id: number;
  airline_airport: string;
  airline_iata_code: string;
}

export interface IProductsData {
  product_name: string;
  product_quantity: number;
  product_unit_price: number;
  product_total_price: number;
  product_description: number;
  product_category_id: number;
  product_status: number;
}

export interface IVisaTypeData {
  type_name: string;
  type_created_by: string;
}
export interface IDepartmentData {
  department_name: string;
  department_created_by: string;
}
export interface IRoomTypeData {
  rtype_name: string;
  rtype_created_by: string;
}

export interface ITransportTypeData {
  ttype_name: string;
}

export interface IDesignationData {
  designation_name: string;
}

export interface IPassportStatusData {
  pstatus_name: string;
}

export interface IAdminAgencyData {
  agency_name: string;
}

export interface ITrabillSalesman {
  salesman_name: string;
  salesman_number: number;
  salesman_email: string;
  salesman_designation: string;
}

export interface IAdminActivity {
  activity_type: 'UPDATE' | 'CREATE' | 'DELETE' | 'LOGIN' | 'RESTORED';
  activity_description: string;
  activity_org_id?: idType;
}

export interface INotice {
  ntc_id: number;
  ntc_txt: string;
  ntc_txt_colr: string;
  ntc_txt_bg: string;
  ntc_bg_img: string;
  ntc_status: number;
}
