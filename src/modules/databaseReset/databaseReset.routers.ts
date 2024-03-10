import AbstractRouter from '../../abstracts/abstract.routers';
import DatabaseResetControllers from './databaseReset.controllers';

class DatabaseResetRouters extends AbstractRouter {
  public controllers = new DatabaseResetControllers();
  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.patch('/reset/:agency_id', this.controllers.databaseReset);
  }
}

export default DatabaseResetRouters;
