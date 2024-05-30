"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withinRange = exports.bspBillingFormatter = void 0;
const lib_1 = require("../../../common/utils/libraries/lib");
const bspBillingFormatter = (text) => {
    const summaryStartIndex = text.indexOf('REMITTANCE TOTAL');
    const summaryEndIndex = text.indexOf('BANK:');
    const summaryText = text.slice(summaryStartIndex, summaryEndIndex);
    const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;
    const salesPeriodMatch = text.match(salesPeriodRegex);
    const salesPeriod = salesPeriodMatch
        ? (0, lib_1.dateStrConverter)(salesPeriodMatch[3])
        : null;
    // BILLING PERIOD
    const dateRegex = /\d{2}-[A-Z]{3}-\d{4}/;
    const match = summaryText.match(dateRegex);
    const billingPeriod = match ? (0, lib_1.dateStrConverter)(match[0]) : null;
    const summaryRegex = /REMITTANCE TOTAL \(BDT\)\s*(\d+,\d+) (\d+,\d+) (\d+) ([\d,]+)/;
    const summaryMatch = summaryText.match(summaryRegex);
    const salesDateRange = (0, lib_1.getBspPdfDate)(salesPeriod);
    const billingDateRange = (0, lib_1.getBspPdfDate)(billingPeriod);
    const bsp_summary = {};
    if (summaryMatch) {
        bsp_summary.BILLED = parseInt(summaryMatch[1].replace(',', ''));
        bsp_summary.BROUGHTFORWARD = parseInt(summaryMatch[2].replace(',', ''));
        bsp_summary.DEFERRED = parseInt(summaryMatch[3]);
        bsp_summary.AMOUNT = parseInt(summaryMatch[4].replace(/,/g, ''));
        bsp_summary.SALES = salesPeriod;
        bsp_summary.BILLING = billingPeriod;
    }
    return { bsp_summary, salesDateRange, billingDateRange };
};
exports.bspBillingFormatter = bspBillingFormatter;
function withinRange(num1, num2, range) {
    return Math.abs((0, lib_1.numRound)(num1) - (0, lib_1.numRound)(num2)) <= (0, lib_1.numRound)(range);
}
exports.withinRange = withinRange;
//# sourceMappingURL=dashbaor.utils.js.map