import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersGroups from './groups.controllers';

class RoutersGroup extends AbstractRouter {
  private controllersGroup = new ControllersGroups();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersGroup.viewGroups);
    this.routers.post('/create', this.controllersGroup.createControllerGroups);
    this.routers.get('/view-all', this.controllersGroup.getAllGroups);
    this.routers.patch(
      '/update/:group_id',
      this.controllersGroup.updateControllerGroups
    );
    this.routers.delete(
      '/delete/:group_id',
      this.controllersGroup.deleteControllerGroups
    );
  }
}

export default RoutersGroup;
