import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersDepartments from './departments.controllers';

class RoutersDepartments extends AbstractRouter {
  private controllersDepartments = new ControllersDepartments();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersDepartments.viewDepartment);

    this.routers.post('/create', this.controllersDepartments.createDepartment);

    this.routers.get('/get-all', this.controllersDepartments.getAllDepartments);

    this.routers.patch('/edit/:id', this.controllersDepartments.editDepartment);

    this.routers.delete(
      '/delete/:id',
      this.controllersDepartments.deleteDepartment
    );
  }
}

export default RoutersDepartments;
