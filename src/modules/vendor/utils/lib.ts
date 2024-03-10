import VendorModel from '../models/VendorModel';
import { IVendorProduct } from '../types/vendor.interfaces';

class VendorLib {
  public static async insertProducts(
    conn: VendorModel,
    vendor_products_ids: number[],
    vendor_commission_rate: number,
    vendor_id: number
  ) {
    const vendorProducts: IVendorProduct[] = [];

    for (let i = 0; i < vendor_products_ids.length; i++) {
      const product: IVendorProduct = {
        vproduct_vendor_id: vendor_id,
        vproduct_product_id: vendor_products_ids[i],
      };

      if (vendor_products_ids[i] === 106) {
        product.vproduct_commission_rate = vendor_commission_rate;
      }

      vendorProducts.push(product);
    }

    await conn.insertVendorProducts(vendorProducts);
  }
}

export default VendorLib;
