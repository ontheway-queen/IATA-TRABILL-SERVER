import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import CustomError from '../../../../common/utils/errors/customError';
import {
  IClientToClient,
  IClietnToClietnReq,
  ICltoClUpdate,
} from '../../Types/HajjiManagement.Iterfaces';

class ClientToClientServices extends AbstractServices {
  constructor() {
    super();
  }

  public addClientToClient = async (req: Request) => {
    const {
      ctransfer_combclient_from,
      ctransfer_combclient_to,
      ctransfer_created_by,
      ctransfer_job_name,
      ctransfer_charge,
      ctransfer_note,
      ctransfer_tracking_no,
      ctrcknumber_number,
    } = req.body as IClietnToClietnReq;

    if (ctransfer_combclient_from === ctransfer_combclient_to) {
      throw new CustomError(
        'Client transfer from and to must be diffrent',
        400,
        'Invalid client select'
      );
    }

    const combclient_from = separateCombClientToId(ctransfer_combclient_from);
    const combclient_to = separateCombClientToId(ctransfer_combclient_to);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const cltocl_data: IClientToClient = {
        ctransfer_client_from: combclient_from.client_id,
        ctransfer_client_to: combclient_to.client_id,
        ctransfer_combined_from: combclient_from.combined_id,
        ctransfer_combined_to: combclient_to.combined_id,
        ctransfer_created_by,
        ctransfer_charge,
        ctransfer_job_name,
        ctransfer_note,
        ctransfer_tracking_no,
      };

      const id = await conn.insertClientToClient(cltocl_data);

      if (ctrcknumber_number) {
        const clToclTransactionData = ctrcknumber_number.map((item) => {
          return { ctrcknumber_ctransfer_id: id, ctrcknumber_number: item };
        });

        await conn.insertClToClTransaction(clToclTransactionData);
      }

      const content = `Client to client hajj successfully transfer`;
      await this.insertAudit(
        req,
        'create',
        content,
        ctransfer_created_by,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Client to client hajj transfer succeed',
        data: id,
      };
    });
  };

  public updateClientToClient = async (req: Request) => {
    const {
      ctransfer_combclient_from,
      ctransfer_combclient_to,
      ctransfer_created_by,
      ctransfer_job_name,
      ctransfer_note,
      ctransfer_charge,
      ctransfer_tracking_no,
      ctrcknumber_number,
    } = req.body as IClietnToClietnReq;

    if (ctransfer_combclient_from === ctransfer_combclient_to) {
      throw new CustomError(
        'Client transfer from and to must be different',
        400,
        'Invalid client select'
      );
    }

    const combclient_from = separateCombClientToId(ctransfer_combclient_from);
    const combclient_to = separateCombClientToId(ctransfer_combclient_to);
    const id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const cltocl_data: ICltoClUpdate = {
        ctransfer_client_from: combclient_from.client_id,
        ctransfer_client_to: combclient_to.client_id,
        ctransfer_combined_from: combclient_from.combined_id,
        ctransfer_combined_to: combclient_to.combined_id,
        ctransfer_updated_by: ctransfer_created_by,
        ctransfer_charge,
        ctransfer_job_name,
        ctransfer_note,
        ctransfer_tracking_no,
      };

      await conn.updateClientToClient(cltocl_data, id);

      // @Delete previous clToCl Transaction data
      await conn.deleteClToClTransaction(id, ctransfer_created_by);

      if (ctrcknumber_number) {
        const clToclTransactionData = ctrcknumber_number.map((item) => {
          return { ctrcknumber_ctransfer_id: id, ctrcknumber_number: item };
        });

        await conn.insertClToClTransaction(clToclTransactionData);
      }

      const content = `Client to client hajj transfer updated`;
      await this.insertAudit(
        req,
        'update',
        content,
        ctransfer_created_by,
        'HAJJ_MGT'
      );
      return {
        success: true,
        data: 'Client to client transfer update successfully...',
      };
    });
  };

  public deleteClientToClient = async (req: Request) => {
    const id = Number(req.params.id);

    const { transfer_deleted_by } = req.body as { transfer_deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.HajjiManagementModels(req, trx);

      const data = await conn.deleteClientToClient(id, transfer_deleted_by);
      if (!data) {
        throw new CustomError('Please provide an valid id', 400, 'Invalid Id');
      }

      await conn.deleteClToClTransaction(id, transfer_deleted_by);

      const message = `Client to client hajj transfer deleted`;
      await this.insertAudit(
        req,
        'delete',
        message,
        transfer_deleted_by,
        'HAJJ_MGT'
      );
      return {
        success: true,
        data: 'Client to client transfer deleted successfully...',
      };
    });
  };

  public getAllClientToClient = async (req: Request) => {
    const { page, size, trash } = req.query;

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getAllClientToClient(
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      message: 'Client to client transfer',
      ...data,
    };
  };

  public getDetailsClientToClient = async (req: Request) => {
    const id = Number(req.params.id);
    if (!id) {
      throw new CustomError('Please provide Id', 400, 'Empty Id');
    }

    const conn = this.models.HajjiManagementModels(req);

    const data = await conn.getDetailsClientToClient(id);

    return {
      success: true,
      data,
    };
  };

  public viewClientTransaction = async (req: Request) => {
    const conn = this.models.HajjiManagementModels(req);
    const conn_client = this.models.clientModel(req);
    const id = Number(req.params.id);

    const data = await conn.viewClientTransaction(id);
    const transfer_to_id = data.ctransfer_client_to;
    const transfer_to = await conn_client.getClientName(transfer_to_id);
    data.transfer_to = transfer_to.client_name;

    return { success: true, data };
  };
}

export default ClientToClientServices;
