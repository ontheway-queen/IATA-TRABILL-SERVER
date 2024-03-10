import AbstractRouter from '../../../../abstracts/abstract.routers';
import ControllersProducts from './products.controllers';

class RoutersProducts extends AbstractRouter {
  private controllersProducts = new ControllersProducts();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.get('/', this.controllersProducts.viewProducts);

    this.routers.post('/create', this.controllersProducts.createProduct);

    this.routers.post(
      '/create-category',
      this.controllersProducts.createProductCategory
    );

    this.routers.get('/get-all', this.controllersProducts.getAllProducts);

    this.routers.get('/get/:id', this.controllersProducts.viewProductsById);

    this.routers.get(
      '/category/get-all',
      this.controllersProducts.getAllProductCategory
    );

    this.routers.get(
      '/category/get/:id',
      this.controllersProducts.getOneProductCategory
    );

    this.routers.patch(
      '/edit-product/:id',
      this.controllersProducts.editProducts
    );

    this.routers.patch(
      '/edit-product-category/:id',
      this.controllersProducts.editProductCategory
    );

    this.routers.delete(
      '/delete-product-category/:category_id',
      this.controllersProducts.deleteProductCategory
    );

    this.routers.delete(
      '/delete-product/:product_id',
      this.controllersProducts.deleteProduct
    );
  }
}

export default RoutersProducts;
