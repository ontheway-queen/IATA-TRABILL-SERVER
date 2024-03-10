import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import {
  ProductCategoryReqBody,
  ProductsReqBody,
} from '../../types/configuration.interfaces';

class ProductsModel extends AbstractModels {
  public async createProduct(data: ProductsReqBody) {
    const product = await this.query()
      .insert({ ...data, product_org_agency: this.org_agency })
      .into('trabill_products');

    return product[0];
  }

  public async createProductCategory(data: ProductCategoryReqBody) {
    const product = await this.query()
      .insert({ ...data, category_org_agency: this.org_agency })
      .into('trabill_product_categories');

    return product[0];
  }

  public async getProduct(product_id: idType) {
    return await this.query()
      .select(
        'product_id',
        'product_name',
        'product_status',
        'trabill_product_categories.category_title'
      )
      .from('trabill_products')
      .where({ product_id })
      .andWhereNot('products_is_deleted', 1)
      .leftJoin('trabill_product_categories', {
        category_id: 'product_category_id',
      });
  }

  public async viewProducts(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .select(
        'product_id',
        'product_name',
        'product_status',
        'product_category_id',
        'trabill_product_categories.category_title',
        'product_org_agency as agency_id',
        'products_is_deleted'
      )
      .from('trabill_products')
      .leftJoin('trabill_product_categories', {
        'trabill_product_categories.category_id':
          'trabill_products.product_category_id',
      })
      .where('product_org_agency', this.org_agency)
      .whereNot('products_is_deleted', 1)
      .orWhere('product_org_agency', null)
      .orderBy('product_id', 'desc')
      .limit(size)
      .offset(page_number);
  }

  public async countProductsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_products')
      .whereNot('products_is_deleted', 1)
      .andWhere('product_org_agency', null)
      .orWhere('product_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllProducts() {
    const by_clients = await this.query()
      .select(
        'product_id',
        'product_name',
        'product_status',
        'product_category_id',
        'trabill_product_categories.category_title',
        'product_org_agency as agency_id'
      )
      .from('trabill_products')
      .leftJoin('trabill_product_categories', {
        'trabill_product_categories.category_id':
          'trabill_products.product_category_id',
      })
      .where('product_org_agency', this.org_agency)
      .whereNot('products_is_deleted', 1)
      .orderBy('product_name');

    const by_default = await this.query()
      .select(
        'product_id',
        'product_name',
        'product_status',
        'product_category_id',
        'trabill_product_categories.category_title',
        'product_org_agency as agency_id'
      )
      .from('trabill_products')
      .leftJoin('trabill_product_categories', {
        'trabill_product_categories.category_id':
          'trabill_products.product_category_id',
      })
      .where('product_org_agency', null)
      .whereNot('products_is_deleted', 1)
      .orderBy('product_name');

    return [...by_default, ...by_clients];
  }

  public async getProductById(id: idType) {
    return await this.query()
      .select('*')
      .from('trabill_products')
      .where('trabill_products.product_id', id)
      .andWhereNot('products_is_deleted', 1);
  }

  public async getAllProductCategories() {
    const by_clients = await this.query()
      .select(
        'category_id',
        'category_title',
        'category_org_agency as agency_id'
      )
      .from('trabill_product_categories')
      .where('category_org_agency', this.org_agency)
      .andWhereNot('category_is_deleted', 1);

    const by_default = await this.query()
      .select(
        'category_id',
        'category_title',
        'category_org_agency as agency_id'
      )
      .from('trabill_product_categories')
      .where('category_org_agency', null)
      .andWhereNot('category_is_deleted', 1);

    return [...by_clients, ...by_default];
  }

  public async getOneProductCategory(id: idType) {
    return await this.query()
      .select(
        'category_id',
        'category_title',
        'category_org_agency as agency_id'
      )
      .from('trabill_product_categories')
      .where('trabill_product_categories.category_id', id);
  }

  public async editProduct(data: ProductsReqBody, id: idType) {
    return await this.query()
      .from('trabill_products')
      .update(data)
      .where('trabill_products.product_id', id);
  }

  public async editProductCategory(data: ProductCategoryReqBody, id: idType) {
    return await this.query()
      .update('trabill_product_categories')
      .update(data)
      .where('trabill_product_categories.category_id', id);
  }

  public async deleteProductCategory(category_id: idType) {
    return await this.query()
      .into('trabill_product_categories')
      .update('category_is_deleted', 1)
      .where('category_id', category_id);
  }

  public async deleteProductByCategoryId(category_id: idType) {
    return await this.query()
      .from('trabill_products')
      .update('products_is_deleted', 1)
      .where('product_category_id', category_id)
      .whereNot('products_is_deleted', 1)
      .andWhereNot('product_org_agency', null);
  }

  public async deleteProductById(
    product_id: idType,
    product_deleted_by: idType
  ) {
    const data = await this.query()
      .from('trabill_products')
      .update({ products_is_deleted: 1, product_deleted_by })
      .where('product_id', product_id)
      .andWhereNot('product_org_agency', null);

    if (data) {
      return data;
    } else {
      throw new CustomError(
        `You can't delete this product`,
        400,
        'Bad request'
      );
    }
  }
}

export default ProductsModel;
