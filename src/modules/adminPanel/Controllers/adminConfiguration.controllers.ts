import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import AdminPanelServices from '../Services/adminPanel.services';
import AdminPanelValidators from '../Validators/adminPanel.validators';

class AdminConfigurationControllers extends AbstractController {
  private services = new AdminPanelServices();
  private validator = new AdminPanelValidators();
  constructor() {
    super();
  }

  public getAllClientCategory = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllClientCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getClientCategoryForSelect = this.assyncWrapper.wrap(
    this.validator.readAll,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getClientCategoryForSelect(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public insertClientCategory = this.assyncWrapper.wrap(
    this.validator.createClientCategory,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.insertClientCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteClientCate = this.assyncWrapper.wrap(
    this.validator.deleteClientCate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteClientCate(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateClientCategory = this.assyncWrapper.wrap(
    this.validator.createClientCategory,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateClientCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllAirports = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllAirports(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
  public insertAirports = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.inserAirports(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
  public deleteAirports = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteAirports(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
  public updateAirports = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateAirports(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAllProducts = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getProductCategoryForSelect = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getProductCategoryForSelect(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public insetProducts = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.insetProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateProducts = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.updateProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteProducts = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllVisaType = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserVisaType = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateVisaType = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteVisaType = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllDepartment = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserDepartment = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateDepartment = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteDepartment = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllRoomType = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserRoomType = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateRoomType = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteRoomType = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllTransportType = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserTransportType = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateTransportType = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateTransportTypeStatus = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTransportTypeStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteTransportType = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllDesignation = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserDesignation = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateDesignation = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteDesignation = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllPassportStatus = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllPassportStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserPassportStatus = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserPassportStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updatePassportStatus = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updatePassportStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deletePassportStatus = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deletePassportStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllAdminAgency = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAdminAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public inserAdminAgency = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.inserAdminAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateAdminAgency = this.assyncWrapper.wrap(
    this.validator.commonEdit,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAdminAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteAdminAgency = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAdminAgency(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getOfficeSalesman = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getOfficeSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getTrabillEmployeeForSelect = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getTrabillEmployeeForSelect(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public viewOfficeSalesman = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.viewOfficeSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public deleteOfficeSalesman = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.deleteOfficeSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public updateOfficeSalesman = this.assyncWrapper.wrap(
    this.validator.updateTrabillSalesman,
    async (req: Request, res: Response) => {
      const data = await this.services.updateOfficeSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public insertOfficeSalesman = this.assyncWrapper.wrap(
    this.validator.createTrabillSalesman,
    async (req: Request, res: Response) => {
      const data = await this.services.insertOfficeSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAgencySaleBy = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAgencySaleBy(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getSalesmanSalesForChart = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getSalesmanSalesForChart(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getTrabillSalesmanSales = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getTrabillSalesmanSales(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAllNotice = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllNotice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getActiveNotice = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getActiveNotice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public addNotice = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.addNotice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editNotice = this.assyncWrapper.wrap(
    this.validator.commonCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.editNotice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public downloadDB = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.downloadDB(req, res);
    }
  );
}

export default AdminConfigurationControllers;
