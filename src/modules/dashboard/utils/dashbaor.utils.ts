import {
  dateStrConverter,
  getBspPdfDate,
  numRound,
} from '../../../common/utils/libraries/lib';

export const bspBillingFormatter = (text: string) => {
  const summaryStartIndex = text.indexOf('REMITTANCE TOTAL');
  const summaryEndIndex = text.indexOf('BANK:');
  const summaryText = text.slice(summaryStartIndex, summaryEndIndex);

  console.log({ summaryText });

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

  console.log({ summaryMatch });

  const salesDateRange = getBspPdfDate(salesPeriod as Date);
  const billingDateRange = getBspPdfDate(billingPeriod as Date);

  const SUMMARY: any = {};

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

export function withinRange(num1: number, num2: number, range: number) {
  return Math.abs(numRound(num1) - numRound(num2)) <= numRound(range);
}
