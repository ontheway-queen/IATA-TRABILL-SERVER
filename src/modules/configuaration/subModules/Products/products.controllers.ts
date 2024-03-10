import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesProducts from './products.services';
import ProductsValidator from './products.validators';

class ControllersProducts extends AbstractController {
  private servicesProducts = new ServicesProducts();
  private validator = new ProductsValidator();

  constructor() {
    super();
  }

  public createProduct = this.assyncWrapper.wrap(
    this.validator.createProducts,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.createProduct(req);

      if (data.success) {
        res
          .status(201)
          .json({ success: true, message: data.message, data: data.data });
      } else {
        this.error('add product controller');
      }
    }
  );

  public createProductCategory = this.assyncWrapper.wrap(
    this.validator.createProductCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.createProductCategory(req);

      if (data.success) {
        res.status(201).json({ success: true, message: data.message });
      } else {
        this.error('add product controller');
      }
    }
  );

  public viewProducts = this.assyncWrapper.wrap(
    this.validator.editProductCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.viewProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
  public getAllProducts = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.getAllProducts(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.products });
      } else this.error();
    }
  );

  public viewProductsById = this.assyncWrapper.wrap(
    this.validator.readProduct,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.viewProductsById(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.products });
      } else this.error();
    }
  );

  public getOneProductCategory = this.assyncWrapper.wrap(
    this.validator.readProduct,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.getOneProductCategory(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.products });
      } else this.error();
    }
  );

  public getAllProductCategory = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.getAllProductCategory(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.products });
      } else this.error();
    }
  );

  public editProducts = this.assyncWrapper.wrap(
    this.validator.editProducts,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.editProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editProductCategory = this.assyncWrapper.wrap(
    this.validator.editProductCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.editProductCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteProductCategory = this.assyncWrapper.wrap(
    this.validator.deleteProduct,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.deleteProductCategory(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteProduct = this.assyncWrapper.wrap(
    this.validator.deleteProduct,
    async (req: Request, res: Response) => {
      const data = await this.servicesProducts.deleteProducts(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersProducts;
