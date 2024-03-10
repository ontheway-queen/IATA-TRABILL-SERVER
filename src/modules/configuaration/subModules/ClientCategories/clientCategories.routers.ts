import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersClientCategories from './clientCategories.controllers';

class RoutersClientCategories extends AbstractRouter {
  private controllersClientCategories = new ControllersClientCategories();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersClientCategories.getClientCategories);

    this.routers.post(
      '/create',
      this.controllersClientCategories.createClientCategory
    );

    this.routers.get(
      '/get-all',
      this.controllersClientCategories.getAllClientCategories
    );

    this.routers.delete(
      '/delete/:category_id',
      this.controllersClientCategories.deleteClientCategoryById
    );

    this.routers.patch(
      '/update/:category_id',
      this.controllersClientCategories.editClientCategoryById
    );
  }
}

export default RoutersClientCategories;
