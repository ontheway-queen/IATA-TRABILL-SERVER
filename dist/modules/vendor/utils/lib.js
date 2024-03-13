"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class VendorLib {
    static insertProducts(conn, vendor_products_ids, vendor_commission_rate, vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorProducts = [];
            for (let i = 0; i < vendor_products_ids.length; i++) {
                const product = {
                    vproduct_vendor_id: vendor_id,
                    vproduct_product_id: vendor_products_ids[i],
                };
                if (vendor_products_ids[i] === 106) {
                    product.vproduct_commission_rate = vendor_commission_rate;
                }
                vendorProducts.push(product);
            }
            yield conn.insertVendorProducts(vendorProducts);
        });
    }
}
exports.default = VendorLib;
//# sourceMappingURL=lib.js.map