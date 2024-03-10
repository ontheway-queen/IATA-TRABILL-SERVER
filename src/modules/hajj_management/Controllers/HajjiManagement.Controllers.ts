import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import HajjiManagementServices from '../Services/HajjiManagement.Services';
import HajjimanagementValidators from '../Validators/HajjiManagement.Validators';

class HajjiMangementControllers extends AbstractController {
  private services = new HajjiManagementServices();
  private validator = new HajjimanagementValidators();

  constructor() {
    super();
  }
  // ================ client to client ===================
  public deleteClientToClient = this.assyncWrapper.wrap(
    this.validator.c2cDelete,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteClientToClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateClientToClient = this.assyncWrapper.wrap(
    this.validator.c2cUpdate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateClientToClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public addClientToClient = this.assyncWrapper.wrap(
    this.validator.postClientToClient,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addClientToClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getTrackingNoByClient = this.assyncWrapper.wrap(
    this.validator.readCancelPreReg,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getTrackingNoByClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getTrackingNoByGroup = this.assyncWrapper.wrap(
    this.validator.readCancelPreReg,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getTrackingNoByGroup(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getHajjPreReg = this.assyncWrapper.wrap(
    this.validator.readCancelPreReg,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getHajjPreReg(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllClientToClient = this.assyncWrapper.wrap(
    this.validator.c2cList,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllClientToClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDetailsClientToClient = this.assyncWrapper.wrap(
    this.validator.c2cRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getDetailsClientToClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewClientTransaction = this.assyncWrapper.wrap(
    this.validator.c2cRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewClientTransaction(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ====================== group transaction ========================
  public addGroupToGroup = this.assyncWrapper.wrap(
    this.validator.addGroupTransaction,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addGroupToGroup(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllGroupTransaction = this.assyncWrapper.wrap(
    this.validator.g2gList,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllGroupTransaction(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDetailsGroupTransactioon = this.assyncWrapper.wrap(
    this.validator.g2gRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getDetailsGroupTransactioon(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewGroupTransfer = this.assyncWrapper.wrap(
    this.validator.g2gRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewGroupTransfer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateGroupToGroup = this.assyncWrapper.wrap(
    this.validator.g2gUpdate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateGroupToGroup(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteGroupTransaction = this.assyncWrapper.wrap(
    this.validator.g2gDelete,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteGroupTransaction(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ========================= transfer in =======================
  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.transferInRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public addTransferIn = this.assyncWrapper.wrap(
    this.validator.addTransferIn,
    async (req: Request, res: Response) => {
      const data = await this.services.addTransferIn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateTransferIn = this.assyncWrapper.wrap(
    this.validator.transferInUpdate,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTransferIn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteTransferIn = this.assyncWrapper.wrap(
    this.validator.transferInDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTransferIn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllHajiTransfer = this.assyncWrapper.wrap(
    this.validator.transferInRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllHajiTransfer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ============================== Transfer Out ===========================
  public addTransferOut = this.assyncWrapper.wrap(
    this.validator.transferOutCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.addTransferOut(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateTransferOut = this.assyncWrapper.wrap(
    this.validator.transferOutUpdate,
    async (req: Request, res: Response) => {
      const data = await this.services.updateTransferOut(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // =============== cancel pre reg

  public createCancelPreReg = this.assyncWrapper.wrap(
    this.validator.addCancelPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.createCancelPreReg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllCancelPreReg = this.assyncWrapper.wrap(
    this.validator.readCancelPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllCancelPreReg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteCancelPreReg = this.assyncWrapper.wrap(
    this.validator.deleteCancelPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteCancelPreReg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getHajjiInfoByTrakingNo = this.assyncWrapper.wrap(
    this.validator.readCancelPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.getHajjiInfoByTrakingNo(req);

      res.status(200).json(data);
    }
  );
  public getHajjTrackingList = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getHajjTrackingList(req);

      res.status(200).json(data);
    }
  );

  public createCancelHajjReg = this.assyncWrapper.wrap(
    this.validator.createCancelHajjReg,
    async (req: Request, res: Response) => {
      const data = await this.services.createCancelHajjReg(req);

      res.status(200).json(data);
    }
  );

  public deleteCancelHajjReg = this.assyncWrapper.wrap(
    this.validator.deleteCancelPreReg,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteCancelHajjReg(req);

      res.status(200).json(data);
    }
  );

  public getCancelHajjRegList = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getCancelHajjRegList(req);

      res.status(200).json(data);
    }
  );

  public getHajjHajiInfo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getHajjHajiInfo(req);

      res.status(200).json(data);
    }
  );
}

export default HajjiMangementControllers;
