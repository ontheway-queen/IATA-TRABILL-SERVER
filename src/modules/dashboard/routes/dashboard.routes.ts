import multer from 'multer';
import AbstractRouter from '../../../abstracts/abstract.routers';
import DashboardControllers from '../controllers/dashboard.controllers';

const upload = multer({ dest: 'uploads/' });

class DashboardRoutes extends AbstractRouter {
  private controllers = new DashboardControllers();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/summary', this.controllers.dashboardSummary);
    this.routers.get('/month-report', this.controllers.getMonthReport);

    this.routers.get('/acc-details', this.controllers.getAccountBalanceData);
    this.routers.get('/search', this.controllers.searchInvoices);

    this.routers.get('/expenses', this.controllers.getExpenses);

    // DAILY, MONTHLY & YEARLY REPORT
    this.routers.get('/tr_info', this.controllers.getTransactionInfo);
    this.routers.get(
      '/daily-pay-pur',
      this.controllers.getDailyPaymentPurchase
    );
    this.routers.get(
      '/monthly-pay-pur',
      this.controllers.getMonthlyPaymentPurchase
    );
    this.routers.get(
      '/yearly-pay-pur',
      this.controllers.getYearlyPaymentPurchase
    );

    // BSP BILLING
    this.routers.get('/bsp-billing', this.controllers.getBSPBilling);
    this.routers.get('/bsp-summary', this.controllers.getBspBillingSummary);
    this.routers.get('/vendors', this.controllers.getVendorBankGuarantee);
    this.routers.get('/best-clients', this.controllers.getBestClients);
    this.routers.get('/best-employee', this.controllers.getBestEmployee);
    this.routers.get('/iata-limit', this.controllers.iataBankGuaranteeLimit);
    this.routers.post(
      '/bsp-bill-check',
      upload.single('file'),
      this.controllers.bspBillingCrossCheck
    );

    // UPLOAD BSP BILL
    this.routers
      .route('/bsp-bill')
      .post(
        this.uploader.cloudUploadRaw(this.fileFolder.BSP),
        this.controllers.uploadBSPDocs
      )
      .get(this.controllers.getBSPDocs);

    this.routers.delete('/bsp-bill/:tbd_id', this.controllers.deleteBSPDocs);
  }
}
export default DashboardRoutes;
