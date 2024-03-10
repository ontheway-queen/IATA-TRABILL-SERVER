import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';
import { IInvoiceInfoReq } from '../../../../common/types/Invoice.common.interface';
import { IOtherBillingInformation } from '../../invoice_other/types/invoiceOther.interface';

export interface ITransferInhajiInfo {
  thajiinfo_transin_id: number;
  thajiinfo_haji_id: number;
  thajiinfo_passport_id: number;
  thajiinfo_vouchar_no: string;
  thajiinfo_maharam_id: number;
}

export interface IHajiInfoData {
  hajiinfo_name: string;
  hajiinfo_mobile: string;
  hajiinfo_dob: Date;
  hajiinfo_serial: string;
  hajiinfo_nid: string;
  hajiinfo_tracking_number: string;
  haji_info_passport_id?: number;
  hajiinfo_gender: 'MALE' | 'FEMALE';
}

export interface IHajjiInformation extends IHajiInfoData {
  haji_info_maharam: number;
  haji_info_possible_year: string;
  haji_info_reg_year: string;
  haji_info_vouchar_no: string;
  hajiinfo_id?: number;
  hajiinfo_is_deleted?: 0 | 1;
}

export interface IHajiInformationDb extends IHajiInfoData {
  hajiinfo_created_by: number;
}

export interface IInvoiceHajjPreReg extends IInvoiceInfoReq {
  haji_information: IHajjiInformation[];
  billing_information: IOtherBillingInformation[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IInvoiceHajiPreReg {
  haji_info_invoice_id: number;
  haji_info_haji_id: number;
  haji_info_vouchar_no?: string;
  haji_info_maharam?: number;
  haji_info_reg_year?: string;
  haji_info_possible_year?: string;
  haji_info_created_by?: number;
  haji_info_updated_by?: number;
}
