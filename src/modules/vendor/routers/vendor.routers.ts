import AbstractRouter from '../../../abstracts/abstract.routers';
import VendorController from '../controllers/vendor.Controllers';

class VendorRouter extends AbstractRouter {
  private controller = new VendorController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // ================== advance returns ==================

    this.routers
      .route('/advance-return')
      .post(this.controller.addAdvanceReturn)
      .get(this.controller.getAdvanceReturn);

    this.routers.get(
      '/advance-return-details/:id',
      this.controller.getAdvanceReturnDetails
    );
    this.routers.get(
      '/vendors-lastbalance/:vendor',
      this.controller.vendorLastBalance
    );

    this.routers
      .route('/advance-return/:id')
      .delete(this.controller.deleteAdvanceReturn);

    this.routers.get('/excel-report', this.controller.getVendorExcelReport);
    this.routers.get(
      '/cheques-vendorpay',
      this.controller.allVendorPaymentChecque
    );

    this.routers.patch(
      '/advance-return-edit/:id',
      this.controller.editAdvanceReturn
    );

    // =============== vendors ======================

    this.routers.get(
      '/vendor-invoice-due/:invoice_id',
      this.controller.getVendorInvoiceDue
    );

    this.routers.get(
      '/all-vendors-combined',
      this.controller.getAllVendorsAndCombined
    );

    this.routers.get(
      '/all-vendors-combined/:product_id',
      this.controller.getAllVendorsAndCombinedByProductId
    );

    this.routers.get('/for-edit/:id', this.controller.getForEdit);
    this.routers.get('/vendor/:id', this.controller.getVendorById);

    this.routers.get('/', this.controller.getAllVendors);

    this.routers.patch(
      '/update-status/:id',
      this.controller.updateVendorStatusById
    );

    this.routers.delete('/vendor/delete/:id', this.controller.deleteVendor);

    this.routers.post('/add', this.controller.addVendor);

    this.routers.put('/edit/:id', this.controller.editVendor);

    // ====================== vendor payments ==========================
    this.routers.post(
      '/post-vendor-payments',
      this.controller.addVendorPayment
    );

    this.routers.get('/vendor-payments', this.controller.getVendorPayments);

    this.routers.get(
      '/vendor-pay-cheque',
      this.controller.getVendorPaymentCheque
    );

    this.routers.get(
      '/vendor-pay-advr-cheque',
      this.controller.getVendorAdvrCheque
    );

    this.routers.delete(
      '/vendor-payment-delete/:id',
      this.controller.deleteVendorPayment
    );

    this.routers.patch(
      '/update-vendor-payment/:id',
      this.controller.editVendorPayment
    );

    this.routers.get('/country-code', this.controller.getCountryCode);

    this.routers.get(
      '/get-pre-pay-amount/:id',
      this.controller.getPrevPayBalance
    );

    this.routers.get('/get-payment-method', this.controller.getPaymentMethod);

    this.routers.get(
      '/get-vpay-for-edit/:id',
      this.controller.getVendorPayForEditById
    );

    this.routers.get(
      '/view-vendor-payment/:id',
      this.controller.viewVendorPayment
    );
    this.routers.get(
      '/view-vendor-payment-details/:id',
      this.controller.viewVendorPaymentDetails
    );

    this.routers.get(
      '/get-advancereturn-for-edit/:id',
      this.controller.getAdvanceReturnForEdit
    );
    this.routers.get(
      '/invoices-by-vendor/:comb_vendor',
      this.controller.getInvoiceByVendorId
    );
    this.routers.get('/all-vendors', this.controller.viewAllVendors);

    this.routers.get(
      '/all-vendor-invoices',
      this.controller.getNonPaidVendorInvoice
    );

    this.routers.get(
      '/vendors_by_invoice/:invoice_id',
      this.controller.getInvoiceVendors
    );

    this.routers.get(
      '/all-vendor-invoices-for-edit',
      this.controller.getNonPaidVendorInvoiceForEdit
    );
  }
}

export default VendorRouter;
