import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllerPassportStatus from './passportStatus.controllers';

class RoutersPassportStatus extends AbstractRouter {
  private ControllerPassportStatus = new ControllerPassportStatus();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers.post(
      '/create',
      this.ControllerPassportStatus.createControllerPassportStatus
    );
    this.routers.get('/passport', this.ControllerPassportStatus.viewPassports);
    this.routers.get(
      '/passport/all',
      this.ControllerPassportStatus.getAllPassports
    );
    this.routers.get(
      '/view-all',
      this.ControllerPassportStatus.readControllerPassportStatus
    );
    this.routers.patch(
      '/update/:status_id',
      this.ControllerPassportStatus.updateControllerPassportStatus
    );
    this.routers.delete(
      '/delete/:status_id',
      this.ControllerPassportStatus.deleteControllerPassportStatus
    );
  }
}

export default RoutersPassportStatus;
