import { idType } from '../../../common/types/common.types';

export interface AgencyReqBody {
  agency_name: string;
  agency_created_by: number;
}

export interface VisaTypeReqBody {
  type_name: string;
  type_created_by: number;
}

export interface AirportReqBody {
  airline_country_id: number;
  airline_airport: string;
  airline_iata_code: string;
  airline_created_by?: number;
  airline_update_by?: number;
}

export interface ClientCategoryReqBody {
  category_title: string;
  category_prefix: string;
  category_created_by?: number;
}

export interface CompanyReqBody {
  company_name: string;
  company_contact_person: string;
  company_designation: string;
  company_phone: string;
  company_address: string;
  company_created_by: number;
}

export interface DepartmentsReqBody {
  department_name: string;
}

export interface DesignationReqBody {
  designation_name: string;
  designation_created_by: number;
}

export interface EmployeeReqBody {
  employee_card_id: number;
  employee_department_id: number;
  employee_designation_id: number;
  employee_bloodgroup_id: number;
  employee_full_name: string;
  employee_email: string;
  employee_mobile: string;
  employee_birth_date: string;
  employee_apppoint_date: string;
  employee_joining_date: string;
  employee_address: string;
  employee_created_by: number;
}

export interface ExpenseHeadReqBody {
  head_name: string;
  head_created_by?: number;
}

export interface GroupReqBody {
  group_name: string;
  group_type: string;
  group_created_by: number;
  group_status: number;
}

export interface MahramReqBody {
  maharam_name: string;
  maharam_created_by?: number;
}

export interface PassportStatusReqBody {
  status_title: string;
  status_sms_content: string;
  status_sms_content_client: string;
  status_sms_content_owner: string;
  status_owner_name: string;
  status_owner_mobile: string;
  status_created_by: number;
}

export interface ProductsReqBody {
  product_name: string;
  product_category_id: number;
  product_starting_from: number;
  product_created_by: number;
}

export interface ProductCategoryReqBody {
  category_title: string;
  category_created_by: number;
}

export interface RoomTypeReqBody {
  rtype_name: string;
}

export interface UserReqBody {
  role_name: string;
  user_role: 'ADMIN' | 'EMPLOYEE' | 'ACCOUNTS';
  role_permissions: string;
}

// ======== tour itinerary
export interface ITourGroups {
  group_name: string;
  group_maximum_pax_allowed: string;
  group_created_by: number;
}
export interface ICities {
  city_country_id: number;
  city_name: string;
  city_created_by?: number;
  city_updated_by?: number;
}
export interface IITineraries {
  itinerary_type: itineraryType;
  itinerary_place_id: number;
  itinerary_vendor_id: number;
  itinerary_particular?: string;
  itinerary_cost_price?: number;
  itinerary_created_by?: number;
  itinerary_updated_by?: number;
  itinerary_status: number;
}
export interface IITinerariesVendor {
  itnrvendor_itinerary_id: idType;
  itnrvendor_vendor_id: string;
  itnrvendor_cost_price: number;
}
export interface IITinerariesVendorDb {
  itnrvendor_itinerary_id: idType;
  itnrvendor_vendor_id: number | null;
  itnrvendor_combined_id: number | null;
  itnrvendor_cost_price: number;
}

export interface ITourTicketReq extends IITineraries {
  vendors: IITinerariesVendor[];
}

export interface ITourPlaces {
  place_country_id: number;
  place_city_id: number;
  place_name: string;
  place_status: number;
  place_created_by?: number;
  place_updated_by?: number;
}

export interface IitinerariesAccmVendors {
  accmvendor_accommodation_id: idType;
  accmvendor_vendor_id: string | number;
  accmvendor_cost_price: number;
  accmvendor_combined_id: number | null;
}

export type itineraryType =
  | 'TICKETS'
  | 'GUIDES'
  | 'TRANSPORTS'
  | 'FOODS'
  | 'OTHER_TRANSPORTS';

export interface IToursAccommodations {
  accommodation_country_id: idType;
  accommodation_city_id: idType;
  accommodation_room_type_id: idType;
  accommodation_hotel_name: string;
  accommodation_pax_name: string;
  accommodation_created_by?: idType;
  accommodation_updated_by?: idType;
  accommodation_status: number;
}

export interface IAccmmdtinsReq extends IToursAccommodations {
  vendors: Omit<IitinerariesAccmVendors, 'accmvendor_accommodation_id'>[];
}

export interface IJobs {
  job_name: string;
  job_created_by: number;
  job_updated_by: number;
}

export interface CreateIJobs extends Omit<IJobs, 'job_updated_by'> {}
export interface EditIJobs extends Omit<IJobs, 'job_created_by'> {}

export interface IOffices {
  office_name: number;
  office_address: number;
  office_email: number;
  office_created_by: number;
  office_updated_by: number;
}

export interface CreateIOffices extends Omit<IOffices, 'office_updated_by'> {}
export interface EditIOffices extends Omit<IOffices, 'office_created_by'> {}

export interface IAppConfig {
  tac_inv_cs: string;
  tac_inv_as: string;
  tac_inv_iw: string;
  tac_inv_in: string;
  tac_inv_sd: string;
  tac_inv_mob: string;
  tac_ait_cal: string;
  tac_wtr_mark: 0 | 1;
  tac_sig_url: string;
  tac_signtr: 0 | 1;
  tac_due_wtr_mark: 0 | 1;
  tac_paid_wtr_mark: 0 | 1;
  tac_auto_sms: 0 | 1;
  tac_wk_day: number;
}

export interface ImagesTypes {
  tac_sig_url?: string;
  tac_wtr_mark_url?: string;
}

// SIGNATURE
export interface ISignatureReqBody {
  sig_employee_id: number;
  sig_user_id: number;
  sig_type: 'AUTHORITY' | 'SALES' | 'PREPARE';
  sig_name_title: string;
  sig_position: string;
  sig_company_name: string;
  sig_address: string;
  sig_city: string;
  sig_state: string;
  sig_zip_code: string;
  sig_email: string;
  sig_signature: string | null;
}
export interface ISignatureDB extends ISignatureReqBody {
  sig_org_id: number;
  sig_created_by: number;
}
