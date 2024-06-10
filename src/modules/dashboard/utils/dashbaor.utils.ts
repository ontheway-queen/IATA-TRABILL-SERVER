import {
  dateStrConverter,
  getBspPdfDate,
  numRound,
} from '../../../common/utils/libraries/lib';

// START UTILS
export const toNum = (strNum: string) => Number(strNum.replace(/,/g, ''));

export function withinRange(num1: number, num2: number, range: number) {
  return Math.abs(numRound(num1) - numRound(num2)) <= numRound(range);
}

export const splitText = (text: string, startText: string, endText: string) => {
  const startIndex = text.indexOf(startText);
  const endIndex = text.indexOf(endText);

  return text.substring(startIndex, endIndex);
};

function formatDate(inputDate: string) {
  // inputDate = 010MAR24 | 0OD14MAR24 | 010MAR24
  const datePart = inputDate.match(/[0-9]{2}[A-Z]{3}[0-9]{2}/);
  if (datePart) {
    return new Date(datePart[0]); // 2024-03-13T18:00:00.000Z
  } else {
    return null;
  }
}

// UTILS END

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

export const formatAgentBillingCommission = (arrayOfTickets: any[]) => {
  let commission: any[] = [];
  arrayOfTickets.forEach((item) => {
    if (
      item.includes('0.00') ||
      (item.includes('7.00') && item.includes('0.00'))
    ) {
      commission.push(item);
    }
  });

  const formatedCommission = commission.map((item) => {
    const replaceItem = item
      .replace(/7.00/g, ' 7.00 ')
      .replace(/0.00/g, ' 0.00 ');

    const value = replaceItem.split(' ');

    return {
      commission_parcentage: value[1],
      commission_amount: toNum(value[2]),
      ait: toNum(value[4]),
    };
  });

  return formatedCommission;
};

// AGENT BILLING DETAILS
export const formatAgentBillingDetails = (text: string) => {
  const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;

  const salesPeriodMatch = text.match(salesPeriodRegex);

  let from_date;
  let to_date;

  if (salesPeriodMatch) {
    from_date = dateStrConverter(salesPeriodMatch[2]);
    to_date = dateStrConverter(salesPeriodMatch[3]);
  }

  // GET COMBINED TOTAL
  const combinedTotal = text?.split('COMBINED')[2].split('\n');

  const issues = combinedTotal.includes('ISSUES')
    ? combinedTotal[3].split(' ')[combinedTotal[3].split(' ').length - 2]
    : '';

  const refunds = combinedTotal.includes('REFUNDS')
    ? combinedTotal[6].split(/[\s-]+/)[
        combinedTotal[6].split(/[\s-]+/).length - 1
      ]
    : '';

  const iata_summary = {
    from_date,
    to_date,
    iata_issues: toNum(issues),
    iata_refunds: toNum(refunds),
    iata_grand_total: toNum(issues) - toNum(refunds),
  };

  // ============ TICKETING....
  const ticketsText = splitText(text, '*** ISSUES', 'ISSUES TOTAL');

  const arrayOfTickets = ticketsText.split('\n');

  const filterTickets = arrayOfTickets
    .filter((item) => item.includes('FFVV') || item.includes('TKTT'))
    .map((mapItem) => {
      if (mapItem.includes('7.00') && mapItem.includes('0.00')) {
        const data = mapItem.split(',');
        data.pop();

        return data.join(',');
      } else {
        return mapItem;
      }
    });

  const formattedCommission = formatAgentBillingCommission(arrayOfTickets);

  const tickets = filterTickets.map((item, index) => {
    const arrItem = item.split(' ');

    return {
      id: index + 1,
      ticket_no: arrItem[0].replace(/TKTT|FFVV|FVVV|FFFF/g, ''),
      issue_date: formatDate(arrItem[4]),
      gross_fare: toNum(arrItem[1]),
      base_fare: toNum(arrItem[2]),
      ...formattedCommission[index],
      purchase_price: toNum(arrItem[3]),
    };
  });

  return { iata_summary, tickets };
};
