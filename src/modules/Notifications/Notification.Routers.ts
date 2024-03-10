import AbstractRouter from '../../abstracts/abstract.routers';
import NotificationControllers from './Controllers/Notification.Controllers';

class NotificationRouters extends AbstractRouter {
  private controllers = new NotificationControllers();
  constructor() {
    super();
    this.callRouter();
  }

  // ====================== invoice hajj pre reg reuters =======================
  private callRouter() {
    this.routers.patch(
      '/collection-cheque-status',
      this.controllers.chequeCollectionStatusUpdate
    );

    this.routers.post('/upload-pdf', this.controllers.uploadPDF);

    this.routers.get('/exp-passport', this.controllers.getExpirePassport);
    this.routers.get('/collect-cheque', this.controllers.getCollectionCheque);
    this.routers.get(
      '/payment-cheque',
      this.controllers.getPendingPaymentCheque
    );
    this.routers.get('/due-invoice', this.controllers.getDueInvoiceData);
    this.routers.get('/visa-delivary', this.controllers.getVisaDeliveryData);
    this.routers.get(
      '/passport-resent',
      this.controllers.getNextExpirePassport
    );
  }
}

export default NotificationRouters;
