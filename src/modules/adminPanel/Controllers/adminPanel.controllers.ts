import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import AdminPanelServices from '../Services/adminPanel.services';
import AdminPanelValidators from '../Validators/adminPanel.validators';

class AdminPanelControllers extends AbstractController {
  private services = new AdminPanelServices();
  private validator = new AdminPanelValidators();
  constructor() {
    super();
  }

  // @MODULES
  public createModules = this.assyncWrapper.wrap(
    this.validator.createModules,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.createModules(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updatesSalesInfo = this.assyncWrapper.wrap(
    this.validator.updateSalesInfo,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updatesSalesInfo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateModules = this.assyncWrapper.wrap(
    this.validator.createModules,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateModules(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteModules = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteModules(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllModules = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllModules(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @MODULES
  public createAgency = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.createAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateAgency = this.assyncWrapper.wrap(
    this.validator.updateAgency,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllAgency = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public resentAgency = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response) => {
      const data = await this.services.resentAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteOrgAgency = this.assyncWrapper.wrap(
    this.validator.deleteOrgAgency,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteOrgAgency(req, res);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public agencyExcelReport = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response) => {
      await this.services.agencyExcelReport(req, res);
    }
  );

  public getForEdit = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response) => {
      const data = await this.services.getForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public checkUsername = this.assyncWrapper.wrap(
    this.validator.checkIsUnique,
    async (req: Request, res: Response) => {
      const data = await this.services.checkUsername(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );

  public updateAgencyAcitiveStatus = this.assyncWrapper.wrap(
    this.validator.updateActivity,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAgencyActiveStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );

  public agencyDatabaseReset = this.assyncWrapper.wrap(
    this.validator.updateActivity,
    async (req: Request, res: Response) => {
      const data = await this.services.agencyDatabaseReset(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );

  public resetAgencyPassword = this.assyncWrapper.wrap(
    this.validator.resetAgencyPassword,
    async (req: Request, res: Response) => {
      const data = await this.services.resetAgencyPassword(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );

  public updateAgencyLogo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.updateAgencyLogo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );
  public agencyActivity = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.agencyActivity(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error occurred while checking uniqueness');
      }
    }
  );

  // @REPORT

  public agencyActivityReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAgencyActivityReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('An error is occurred');
      }
    }
  );

  public getAgencyProfile = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAgencyProfile(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public updateAgencyProfile = this.assyncWrapper.wrap(
    this.validator.updateAgencyProfile,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAgencyProfile(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default AdminPanelControllers;
