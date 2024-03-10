import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import CustomError from '../../../common/utils/errors/customError';
import {
  ICancelHajjRegTrackingNo,
  ICancelPreReg,
  ICancelPreRegTrackingNo,
  ICreateCancelHajjReg,
} from '../Types/HajjiManagement.Iterfaces';
import ClientToClientServices from './NarrowServices/ClientToClientServices';
import GroupToGroupServices from './NarrowServices/GroupToGroupServices';
import TransferInServices from './NarrowServices/TransferInServices';
import { IClTrxnBody } from '../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../common/helpers/Trxns';
import dayjs from 'dayjs';

class HajjiManagementServices extends AbstractServices {
  constructor() {
    super();
  }

  // ===================================== client to client transaction ==================================
  public deleteClientToClient = new ClientToClientServices()
    .deleteClientToClient;
  public addClientToClient = new ClientToClientServices().addClientToClient;
  public viewClientTransaction = new ClientToClientServices()
    .viewClientTransaction;
  public updateClientToClient = new ClientToClientServices()
    .updateClientToClient;
  public getDetailsClientToClient = new ClientToClientServices()
    .getDetailsClientToClient;
  public getAllClientToClient = new ClientToClientServices()
    .getAllClientToClient;

  // ==================================== group transaction ===========================================
  public addGroupToGroup = new GroupToGroupServices().addGroupToGroup;
  public getAllGroupTransaction = new GroupToGroupServices()
    .getAllGroupTransaction;
  public getDetailsGroupTransactioon = new GroupToGroupServices()
    .getDetailsGroupTransactioon;
  public viewGroupTransfer = new GroupToGroupServices().viewGroupTransfer;
  public updateGroupToGroup = new GroupToGroupServices().updateGroupToGroup;
  public deleteGroupTransaction = new GroupToGroupServices()
    .deleteGroupTransaction;

  // ============================= transfer in =========================================
  public addTransferIn = new TransferInServices().addTransferIn;
  public updateTransferIn = new TransferInServices().updateTransferIn;
  public deleteTransferIn = new TransferInServices().deleteTransferIn;
  public getAllHajiTransfer = new TransferInServices().getAllHajiTransfer;
  public getDataForEdit = new TransferInServices().getDataForEdit;
  // @Transfer Out
  public addTransferOut = new TransferInServices().addTransferOut;
  public updateTransferOut = new TransferInServices().updateTransferOut;

  // ================================ cancel pre registration ===========================
  public createCancelPreReg = async (req: Request) => {
    const {
      cancel_created_by,
      cancel_total_charge,
      cancel_govt_charge,
      cancel_office_charge,
      tracking_no,
    } = req.body as ICancelPreReg;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const conn = this.models.HajjiManagementModels(req, trx);
      const conn_pre_haji = this.models.invoiceHajjPre(req, trx);
      const trxns = new Trxns(req, trx);

      const cancel_id = await conn.insertPreRegCancelList({
        cancel_office_charge,
        cancel_govt_charge,
        cancel_total_charge,
        cancel_created_by,
      });

      const trackingNoInfo: ICancelPreRegTrackingNo[] = [];
      if (tracking_no.length)
        for await (const item of tracking_no) {
          const info = await conn_pre_haji.getHajiIdByTrackingNo(item);

          const { comb_client, prevInvoiceNo } =
            await common_conn.getPreviousInvoices(info.haji_info_invoice_id);

          await conn.updateHajjPreRegTrackingNoIsCancel(
            item,
            info.haji_info_invoice_id,
            1
          );

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: cancel_total_charge,
            ctrxn_cl: comb_client,
            ctrxn_voucher: prevInvoiceNo,
            ctrxn_particular_id: 44,
            ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
            ctrxn_note: '',
            ctrxn_particular_type: 'Cancel pre reg',
            ctrxn_user_id: cancel_created_by,
          };

          const cancel_track_trxn_id = await trxns.clTrxnInsert(clTrxnBody);

          const { client_id, combined_id } =
            separateCombClientToId(comb_client);

          const trackingNo: ICancelPreRegTrackingNo = {
            cancel_track_client_id: client_id as number,
            cancel_track_combine_id: combined_id as number,
            cancel_track_trxn_id,
            cancel_track_tracking_no: item,
            cancel_track_cancel_id: cancel_id,
            cancel_track_invoice_id: info.haji_info_invoice_id,
          };

          trackingNoInfo.push(trackingNo);

          await conn.updateInvoiceHajjPreRegIsCancel(
            info.haji_info_invoice_id,
            1
          );
        }

      if (trackingNoInfo.length)
        await conn.insertPreRegCancelTrackingNo(trackingNoInfo);

      await this.insertAudit(
        req,
        'create',
        'Invoice hajj pre reg has been created',
        cancel_created_by,
        'INVOICES'
      );

