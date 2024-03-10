export interface IClientToClient {
  ctransfer_combined_from: null | number;
  ctransfer_combined_to: null | number;
  ctransfer_client_from: number | null;
  ctransfer_client_to: number | null;
  ctransfer_note: string;
  ctransfer_job_name: string;
  ctransfer_tracking_no: string;
  ctransfer_charge: string;
  ctransfer_created_by: number;
}

export interface ICltoClUpdate
  extends Omit<IClientToClient, 'ctransfer_created_by'> {
  ctransfer_updated_by: number;
}

export interface IClietnToClietnReq {
  ctransfer_combclient_from: string;
  ctransfer_combclient_to: string;
  ctransfer_note: string;
  ctransfer_job_name: string;
  ctransfer_charge: string;
  ctransfer_tracking_no: string;
  ctransfer_created_by: number;
  ctrcknumber_number: number[];
}

export interface IGroupToGroup {
  gtransfer_from: number;
  gtransfer_to: number;
  gtransfer_note: string;
  gtransfer_job_name: string;
  gtransfer_tracking_no: string;
  gtransfer_charge: number;
  gtransfer_created_by?: number;
  gtransfer_updated_by?: number;
  ctrcknumber_number?: number[];
}

export interface IValues {
  haji_informations: {
    transfertrack_tracking_no: string;
    transfertrack_passport_id: string;
    transfertrack_maharam_id: number;
  }[];
  transfer_agent_id: number;
  transfer_charge: number;
  transfer_created_by?: number;
  transfer_updated_by?: number;
}

export interface IHajiTransfer {
  transfer_type: 'IN' | 'OUT';
  transfer_agent_id: number;
  transfer_haji_id?: number;
  transfer_charge: number;
  transfer_created_by?: number;
  transfer_updated_by?: number;
}

export interface IGetAllHajjiInfo {
  transfer_to_name: string;
  ctransfer_id: number;
  ctransfer_client_from: number;
  ctransfer_client_to: number;
  ctransfer_note: string;
  ctransfer_job_name: string;
  ctransfer_tracking_no: string;
}
export interface IGroupToGroupInfo {
  gtransfer_id: number;
  gtransfer_from: number;
  gtransfer_to: number;
  gtransfer_note: string;
  gtransfer_job_name: string;
  gtransfer_tracking_no: string;
  gtransfer_from_name: string;
  transfer_to_name: string;
}

export interface ICancelPreReg {
  cancel_created_by: number;
  cancel_total_charge: number;
  cancel_govt_charge: number;
  cancel_office_charge: number;
  tracking_no: string[];
}

export interface IPreRegCancelList {
  cancel_office_charge: number;
  cancel_govt_charge: number;
  cancel_total_charge: number;
  cancel_created_by: number;
}

export interface ICancelPreRegTrackingNo {
  cancel_track_client_id: number;
  cancel_track_combine_id: number;
  cancel_track_trxn_id: number;
  cancel_track_tracking_no: string;
  cancel_track_cancel_id: number;
  cancel_track_invoice_id: number;
}

export interface ICancelHajjReg {
  cl_org_agency: number;
  cl_office_charge: number;
  cl_govt_charge: number;
  cl_total_charge: number;
  cl_created_by: number;
}

export interface ICancelHajjRegTrackingNo {
  clt_cl_id: number;
  clt_client_id: number;
  clt_combine_id: number;
  clt_trxn_id: number;
  clt_invoice_id: number;
  clt_tracking_no: number;
}

export interface ICreateCancelHajjReg
  extends Omit<ICancelHajjReg, 'cl_created_by' | 'cl_org_agency'> {
  tracking_no: number[];
  created_by: number;
}
