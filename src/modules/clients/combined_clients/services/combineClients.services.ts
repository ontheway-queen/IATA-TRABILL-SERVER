import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { idType } from '../../../../common/types/common.types';
import CreateCombineClients from './narrowServices/createCombineClients.services';
import DeleteCombineClient from './narrowServices/deleteCombineClient.services';
import EditCombineClient from './narrowServices/editCombineClients.services';
import RestoreCombineClient from './narrowServices/restoreCombineClients.services';

class CombineClientsServices extends AbstractServices {
  constructor() {
    super();
  }

  public getAllCombines = async (req: Request) => {
    const { trash, page, size, search } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
    };

    const conn = this.models.combineClientModel(req);

    const data = await conn.getAllCombines(
      Number(trash) || 0,
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    const count = await conn.countCombineDataRow(Number(trash) || 0, search);

    return { success: true, count, data };
  };

  public viewAllCombine = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.combineClientModel(req);

    const data = await conn.viewAllCombine(search as string);

    return { success: true, data };
  };

  public getCombineClientExcelReport = async (req: Request) => {
    const conn = this.models.combineClientModel(req);

    const clients = await conn.getCombineClientExcelReport();

    return { success: true, clientsData: clients };
  };

  public getCombineForEdit = async (req: Request) => {
    const { combine_id } = req.params as { combine_id: idType };

    const conn = this.models.combineClientModel(req);

    const data = await conn.getSingleCombinedClient(combine_id);
    const cproduct_product_id = await conn.getCombinePrevProductsId(combine_id);

    return { success: true, data: { ...data, cproduct_product_id } };
  };

  public updateClientStatus = async (req: Request) => {
    const { id } = req.params as { id: idType };

    const { combine_client_status, updated_by } = req.body as {
      combine_client_status: 0 | 1;
      updated_by: number;
    };

    const conn = this.models.combineClientModel(req);

    const data = await conn.updateClientStatus(id, combine_client_status);

    const message = `Combine client status updated as -${
      combine_client_status === 1 ? 'Active' : 'Inactive'
    }-`;
    await this.insertAudit(req, 'create', message, updated_by, 'ACCOUNTS');
    return {
      success: true,
      message: 'Combined client active status has been updated ',
    };
  };

  public createCombineClients = new CreateCombineClients().createCombineClient;
  public editCombineClients = new EditCombineClient().editCombineClient;
  public deleteCombineClients = new DeleteCombineClient().deleteCombineClient;
}
export default CombineClientsServices;
