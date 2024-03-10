import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersDesignations from './designations.controllers';

class RoutersDesignations extends AbstractRouter {
  private controllersDesignations = new ControllersDesignations();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersDesignations.viewDesignations);

    this.routers.post(
      '/create',
      this.controllersDesignations.createDesignation
    );

    this.routers.get(
      '/get-all',
      this.controllersDesignations.getAllDesignations
    );

    this.routers.delete(
      '/delete/:id',
      this.controllersDesignations.deleteDesignation
    );

    this.routers.patch(
      '/edit/:id',
      this.controllersDesignations.editDesignation
    );
  }
}

export default RoutersDesignations;
