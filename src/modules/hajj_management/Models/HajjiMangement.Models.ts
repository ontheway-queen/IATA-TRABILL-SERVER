import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  ICancelHajjReg,
  ICancelHajjRegTrackingNo,
  ICancelPreRegTrackingNo,
  IClientToClient,
  ICltoClUpdate,
  IGroupToGroup,
  IGroupToGroupInfo,
  IHajiTransfer,
  IPreRegCancelList,
} from '../Types/HajjiManagement.Iterfaces';

class HajjiManagementModels extends AbstractModels {
  // ============================= @ client to client =====================================

  public async insertClientToClient(insertedData: IClientToClient) {
    const id = await this.query()
      .into('trabill_client_to_client_transfer')
      .insert({ ...insertedData, ctransfer_org_agency: this.org_agency });

    return id[0] as number;
  }

  public async deleteClientToClient(id: number, ctransfer_deleted_by: idType) {
    const data = await this.query()
      .into('trabill_client_to_client_transfer')
      .update({ ctransfer_is_deleted: 1, ctransfer_deleted_by })
      .where('ctransfer_id', id);

    return data;
  }

  public async deleteClToClTransaction(
    id: number,
    ctrcknumber_deleted_by: idType
  ) {
    await this.query()
      .into('trabill_c_to_c_transfer_tracking_numbers')
      .update({ ctrcknumber_is_deleted: 1, ctrcknumber_deleted_by })
      .where('ctrcknumber_ctransfer_id', id);
  }
  public async insertClToClTransaction(
    insertedData: {
      ctrcknumber_ctransfer_id: number;
      ctrcknumber_number: number;
    }[]
  ) {
    const id = await this.query()
      .into('trabill_c_to_c_transfer_tracking_numbers')
      .insert(insertedData);

    return id[0] as number;
  }

  public async updateClientToClient(insertedData: ICltoClUpdate, id: number) {
    const data = await this.query()
      .into('trabill_client_to_client_transfer')
      .update(insertedData)
      .where('ctransfer_id', id);

    if (data) {
      return data;
    } else {
      throw new CustomError(
        `You can't update client to client transfer`,
        400,
        `Bad request`
      );
    }
  }

