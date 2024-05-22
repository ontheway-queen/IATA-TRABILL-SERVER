"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withinRange = exports.bspBillingFormatter = void 0;
const lib_1 = require("../../../common/utils/libraries/lib");
const bspBillingFormatter = (text) => {
    const summaryStartIndex = text.indexOf('REMITTANCE TOTAL');
    const summaryEndIndex = text.indexOf('BANK:');
    const summaryText = text.slice(summaryStartIndex, summaryEndIndex);
    console.log({ summaryText });
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
    console.log({ summaryMatch });
    const salesDateRange = (0, lib_1.getBspPdfDate)(salesPeriod);
    const billingDateRange = (0, lib_1.getBspPdfDate)(billingPeriod);
    const SUMMARY = {};
    if (summaryMatch) {
        SUMMARY.BILLED = parseInt(summaryMatch[1].replace(',', ''));
        SUMMARY.BROUGHTFORWARD = parseInt(summaryMatch[2].replace(',', ''));
        SUMMARY.DEFERRED = parseInt(summaryMatch[3]);
        SUMMARY.AMOUNT = parseInt(summaryMatch[4].replace(/,/g, ''));
        SUMMARY.SALES = salesPeriod;
        SUMMARY.BILLING = billingPeriod;
    }
    console.log({ SUMMARY });
    return { SUMMARY, salesDateRange, billingDateRange };
};
exports.bspBillingFormatter = bspBillingFormatter;
function withinRange(num1, num2, range) {
    return Math.abs((0, lib_1.numRound)(num1) - (0, lib_1.numRound)(num2)) <= (0, lib_1.numRound)(range);
}
exports.withinRange = withinRange;
//# sourceMappingURL=dashbaor.utils.js.map