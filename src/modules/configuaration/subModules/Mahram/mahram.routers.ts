import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersMahram from './mahram.controllers';

class RouterMahram extends AbstractRouter {
  private controllersMahram = new ControllersMahram();

  constructor() {
    super();
    this.callrouter();
  }

  private callrouter() {
    this.routers.get('/', this.controllersMahram.viewMahrams);
    this.routers.post('/create', this.controllersMahram.createControllerMahram);
    this.routers.get('/view-all', this.controllersMahram.getAllMahrams);
    this.routers.patch(
      '/update/:maharam_id',
      this.controllersMahram.updateControllerMahram
    );
    this.routers.delete(
      '/delete/:maharam_id',
      this.controllersMahram.deleteControllerMahram
    );
  }
}

export default RouterMahram;
