import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesProducts extends AbstractServices {
  constructor() {
    super();
  }

  public createProduct = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const insert = await this.models.configModel
        .productsModel(req, trx)
        .createProduct(req.body);

      const product = await this.models.configModel
        .productsModel(req, trx)
        .getProduct(insert);

      return {
        success: true,
        message: 'product category created successfully',
        data: product[0],
      };
    });
  };

  public createProductCategory = async (req: Request) => {
    await this.models.configModel
      .productsModel(req)
      .createProductCategory(req.body);

    return { success: true, message: 'product category created successfully' };
  };

  public viewProducts = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .productsModel(req)
      .viewProducts(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .productsModel(req)
      .countProductsDataRow();

    return { success: true, count, data };
  };
  public getAllProducts = async (req: Request) => {
    const data = await this.models.configModel
      .productsModel(req)
      .getAllProducts();

    return { success: true, products: data };
  };

  public viewProductsById = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .productsModel(req)
      .getProductById(id);

    return { success: true, products: data[0] };
  };

  public getAllProductCategory = async (req: Request) => {
    const data = await this.models.configModel
      .productsModel(req)
      .getAllProductCategories();

    return { success: true, products: data };
  };

  public getOneProductCategory = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .productsModel(req)
      .getOneProductCategory(id);

    return { success: true, products: data[0] };
  };

  public editProducts = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .productsModel(req)
      .editProduct(req.body, id);

    if (data) {
      return {
        success: true,
        message: 'product updated successfully',
        data: data,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };

  public editProductCategory = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .productsModel(req)
      .editProductCategory(req.body, id);

    if (data) {
      return {
        success: true,
        message: 'product category updated successfully',
        data: data,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };

  public deleteProductCategory = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const { category_id } = req.params;
      const { deleted_by } = req.body as { deleted_by: number };

      const data = await this.models.configModel
        .productsModel(req, trx)
        .deleteProductCategory(category_id);

      await this.models.configModel
        .productsModel(req, trx)
        .deleteProductByCategoryId(category_id);

      return { success: true, data: data };
    });
  };

  public deleteProducts = async (req: Request) => {
    const { product_id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .productsModel(req)
      .deleteProductById(product_id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesProducts;
