import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import CombineClientsServices from '../services/combineClients.services';
import CombineClientsValidator from '../validators/combineClients.validators';

class CombineClientsControllers extends AbstractController {
  private services = new CombineClientsServices();
  private validator = new CombineClientsValidator();

  constructor() {
    super();
  }

  public createCombineClients = this.assyncWrapper.wrap(
    this.validator.createCombineClients,
    async (req: Request, res: Response) => {
      const data = await this.services.createCombineClients(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Combine Client Created...');
      }
    }
  );

  public getAllCombines = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCombines(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all combine clients...');
      }
    }
  );

  public viewAllCombine = this.assyncWrapper.wrap(
    this.validator.readAllCombines,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllCombine(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  /**
   * get all combine
   */
  public getCombineClientExcelReport = this.assyncWrapper.wrap(
    this.validator.readAllCombines,
    async (req: Request, res: Response) => {
      const data = await this.services.getCombineClientExcelReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get combine clients excel report...');
      }
    }
  );

  public getCombinesForEdit = this.assyncWrapper.wrap(
    this.validator.readAllCombines,
    async (req: Request, res: Response) => {
      const data = await this.services.getCombineForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all combine clients...');
      }
    }
  );

  public updateClientStatus = this.assyncWrapper.wrap(
    this.validator.updateClientStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.updateClientStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Update client status...');
      }
    }
  );

  public editCombineClients = this.assyncWrapper.wrap(
    this.validator.updateCombineClients,
    async (req: Request, res: Response) => {
      const data = await this.services.editCombineClients(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit combine client...');
      }
    }
  );

  public deleteCombineClients = this.assyncWrapper.wrap(
    this.validator.deleteCombineClient,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteCombineClients(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete combine client...');
      }
    }
  );
}
export default CombineClientsControllers;
