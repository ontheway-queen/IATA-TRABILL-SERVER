import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
import { IHajiTransfer, IValues } from '../../Types/HajjiManagement.Iterfaces';

class TransferInServices extends AbstractServices {
  constructor() {
    super();
  }

  public addTransferIn = async (req: Request) => {
    const {
      haji_informations,
      transfer_charge,
      transfer_agent_id,
      transfer_created_by,
    } = req.body as IValues;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const transferInData: IHajiTransfer = {
        transfer_agent_id,
        transfer_charge,
        transfer_type: 'IN',
        transfer_created_by,
      };

      const transfertrack_transfer_id = await conn.insertHajiTransfer(
        transferInData
      );

      for (const item of haji_informations) {
        const transferTrackingNo = {
          transfertrack_tracking_no: item.transfertrack_tracking_no,
          transfertrack_passport_id: item.transfertrack_passport_id,
          transfertrack_maharam_id: item.transfertrack_maharam_id,
          transfertrack_transfer_id,
        };

        await conn.insertHajiTransferTrackingNo(transferTrackingNo);
      }

      const message = `Hajj transfer in has been created`;
      await this.insertAudit(
        req,
        'create',
        message,
        transfer_created_by as number,
        'HAJJ_MGT'
      );

      return { success: true, data: transfertrack_transfer_id };
    });
  };

  public updateTransferIn = async (req: Request) => {
    const {
      haji_informations,
      transfer_charge,
      transfer_agent_id,
      transfer_created_by,
    } = req.body as IValues;

    const id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const transferInData: IHajiTransfer = {
        transfer_agent_id,
        transfer_charge,
        transfer_type: 'IN',
        transfer_created_by,
      };

      await conn.updateHajiTransfer(transferInData, id);

      // ============ delete previous hajiInfo
      await conn.deleteHajiTransferTrackingNo(
        id,
        transfer_created_by as number
      );

      for (const item of haji_informations) {
        const transferTrackingNo = {
          ...item,
          transfertrack_transfer_id: id,
        };

        await conn.insertHajiTransferTrackingNo(transferTrackingNo);
      }

      const message = `Hajj transfer in has been updated`;
      await this.insertAudit(
        req,
        'update',
        message,
        transfer_created_by as number,
        'HAJJ_MGT'
      );

      return { success: true, data: 'Updated successfully...' };
    });
  };

  public deleteTransferIn = async (req: Request) => {
    const id = Number(req.params.id);
    const { deleted_by } = req.body as { deleted_by: number };

    if (!id) {
      throw new CustomError('Pleace provide  a id', 400, 'Invalid Id');
    }

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      await conn.updateDeleteHajiTransfer(id, deleted_by);

      const message = `Hajj transfer in has been deleted`;
      await this.insertAudit(req, 'create', message, deleted_by, 'HAJJ_MGT');
      return {
        success: true,
        data: 'Data deleted successfully...',
      };
    });
  };

  public getAllHajiTransfer = async (req: Request) => {
    const { trash, page, size } = req.query;

    const conn = this.models.HajjiManagementModels(req);
    const transaction_type = req.params.type.toUpperCase();

    if (!['IN', 'OUT'].includes(transaction_type)) {
      throw new CustomError(
        'Provide a valid transaction type',
        400,
        'Invalid Type'
      );
    }

    const data: any[] = [];

    const items = await conn.getAllHajiTransfer(
      transaction_type,
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countHajTransDataRow(transaction_type);

    for (const item of items) {
      const haji_info = await conn.getTotalhaji(item.transfer_id);
      data.push({ ...item, haji_info });
    }

    return {
      success: true,
      count: count.row_count,
      data,
    };
  };

  public getDataForEdit = async (req: Request) => {
    const id = Number(req.params.id);
    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getHajiTransferForEdit(id);

    return {
      success: true,
      data,
    };
  };

  // =================== transfer out add update
  public addTransferOut = async (req: Request) => {
    const {
      haji_informations,
      transfer_charge,
      transfer_agent_id,
      transfer_created_by,
    } = req.body as IValues;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const transferInData: IHajiTransfer = {
        transfer_charge,
        transfer_agent_id,
        transfer_type: 'OUT',
        transfer_created_by,
      };

      const transfertrack_transfer_id = await conn.insertHajiTransfer(
        transferInData
      );

      for (const item of haji_informations) {
        const transferTrackingNo = {
          ...item,
          transfertrack_transfer_id,
        };

        await conn.insertHajiTransferTrackingNo(transferTrackingNo);
      }

      const message = `Hajj transfer out has been created`;
      await this.insertAudit(
        req,
        'create',
        message,
        transfer_created_by as number,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Haji transfer out created successful',
        data: transfertrack_transfer_id,
      };
    });
  };

  public updateTransferOut = async (req: Request) => {
    const {
      haji_informations,
      transfer_charge,
      transfer_agent_id,
      transfer_created_by,
    } = req.body as IValues;

    const id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const transferInData: IHajiTransfer = {
        transfer_charge,
        transfer_agent_id,
        transfer_type: 'OUT',
        transfer_created_by,
      };

      await conn.updateHajiTransfer(transferInData, id);

      // ============ delete previous hajiInfo
      await conn.deleteHajiTransferTrackingNo(
        id,
        transfer_created_by as number
      );

      for (const item of haji_informations) {
        const transferTrackingNo = {
          ...item,
          transfertrack_transfer_id: id,
        };

        await conn.insertHajiTransferTrackingNo(transferTrackingNo);
      }

      const message = `Hajj transfer out has been updated`;
      await this.insertAudit(
        req,
        'update',
        message,
        transfer_created_by as number,
        'HAJJ_MGT'
      );

      return { success: true, data: 'Updated successfully...' };
    });
  };
}

export default TransferInServices;
