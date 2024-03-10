import AbstractRouter from '../../../abstracts/abstract.routers';
import InvoiceHajjControllers from '../Controllers/MoneyReceipt.Controllers';

class MoneyReceiptRouters extends AbstractRouter {
  private controllers = new InvoiceHajjControllers();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // money receipt
    this.routers.post('/post', this.controllers.postMoneyReceipt);

    this.routers.post(
      '/addInvoiceMoneyReceipt/:id',
      this.controllers.addInvoiceMoneyReceipt
    );

    this.routers.patch('/edit/:id', this.controllers.editMoneyReceipt);

    // view agent invoice by client id
    this.routers.get(
      '/agent-invoice/:id',
      this.controllers.viewAgentInvoiceById
    );

    // this route for payment route
    this.routers.post(
      '/agent-money-receipt',
      this.controllers.agentCommissionReceiptAdd
    );

    this.routers
      .route('/agent-money-receipt/:receipt_id')
      .delete(this.controllers.deleteAgentMoneyRecipt);

    this.routers.post(
      '/update-cheque-status',
      this.controllers.updateMoneyReceiptChequeStatus
    );

    this.routers.get(
      '/receipt-cheque/:cheque_id',
      this.controllers.viewChequeInfoById
    );

    this.routers.get('/due-invoice/:id', this.controllers.getInvoiceDue);

    this.routers.delete('/delete/:id', this.controllers.deleteMoneyReceipt);

    this.routers.get('/for-edit/:id', this.controllers.getDataForEdit);

    this.routers.get('/all', this.controllers.getAllMoneyReceiipt);

    this.routers.get(
      '/agent-commission',
      this.controllers.getAllAgentMoneyReceipt
    );

    this.routers.get('/view/:id', this.controllers.viewMoneyReceipt);
    this.routers.get(
      '/view-details/:receipt_id',
      this.controllers.viewMoneyReceiptDetails
    );

    this.routers.get(
      '/:payment_to/byclient/:clientId',
      this.controllers.getInvoiceAndTicketNoByClient
    );
    this.routers.get(
      '/:payment_to/byclient/for-edit/:clientId',
      this.controllers.getInvoiceByClientCombinedForEdit
    );

    // ==================== @ ADVANCE RETURN @ ========================
    this.routers.post('/advance/post', this.controllers.addAdvanceReturn);
    this.routers.patch('/advance/edit/:id', this.controllers.editAdvanceReturn);
    this.routers.delete(
      '/advance/delete/:id',
      this.controllers.deleteAdvanceReturn
    );
    this.routers.get('/advance/all', this.controllers.getAllAdvanceReturn);
    this.routers.get('/advance/for-edit/:id', this.controllers.getAdvrForEdit);

    this.routers.get(
      '/agents-commission-by-recept-id/:receipt_id',
      this.controllers.viewAgentComission
    );
    this.routers.get(
      '/view/invoice/:receipt_id',
      this.controllers.viewMoneyReceiptsInvoices
    );

    // get all agent invoces by id
    this.routers.get(
      '/agent-invoices/:invoice_id',
      this.controllers.getAllAgentInvoiceById
    );
    this.routers.get('/agent-invoices', this.controllers.viewAllAgentInvoice);
  }
}

export default MoneyReceiptRouters;
