import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import InvoiceHajjServices from '../Services/MoneyReceipt.Services';
import InvoiceCostValidators from '../Validators/MoneyReceipt.Validators';

class MoneyReceiptControllers extends AbstractController {
  private services = new InvoiceHajjServices();
  private validator = new InvoiceCostValidators();
  constructor() {
    super();
  }

  // @POST_MONEY_RECEIPT
  public postMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.postMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.addMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public agentCommissionReceiptAdd = this.assyncWrapper.wrap(
    this.validator.agentCommissionAdd,
    async (req: Request, res: Response) => {
      const data = await this.services.agentCommissionReceiptAdd(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteAgentMoneyRecipt = this.assyncWrapper.wrap(
    this.validator.deleteAgentCommission,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAgentMoneyRecipt(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  // @EDIT_MONEY_RECEIPT
  public editMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.updateMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.editMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  // @VIEW_MONREY_RECEIPT
  public viewMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewMoneyReceiptDetails = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewMoneyReceiptDetails(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @GET_INVOICE_DUE
  public getInvoiceDue = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceDue(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateMoneyReceiptChequeStatus = this.assyncWrapper.wrap(
    this.validator.chequeStatusUpdate,
    async (req: Request, res: Response) => {
      const data = await this.services.updateMoneyReceiptChequeStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewChequeInfoById = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewChequeInfoById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('read money receipt cheque by Id...');
      }
    }
  );

  // @ADD_INVOICE_MONEY_RECEIPT
  public addInvoiceMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.addInvoiceMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @DELETE_MONEY_RECEIPT
  public deleteMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @GET_DATA_FOR_EDIT
  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // view agent comission
  public viewAgentComission = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAgentCommission(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view agent comission...');
      }
    }
  );

  // view agent comission
  public viewMoneyReceiptsInvoices = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewMoneyReceiptsInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view money receipts invoices...');
      }
    }
  );

  // view agent comission
  public viewAgentInvoiceById = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAgentInvoiceById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view invoices by client id...');
      }
    }
  );

  // @GET_ALL_MONEY_RECEIPT
  public getAllMoneyReceiipt = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllAgentMoneyReceipt = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAgentMoneyReceipt(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getInvoiceAndTicketNoByClient = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceAndTicketNoByClient(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getInvoiceByClientCombinedForEdit = this.assyncWrapper.wrap(
    this.validator.readMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceByClientCombinedForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ======================== @ ADVANCE @ ==========================
  public addAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.postAdvanceReturn,
    async (req: Request, res: Response) => {
      const data = await this.services.addAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public editAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.editAdvanceReturn,
    async (req: Request, res: Response) => {
      const data = await this.services.editAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.advrDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.adveRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAdvrForEdit = this.assyncWrapper.wrap(
    this.validator.adveRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAdvrForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get all agent invoices by id
  public getAllAgentInvoiceById = this.assyncWrapper.wrap(
    this.validator.adveRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAgentInvoiceById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get all agent invoice by id...');
      }
    }
  );

  public viewAllAgentInvoice = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllAgentInvoice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view all agent invoices...');
      }
    }
  );
}

export default MoneyReceiptControllers;
