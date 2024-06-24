import {
  dateStrConverter,
  numRound,
} from '../../../common/utils/libraries/lib';
import DashboardModels from '../models/dashboard.models';

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

  const formattedCommission = commission.map((item) => {
    const replaceItem = item
      .replace(/7.00/g, ' 7.00 ')
      .replace(/0.00/g, ' 0.00 ');

    const value = replaceItem.split(' ');

    return {
      commission_percent: value[1],
      commission_percent_total: toNum(value[2]),
      ait: toNum(value[4]),
    };
  });

  return formattedCommission;
};

// AGENT BILLING DETAILS
export const formatAgentTicket = async (
  text: string,
  conn: DashboardModels
) => {
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
    })
    .filter((item) => !item.includes('+TKTT'));

  const formattedCommission = formatAgentBillingCommission(arrayOfTickets);

  const tickets: any[] = [];

  for (const [index, item] of filterTickets.entries()) {
    const arrItem = item.split(' ');

    const ticket_no = arrItem[0].replace(/TKTT|FFVV|FVVV|FFFF|FFSF/g, '');
    const db_ticket = await conn.getTicketInfoByTicket1(ticket_no);

    const iata_ticket = {
      sl: index + 1,
      invoice_id: index + 1,
      type: 'IATA',
      invoice_no: undefined,
      invoice_category_id: undefined,
      ticket_no,
      sales_date: formatDate(arrItem[4]),
      gross_fare: toNum(arrItem[1]),
      base_fare: toNum(arrItem[2]),
      ...formattedCommission[index],
      purchase_price: toNum(arrItem[3]),
    };

    tickets.push(iata_ticket);
    if (db_ticket) {
      tickets.push({ sl: index + 1, ...db_ticket });
    }
  }

  return { tickets };
};

// AGENT BILLING DETAILS
export const formatAgentRefund = async (
  text: string,
  conn: DashboardModels
) => {
  const refundsText = splitText(text, '*** REFUNDS', 'REFUNDS TOTAL');

  const arrayOfRefund = refundsText.split('\n');

  const formattedCommission = formatAgentBillingCommission(arrayOfRefund);

  const filterRfArr = arrayOfRefund.filter((item) => item.includes('RFND'));

  const refunds: any[] = [];

  for (const [index, item] of filterRfArr.entries()) {
    const formattedItem = item
      .replace(/-/g, ' -')
      .replace(/I|RFND/g, '')
      .split(' ');
    const ticket_no = formattedItem[0];

    const db_refund = await conn.getTicketInfoByRefund(ticket_no);

    const iata_refund = {
      refund_id: index + 1,
      type: 'IATA',
      ticket_no,
      vouchar_number: undefined,
      date: formatDate(formattedItem[4]),
      iata_purchase: toNum(formattedItem[1]),
      iata_fare: toNum(formattedItem[2]),
      iata_com_able: toNum(formattedItem[5]),
      ...formattedCommission[index],
      return_amount: toNum(formattedItem[3]),
    };

    refunds.push(iata_refund);
    if (db_refund) {
      refunds.push(db_refund);
    }
  }

  return { refunds };
};

// AGENT BILLING DETAILS
export const getAgentBillingSummary = async (
  text: string,
  conn: DashboardModels
) => {
  const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;

  const salesPeriodMatch = text.match(salesPeriodRegex);

  let from_date;
  let to_date;

  if (salesPeriodMatch) {
    from_date = dateStrConverter(salesPeriodMatch[2]);
    to_date = dateStrConverter(salesPeriodMatch[3]);
  }

  // GET COMBINED TOTAL
  const combinedTotal = text?.split('COMBINED')[2];

  const issues = combinedTotal.includes('ISSUES')
    ? combinedTotal.split('ISSUES\n')[1].split(' ')[8]
    : '';

  let refunds = '';

  if (combinedTotal.includes('REFUNDS')) {
    const refundTotalText = splitText(
      combinedTotal,
      'REFUNDS\n',
      'GRAND TOTAL\n'
    );

    let refundTotalAmounts = refundTotalText.replace(/[^\d,-\s]/g, '').trim();

    const refundTotalArr = refundTotalAmounts.split('-');

    refunds = refundTotalArr[refundTotalArr.length - 1];
  }

  const iata_summary = {
    from_date,
    to_date,
    iata_issues: toNum(issues),
    iata_refunds: toNum(refunds),
    iata_grand_total: toNum(issues) - toNum(refunds),
  };

  const ticket_issue = await conn.getBspTicketIssueInfo(
    iata_summary.from_date as Date,
    iata_summary.to_date as Date
  );

  const ticket_re_issue = await conn.getBspTicketReissueInfo(
    iata_summary.from_date as Date,
    iata_summary.to_date as Date
  );

  const ticket_refund = await conn.getBspTicketRefundInfo(
    iata_summary.from_date as Date,
    iata_summary.to_date as Date
  );

  const db_issue =
    numRound(ticket_issue.purchase_amount) +
    numRound(ticket_re_issue.purchase_amount);

  const db_grand_total =
    numRound(ticket_issue.purchase_amount) +
    numRound(ticket_re_issue.purchase_amount) -
    numRound(ticket_refund.refund_amount);

  const summary = {
    ...iata_summary,
    db_issue,
    db_refund: numRound(ticket_refund.refund_amount),
    db_grand_total,
    difference_amount: Math.abs(db_issue - iata_summary.iata_issues),
  };

  return { summary };
};
