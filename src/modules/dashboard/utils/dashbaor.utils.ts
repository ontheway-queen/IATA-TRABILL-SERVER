import {
  dateStrConverter,
  getBspPdfDate,
  numRound,
} from '../../../common/utils/libraries/lib';

export const bspBillingFormatter = (text: string) => {
  const summaryStartIndex = text.indexOf('REMITTANCE TOTAL');
  const summaryEndIndex = text.indexOf('BANK:');
  const summaryText = text.slice(summaryStartIndex, summaryEndIndex);

  const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;
  const salesPeriodMatch = text.match(salesPeriodRegex);
  const salesPeriod = salesPeriodMatch
    ? dateStrConverter(salesPeriodMatch[3])
    : null;

  // BILLING PERIOD
  const dateRegex = /\d{2}-[A-Z]{3}-\d{4}/;

  const match = summaryText.match(dateRegex);

  const billingPeriod = match ? dateStrConverter(match[0]) : null;

  const summaryRegex =
    /REMITTANCE TOTAL \(BDT\)\s*(\d+,\d+) (\d+,\d+) (\d+) ([\d,]+)/;

  const summaryMatch = summaryText.match(summaryRegex);

  const salesDateRange = getBspPdfDate(salesPeriod as Date);
  const billingDateRange = getBspPdfDate(billingPeriod as Date);

  const bsp_summary: any = {};

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

export function withinRange(num1: number, num2: number, range: number) {
  return Math.abs(numRound(num1) - numRound(num2)) <= numRound(range);
}
