export interface IReqPassportInfo {
  passport_no: string;
  name: string;
  mobile_no: string;
  date_of_birth?: string;
  date_of_issue?: string;
  date_of_expire?: string;
  email?: string;
  nid?: string;
}

export interface IPassportReqBody {
  passport_rec_cl_id?: string;
  client_id: string;
  passport_info: string;
  passport_created_by: number;
}

export interface IPassport_info {
  passport_no: string;
  name: string;
  email?: string;
  nid?: string;
  mobile_no: string;
  country_code: string;
  date_of_birth?: string;
  date_of_issue?: string;
  date_of_expire?: string;
  scan_copy?: string;
  upload_photo?: string;
  upload_others?: string;
  passport_person_type: 'Infant' | 'Child' | 'Adult';
}

export interface UploadedImage {
  passport_scan_copy?: string;
  passport_upload_photo?: string;
  passport_upload_others?: string;
}

export interface IPassport {
  passport_client_id: number | null;
  passport_combined_id: number | null;
  passport_passport_no: string;
  passport_name: string;
  passport_mobile_no: string;
  passport_date_of_birth?: string;
  passport_nid_no?: string;
  passport_date_of_issue?: string;
  passport_date_of_expire?: string;
  passport_email?: string;
  passport_scan_copy?: string;
  passport_upload_photo?: string;
  passport_upload_others?: string;
  passport_created_by?: number;
}

export interface IEditPassport
  extends Omit<IPassport, 'passport_client_id' | 'passport_combined_id'> {
  passport_updated_by?: number;
  passport_person_type: 'Infant' | 'Child' | 'Adult';
}

export interface IPassportEditReqBody
  extends IReqPassportInfo,
    Omit<IPassportReqBody, 'passport_info'> {
  passport_person_type: 'Infant' | 'Child' | 'Adult';
}

export interface PassportScanCopy {
  passport_scan_copy: string;
  passport_upload_others: string;
  passport_upload_photo: string;
}

export interface ChangePassport {
  passport_status_id: number;
  passport_status_change_date: string;
}

export interface SMSlog {
  smslog_for: string;
  smslog_passport_id: number | string;
  smslog_mobile?: number | string | undefined;
  smslog_content?: string | undefined;
  smslog_delivery_status: 'DELIVERED' | 'NOT DELIVERED';
}

export interface IParsePassportInfo {
  passport_info: IReqPassportInfo[];
  files: { [key: string]: string };
  clientId: number | null;
  combinedId: number | null;
  user: number;
}

interface IPassportInfoForm {
  country_code: number;
  scan_copy: {
    file: {
      uid: string;
      lastModified: number;
      lastModifiedDate: string;
      name: string;
      size: number;
      type: string;
      percent: number;
      originFileObj: {
        uid: string;
      };
      status: string;
      response: {
        name: string;
        status: string;
        url: string;
        thumbUrl: string;
      };
      xhr: {};
    };
    fileList: {
      uid: string;
      lastModified: number;
      lastModifiedDate: string;
      name: string;
      size: number;
      type: string;
      percent: number;
      originFileObj: {
        uid: string;
      };
      status: string;
      response: {
        name: string;
        status: string;
        url: string;
        thumbUrl: string;
      };
      xhr: {};
    }[];
  };
  passport_no: string;
  mobile_no: string;
  email: string;
  date_of_birth: string;
  date_of_issue: string;
  date_of_expire: string;
  name: string;
}

export interface IPassportFormValue {
  client_id: string;
  passport_info: IPassportInfoForm[];
  passport_created_by: string;
}
