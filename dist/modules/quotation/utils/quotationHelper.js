"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuotationHelper {
    /**
     * accpets array of billing information object from the request body
     * @returns parsed array of object ready to insert into database
     *
     * @param bill_info IBillInfo[]
     *
     */
    static parseBillInfo(reqBillInfo, sub_total, qutation_id) {
        const billInfo = [];
        for (let i = 0; i < reqBillInfo.length; i++) {
            const element = reqBillInfo[i];
            const toPush = {
                billing_product_id: element.product_id,
                billing_quotation_id: qutation_id,
                billing_description: element.description,
                billing_quantity: element.quantity,
                billing_unit_price: element.unit_price,
                billing_subtotal: sub_total,
                billing_product_total_price: element.total_price,
                billing_country_id: element.billing_country_id,
            };
            billInfo.push(toPush);
        }
        return billInfo;
    }
}
exports.default = QuotationHelper;
//# sourceMappingURL=quotationHelper.js.map