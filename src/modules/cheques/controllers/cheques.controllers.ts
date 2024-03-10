import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import chequesServices from '../services/cheques.services';
import chequesValidators from '../validators/cheques.validators';

class chequesControllers extends AbstractController {
  private services = new chequesServices();
  private validator = new chequesValidators();

  constructor() {
    super();
  }

  public getAllCheques = this.assyncWrapper.wrap(
    this.validator.readCheques,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCheques(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get all cheques...');
      }
    }
  );

  public updateChequeStatus = this.assyncWrapper.wrap(
    this.validator.updateChequeStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.updateChequeStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}
export default chequesControllers;