  public async getTrackingNoByClient(
    clientId: number | null,
    combinedId: number | null,
    searchTerm: string
  ) {
    const data = await this.query()
      .select(
        'haji_info_vouchar_no',
        'hajiinfo_tracking_number',
        'hajiinfo_serial',
        'passport_name',
        'passport_mobile_no',
        'passport_nid_no',
        'passport_date_of_birth',
        'hajiinfo_gender'
      )
      .from('trabill_invoice_hajj_haji_infos')
      .leftJoin('trabill_passport_details', {
        passport_id: 'haji_info_passport_id',
      })
      .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
      .where('invoice_org_agency', this.org_agency)
      .andWhereNot('haji_info_is_deleted', 1)
      .andWhere((event) => {
        if (clientId) {
          event.andWhere('invoice_client_id', clientId);
        } else {
          event.andWhere('invoice_combined_id', combinedId);
        }

        if (searchTerm)
          event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
            searchTerm,
          ]);
      });

    return data;
  }

  public async getTrackingNoByGroup(group_id: string, searchTerm: string) {
    return await this.query()
      .select(
        'passport_name',
        'haji_info_vouchar_no',
        'hajiinfo_gender',
        'hajiinfo_serial',
        'hajiinfo_tracking_number',
        'passport_nid_no'
      )
      .from('trabill_invoices')
      .leftJoin('trabill_invoice_hajj_haji_infos', (event) => {
        return event
          .on('haji_info_invoice_id', '=', 'invoice_id')
          .andOn(this.db.raw('haji_info_is_deleted = 0'));
      })
      .leftJoin('trabill_passport_details', {
        passport_id: 'haji_info_passport_id',
      })
      .whereNot('invoice_is_deleted', 1)
      .andWhere('invoice_haji_group_id', group_id)
      .andWhere((event) => {
        if (searchTerm) {
          event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
            searchTerm,
          ]);
        }
      })
      .whereNotNull('hajiinfo_tracking_number');
  }

  public async getHajjPreReg(searchTerm: string) {
    const haji = await this.query()
      .select(
        'trabill_invoices.invoice_id',
        'haji_info_haji_id',
        'hajiinfo_tracking_number',
        'hajiinfo_name',
        'hajiinfo_mobile',
        'hajiinfo_gender',
        'hajiinfo_nid',
        'hajiinfo_serial',
        'haji_info_vouchar_no'
      )
      .from('trabill_invoice_hajj_pre_reg_haji_infos')
      .join('trabill_haji_informations as haji', {
        hajiinfo_id: 'haji_info_haji_id',
      })
      .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
      .where('trabill_invoices.invoice_org_agency', this.org_agency)
      .andWhereNot('haji_info_info_is_deleted', 1)
      .andWhereNot('haji_info_is_cancel', 1)
      .andWhereNot('haji.hajiinfo_tracking_number', 'null')
      .modify((builder) => {
        if (searchTerm) {
          builder.where(
            'haji.hajiinfo_tracking_number',
            'like',
            `%${searchTerm}%`
          );
        }
      });

    return haji;
  }

  public async getAllClientToClient(page: number, size: number) {
    const page_number = (page - 1) * size;
    const data = await this.query()
      .from('trabill_client_to_client_transfer')
      .select(
        'ctransfer_id',
        'ctransfer_note',
        'ctransfer_job_name',
        'ctransfer_tracking_no',
        'ctransfer_charge',
        this.db.raw(
          'COALESCE(cl.client_name, cc.combine_name) AS transfer_from_name'
        ),
        this.db.raw(
          'COALESCE(ct.client_name, cct.combine_name) AS transfer_to_name'
        ),
        this.db.raw(
          "DATE_FORMAT(ctransfer_created_date , '%b %d %Y') as transfer_date"
        )
      )
      .leftJoin(
        'trabill_clients as cl',
        'cl.client_id',
        'ctransfer_client_from'
      )
      .leftJoin('trabill_clients as ct', 'ct.client_id', 'ctransfer_client_to')
      .leftJoin(
        'trabill_combined_clients as cc',
        'cc.combine_id',
        'ctransfer_combined_from'
      )
      .leftJoin(
        'trabill_combined_clients as cct',
        'cct.combine_id',
        'ctransfer_combined_to'
      )
      .where(
        'trabill_client_to_client_transfer.ctransfer_org_agency',
        this.org_agency
      )
      .andWhereNot('ctransfer_is_deleted', 1)
      .orderBy('ctransfer_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_client_to_client_transfer')
      .where(
        'trabill_client_to_client_transfer.ctransfer_org_agency',
        this.org_agency
      )
      .andWhereNot('ctransfer_is_deleted', 1);

    return { count: row_count, data };
  }

  public async getDetailsClientToClient(id: number) {
    const [data] = await this.query()
      .from('trabill_client_to_client_transfer')
      .select(
        this.db.raw(
          "CASE WHEN ctransfer_client_from IS NOT NULL THEN CONCAT('client-',ctransfer_client_from) ELSE CONCAT('combined-',ctransfer_combined_from) END AS ctransfer_combclient_from"
        ),
        this.db.raw(
          "CASE WHEN ctransfer_client_to IS NOT NULL THEN CONCAT('client-',ctransfer_client_to) ELSE CONCAT('combined-',ctransfer_combined_from) END AS ctransfer_combclient_to"
        ),

        'ctransfer_note',
        'ctransfer_job_name',
        'ctransfer_tracking_no',
        'ctransfer_created_by',
        'ctransfer_charge'
      )
      .where('ctransfer_id', id);

    const tracking_numbers = (await this.query()
      .select('ctrcknumber_number', 'ctrcknumber_is_deleted')
      .from('trabill_c_to_c_transfer_tracking_numbers')
      .where('ctrcknumber_ctransfer_id', id)
      .andWhereNot('ctrcknumber_is_deleted', 1)) as {
      ctrcknumber_number: number;
    }[];

    const ctrcknumber_number: number[] = tracking_numbers.map((item) => {
      return item.ctrcknumber_number;
    });

    return { ...data, ctrcknumber_number };
  }

  public getGroupToGroupTrackNo = async (id: number) => {
    const data = await this.query()
      .select('grouptr_number as ctrcknumber_number')
      .from('trabill_group_transfer_tracking_numbers')
      .where('grouptr_gtransfer_id', id);

    return data as { ctrcknumber_number: number }[];
  };

  public async viewClientTransaction(id: number) {
    const data = await this.query()
      .from('trabill_client_to_client_transfer')
      .select(
        'ctransfer_client_from',
        'ctransfer_client_to',
        this.db.raw(
          "DATE_FORMAT(ctransfer_created_date, '%Y-%c-%e') as transfer_date"
        ),
        'ctrcknumber_number',
        'client_name as transfer_from',
        'ctransfer_client_to'
      )
      .where('ctransfer_id', id)
      .leftJoin('trabill_c_to_c_transfer_tracking_numbers', {
        ctrcknumber_ctransfer_id: 'ctransfer_id',
      })
      .leftJoin('trabill_clients', {
        client_id: 'ctransfer_client_from',
      });

    return data[0];
  }

  // ========================= group to group ===============================
  public async insertGroupToGroup(insertedData: IGroupToGroup) {
    const id = await this.query()
      .into('trabill_group_to_group_transfer')
      .insert({ ...insertedData, gtransfer_org_agency: this.org_agency });

    return id[0] as number;
  }

  public async updateGroupToGroup(insertedData: IGroupToGroup, id: number) {
    const data = await this.query()
      .into('trabill_group_to_group_transfer')
      .update(insertedData)
      .where('gtransfer_id', id);
    if (data) {
      return data;
    } else {
      throw new CustomError(
        `You can't update group to group transer`,
        400,
        `Bad request`
      );
    }
  }

  public async getAllGroupToGroupTransfer(page: number, size: number) {
    const page_number = (page - 1) * size;
    const data: IGroupToGroupInfo[] = await this.query()
      .from('trabill_group_to_group_transfer')
      .select(
        'gtransfer_id',
        'gtransfer_from',
        'gtransfer_to',
        'gtransfer_note',
        'gtransfer_job_name',
        'gtransfer_tracking_no',
        'from_group.group_name as gtransfer_from_name',
        'to_group.group_name as gtransfer_to_name',
        this.db.raw(
          'DATE_FORMAT(gtransfer_create_date,"%Y %b %e") AS transfer_date'
        )
      )
      .where('is_deleted', 0)
      .andWhere('gtransfer_org_agency', this.org_agency)
      .orderBy('gtransfer_id', 'desc')
      .leftJoin('trabill_haji_group AS from_group', {
        'from_group.group_id': 'gtransfer_from',
      })
      .leftJoin('trabill_haji_group AS to_group', {
        'to_group.group_id': 'gtransfer_to',
      })
      .limit(size)
      .offset(page_number);

    const [{ count }] = (await this.query()
      .count('* as count')
      .from('trabill_group_to_group_transfer')
      .where('is_deleted', 0)
      .andWhere('gtransfer_org_agency', this.org_agency)) as {
      count: number;
    }[];

    return { count, data };
  }

  public async getHajiGroupName(group_id: number) {
    const client = await this.query()
      .from('trabill_haji_group')
      .select('group_name')
      .where('group_id', group_id)
      .andWhereNot('group_is_deleted', 1)
      .whereNull('group_org_agency')
      .orWhere('group_org_agency', this.org_agency);

    return client[0];
  }

  public async viewGroupTransfer(id: number) {
    const data = await this.query()
      .from('trabill_group_to_group_transfer')
      .select(
        this.db.raw(
          "DATE_FORMAT(gtransfer_create_date, '%Y %b %d') as transfer_date"
        ),
        'group_name as transfer_to_name',
        'gtransfer_to'
      )
      .where('gtransfer_id', id)
      .leftJoin('trabill_group_transfer_tracking_numbers', {
        grouptr_gtransfer_id: 'gtransfer_id',
      })
      .leftJoin('trabill_haji_group', {
        group_id: 'gtransfer_to',
      });

    return data[0];
  }

  public async deleteGroupTransaction(
    id: number,
    gtransfer_deleted_by: idType
  ) {
    const data = await this.query()
      .into('trabill_group_to_group_transfer')
      .update({ is_deleted: 1, gtransfer_deleted_by })
      .where('gtransfer_id', id);

    return data;
  }

  public async getDetailsGroupTransaction(id: number) {
    const [data] = await this.query()
      .from('trabill_group_to_group_transfer')
      .select(
        'gtransfer_from',
        'gtransfer_to',
        'gtransfer_note',
        'gtransfer_job_name',
        'grouptr_number',
        'gtransfer_tracking_no'
      )
      .where('gtransfer_id', id)
      .leftJoin('trabill_group_transfer_tracking_numbers', {
        grouptr_gtransfer_id: 'gtransfer_id',
      });

    const tracking_number = (await this.query()
      .select('grouptr_number')
      .from('trabill_group_transfer_tracking_numbers')
      .whereNot('is_deleted', 1)
      .andWhere('grouptr_gtransfer_id', id)) as { grouptr_number: number }[];

    const ctrcknumber_number = tracking_number.map((item) => {
      return item.grouptr_number;
    });

    return { ...data, ctrcknumber_number };
  }

  public async deleteGroupTransTracking(id: number) {
    await this.query()
      .into('trabill_group_transfer_tracking_numbers')
      .update({ is_deleted: 1 })
      .where('grouptr_gtransfer_id', id);
  }
  public async insertGroupTransactionTrackingNo(insertedData: {
    grouptr_gtransfer_id: number;
    grouptr_number: number;
  }) {
    const id = await this.query()
      .into('trabill_group_transfer_tracking_numbers')
      .insert(insertedData);

    return id[0] as number;
  }

  public async insertHajiTransfer(inserteData: IHajiTransfer) {
    const data = await this.query()
      .into('trabill_haji_transfer')
      .insert({ ...inserteData, transfer_org_agency: this.org_agency });
    return data[0];
  }

  public async insertHajiTransferTrackingNo(inserteData: {
    transfertrack_transfer_id: number;
    transfertrack_tracking_no: string;
    transfertrack_passport_id: string;
    transfertrack_maharam_id: number;
  }) {
    const data = await this.query()
      .into('trabill_haji_transfer_tracking_no')
      .insert(inserteData);
    return data[0];
  }

  public async deleteHajiTransferTrackingNo(
    id: number,
    transfertrack_deleted_by: idType
  ) {
    const data = await this.query()
      .into('trabill_haji_transfer_tracking_no')
      .update({ transfertrack_is_deleted: 1, transfertrack_deleted_by })
      .where('transfertrack_transfer_id', id);
    return data;
  }
  public async getAllHajiTransfer(
    transaction_type: string,
    page: number,
    size: number
  ) {
    const page_number = (page - 1) * size;
    const data = await this.query()
      .from('trabill_haji_transfer')
      .select(
        'transfer_id',
        'agency_name',
        'transfer_charge',
        this.db.raw(
          "DATE_FORMAT(transfer_create_date, ' %d %b %Y') as transfer_date"
        )
      )
      .where('transfer_type', transaction_type)
      .andWhere('is_deleted', 0)
      .join('trabill_agency', { agency_id: 'transfer_agent_id' })
      .andWhere('transfer_org_agency', this.org_agency)
      .orderBy('transfer_id', 'desc')
      .limit(size)
      .offset(page_number);
    return data;
  }

  public async countHajTransDataRow(transaction_type: string) {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_haji_transfer')
      .where('transfer_type', transaction_type)
      .andWhere('is_deleted', 0)
      .join('trabill_agency', { agency_id: 'transfer_agent_id' })
      .where('transfer_org_agency', this.org_agency);

    return count;
  }

  public async updateHajiTransfer(inserteData: IHajiTransfer, id: number) {
    const data = await this.query()
      .into('trabill_haji_transfer')
      .update(inserteData)
      .where('transfer_id', id);

    return data;
  }

  public async updateDeleteHajiTransfer(
    id: number,
    transfer_deleted_by: idType
  ) {
    const data = await this.query()
      .into('trabill_haji_transfer')
      .update({ is_deleted: 1, transfer_deleted_by })
      .where('transfer_id', id);
    return data;
  }

  public getHajiTransferForEdit = async (id: idType) => {
    const [data] = await this.query()
      .select('transfer_agent_id', 'agency_name', 'transfer_charge')
      .from('trabill_haji_transfer')
      .leftJoin('trabill_agency', { agency_id: 'transfer_agent_id' })
      .where('transfer_id', id);

    const haji_informations = await this.query()
      .select(
        this.db.raw(
          'CAST(transfertrack_tracking_no AS SIGNED) AS transfertrack_tracking_no'
        ),
        'transfertrack_passport_id',
        'passport_name',
        'passport_passport_no',
        'passport_mobile_no',
        'passport_email',
        'passport_nid_no',
        'transfertrack_maharam_id',
        'maharam_name'
      )
      .from('trabill_haji_transfer_tracking_no')
      .leftJoin('trabill_passport_details', {
        passport_id: 'transfertrack_passport_id',
      })
      .leftJoin('trabill_maharams', { maharam_id: 'transfertrack_maharam_id' })
      .whereNot('transfertrack_is_deleted', 1)
      .andWhere('transfertrack_transfer_id', id);

    return { ...data, haji_informations };
  };

  public getTotalhaji = async (id: idType) => {
    const data = await this.query()
      .from('trabill_haji_transfer_tracking_no')
      .select(
        'transfertrack_tracking_no',
        'transfertrack_passport_id',
        'passport_name',
        'passport_passport_no',
        'transfertrack_maharam_id',
        'maharam_name'
      )
      .leftJoin('trabill_passport_details', {
        passport_id: 'transfertrack_passport_id',
      })
      .leftJoin('trabill_maharams', { maharam_id: 'transfertrack_maharam_id' })
      .where('transfertrack_transfer_id', id)
      .andWhere('transfertrack_is_deleted', 0);

    return data as {
      transfertrack_tracking_no: string;
      total_hajji: number;
    }[];
  };

  public getAllCancelPreReg = async (page: number, size: number) => {
    const page_number = (page - 1) * size;

    const data = await this.query()
      .into('trabill_prereg_cancel_list')
      .select(
        'cancel_id',
        this.db.raw(
          `GROUP_CONCAT(cancel_track_tracking_no SEPARATOR ', ') as cancel_track_tracking_no`
        ),
        'cancel_office_charge',
        'cancel_govt_charge',
        'cancel_total_charge',

        this.db.raw("DATE_FORMAT(cancel_create_date, '%d %b %Y') as date")
      )
      .join('trabill_prereg_cancel_tracking_no', {
        cancel_track_cancel_id: 'cancel_id',
      })
      .where('trabill_prereg_cancel_list.cancel_is_deleted', 0)
      .andWhere('cancel_org_agency', this.org_agency)
      .groupBy(
        'cancel_id',
        'cancel_office_charge',
        'cancel_govt_charge',
        'cancel_total_charge'
      )
      .orderBy('cancel_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [count] = (await this.query()
      .select(this.db.raw(`COUNT(*) AS row_count`))
      .from('trabill_prereg_cancel_list')
      .where('trabill_prereg_cancel_list.cancel_is_deleted', 0)
      .andWhere('cancel_org_agency', this.org_agency)) as {
      row_count: number;
    }[];

    return { count: count.row_count, data };
  };

  public deleteCancelPreReg = async (
    cancle_id: idType,
    cancel_track_deleted_by: idType
  ) => {
    return await this.query()
      .into('trabill_prereg_cancel_tracking_no')
      .update({ cancel_track_is_deleted: 1, cancel_track_deleted_by })
      .where('cancel_track_cancel_id', cancle_id);
  };

  public async deleteHajiPreRegInvoice(
    id: number,
    invoice_has_deleted_by: number | null,
    is_deleted: 0 | 1
  ) {
    const deleted = this.query()
      .into('trabill_invoices')
      .update({ invoice_is_deleted: is_deleted, invoice_has_deleted_by })
      .where('invoice_id', id);

    if (!deleted) {
      throw new CustomError(
        'Please provide a valid Id to delete a Invoice',
        400,
        'Invalid Invoice Id'
      );
    }
  }

  public insertPreRegCancelList = async (insertedData: IPreRegCancelList) => {
    const data = await this.query()
      .into('trabill_prereg_cancel_list')
      .insert({ ...insertedData, cancel_org_agency: this.org_agency });

    return data[0];
  };

  public deletePreRegCancleList = async (
    cancel_id: idType,
    cancel_deleted_by: number
  ) => {
    return await this.query()
      .update({ cancel_is_deleted: 1, cancel_deleted_by })
      .into('trabill_prereg_cancel_list')
      .where({ cancel_id });
  };

  public insertPreRegCancelTrackingNo = async (
    insertedData: ICancelPreRegTrackingNo | ICancelPreRegTrackingNo[]
  ) => {
    const data = await this.query()
      .into('trabill_prereg_cancel_tracking_no')
      .insert(insertedData);

    return data[0];
  };

  public async getHajjiInfoByTrakingNo(traking_no: number[]) {
    const data = await this.query()
      .select(
        'haji.hajiinfo_name',
        'haji.hajiinfo_serial',
        'haji.hajiinfo_tracking_number',
        'haji.hajiinfo_nid',
        'haji.hajiinfo_mobile',
        'haji.hajiinfo_gender',
        'haji_info.haji_info_vouchar_no',
        'maharam_name'
      )
      .from('trabill_haji_informations as haji')
      .leftJoin('trabill_invoice_hajj_pre_reg_haji_infos as haji_info', {
        haji_info_haji_id: 'haji.hajiinfo_id',
      })
      .leftJoin('trabill_maharams', { maharam_id: 'haji.hajiinfo_id' })
      .where('trabill_org_agency', this.org_agency)
      .havingIn('haji.hajiinfo_tracking_number', traking_no);

    return data;
  }

  public async getCancleTrakingNoInfo(cancel_id: idType) {
    return (await this.query()
      .select(
        'cancel_track_client_id as client_id',
        'cancel_track_combine_id as combine_id',
        'cancel_track_trxn_id as trxn_id',
        'cancel_track_tracking_no as tracking_no',
        this.db.raw(
          `COALESCE(concat('client-', cancel_track_client_id), concat('combined-', cancel_track_combine_id)) as comb_client`
        ),
        'cancel_track_invoice_id as invoice_id'
      )
      .from('trabill_prereg_cancel_tracking_no')
      .where('cancel_track_cancel_id', cancel_id)) as {
      client_id: number;
      combine_id: number;
      trxn_id: number;
      tracking_no: string;
      comb_client: string;
      invoice_id: number;
    }[];
  }

  public async getHajjTrackingList(search: string) {
    return await this.query()
      .select(
        'haji_info_id',
        'haji_info_vouchar_no',
        'hajiinfo_tracking_number',
        'hajiinfo_serial',
        'passport_name',
        'passport_passport_no',
        'passport_mobile_no',
        'passport_email',
        'passport_nid_no',
        'hajiinfo_gender',
        'haji_info_passport_id AS transfertrack_passport_id'
      )
      .from('trabill_invoice_hajj_haji_infos')
      .leftJoin('trabill_passport_details', {
        passport_id: 'haji_info_passport_id',
      })
      .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
      .whereNot('haji_info_is_deleted', 1)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhere((event) => {
        if (search) {
          event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE = ?`, [
            search,
          ]);
        }
      })
      .whereNotNull('haji_info_vouchar_no');
  }

  public async createHajjRegCancel(data: ICancelHajjReg) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_hajj_reg_cancel_list');

    return id;
  }
  public async deleteHajjRegCancelListTrackingNo(
    cancel_id: idType,
    deleted_by: number
  ) {
    await this.query()
      .update({ cl_is_deleted: 1, cl_deleted_by: deleted_by })
      .into('trabill_hajj_reg_cancel_list')
      .where('cl_id', cancel_id);

    return await this.query()
      .update({ clt_is_deleted: 1, clt_deleted_by: deleted_by })
      .into('trabill_hajj_reg_cancel_tracking_no')
      .where('clt_cl_id', cancel_id);
  }

  public async createHajjRegCancelTrackingNo(
    data: ICancelHajjRegTrackingNo | ICancelHajjRegTrackingNo[]
  ) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_hajj_reg_cancel_tracking_no');

    return id;
  }

  public async updateHajjHajiInfoIsCancel(
    tracking_no: idType,
    invoice_id: idType,
    is_cancel: 0 | 1 = 1
  ) {
    return await this.query()
      .update({ hajinfo_is_cancel: is_cancel })
      .into('trabill_invoice_hajj_haji_infos')
      .where('hajiinfo_tracking_number', tracking_no)
      .andWhere('haji_info_invoice_id', invoice_id);
  }

  public async updateInvoiceIsCancel(invoice_id: idType, is_cancel: 0 | 1) {
    const haji = await this.query()
      .select('hajiinfo_tracking_number')
      .from('trabill_invoice_hajj_haji_infos')
      .where('haji_info_invoice_id', invoice_id)
      .andWhereNot('haji_info_is_deleted', 1)
      .andWhereNot('hajinfo_is_cancel', is_cancel);

    await this.query()
      .update({ invoice_is_cancel: !haji.length && is_cancel === 1 ? 1 : 0 })
      .into('trabill_invoices')
      .where({ invoice_id });
  }

  public async updateHajjPreRegTrackingNoIsCancel(
    tracking_no: idType,
    invoice_id: idType,
    is_cancel: 0 | 1 = 1
  ) {
    return await this.query()
      .update({ haji_info_is_cancel: is_cancel })
      .into('trabill_invoice_hajj_pre_reg_haji_infos')
      .leftJoin('trabill_haji_informations', {
        hajiinfo_id: 'haji_info_haji_id',
      })
      .where('haji_info_invoice_id', invoice_id)
      .andWhere('hajiinfo_tracking_number', tracking_no);
  }

  public async updateInvoiceHajjPreRegIsCancel(
    invoice_id: idType,
    is_cancel: 0 | 1
  ) {
    const haji = await this.query()
      .select('hajiinfo_tracking_number')
      .from('trabill_invoice_hajj_pre_reg_haji_infos')
      .leftJoin('trabill_haji_informations', {
        hajiinfo_id: 'haji_info_haji_id',
      })
      .where('haji_info_invoice_id', invoice_id)
      .andWhereNot('haji_info_info_is_deleted', 1)
      .andWhereNot('haji_info_is_cancel', is_cancel);

    await this.query()
      .update({ invoice_is_cancel: !haji.length && is_cancel === 1 ? 1 : 0 })
      .into('trabill_invoices')
      .where({ invoice_id });
  }

  public async getCancelRegTrackingInfo(cancel_id: idType) {
    const data = (await this.query()
      .select(
        'clt_client_id',
        'clt_combine_id',
        'clt_trxn_id',
        'clt_invoice_id',
        'clt_tracking_no',
        this.db.raw(
          `COALESCE(concat('client-',clt_client_id),concat('combined-',clt_combine_id)) AS comb_client`
        )
      )
      .from('trabill_hajj_reg_cancel_tracking_no')
      .where('clt_cl_id', cancel_id)
      .andWhereNot('clt_is_deleted', 1)) as {
      clt_client_id: number;
      clt_combine_id: number;
      clt_trxn_id: number;
      clt_invoice_id: number;
      clt_tracking_no: string;
      comb_client: string;
    }[];

    return data;
  }

  public async getCancelHajjRegList(page: number, size: number) {
    const offset = (page - 1) * size;
    const data = await this.query()
      .select(
        'cl_id',
        'cl_office_charge',
        'cl_govt_charge',
        'cl_total_charge',
        'cl_created_date',
        this.db.raw(
          `GROUP_CONCAT(clt_tracking_no SEPARATOR ', ') AS tracking_no`
        )
      )
      .from('trabill_hajj_reg_cancel_list')
      .leftJoin('trabill_hajj_reg_cancel_tracking_no', (event) => {
        return event
          .on('clt_cl_id', '=', 'cl_id')
          .andOn(this.db.raw(`clt_is_deleted = 0`));
      })
      .whereNot('cl_is_deleted', 1)
      .andWhere('cl_org_agency', this.org_agency)
      .groupBy(
        'cl_id',
        'cl_office_charge',
        'cl_govt_charge',
        'cl_total_charge',
        'cl_created_date'
      )
      .limit(size)
      .offset(offset);

    const [{ count }] = (await this.query()
      .count('* AS count')
      .from('trabill_hajj_reg_cancel_list')
      .whereNot('cl_is_deleted', 1)
      .andWhere('cl_org_agency', this.org_agency)) as { count: number }[];

    return { count, data };
  }

  public async getHajjHajiInfo(search: string) {
    search && search.toLowerCase();

    return await this.query()
      .select(
        'hajiinfo_tracking_number',
        'invoice_id',
        'invoice_no',
        'haji_info_vouchar_no',
        'hajiinfo_serial',
        'hajiinfo_gender',
        'passport_nid_no',
        this.db.raw(`COALESCE(client_name, combine_name) AS client_name`)
      )
      .from('trabill_invoice_hajj_haji_infos')
      .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
      .leftJoin('trabill_passport_details', {
        passport_id: 'haji_info_passport_id',
      })
      .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'invoice_combined_id',
      })
      .whereNot('haji_info_is_deleted', 1)
      .andWhereNot('hajinfo_is_cancel', 1)
      .andWhere('invoice_org_agency', this.org_agency)
      .andWhere((event) => {
        if (search)
          event.andWhereRaw(`LOWER(hajiinfo_tracking_number) LIKE ?`, [
            `%${search}%`,
          ]);
      });
  }
}

export default HajjiManagementModels;
