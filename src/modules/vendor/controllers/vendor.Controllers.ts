import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import VendorServices from '../services/Vendor.Services';
import VendorValidator from '../validators/vendor.validator';

class VendorController extends AbstractController {
  private services = new VendorServices();
  private validator = new VendorValidator();

  constructor() {
    super();
  }

  // ===================== vendors ================================

  public getVendorById = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorById(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getVendorInvoiceDue = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorInvoiceDue(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllVendorsAndCombinedByProductId = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllVendorsAndCombinedByProductId(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllVendorsAndcombined = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllVendorsAndcombined(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public allVendorPaymentChecque = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.allVendorPaymentChecque(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getVendorExcelReport = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorExcelReport(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllVendors = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllVendors(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getForEdit = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateVendorStatusById = this.assyncWrapper.wrap(
    this.validator.commonUpdate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateVendorStatusById(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteVendor = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteVendor(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public addVendor = this.assyncWrapper.wrap(
    this.validator.addVendor,
    async (req: Request, res: Response) => {
      const data = await this.services.addVendor(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editVendor = this.assyncWrapper.wrap(
    this.validator.editVendor,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.editVendor(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ===================== advance return ================================
  public addAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.addAdvanceReturn,
    async (req: Request, res: Response) => {
      const data = await this.services.addAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.editAdvanceReturn,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.editAdvanceReturn(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteAdvanceReturn = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAdvanceReturn(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public vendorLastBalance = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.vendorLastBalance(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // ===================== vendor payments ================================

  public addVendorPayment = this.assyncWrapper.wrap(
    this.validator.addVendorPayment,
    async (req: Request, res: Response) => {
      const data = await this.services.addVendorPayment(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editVendorPayment = this.assyncWrapper.wrap(
    this.validator.editVendorPayment,
    async (req: Request, res: Response) => {
      const data = await this.services.editVendorPayment(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public viewVendorPayment = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.viewVendorPayment(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public viewVendorPaymentDetails = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.viewVendorPaymentDetails(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getVendorPayments = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorPayments(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getCountryCode = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getCountryCode(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getPrevPayBalance = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getPrevPayBalance(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteVendorPayment = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteVendorPayment(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getPaymentMethod = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getPaymentMethod(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getVendorPayForEditById = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorPayForEditById(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getNonPaidVendorInvoice = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getNonPaidVendorInvoice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
  public getNonPaidVendorInvoiceForEdit = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getNonPaidVendorInvoiceForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAdvanceReturnForEdit = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAdvanceReturnForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAdvanceReturnDetails = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAdvanceReturnDetails(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getVendorPaymentCheque = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorPaymentCheque(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getVendorAdvrCheque = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorAdvrCheque(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getInvoiceByVendorId = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceByVendorId(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewAllVendors = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllVendors(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getInvoiceVendors = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceVendors(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
}

export default VendorController;
