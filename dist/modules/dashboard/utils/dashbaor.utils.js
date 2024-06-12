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
exports.getAgentBillingSummary = exports.formatAgentRefund = exports.formatAgentTicket = exports.formatAgentBillingCommission = exports.splitText = exports.withinRange = exports.toNum = void 0;
const lib_1 = require("../../../common/utils/libraries/lib");
// START UTILS
const toNum = (strNum) => Number(strNum.replace(/,/g, ''));
exports.toNum = toNum;
function withinRange(num1, num2, range) {
    return Math.abs((0, lib_1.numRound)(num1) - (0, lib_1.numRound)(num2)) <= (0, lib_1.numRound)(range);
}
exports.withinRange = withinRange;
const splitText = (text, startText, endText) => {
    const startIndex = text.indexOf(startText);
    const endIndex = text.indexOf(endText);
    return text.substring(startIndex, endIndex);
};
exports.splitText = splitText;
function formatDate(inputDate) {
    // inputDate = 010MAR24 | 0OD14MAR24 | 010MAR24
    const datePart = inputDate.match(/[0-9]{2}[A-Z]{3}[0-9]{2}/);
    if (datePart) {
        return new Date(datePart[0]); // 2024-03-13T18:00:00.000Z
    }
    else {
        return null;
    }
}
const formatAgentBillingCommission = (arrayOfTickets) => {
    let commission = [];
    arrayOfTickets.forEach((item) => {
        if (item.includes('0.00') ||
            (item.includes('7.00') && item.includes('0.00'))) {
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
            commission_percent_total: (0, exports.toNum)(value[2]),
            ait: (0, exports.toNum)(value[4]),
        };
    });
    return formattedCommission;
};
exports.formatAgentBillingCommission = formatAgentBillingCommission;
// AGENT BILLING DETAILS
const formatAgentTicket = (text, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketsText = (0, exports.splitText)(text, '*** ISSUES', 'ISSUES TOTAL');
    const arrayOfTickets = ticketsText.split('\n');
    const filterTickets = arrayOfTickets
        .filter((item) => item.includes('FFVV') || item.includes('TKTT'))
        .map((mapItem) => {
        if (mapItem.includes('7.00') && mapItem.includes('0.00')) {
            const data = mapItem.split(',');
            data.pop();
            return data.join(',');
        }
        else {
            return mapItem;
        }
    });
    const formattedCommission = (0, exports.formatAgentBillingCommission)(arrayOfTickets);
    const tickets = [];
    for (const [index, item] of filterTickets.entries()) {
        const arrItem = item.split(' ');
        const ticket_no = arrItem[0].replace(/TKTT|FFVV|FVVV|FFFF/g, '');
        const db_ticket = yield conn.getTicketInfoByTicket(ticket_no);
        const iata_ticket = Object.assign(Object.assign({ invoice_id: index + 1, type: 'IATA', invoice_no: undefined, invoice_category_id: undefined, ticket_no, sales_date: formatDate(arrItem[4]), gross_fare: (0, exports.toNum)(arrItem[1]), base_fare: (0, exports.toNum)(arrItem[2]) }, formattedCommission[index]), { purchase_price: (0, exports.toNum)(arrItem[3]) });
        tickets.push(iata_ticket);
        if (db_ticket) {
            tickets.push(db_ticket);
        }
    }
    return tickets;
});
exports.formatAgentTicket = formatAgentTicket;
// AGENT BILLING DETAILS
const formatAgentRefund = (text, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const refundsText = (0, exports.splitText)(text, '*** REFUNDS', 'REFUNDS TOTAL');
    const arrayOfRefund = refundsText.split('\n');
    const formattedCommission = (0, exports.formatAgentBillingCommission)(arrayOfRefund);
    const filterRfArr = arrayOfRefund.filter((item) => item.includes('RFND'));
    const refunds = [];
    for (const [index, item] of filterRfArr.entries()) {
        const formattedItem = item
            .replace(/-/g, ' -')
            .replace(/I|RFND/g, '')
            .split(' ');
        const ticket_no = formattedItem[0];
        const db_refund = yield conn.getTicketInfoByRefund(ticket_no);
        const iata_refund = Object.assign(Object.assign({ refund_id: index + 1, type: 'IATA', ticket_no, vouchar_number: undefined, date: formatDate(formattedItem[4]), iata_purchase: (0, exports.toNum)(formattedItem[1]), iata_fare: (0, exports.toNum)(formattedItem[2]), iata_com_able: (0, exports.toNum)(formattedItem[3]) }, formattedCommission[index]), { return_amount: (0, exports.toNum)(formattedItem[5]) });
        refunds.push(iata_refund);
        if (db_refund) {
            refunds.push(db_refund);
        }
    }
    return refunds;
});
exports.formatAgentRefund = formatAgentRefund;
// AGENT BILLING DETAILS
const getAgentBillingSummary = (text, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;
    const salesPeriodMatch = text.match(salesPeriodRegex);
    let from_date;
    let to_date;
    if (salesPeriodMatch) {
        from_date = (0, lib_1.dateStrConverter)(salesPeriodMatch[2]);
        to_date = (0, lib_1.dateStrConverter)(salesPeriodMatch[3]);
    }
    // GET COMBINED TOTAL
    const combinedTotal = text === null || text === void 0 ? void 0 : text.split('COMBINED')[2].split('\n');
    const issues = combinedTotal.includes('ISSUES')
        ? combinedTotal[3].split(' ')[combinedTotal[3].split(' ').length - 2]
        : '';
    const refunds = combinedTotal.includes('REFUNDS')
        ? combinedTotal[6].split(/[\s-]+/)[combinedTotal[6].split(/[\s-]+/).length - 1]
        : '';
    const iata_summary = {
        from_date,
        to_date,
        iata_issues: (0, exports.toNum)(issues),
        iata_refunds: (0, exports.toNum)(refunds),
        iata_grand_total: (0, exports.toNum)(issues) - (0, exports.toNum)(refunds),
    };
    const ticket_issue = yield conn.getBspTicketIssueInfo(iata_summary.from_date, iata_summary.to_date);
    const ticket_re_issue = yield conn.getBspTicketReissueInfo(iata_summary.from_date, iata_summary.to_date);
    const ticket_refund = yield conn.getBspTicketRefundInfo(iata_summary.from_date, iata_summary.to_date);
    const db_issue = (0, lib_1.numRound)(ticket_issue.purchase_amount) +
        (0, lib_1.numRound)(ticket_re_issue.purchase_amount);
    const db_grand_total = (0, lib_1.numRound)(ticket_issue.purchase_amount) +
        (0, lib_1.numRound)(ticket_re_issue.purchase_amount) -
        (0, lib_1.numRound)(ticket_refund.refund_amount);
    const summary = Object.assign(Object.assign({}, iata_summary), { db_issue, db_refund: (0, lib_1.numRound)(ticket_refund.refund_amount), db_grand_total, difference_amount: Math.abs(db_issue - iata_summary.iata_issues) });
    return { summary };
});
exports.getAgentBillingSummary = getAgentBillingSummary;
//# sourceMappingURL=dashbaor.utils.js.map