import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersCompanies from './companies.controllers';
import CompaniesValidator from './companies.validators';

class RoutersCompanies extends AbstractRouter {
  private controllersCompanies = new ControllersCompanies();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersCompanies.viewCompanies);
    this.routers.post(
      '/create',
      this.controllersCompanies.createControllerCompanies
    );
    this.routers.get('/view-all', this.controllersCompanies.getAllCompanies);
    this.routers.patch(
      '/update/:company_id',
      this.controllersCompanies.updateControllerCompanies
    );
    this.routers.delete(
      '/delete/:company_id',
      this.controllersCompanies.deleteControllerCompanies
    );
  }
}

export default RoutersCompanies;
