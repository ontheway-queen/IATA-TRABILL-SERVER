import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersEmployee from './employee.controllers';
import EmployeeValidator from './employee.validators';

class RoutersEmployee extends AbstractRouter {
  private controllersEmployee = new ControllersEmployee();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersEmployee.viewEmployees);

    this.routers.post(
      '/create',
      this.controllersEmployee.createControllerEmployee
    );

    this.routers.get('/view-all', this.controllersEmployee.getAllEmployees);

    this.routers.patch(
      '/update/:employee_id',
      this.controllersEmployee.updateControllerEmployee
    );

    this.routers.delete(
      '/delete/:employee_id',
      this.controllersEmployee.deleteControllerEmployee
    );

    this.routers.get(
      '/view-blood-group',
      this.controllersEmployee.readControllerBloodGroup
    );

    this.routers.get('/:id', this.controllersEmployee.getEmployeeById);
  }
}

export default RoutersEmployee;