      return { success: true, data: { cancel_id } };
    });
  };

  /**
   *
   * @Get_invoice_hajj_tracking_no
   */
  public getTrackingNoByClient = async (req: Request) => {
    const conn = this.models.HajjiManagementModels(req);

    const combClient = req.params.comb_client;

    const { search } = req.query as {
      search: string;
    };

    const { client_id, combined_id } = separateCombClientToId(combClient);

    const data = await conn.getTrackingNoByClient(
      client_id,
      combined_id,
      search
    );

    return {
      success: true,
      message: 'Invoice hajj tracking no',
      data,
    };
  };

  /**
   *
   * @Get_invoice_hajj_tracking_no_by_group_id
   */
  public getTrackingNoByGroup = async (req: Request) => {
    const conn = this.models.HajjiManagementModels(req);

    const { group_id } = req.params;

    const { search: searchText } = req.query as {
      search: string;
    };

    const data = await conn.getTrackingNoByGroup(
      group_id,
      searchText as string
    );

    return {
      success: true,
      message: 'Invoice hajj tracking no by group',
      data,
    };
  };

  /**
   *
   * @Get_invoice_hajj_tracking_no_by_group_id
   */
  public getHajjPreReg = async (req: Request) => {
    const conn = this.models.HajjiManagementModels(req);

    const { search } = req.query as {
      search: string;
    };

    const data = await conn.getHajjPreReg(search);

    return { success: true, data };
  };

  public getAllCancelPreReg = async (req: Request) => {
    const { page, size } = req.query;
    const data = await this.models
      .HajjiManagementModels(req)
      .getAllCancelPreReg(Number(page) || 1, Number(size) || 20);

    return {
      success: true,
      ...data,
    };
  };

  public deleteCancelPreReg = async (req: Request) => {
    const cancle_id = req.params.id;
    const { deleted_by } = req.body as { deleted_by: number };
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);
      const trxn = new Trxns(req, trx);

      const trackingInfo = await conn.getCancleTrakingNoInfo(cancle_id);

      await conn.deletePreRegCancleList(cancle_id, deleted_by);
      await conn.deleteCancelPreReg(cancle_id, deleted_by);

      if (trackingInfo.length)
        for (const info of trackingInfo) {
          const { comb_client, trxn_id, invoice_id } = info;

          await conn.updateHajjPreRegTrackingNoIsCancel(
            info.tracking_no,
            invoice_id,
            0
          );

          if (trxn_id && comb_client)
            await trxn.deleteClTrxn(trxn_id, comb_client);

          await conn.updateInvoiceHajjPreRegIsCancel(invoice_id, 0);
        }

      await this.insertAudit(
        req,
        'delete',
        'Invoice hajj pre reg has been deleted',
        deleted_by,
        'INVOICES'
      );
      return {
        success: true,
        data: 'Cancle pre reg deleted successfully',
      };
    });
  };

  public getHajjiInfoByTrakingNo = async (req: Request) => {
    const { ticket_no } = req.body as { ticket_no: number[] };

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getHajjiInfoByTrakingNo(ticket_no);

    return { success: true, message: 'Get haji info by traking no', data };
  };

  public getHajjTrackingList = async (req: Request) => {
    const { search } = req.query as { search: string };

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getHajjTrackingList(search);

    return { success: true, data };
  };

  public createCancelHajjReg = async (req: Request) => {
    const {
      cl_govt_charge,
      cl_office_charge,
      cl_total_charge,
      created_by,
      tracking_no,
    } = req.body as ICreateCancelHajjReg;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);
      const hajj_conn = this.models.InvoiceHajjModels(req, trx);
      const trxns = new Trxns(req, trx);

      const cancel_id = await conn.createHajjRegCancel({
        cl_org_agency: +req.agency_id,
        cl_total_charge,
        cl_office_charge,
        cl_govt_charge,
        cl_created_by: created_by,
      });

      const trackingNoInfo: ICancelHajjRegTrackingNo[] = [];
      for (const item of tracking_no) {
        const info = await hajj_conn.getHajiInfoByTrackingNo(item);

        await conn.updateHajjHajiInfoIsCancel(item, info.invoice_id, 1);

        const ctrxn_id = await trxns.clTrxnInsert({
          ctrxn_amount: cl_total_charge,
          ctrxn_cl: info.comb_client,
          ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
          ctrxn_note: '',
          ctrxn_voucher: info.invoice_no,
          ctrxn_particular_id: 152,
          ctrxn_particular_type: 'Cancel Hajj Registration',
          ctrxn_type: 'DEBIT',
          ctrxn_user_id: created_by,
        });

        const trackingNo: ICancelHajjRegTrackingNo = {
          clt_cl_id: cancel_id,
          clt_client_id: info.invoice_client_id,
          clt_combine_id: info.invoice_combined_id,
          clt_invoice_id: info.invoice_id,
          clt_tracking_no: item,
          clt_trxn_id: ctrxn_id,
        };

        trackingNoInfo.push(trackingNo);
        await conn.updateInvoiceIsCancel(info.invoice_id, 1);
      }

      if (trackingNoInfo.length)
        await conn.createHajjRegCancelTrackingNo(trackingNoInfo);

      await this.insertAudit(
        req,
        'create',
        'Cancel reg has been created',
        created_by,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Create cancel hajj reg successful!',
        data: cancel_id,
      };
    });
  };

  public deleteCancelHajjReg = async (req: Request) => {
    const { cancel_id } = req.params as { cancel_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);
      const trxns = new Trxns(req, trx);

      const cancelInfo = await conn.getCancelRegTrackingInfo(cancel_id);
      await conn.deleteHajjRegCancelListTrackingNo(cancel_id, deleted_by);

      if (cancelInfo.length)
        for (const cancel of cancelInfo) {
          const { comb_client, clt_trxn_id, clt_invoice_id, clt_tracking_no } =
            cancel;

          await conn.updateHajjHajiInfoIsCancel(
            clt_tracking_no,
            clt_invoice_id,
            0
          );

          await trxns.deleteClTrxn(clt_trxn_id, comb_client);

          await conn.updateInvoiceIsCancel(clt_invoice_id, 0);
        }

      await this.insertAudit(
        req,
        'delete',
        'Delete cancel hajj reg',
        deleted_by,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Cancel Hajj Reg Delete Successful!',
      };
    });
  };

  public getCancelHajjRegList = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getCancelHajjRegList(
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      ...data,
    };
  };

  public getHajjHajiInfo = async (req: Request) => {
    const { search } = req.query as { search: string };

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getHajjHajiInfo(search);

    return {
      success: true,
      data,
    };
  };
}

export default HajjiManagementServices;
