import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
import {
  IGroupToGroup,
  IGroupToGroupInfo,
} from '../../Types/HajjiManagement.Iterfaces';

class GroupToGroupServices extends AbstractServices {
  constructor() {
    super();
  }

  public addGroupToGroup = async (req: Request) => {
    const body = req.body as IGroupToGroup;
    const ctrcknumber_numbers = body.ctrcknumber_number;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      delete body.ctrcknumber_number;

      const id = await conn.insertGroupToGroup(body);

      if (ctrcknumber_numbers) {
        for (const grouptr_number of ctrcknumber_numbers) {
          const clToclTransactionData = {
            grouptr_gtransfer_id: id,
            grouptr_number,
          };
          await conn.insertGroupTransactionTrackingNo(clToclTransactionData);
        }
      }

      await this.insertAudit(
        req,
        'create',
        `Group to group transfer created`,
        body.gtransfer_created_by as number,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Hajji has been transfer group to group',
        data: id,
      };
    });
  };

  public updateGroupToGroup = async (req: Request) => {
    const body = req.body as IGroupToGroup;
    const id = Number(req.params.id);
    const ctrcknumber_numbers = body.ctrcknumber_number;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      delete body.ctrcknumber_number;
      await conn.updateGroupToGroup(body, id);

      await conn.deleteGroupTransTracking(id);

      if (ctrcknumber_numbers) {
        for (const grouptr_number of ctrcknumber_numbers) {
          const clToclTransactionData = {
            grouptr_gtransfer_id: id,
            grouptr_number,
          };
          await conn.insertGroupTransactionTrackingNo(clToclTransactionData);
        }
      }

      const message = 'Group to group transfer update successfully...';
      await this.insertAudit(
        req,
        'update',
        message,
        body.gtransfer_created_by as number,
        'HAJJ_MGT'
      );

      return {
        success: true,
        data: 'Group to group transfer update successfully...',
      };
    });
  };

  public getAllGroupTransaction = async (req: Request) => {
    const { page, size } = req.query;

    const conn = this.models.HajjiManagementModels(req);
    const data = await conn.getAllGroupToGroupTransfer(
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      message: 'Group to group transfer',
      ...data,
    };
  };

  public viewGroupTransfer = async (req: Request) => {
    const conn = this.models.HajjiManagementModels(req);
    const conn_group = this.models.configModel.groupModel(req);
    const id = Number(req.params.id);
    const data = await conn.viewGroupTransfer(id);
    const transfer_to_id = data.gtransfer_to;
    const transfer_to = await conn_group.getGroupName(transfer_to_id);
    data.transfer_to = transfer_to;

    return { success: true, message: 'View group transfer data', data };
  };

  public deleteGroupTransaction = async (req: Request) => {
    const id = Number(req.params.id);
    const { deleted_by } = req.body as { deleted_by: number };

    if (!id) {
      throw new CustomError('Please provide an id', 400, 'Id is empty');
    }

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const data = await conn.deleteGroupTransaction(id, deleted_by);
      if (!data) {
        throw new CustomError('Please provide an valid id', 400, 'Invalid Id');
      }

      await conn.deleteGroupTransTracking(id);

      await this.insertAudit(
        req,
        'delete',
        `Group to group transfer deleted`,
        deleted_by,
        'HAJJ_MGT'
      );
      return {
        success: true,
        data: 'Group to group transfer deleted successfully...',
      };
    });
  };

  public getDetailsGroupTransactioon = async (req: Request) => {
    const id = Number(req.params.id);

    const conn = this.models.HajjiManagementModels(req);
    const data = await conn.getDetailsGroupTransaction(id);

    return {
      success: true,
      data,
    };
  };
}

export default GroupToGroupServices;
