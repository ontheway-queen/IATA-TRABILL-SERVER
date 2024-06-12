import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import DashboardServices from '../services/dashboard.services';
import DashboardValidators from '../validators/dashboard.validators';

class DashboardControllers extends AbstractController {
  private services = new DashboardServices();
  private validator = new DashboardValidators();

  constructor() {
    super();
  }
  /**
   * @Desc Dashboard summary data
   * @Method GET
   * @Api /api/v1/dashboard/summary
   */
  public dashboardSummary = this.assyncWrapper.wrap(
    this.validator.readAllProducts,
    async (req: Request, res: Response) => {
      const data = await this.services.dashboardSummary(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get all products...');
      }
    }
  );

  /**
   * @Desc Search all invoices by clients or invoice-info
   * @Method GET
   * @Api /api/v1/dashboard/search?search=
   */
  public searchInvoices = this.assyncWrapper.wrap(
    this.validator.dashboardValidator,
    async (req: Request, res: Response) => {
      const data = await this.services.searchInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Search invoices');
      }
    }
  );

  public getAccountBalanceData = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAccountBalanceData(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('getAccountBalanceData');
      }
    }
  );

  getExpenses = this.assyncWrapper.wrap(
    this.validator.dashboardValidator,
    async (req: Request, res: Response) => {
      const data = await this.services.getExpenses(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  getMonthReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getMonthReport(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  // DAILY , MONTHLY & YEARLY TRANSACTIONS
  getTransactionInfo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getTransactionInfo(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  getDailyPaymentPurchase = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getDailyPaymentPurchase(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  getMonthlyPaymentPurchase = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getMonthlyPaymentPurchase(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  getYearlyPaymentPurchase = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getYearlyPaymentPurchase(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  // BSP BILLING
  getBSPBilling = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getBSPBilling(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  getBspBillingSummary = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getBspBillingSummary(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  getVendorBankGuarantee = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorBankGuarantee(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  getBestClients = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getBestClients(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  getBestEmployee = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getBestEmployee(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  iataBankGuaranteeLimit = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.iataBankGuaranteeLimit(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  bspBillingCrossCheck = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.bspBillingCrossCheck(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  uploadBSPDocs = this.assyncWrapper.wrap(
    this.validator.uploadBSP,
    async (req: Request, res: Response) => {
      const data = await this.services.uploadBSPDocs(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  deleteBSPDocs = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.deleteBSPDocs(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  selectBspFiles = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.selectBspFiles(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  bspFileList = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.bspFileList(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}
export default DashboardControllers;
