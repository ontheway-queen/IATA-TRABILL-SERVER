import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceHajjPreRegServices from '../Services/InvoiceHajjPreReg.Services';
import InvoiceHajjPreRegValidators from '../Validators/InvoiceHajjPreReg.Validators';

class InvoiceHajjPreRegControllers extends AbstractController {
  private services = new InvoiceHajjPreRegServices();
  private validator = new InvoiceHajjPreRegValidators();
  constructor() {
    super();
  }

  public getAllInvoiceHajjiPreReg = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoices(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewInvoiceHajjiPreReg = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceHajjPreReg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public addInvoiceHajjPre = this.assyncWrapper.wrap(
    this.validator.postInvoiceHajjPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceHajjPre(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getPreRegistrationReports = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getPreRegistrationReports(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteInvoiceHajjPre = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteInvoiceHajjPre(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public voidHajjPreReg = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.voidHajjPreReg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editInvoiceHajjPre = this.assyncWrapper.wrap(
    this.validator.editInvoiceHajjPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceHajjPre(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDetailsById = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getDetailsById(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public hajiInfoByTrackingNo = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.hajiInfoByTrackingNo(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public hajiInformationHajjiManagement = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.hajiInformationHajjiManagement(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public hajiInfoSerialIsUnique = this.assyncWrapper.wrap(
    this.validator.hajiTrackingSerialCheck,
    async (req: Request, res: Response) => {
      const data = await this.services.hajiInfoSerialIsUnique(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateHajjiInfoStatus = this.assyncWrapper.wrap(
    this.validator.updateHajjiInfoStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.updateHajjiInfoStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAllHajiPreRegInfos = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllHajiPreRegInfos(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
}

export default InvoiceHajjPreRegControllers;
