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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
const airTicketReport_excels_1 = __importDefault(require("./airTicketReport.excels"));
class ReportExcelServices extends abstract_services_1.default {
    constructor() {
        super();
        this.rowSize = 500;
        /*
        @NARROW EXCEL SERVICES
        */
        this.airTicketExcel = new airTicketReport_excels_1.default();
        this.airTicketTotalReportExcel = this.airTicketExcel.airTicketTotalReportExcel;
        this.airTicketDetailsReportExcel = this.airTicketExcel.airTicketDetailsReportExcel;
        this.customAirTicketReportExcel = this.airTicketExcel.customAirTicketReportExcel;
        /**
         * @ledgers
         */
        this.getClientLedgersExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { from_date, to_date } = req.query;
            const conn = this.models.trxnModels(req);
            const { ledgers } = yield conn.getClTrans(client_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('client ledger');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/client_ledger.xlsx`;
            // Column for data in excel. key must match data key
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'ctrxn_created_at', width: 15 },
                { header: 'Particular', key: 'trxntype_name', width: 25 },
                { header: 'Vouchar No.', key: 'ctrxn_voucher', width: 15 },
                { header: 'Pax Name', key: 'ctrxn_pax', width: 20 },
                { header: 'PNR', key: 'ctrxn_pnr', width: 18 },
                { header: 'Ticket No', key: 'ctrxn_airticket_no', width: 15 },
                { header: 'Route', key: 'ctrxn_route', width: 15 },
                { header: 'Debit', key: 'transection_debit_Amount', width: 15 },
                { header: 'Credit', key: 'transection_credit_Amount', width: 15 },
                { header: 'Balance', key: 'ctrxn_lbalance', width: 15 },
                { header: 'Note', key: 'ctrxn_note', width: 15 },
            ];
            // Loop through data and populate rows
            ledgers.forEach((item, index) => {
                item.serial = index + 1;
                const date = new Date(item.ctrxn_created_at);
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                item.ctrxn_created_at = formattedDate;
                if (item.ctrxn_type === 'DEBIT') {
                    item.transection_debit_Amount = `${item.ctrxn_amount}`;
                }
                else {
                    item.transection_credit_Amount = `${item.ctrxn_amount}`;
                }
                worksheet.addRow(item);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`client ledger report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getVendorLedgersExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.trxnModels(req);
            const { ledgers } = yield conn.getVenTrxns(vendor_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('vendor ledger');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/vendor_ledger.xlsx`;
            // Column for data in excel. key must match data key
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'vtrxn_created_at', width: 15 },
                { header: 'Particular', key: 'trxntype_name', width: 25 },
                { header: 'Pax Name', key: 'vtrxn_pax', width: 25 },
                { header: 'Client Name', key: '', width: 25 },
                { header: 'Vouchar No.', key: 'vtrxn_voucher', width: 15 },
                { header: 'Ticket No', key: 'vtrxn_airticket_no', width: 15 },
                { header: 'PNR', key: 'vtrxn_pnr', width: 18 },
                { header: 'Route', key: 'vtrxn_route', width: 15 },
                { header: 'Debit', key: 'transection_debit_amount', width: 15 },
                { header: 'Credit', key: 'transection_credit_amount', width: 15 },
                { header: 'Balance', key: 'vtrxn_lbalance', width: 15 },
                { header: 'Note', key: 'vtrxn_note', width: 30 },
            ];
            // Loop through data and populate rows
            ledgers.forEach((ledger, index) => {
                ledger.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                const date = new Date(ledger.vtrxn_created_at);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                ledger.vtrxn_created_at = formattedDate;
                if (ledger.vtrxn_type === 'DEBIT') {
                    ledger.transection_debit_amount = `${ledger.vtrxn_amount}`;
                }
                else {
                    ledger.transection_credit_amount = `${ledger.vtrxn_amount}`;
                }
                worksheet.addRow(ledger);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Vnedor ledger report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getCombinedLedgersExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { combined_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.trxnModels(req);
            const { data: ledgers } = yield conn.getComTrxn(combined_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('combined ledger');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/combined_ledger.xlsx`;
            // Column for data in excel. key must match data key
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Payment Date', key: 'comtrxn_create_at', width: 15 },
                { header: 'Particular', key: 'trxntype_name', width: 25 },
                { header: 'Voucher No', key: 'comtrxn_voucher_no', width: 25 },
                { header: 'Ticket No', key: 'comtrxn_airticket_no', width: 15 },
                { header: 'Pax Name', key: 'comtrxn_pax', width: 15 },
                { header: 'PNR', key: 'comtrxn_pnr', width: 18 },
                { header: 'Route', key: 'comtrxn_route', width: 15 },
                { header: 'Debit', key: 'comtransaction_debit_amount', width: 15 },
                { header: 'Credit', key: 'comtransaction_credit_amount', width: 15 },
                { header: 'Balance', key: 'comtrxn_lbalance', width: 15 },
                { header: 'Note', key: 'comtrxn_note', width: 30 },
            ];
            // Loop through data and populate rows
            ledgers.forEach((ledger, index) => {
                ledger.serial = index + 1;
                const date = new Date(ledger.comtrxn_create_at);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                ledger.comtrxn_create_at = formattedDate;
                if (ledger.comtrxn_type === 'DEBIT') {
                    ledger.comtransaction_debit_amount = `${ledger.comtrxn_amount}`;
                }
                else {
                    ledger.comtransaction_credit_amount = `${ledger.comtrxn_amount}`;
                }
                worksheet.addRow(ledger);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Vnedor ledger report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * TOTAL DUE ADVANCE
         */
        this.getDueAdvanceClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { payment_date, page, size, present_balance } = req.query;
            const conn = this.models.reportModel(req);
            const reports = yield conn.clientDueAdvance(client_id, String(payment_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('client Due Advance Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/clientDueAdvanceReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 5 },
                {
                    header: 'Client Name',
                    key: 'client_name',
                    width: 30,
                    alignment: { wrapText: true },
                },
                {
                    header: 'Mobile No.',
                    key: 'client_mobile',
                    width: 30,
                    alignment: { wrapText: true },
                },
                {
                    header: 'Email',
                    key: 'client_email',
                    width: 30,
                    alignment: { wrapText: true },
                },
                {
                    header: 'Advance',
                    key: 'credit_Amount',
                    width: 20,
                    alignment: { horizontal: 'left' },
                },
                {
                    header: 'Due',
                    key: 'debit_Amount',
                    width: 20,
                    alignment: { horizontal: 'left' },
                },
                {
                    header: 'Current Last Balance',
                    key: 'client_lbalance',
                    width: 20,
                    alignment: { horizontal: 'left' },
                },
                {
                    header: 'Credit Limit',
                    key: 'client_credit_limit',
                    width: 20,
                    alignment: { horizontal: 'left' },
                },
            ];
            // Loop through data and populate rows
            reports.data.forEach((report, index) => {
                report.serial = index + 1;
                if (Number(report.ctrxn_lbalance) >= 0) {
                    report.credit_Amount = report.ctrxn_lbalance;
                }
                else {
                    report.debit_Amount = Math.abs(report.ctrxn_lbalance);
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`client due advance report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDueAdvanceVendorExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id } = req.params;
            const { payment_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const vendor_ledgers = yield conn.getDueAdvanceVendor(vendor_id, String(payment_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('vendor Due Advance Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/vendorDueAdvanceReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Vendor Name', key: 'vendor_name', width: 20 },
                { header: 'Mobile No.', key: 'vendor_mobile', width: 25 },
                { header: 'Email', key: 'vendor_email', width: 25 },
                { header: 'Advance', key: 'credit_Amount', width: 20 },
                { header: 'Due', key: 'debit_Amount', width: 20 },
                { header: 'Current Last Balance', key: 'vendor_lbalance', width: 20 },
                { header: 'Credit Limit', key: 'vendor_credit_limit', width: 20 },
                { header: 'Fixed Advance', key: 'vendor_fixed_advance', width: 20 },
            ];
            // Loop through data and populate rows
            vendor_ledgers === null || vendor_ledgers === void 0 ? void 0 : vendor_ledgers.data.forEach((report, index) => {
                report.serial = index + 1;
                if (Number(report.vtrxn_lbalance) >= 0) {
                    report.credit_Amount = report.vtrxn_lbalance;
                }
                else {
                    report.debit_Amount = Math.abs(report.vtrxn_lbalance);
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`vendor due advance report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDueAdvanceAgentExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { agent_id } = req.params;
            const { payment_date } = req.query;
            const conn = this.models.reportModel(req);
            const agents_data = yield conn.getAgentsDueAdvance(agent_id, payment_date, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('agent Due Advance Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/agentDueAdvanceReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Agent Name', key: 'agent_name', width: 25 },
                { header: 'Mobile', key: 'agent_mobile', width: 25 },
                { header: 'Commission', key: 'agent_commission_rate', width: 20 },
                { header: 'Advance', key: 'credit_Amount', width: 15 },
                { header: 'Due', key: 'debit_Amount', width: 20 },
            ];
            // Loop through data and populate rows
            (_a = agents_data === null || agents_data === void 0 ? void 0 : agents_data.data) === null || _a === void 0 ? void 0 : _a.forEach((report, index) => {
                report.serial = index + 1;
                if (report.agent_last_balance >= 0) {
                    report.credit_Amount = report.agent_last_balance;
                }
                else {
                    report.debit_Amount = Math.abs(report.agent_last_balance);
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`agent due advance report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDueAdvanceCombinedClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const { combined_client_id } = req.params;
            const { payment_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const combined_clients_data = yield conn.getDueAdvanceCombineClient(combined_client_id, payment_date, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('combined client Due Advance Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/combinedClientDueAdvanceReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Name', key: 'combine_name', width: 25 },
                { header: 'Mobile', key: 'combine_mobile', width: 25 },
                { header: 'Email', key: 'combine_email', width: 20 },
                { header: 'Present Due', key: 'debit_Amount', width: 25 },
                { header: 'Present Advance', key: 'credit_Amount', width: 20 },
                { header: 'Current Last Balance', key: 'combine_lbalance', width: 20 },
                { header: 'Credit Limit', key: 'combine_credit_limit', width: 20 },
            ];
            // Loop through data and populate rows
            (_b = combined_clients_data === null || combined_clients_data === void 0 ? void 0 : combined_clients_data.data) === null || _b === void 0 ? void 0 : _b.forEach((report, index) => {
                report.serial = index + 1;
                if (Number(report.comtrxn_lbalance) > 0) {
                    report.credit_Amount = report.comtrxn_lbalance;
                }
                else {
                    report.debit_Amount = Math.abs(report.comtrxn_lbalance);
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`combined client due advance report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * Sales and Earning
         */
        this.getMonthlySalesEarninghExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            const { client_id, employee_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.getSalesReport(client_id, employee_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Monthly Sales and earning');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/monthlySalesAndEarningReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'invoice_sales_date', width: 15 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'Client Name', key: 'guest_name', width: 25 },
                { header: 'Sales By', key: 'employee_name', width: 20 },
                { header: 'Sales Category', key: 'sales_category', width: 30 },
                { header: 'Total Amount', key: 'invoice_net_total', width: 20 },
                { header: 'Purchase Amount', key: 'cost_price', width: 18 },
                { header: 'Earning Amount', key: 'total_profit', width: 15 },
                { header: 'Collected Amount', key: 'collected_Amount', width: 18 },
                { header: 'Due Amount', key: 'due_amount', width: 15 },
            ];
            // Loop through data and populate rows
            (_d = (_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.invoice_sales_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.invoice_sales_date = formattedDate;
                report.collected_Amount =
                    report.total_client_payments > 0 ? report.total_client_payments : 0;
                const dueAmount = Number(report.invoice_net_total) - Number(report.total_client_payments);
                report.due_amount = dueAmount > 0 ? dueAmount : 0;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`monthly sales and report of sales report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getAirlineWiseReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const airline_id = req.params.airline;
            const { from_date, to_date, page, size, search } = req.query;
            const conn = this.models.reportModel(req);
            const { data } = yield conn.airlineWiseSalesReport(airline_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, search, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Airline Wise Sales');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/AirlineWiseSalesReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'invoice_create_date', width: 15 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'Airline Name', key: 'airline_name', width: 25 },
                { header: 'Pax Name', key: 'passport_name', width: 20 },
                { header: 'Ticket No', key: 'airticket_ticket_no', width: 20 },
                { header: 'Pnr', key: 'airticket_pnr', width: 20 },
                { header: 'Route', key: 'airticket_routes', width: 18 },
                { header: 'Client Price', key: 'airticket_client_price', width: 15 },
                { header: 'Purchase Price', key: 'airticket_purchase_price', width: 18 },
                { header: 'Total Profit', key: 'total_profit', width: 15 },
            ];
            // Loop through data and populate rows
            data.result.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.invoice_create_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.invoice_create_date = formattedDate;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`airline wise report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getSalesManItemExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item_id, sales_man_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const items = yield conn.salesReportItemSalesman(item_id, sales_man_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Sales Man & Item');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/salesManItemReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice No', key: 'invoice_no', width: 15 },
                { header: 'Invoice Name', key: 'invoice_name', width: 20 },
                { header: 'Sales Date', key: 'create_date', width: 20 },
                { header: 'Client Name', key: 'client_name', width: 20 },
                { header: 'Sales By', key: 'sales_by', width: 20 },
                { header: 'Sales Amount', key: 'sales_price', width: 20 },
            ];
            // Loop through data and populate rows
            items.data.report.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.create_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.create_date = formattedDate;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Sales man Item wise report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getClientWiseCollectionSalesReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f;
            const { client_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            let separateComb;
            if (client_id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(client_id);
            }
            const clientId = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.client_id) || 'all';
            const combine_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const sales = yield conn.getClientSales(clientId, combine_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const collection = yield conn.getClientCollectionClient(clientId, combine_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/clientWiseCollectionSalesReport.xlsx`;
            const salesReportWorksheet = workbook.addWorksheet('Sales Report');
            salesReportWorksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice Date', key: 'sales_date', width: 20 },
                { header: 'Invoice No', key: 'invoice_no', width: 15 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'PAX Name', key: 'pax_name', width: 20 },
                { header: 'Ticket No', key: 'ticket_no', width: 20 },
                { header: 'Net Total', key: 'net_total', width: 20 },
            ];
            // Loop through data and populate rows
            (_e = sales === null || sales === void 0 ? void 0 : sales.sales_data) === null || _e === void 0 ? void 0 : _e.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.sales_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.sales_date = formattedDate;
                salesReportWorksheet.addRow(report);
            });
            salesReportWorksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            const clientReportWorksheet = workbook.addWorksheet('Client Wise Collection');
            clientReportWorksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Particular', key: 'trxntype_name', width: 15 },
                { header: 'Money Receipt No', key: 'receipt_vouchar_no', width: 20 },
                { header: 'Payment Date', key: 'receipt_payment_date', width: 20 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'Collection Amount', key: 'receipt_total_amount', width: 20 },
            ];
            // Loop through data and populate rows
            (_f = collection === null || collection === void 0 ? void 0 : collection.collection_data) === null || _f === void 0 ? void 0 : _f.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.receipt_payment_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.receipt_payment_date = formattedDate;
                clientReportWorksheet.addRow(report);
            });
            clientReportWorksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Client Wise Collection & Sales report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getVendorWisePurchasePaymentReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comb_vendor } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getVendorWiseReport(comb_vendor, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/vendorWisePurchasePaymentReport.xlsx`;
            const ticketFromVendorWorksheet = workbook.addWorksheet('Ticket Purchase From Vendor');
            ticketFromVendorWorksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice Date', key: 'create_date', width: 15 },
                { header: 'Sales Date', key: 'sales_date', width: 15 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'Voucher No.', key: 'vouchar_no', width: 20 },
                { header: 'Vendor Name', key: 'vendor_name', width: 20 },
                { header: 'Purchase Price', key: 'cost_price', width: 20 },
                { header: 'Payment Amount', key: 'payment_amount', width: 20 },
                { header: 'Due Amount', key: 'due_amount', width: 20 },
            ];
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                ticketFromVendorWorksheet.addRow(report);
            });
            ticketFromVendorWorksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Vendor Wise Purchase & Payment Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getSalesManCollectionAndDueExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _g, _h;
            const sales_man_id = req.params.salesman_id;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.salesManWiseCollectionDue(sales_man_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('SalesMan Collection & Due');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/salesManCollectionDue.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'create_date', width: 15 },
                { header: 'Invoice No', key: 'invoice_no', width: 15 },
                { header: 'Person', key: 'employee_full_name', width: 20 },
                { header: 'Sales Price', key: 'sales_price', width: 20 },
                { header: 'Collected Amount', key: 'client_payment', width: 20 },
                { header: 'Due', key: 'due_amount', width: 20 },
            ];
            // Loop through data and populate rows
            (_h = (_g = data.data) === null || _g === void 0 ? void 0 : _g.result) === null || _h === void 0 ? void 0 : _h.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.create_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.create_date = formattedDate;
                report.due_amount = report.client_payment
                    ? report.sales_price - parseInt(report.client_payment)
                    : report.sales_price;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`SalesMan Collection & Due file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDailySalesReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, employee_id, product_id } = req.body;
            const { from_date, to_date } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const { data } = yield conn.getDailySalesReport(comb_client, employee_id, product_id, from_date, to_date, 1, this.rowSize, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/dailySalesReport.xlsx`;
            const ticketFromVendorWorksheet = workbook.addWorksheet('Daily Sales Report');
            ticketFromVendorWorksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Sales date', key: 'sales_date', width: 15 },
                { header: 'Invoice no.', key: 'invoice_no', width: 20 },
                { header: 'Client name', key: 'client_name', width: 20 },
                { header: 'Item', key: 'product_name', width: 20 },
                { header: 'Sales by', key: 'employee_name', width: 20 },
                { header: 'Sales price', key: 'sales_price', width: 20 },
                { header: 'Cost price', key: 'cost_price', width: 20 },
                { header: 'Collect amount', key: 'client_pay_amount', width: 20 },
                { header: 'Due amount', key: 'due_amount', width: 20 },
                { header: 'Refund amount', key: 'refund_total_amount', width: 20 },
                { header: 'Refund profit', key: 'refund_profit', width: 20 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                report.sales_price = Number(report.sales_price);
                report.cost_price = Number(report.cost_price);
                report.client_pay_amount = Number(report.client_pay_amount);
                report.due_amount = Number(report.due_amount);
                report.refund_total_amount = Number(report.refund_total_amount);
                report.refund_profit = Number(report.refund_profit);
                ticketFromVendorWorksheet.addRow(report);
            });
            ticketFromVendorWorksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Sales Report, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDailySalesCollectionReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.salesPurchaseReport(req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/dailyCollectionSalesReport.xlsx`;
            const worksheet = workbook.addWorksheet('Daily Sales and Collection');
            /**
             * Daily Sales Report
             */
            worksheet.getCell('A1').value = 'Daily Sales';
            const salesMergeCell = worksheet.getCell('A1');
            if (salesMergeCell.isMerged) {
                const mergeCellAddress = salesMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('A1:E1');
            worksheet.getCell('A1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            const salesCollectionColumns = ['B', 'C', 'D', 'E'];
            salesCollectionColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const salesColumnHeader = [
                { callName: 'A2', value: 'SL' },
                { callName: 'B2', value: 'Sales Date' },
                { callName: 'C2', value: 'Invoice No' },
                { callName: 'D2', value: 'Client' },
                { callName: 'E2', value: 'Sales Amount' },
            ];
            salesColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            const salesData = data.sales.map((item, index) => [
                index + 1,
                (item.create_date = formateDate(item.create_date)),
                item.invoice_no,
                item.client_name,
                item.sales_price,
            ]);
            salesData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            /**
             * Daily Collection Report
             */
            worksheet.getCell('G1').value = 'Daily Collection';
            const cllectionMergeCell = worksheet.getCell('G1');
            if (cllectionMergeCell.isMerged) {
                const mergeCellAddress = cllectionMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('G1:K1');
            worksheet.getCell('G1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            const CollectionColumns = ['G', 'H', 'I', 'J', 'K'];
            CollectionColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const CollectionColumnHeader = [
                { callName: 'G2', value: 'SL' },
                { callName: 'H2', value: 'Collection Date' },
                { callName: 'I2', value: 'Vouchar No' },
                { callName: 'J2', value: 'Client' },
                { callName: 'K2', value: 'Collected Amount' },
            ];
            CollectionColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const CollectionData = data.collection.map((item, index) => [
                index + 1,
                (item.receipt_payment_date = formateDate(item.receipt_payment_date)),
                item.receipt_vouchar_no,
                item.client_name,
                item.receipt_total_amount,
            ]);
            CollectionData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 7).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 7).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Daily Sales Collection file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getDailyPurchasePaymentExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.paymentAndPurchase(req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/dailyCollectionPurcheasePaymentReport.xlsx`;
            const worksheet = workbook.addWorksheet('Daily Purchase Report');
            /**Purchase report */
            worksheet.getCell('A1').value = 'Daily Purchase';
            const purcheaseMergeCell = worksheet.getCell('A1');
            if (purcheaseMergeCell.isMerged) {
                const mergeCellAddress = purcheaseMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('A1:E1');
            worksheet.getCell('A1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            worksheet.getColumn('A').width = 20;
            const balanceColumns = ['B', 'C', 'D', 'E'];
            balanceColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const balanceColumnHeader = [
                { callName: 'A2', value: 'SL' },
                { callName: 'B2', value: 'Purchase Date' },
                { callName: 'C2', value: 'Invoice No' },
                { callName: 'D2', value: 'Vendor' },
                { callName: 'E2', value: 'Purchase Amount' },
            ];
            balanceColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            const purcheaseData = data.purchase.map((item, index) => [
                index + 1,
                (item.create_date = formateDate(item.create_date)),
                item.invoice_no,
                item.vendor_name,
                item.cost_price,
            ]);
            purcheaseData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            /**
             * PAYMENT REPRORT
             */
            worksheet.getCell('G1').value = 'Daily Payment';
            const paymentMergeCell = worksheet.getCell('G1');
            if (paymentMergeCell.isMerged) {
                const mergeCellAddress = paymentMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('G1:M1');
            worksheet.getCell('G1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            worksheet.getColumn('G').width = 20;
            const paymentColumns = ['G', 'H', 'I', 'J', 'K', 'L', 'M'];
            paymentColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const paymentColumnHeader = [
                { callName: 'G2', value: 'SL' },
                { callName: 'H2', value: 'Payment Date' },
                { callName: 'I2', value: 'Vouchar No' },
                { callName: 'J2', value: 'Invoice No' },
                { callName: 'K2', value: 'Receipt No' },
                { callName: 'L2', value: 'Vendor' },
                { callName: 'M2', value: 'Payment Amount' },
            ];
            paymentColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const paymenntsData = data.payments.map((item, index) => [
                index + 1,
                (item.payment_date = formateDate(item.payment_date)),
                item.vouchar_no,
                item.invoice_no,
                item.vpay_receipt_no,
                '',
                item.payment_amount,
            ]);
            paymenntsData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 7).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 7).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Daily Collection & purchease and payment file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getVisaWiseProfitLossExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { visa_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.visaWiseProfitLoss(visa_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Visa Wise Profit Loss');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/visaWiseProfitLossReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'invoice_sales_date', width: 15 },
                { header: 'Invoice No', key: 'invoice_no', width: 20 },
                { header: 'Product Name', key: 'product_name', width: 25 },
                { header: 'Sale Price', key: 'costitem_sale_price', width: 20 },
                { header: 'Cost Price', key: 'costitem_cost_price', width: 20 },
                { header: 'Profit/Loss', key: 'profit_loss_amount', width: 18 },
            ];
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.invoice_sales_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.invoice_sales_date = formattedDate;
                report.profit_loss_amount =
                    report.costitem_sale_price - Number(report.costitem_cost_price);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Visa wise profit loss report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getOverAllProfitLossExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date } = req.query;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.profitLossReport(req, trx);
                const user_percentage = yield conn.getUserPercentage(req.user_id);
                const { total_sales_price, total_cost_price } = yield conn.totalSales(String(from_date), String(to_date), user_percentage);
                const total_refun_profit = yield conn.refundProfitAir(String(from_date), String(to_date));
                const total_employee_salary = yield conn.getEmployeeExpense(String(from_date), String(to_date), user_percentage);
                const incentive = yield conn.allIncentive(String(from_date), String(to_date), user_percentage);
                const expense_total = yield conn.allExpenses(String(from_date), String(to_date), user_percentage);
                const client_discount = yield conn.getAllClientDiscount(String(from_date), String(to_date), user_percentage);
                const service_charge = yield conn.getInvoicesServiceCharge(from_date, to_date, user_percentage);
                // const tour_profit = await conn.getTourProfitLoss(from_date, to_date);
                const total_sales_profit = (total_sales_price - (total_cost_price | 0)) | 0;
                const gross_profit_loss = total_sales_profit + (total_refun_profit | 0);
                const total_gross_profit_loss = gross_profit_loss + incentive + service_charge + 0;
                const total_discount = client_discount || 0;
                const tour_pakage_profit = 0;
                const total_service_charge = service_charge || 0;
                const data = {
                    total_sales_price,
                    total_cost_price,
                    total_sales_profit,
                    total_refun_profit,
                    gross_profit_loss,
                    total_incentive_income: incentive,
                    expense_total,
                    total_employee_salary,
                    total_discount,
                    overall_expense: expense_total + (total_employee_salary | 0),
                    total_gross_profit_loss,
                    net_profit_loss: total_gross_profit_loss -
                        (expense_total + (total_employee_salary | 0)),
                    tour_pakage_profit,
                    total_service_charge,
                };
                const workbook = new exceljs_1.default.Workbook();
                const dirPath = path_1.default.join(__dirname, '../files');
                const filePath = `${dirPath}/OverallProfitLossReport.xlsx`;
                const worksheet = workbook.addWorksheet('Over All Profit Loss Report');
                /**
                 * Populate the data for the Gross Profit/Loss
                 */
                worksheet.getCell('A1').value = 'Gross Profit/Loss';
                const grossMergeCell = worksheet.getCell('A1');
                if (grossMergeCell.isMerged) {
                    const mergeCellAddress = grossMergeCell.master.address;
                    worksheet.unMergeCells(mergeCellAddress);
                }
                worksheet.mergeCells('A1:E1');
                worksheet.getCell('A1').style = {
                    font: { color: { argb: 'FFFFFF' }, bold: true },
                    alignment: { horizontal: 'center', vertical: 'middle' },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '18b4e9' },
                    },
                };
                worksheet.getColumn('A').width = 20;
                const columns = ['B', 'C', 'D', 'E', 'F', 'G'];
                columns.forEach((column) => {
                    worksheet.getColumn(column).width = 15;
                });
                const GrossColumnHeader = [
                    { callName: 'A2', value: 'Sales' },
                    { callName: 'B2', value: 'Cost Of Product' },
                    { callName: 'C2', value: 'Sales Profit' },
                    { callName: 'D2', value: 'Refund Profit' },
                    { callName: 'F2', value: 'Tour Pakage Profit' },
                    { callName: 'G2', value: 'Service Charge' },
                    { callName: 'E2', value: 'Gross Profit/Loss' },
                ];
                GrossColumnHeader.forEach((head) => {
                    worksheet.getCell(head.callName).value = head.value;
                    worksheet.getCell(head.callName).style = {
                        font: { bold: true },
                    };
                });
                const grossProfitLossData = [
                    [
                        data.total_sales_price,
                        data.total_cost_price,
                        data.total_sales_profit,
                        data.total_refun_profit,
                        data.total_service_charge,
                        data.tour_pakage_profit,
                        ,
                        data.gross_profit_loss,
                    ],
                ];
                grossProfitLossData.forEach((row, rowIndex) => {
                    row.forEach((value, columnIndex) => {
                        worksheet.getCell(rowIndex + 3, columnIndex + 1).value = value;
                        worksheet.getCell(rowIndex + 3, columnIndex + 1).style = {
                            alignment: { horizontal: 'left' },
                        };
                    });
                });
                /**
                 * Incentive Income REPORT
                 */
                worksheet.getCell('G1').value = 'Incentive Income';
                worksheet.getCell('G1').style = {
                    font: { color: { argb: 'FFFFFF' }, bold: true },
                    alignment: { horizontal: 'center', vertical: 'middle' },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '18b4e9' },
                    },
                };
                worksheet.getColumn('I').width = 20;
                const incomeColumnHeader = [
                    { callName: 'G2', value: 'Incentive Income' },
                ];
                incomeColumnHeader.forEach((head) => {
                    worksheet.getCell(head.callName).value = head.value;
                    worksheet.getCell(head.callName).style = {
                        font: { bold: true },
                    };
                });
                const incomeData = [[data.total_incentive_income]];
                incomeData.forEach((row, rowIndex) => {
                    row.forEach((value, columnIndex) => {
                        worksheet.getCell(rowIndex + 3, columnIndex + 7).value = value;
                        worksheet.getCell(rowIndex + 3, columnIndex + 7).style = {
                            alignment: { horizontal: 'left' },
                        };
                    });
                });
                /**
                 * Populate the data for the Expense
                 */
                worksheet.getCell('I1').value = 'Expense';
                worksheet.getCell('I1').style = {
                    font: { color: { argb: 'FFFFFF' }, bold: true },
                    alignment: { horizontal: 'center', vertical: 'middle' },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '18b4e9' },
                    },
                };
                // Merge cells and apply styles for Expense
                const expenseMergeCell = worksheet.getCell('I1');
                if (expenseMergeCell.isMerged) {
                    const mergeCellAddress = expenseMergeCell.master.address;
                    worksheet.unMergeCells(mergeCellAddress);
                }
                worksheet.mergeCells('I1:L1');
                const expenseColumns = ['K', 'L', 'M', 'N'];
                expenseColumns.forEach((column) => {
                    worksheet.getColumn(column).width = 18;
                });
                const expenseColumnHeader = [
                    { callName: 'I2', value: 'General Expense' },
                    { callName: 'J2', value: 'Employee Expense' },
                    { callName: 'K2', value: 'Client Discount' },
                    { callName: 'L2', value: 'Total Expenses' },
                ];
                expenseColumnHeader.forEach((head) => {
                    worksheet.getCell(head.callName).value = head.value;
                    worksheet.getCell(head.callName).style = {
                        font: { bold: true },
                    };
                });
                const expenseProfitLossData = [
                    [
                        data.overall_expense,
                        data.total_employee_salary ? data.total_employee_salary : 0,
                        data.total_discount,
                        data.expense_total,
                    ],
                ];
                expenseProfitLossData.forEach((row, rowIndex) => {
                    row.forEach((value, columnIndex) => {
                        worksheet.getCell(rowIndex + 3, columnIndex + 9).value = value;
                        worksheet.getCell(rowIndex + 3, columnIndex + 9).style = {
                            alignment: { horizontal: 'left' },
                        };
                    });
                });
                /**
                 * Net Profit/Loss
                 */
                worksheet.getCell('N1').value = 'Total Gross Profit/Loss';
                worksheet.getCell('N1').style = {
                    font: { color: { argb: 'FFFFFF' }, bold: true },
                    alignment: { horizontal: 'center', vertical: 'middle' },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '18b4e9' },
                    },
                };
                // Merge cells and apply styles for Total Gross Profit/Loss
                const netProfitMergeCell = worksheet.getCell('N1');
                if (netProfitMergeCell.isMerged) {
                    const mergeCellAddress = netProfitMergeCell.master.address;
                    worksheet.unMergeCells(mergeCellAddress);
                }
                worksheet.mergeCells('N1:P1');
                worksheet.getColumn('N').width = 25;
                const netProfitColumns = ['R', 'S'];
                netProfitColumns.forEach((column) => {
                    worksheet.getColumn(column).width = 18;
                });
                const netProfitLossColumnHeader = [
                    { callName: 'Q2', value: 'Total Gross Profit/Loss' },
                    { callName: 'R2', value: 'Total Expense' },
                    { callName: 'S2', value: 'Net Profit/Loss' },
                ];
                netProfitLossColumnHeader.forEach((head) => {
                    worksheet.getCell(head.callName).value = head.value;
                    worksheet.getCell(head.callName).style = {
                        font: { bold: true },
                    };
                });
                const netProfitLossData = [
                    [
                        data.total_gross_profit_loss,
                        data.expense_total,
                        data.net_profit_loss,
                    ],
                ];
                netProfitLossData.forEach((row, rowIndex) => {
                    row.forEach((value, columnIndex) => {
                        worksheet.getCell(rowIndex + 3, columnIndex + 14).value = value;
                        worksheet.getCell(rowIndex + 3, columnIndex + 15).style = {
                            alignment: { horizontal: 'left' },
                        };
                    });
                });
                try {
                    if (!fs_1.default.existsSync(dirPath)) {
                        fs_1.default.mkdirSync(dirPath);
                    }
                    yield workbook.xlsx.writeFile(filePath);
                    // response download
                    res.download(filePath, filePath, (err) => {
                        if (err) {
                            throw new Error(`overall profit loss report file not download, error is: ${err}`);
                        }
                        else {
                            fs_1.default.unlinkSync(filePath);
                        }
                    });
                }
                catch (err) {
                    throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
                }
            }));
        });
        this.getTicketWiseProfitExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ticket_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const tickets = yield conn.ticketWiseProfitLossReport(ticket_id, from_date, to_date, Number(page) || 1, Number(size) || 20, req.user_id);
            let data = [];
            for (const ticket of tickets.data) {
                const invoiceId = ticket === null || ticket === void 0 ? void 0 : ticket.invoice_id;
                if (invoiceId) {
                    const invoiceDue = yield this.models
                        .MoneyReceiptModels(req)
                        .getInvoiceDue(invoiceId);
                    const ticket_info = Object.assign(Object.assign({}, invoiceDue), ticket);
                    data.push(ticket_info);
                }
            }
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Ticket Wise Profit Loss');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/ticketWiseProfitLossReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice No', key: 'invoice_no', width: 15 },
                { header: 'Invoice Date', key: 'invoice_create_date', width: 20 },
                { header: 'Client', key: 'client_name', width: 25 },
                { header: 'Ticket No', key: 'airticket_ticket_no', width: 20 },
                { header: 'Cost Amount', key: 'airticket_purchase_price', width: 20 },
                { header: 'Net Total', key: 'airticket_client_price', width: 20 },
                { header: 'Profit/Loss', key: 'airticket_profit', width: 18 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.invoice_create_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.invoice_create_date = formattedDate;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`ticket wise profit loss report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getEmployeeExpenseExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { employee_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.getEmployeeExpenses(employee_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Employee Expense Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/EmployeeExpenseReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'created_date', width: 15 },
                { header: 'Employe Name', key: 'employes_name', width: 20 },
                { header: 'Basic Salary', key: 'employes_salary', width: 25 },
                { header: 'Other Aloowance', key: 'payroll_other_aloowance', width: 20 },
                { header: 'Net Amount', key: 'payroll_net_amount', width: 20 },
                { header: 'Note', key: 'note', width: 20 },
            ];
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.created_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.created_date = formattedDate;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`ticket wise profit loss report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getExpenseReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { head_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.headWiseExpenseReport(head_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Expense Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/ExpenseReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'expense_date', width: 20 },
                { header: 'Expense', key: 'head_expense', width: 15 },
                { header: 'Voucher No', key: 'expense_vouchar_no', width: 20 },
                { header: 'Amount', key: 'expense_total_amount', width: 25 },
                { header: 'Note', key: 'expense_note', width: 20 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const date = new Date(report.expense_date);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                report.expense_date = formattedDate;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`ticket wise profit loss report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getPassportStatusReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status_name } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.passportStatusReport(status_name, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Passport Status Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/PassportStatusReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice', key: 'invoice_no', width: 25 },
                { header: 'Name', key: 'passport_name', width: 20 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'Passport No', key: 'passport_passport_no', width: 15 },
                { header: 'Country', key: 'country_name', width: 20 },
                { header: 'Status', key: 'pstatus_name', width: 20 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'left' };
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Passport Status Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getPassportWiseReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            const passport_id = req.params.id;
            const { from_date, to_date } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.passportWiseReport(passport_id, String(from_date), String(to_date));
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Passport Wise Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/PassportWiseReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice', key: 'invoice_no', width: 15 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'Passport Name', key: 'passport_name', width: 25 },
                { header: 'Destination', key: 'destination', width: 20 },
                { header: 'Status', key: '', width: 20 },
            ];
            // Loop through data and populate rows
            (_j = data === null || data === void 0 ? void 0 : data.data) === null || _j === void 0 ? void 0 : _j.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'left' };
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Passport Wise Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getClientWisePassengerListExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const client_ids = req.params.id;
            const { page, size } = req.query;
            const conn = this.models.reportModel(req);
            let combineClients;
            if (client_ids && client_ids !== 'all') {
                combineClients = (0, common_helper_1.separateCombClientToId)(client_ids);
            }
            const client_id = (combineClients === null || combineClients === void 0 ? void 0 : combineClients.client_id) || 'all';
            const combined_id = (combineClients === null || combineClients === void 0 ? void 0 : combineClients.combined_id) || 'all';
            const data = yield conn.clientWisePassengerList(client_id, combined_id, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Client Wise Passenger List');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/ClientWisePassengerList.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Passport No', key: 'passport_passport_no', width: 15 },
                { header: 'Name', key: 'client_name', width: 20 },
                { header: 'Mobile No', key: 'passport_mobile_no', width: 25 },
                { header: 'Date of Birth', key: 'passport_date_of_birth', width: 20 },
                { header: 'Date Of Issue', key: 'passport_date_of_issue', width: 20 },
                { header: 'Date Of Expire', key: 'passport_date_of_expire', width: 20 },
                { header: 'Email', key: 'passport_email', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                worksheet.getColumn('H').width = 30;
                cell.style.alignment = { horizontal: 'center' };
                report.passport_date_of_birth
                    ? (report.passport_date_of_birth = formateDate(report.passport_date_of_birth))
                    : '';
                report.passport_date_of_issue
                    ? (report.passport_date_of_issue = formateDate(report.passport_date_of_issue))
                    : '';
                report.passport_date_of_expire
                    ? (report.passport_date_of_expire = formateDate(report.passport_date_of_expire))
                    : '';
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Client Wise Passenger list report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getGroupWisePassengerListExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { group_id } = req.params;
            const { page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.hajGroupPassengerList(group_id, 1, 200);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Group Wise Passenger List');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/GroupWisePassengerList.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Passport No', key: 'passport_passport_no', width: 15 },
                { header: 'Name', key: 'hajiinfo_name', width: 20 },
                { header: 'Mobile No', key: '', width: 25 },
                { header: 'Tracking No', key: 'hajiinfo_tracking_number', width: 20 },
                { header: 'Date Of Issue', key: 'passport_date_of_issue', width: 20 },
                { header: 'Date Of Expire', key: 'passport_date_of_expire', width: 20 },
                { header: 'Email', key: 'passport_email', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.getColumn('H').width = 40;
                report.passport_date_of_issue
                    ? (report.passport_date_of_issue = formateDate(report.passport_date_of_issue))
                    : '';
                report.passport_date_of_expire
                    ? (report.passport_date_of_expire = formateDate(report.passport_date_of_expire))
                    : '';
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Group Wise Passenger list report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getClientDiscountExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            let separateComb;
            if (client_id && client_id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(client_id);
            }
            const clientId = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.client_id) || 'all';
            const combine_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const data = yield conn.getClientDiscount(clientId, combine_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Client Discount');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/ClientDiscount.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Client', key: 'client_name', width: 15 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'Payment Date', key: 'payment_date', width: 25 },
                { header: 'Discount', key: 'discount_total', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.payment_date = formateDate(report.payment_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Client Discount report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getJourneyDateWiseClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client } = req.body;
            let separeClient;
            if (comb_client !== 'all') {
                separeClient = (0, common_helper_1.separateCombClientToId)(comb_client);
            }
            const client_id = (separeClient === null || separeClient === void 0 ? void 0 : separeClient.client_id) || 'all';
            const combined_id = (separeClient === null || separeClient === void 0 ? void 0 : separeClient.combined_id) || 'all';
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.journeyDateWiseClientReport(client_id, combined_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Journey Date Wise Client');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/journeyDateWiseClient.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice Date', key: 'created_date', width: 20 },
                { header: 'Invoice No', key: 'invoice_no', width: 20 },
                { header: 'Client Name', key: 'client_name', width: 20 },
                { header: 'Pax Name', key: 'pass_name', width: 20 },
                { header: 'Journey Date', key: 'airticket_journey_date', width: 20 },
                { header: 'Return Date', key: 'airticket_return_date', width: 25 },
                { header: 'Airline Name', key: 'airline_name', width: 25 },
                { header: 'Ticket No', key: 'airticket_ticket_no', width: 20 },
                { header: 'PNR', key: 'airticket_pnr', width: 20 },
                { header: 'Route', key: 'airticket_routes', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            //   // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.getColumn('H').width = 40;
                report.created_date = report.created_date
                    ? formateDate(report.created_date)
                    : '26 Jun 2023';
                report.fltdetails_fly_date = formateDate(report.fltdetails_fly_date);
                report.airticket_return_date = formateDate(report.airticket_return_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Journey Date Wise Client report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getAitReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.vendor_id;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            let separateComb;
            if (id && id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(id);
            }
            const vendor_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.vendor_id) || 'all';
            const combined_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const data = yield conn.AITReportClient(vendor_id, combined_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('AIT REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/AitReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Sales Date', key: 'airticket_sales_date', width: 20 },
                { header: 'Vendor', key: 'vendor_name', width: 20 },
                { header: 'Ait Amount', key: 'airticket_ait', width: 25 },
                { header: 'Commission', key: 'airticket_net_commssion', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            //   // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.airticket_sales_date = formateDate(report.airticket_sales_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Ait Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getGDSReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { gds_id } = req.params;
            const { from_date, to_date } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.GDSReport(gds_id, String(from_date), String(to_date));
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('GDS REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/GDSReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'GDS Name', key: 'gds_name', width: 20 },
                { header: 'Ticket No', key: 'airticket_ticket_no', width: 20 },
                { header: 'Route', key: 'airline_iata_code', width: 20 },
                { header: 'PNR', key: 'airticket_pnr', width: 20 },
                { header: 'Fly Date', key: 'airticket_journey_date', width: 20 },
                { header: 'Total Segment', key: 'airticket_segment', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.airticket_journey_date
                    ? (report.airticket_journey_date = formateDate(report.airticket_journey_date))
                    : '';
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`GDS Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getAccountsReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { account_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.accountReport(account_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('ACCOUNTS REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/AccountsReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'actransaction_date', width: 20 },
                { header: 'Account Name', key: 'account_name', width: 20 },
                { header: 'Details', key: 'transection_type', width: 20 },
                { header: 'Tr. Type', key: 'actransaction_type', width: 20 },
                { header: 'Debit', key: 'transection_debit_Amount', width: 20 },
                { header: 'Credit', key: 'transection_credit_Amount', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.getColumn('E').width = 30;
                report.actransaction_date = formateDate(report.actransaction_date);
                if (report.actransaction_type === 'DEBIT') {
                    report.transection_debit_Amount = `${report.actransaction_amount}`;
                }
                else {
                    report.transection_credit_Amount = `${report.actransaction_amount}`;
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Accounts Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getAccountsStatementExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { account_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAccountStatements(+account_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('ACCOUNTS STATEMENTS');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/AccountsSatements.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'acctrxn_created_at', width: 20 },
                { header: 'Vouchar No.', key: 'acctrxn_voucher', width: 20 },
                { header: 'Account Name', key: 'account_name', width: 20 },
                { header: 'Particulars', key: 'trxntype_name', width: 20 },
                { header: 'Debit', key: 'transection_debit_Amount', width: 20 },
                { header: 'Credit', key: 'transection_credit_Amount', width: 20 },
                { header: 'Last Balance', key: 'acctrxn_lbalance', width: 20 },
                { header: 'Note', key: 'acctrxn_note', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.getColumn('E').width = 30;
                report.acctrxn_created_at = formateDate(report.acctrxn_created_at);
                if (report.acctrxn_type === 'DEBIT') {
                    report.transection_debit_Amount = `${report.acctrxn_amount}`;
                }
                else {
                    report.transection_credit_Amount = `${report.acctrxn_amount}`;
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Accounts Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getLoanReportsExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reportModel(req);
            const { authority, loan_type } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const data = yield conn.loanReport(String(from_date), String(to_date), authority, loan_type, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('LOAN REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/LoanReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'loan_create_date', width: 20 },
                { header: 'Loan Authority', key: 'authority_name', width: 20 },
                { header: 'Loan Name', key: 'loan_name', width: 20 },
                { header: 'Method', key: 'method_name', width: 20 },
                { header: 'Amount', key: 'loan_amount', width: 20 },
                { header: 'Interest', key: 'loan_interest_percent', width: 20 },
                { header: 'Receivable', key: 'loan_receivable_amount', width: 20 },
                { header: 'Installment', key: 'loan_installment', width: 20 },
                { header: 'Due', key: 'loan_due_amount', width: 20 },
                { header: 'Note', key: 'loan_note', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.method_name =
                    report.loan_payment_type === 1
                        ? 'Cash'
                        : report.loan_payment_type === 2
                            ? 'Bank'
                            : report.loan_payment_type === 3
                                ? 'Mobile Banking'
                                : 'cheque';
                report.loan_create_date = formateDate(report.loan_create_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Loan Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getOnlineTrxnChargeReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, from_date, to_date } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.getOnlineTrxnCharge(1, this.rowSize, String(from_date), String(to_date));
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('ONLINE TRXN CHARGE REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/OnlineTrxnChargeReports.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'charge_created_date', width: 20 },
                { header: 'From Account', key: 'from_acc_name', width: 20 },
                { header: 'To Account', key: 'to_acc_name', width: 20 },
                { header: 'Charge Amount', key: 'charge_amount', width: 20 },
                { header: 'Note', key: 'charge_note', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.charge_created_date = formateDate(report.charge_created_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Online TRXN Charge Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getInvoicePurches = (req) => __awaiter(this, void 0, void 0, function* () {
            const comb_vendor = req.params.comb_vendor;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            let combineVendor;
            if (comb_vendor && comb_vendor !== 'all') {
                combineVendor = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            }
            const vendor_id = (combineVendor === null || combineVendor === void 0 ? void 0 : combineVendor.vendor_id)
                ? combineVendor.vendor_id
                : 'all';
            const combine_id = (combineVendor === null || combineVendor === void 0 ? void 0 : combineVendor.combined_id)
                ? combineVendor.combined_id
                : 'all';
            const data = yield conn.getInvoicePurches(vendor_id, combine_id, from_date, to_date, 1, this.rowSize);
            const count = yield conn.countInvoicePurchaseDataRow(vendor_id, combine_id, from_date, to_date);
            return { success: true, count, data };
        });
        this.getRefundReportClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.refundReportClient(String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('REFUND REPORT CLIENT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/RefundReportClient.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'Invoice No', key: 'invoice_no', width: 20 },
                { header: 'Vouchar No', key: 'vouchar_no', width: 20 },
                { header: 'Refund Amount', key: 'crefund_amount', width: 20 },
                { header: 'Charge Amount', key: 'ccharge_amount', width: 20 },
                { header: 'Return Amount', key: 'crefund_return_amount', width: 20 },
                { header: 'Date', key: 'create_date', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.create_date = formateDate(report.create_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Refund Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getRefundReportVendorExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.refundReportVendor(String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('REFUND REPORT Vendor');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/RefundReportVendor.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'create_date', width: 20 },
                { header: 'Vendor Name', key: 'vendor_name', width: 20 },
                { header: 'Invoice No', key: 'invoice_no', width: 20 },
                { header: 'Vouchar No', key: 'vouchar_no', width: 20 },
                { header: 'Refund Amount', key: 'vrefund_amount', width: 20 },
                { header: 'Charge Amount', key: 'vcharge_amount', width: 20 },
                { header: 'Return Amount', key: 'vrefund_return_amount', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.create_date = formateDate(report.create_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Refund Report Vendor file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getSummaryDailyReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { day, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const dailySalesAmount = yield conn.salesAmountReport(day, 'daily');
            const dailyExpenseAmount = yield conn.expenseAmountReport(day, 'daily');
            const dailyEmployeeExpenseAmount = yield conn.employeeExpenseReport(day, 'daily');
            const dailyClientRefund = yield conn.clientRefundAmount(day, 'daily');
            const dailyVendorRefund = yield conn.vendorRefundAmount(day, 'daily');
            const dailyAccountCollection = yield conn.accountCollectionReport(day, 'daily');
            const dailyPurches = yield conn.purchaseReport(day, 'daily');
            const data = {
                dailySalesAmount,
                dailyExpenseAmount,
                dailyEmployeeExpenseAmount,
                dailyClientRefund,
                dailyVendorRefund,
                dailyAccountCollection,
                dailyPurches,
            };
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/summaryDailyMonthReport.xlsx`;
            const worksheet = workbook.addWorksheet('Daily Summary Report');
            /**
             * Daily Summary Report
             */
            worksheet.getCell('A1').value = 'Daily Summary Report';
            const grossMergeCell = worksheet.getCell('A1');
            if (grossMergeCell.isMerged) {
                const mergeCellAddress = grossMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('A1:F1');
            worksheet.getCell('A1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            worksheet.getColumn('A').width = 20;
            const columns = ['B', 'C', 'D', 'E', 'F'];
            columns.forEach((column) => {
                worksheet.getColumn(column).width = 25;
            });
            const dailySummaryColumnHeader = [
                { callName: 'A2', value: 'Total sales' },
                { callName: 'B2', value: 'Total purchase' },
                { callName: 'C2', value: 'Total expense' },
                { callName: 'D2', value: 'Total refund from client' },
                { callName: 'E2', value: 'Total refund from vendor' },
                { callName: 'F2', value: 'Total account collection' },
            ];
            dailySummaryColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const dailySummaryData = [
                [
                    data.dailySalesAmount[0].sales_total,
                    data.dailyPurches[0].total_cost,
                    data.dailyExpenseAmount[0].expense_total,
                    data.dailyClientRefund[0].client_refund_total,
                    data.dailyVendorRefund[0].vendor_refund_total,
                    data.dailyAccountCollection[0].account_collection,
                ],
            ];
            dailySummaryData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 1).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            /**
             * Closing Balance
             */
            worksheet.getCell('H1').value = 'Closing Balance';
            const closingMergeCell = worksheet.getCell('H1');
            if (closingMergeCell.isMerged) {
                const mergeCellAddress = closingMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('H1:J1');
            worksheet.getCell('H1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            worksheet.getColumn('H').width = 20;
            const balanceColumns = ['I', 'J'];
            balanceColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const balanceColumnHeader = [
                { callName: 'H2', value: 'SL' },
                { callName: 'I2', value: 'Name' },
                { callName: 'J2', value: 'Amount' },
            ];
            balanceColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Daily Summary Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getSummaryMonthlyReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { month, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const monthlySalesAmount = yield conn.salesAmountReport(month, 'monthly');
            const monthlyExpenseAmount = yield conn.expenseAmountReport(month, 'monthly');
            const employeeExpenseAmount = yield conn.employeeExpenseReport(month, 'monthly');
            const monthlyClientRefund = yield conn.clientRefundAmount(month, 'monthly');
            const monthlyVendorRefund = yield conn.vendorRefundAmount(month, 'monthly');
            const monthlyAccountCollection = yield conn.accountCollectionReport(month, 'monthly');
            const monthlyPurches = yield conn.purchaseReport(month, 'monthly');
            const data = {
                monthlySalesAmount,
                monthlyExpenseAmount,
                employeeExpenseAmount,
                monthlyClientRefund,
                monthlyVendorRefund,
                monthlyAccountCollection,
                monthlyPurches,
            };
            const workbook = new exceljs_1.default.Workbook();
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/summaryMonthlyReport.xlsx`;
            const worksheet = workbook.addWorksheet('Monthly Summary Report');
            /**
             * Monthly Summary Report
             */
            worksheet.getCell('A1').value = 'Closing Balance';
            const closingMergeCell = worksheet.getCell('A1');
            if (closingMergeCell.isMerged) {
                const mergeCellAddress = closingMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('A1:C1');
            worksheet.getCell('A1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            worksheet.getColumn('A').width = 20;
            const columns = ['B', 'C'];
            columns.forEach((column) => {
                worksheet.getColumn(column).width = 25;
            });
            const monthlySummaryColumnHeader = [
                { callName: 'A2', value: 'SL.' },
                { callName: 'B2', value: 'Name' },
                { callName: 'C2', value: 'Amount' },
            ];
            monthlySummaryColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            worksheet.getCell('E1').value = 'Opening Balance';
            const summaryMergeCell = worksheet.getCell('E1');
            if (summaryMergeCell.isMerged) {
                const mergeCellAddress = summaryMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('E1:F1');
            worksheet.getCell('E1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            const summaryColumns = ['E', 'F'];
            summaryColumns.forEach((column) => {
                worksheet.getColumn(column).width = 20;
            });
            const balanceColumnHeader = [
                { callName: 'E2', value: 'opening balance' },
                { callName: 'F2', value: 'Amount' },
            ];
            balanceColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            /**
             * Total
             */
            worksheet.getCell('H1').value = 'Total';
            const totalMergeCell = worksheet.getCell('H1');
            if (totalMergeCell.isMerged) {
                const mergeCellAddress = totalMergeCell.master.address;
                worksheet.unMergeCells(mergeCellAddress);
            }
            worksheet.mergeCells('H1:M1');
            worksheet.getCell('H1').style = {
                font: { color: { argb: 'FFFFFF' }, bold: true },
                alignment: { horizontal: 'center', vertical: 'middle' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '18b4e9' },
                },
            };
            const TotalColumns = ['H', 'I', 'J', 'K', 'L', 'M', 'N'];
            TotalColumns.forEach((column) => {
                worksheet.getColumn(column).width = 23;
            });
            const TotalColumnHeader = [
                { callName: 'H2', value: 'Total opening balance' },
                { callName: 'I2', value: 'Total sales' },
                { callName: 'J2', value: 'Total purchase' },
                { callName: 'K2', value: 'Total expense' },
                { callName: 'L2', value: 'Total client refund' },
                { callName: 'M2', value: 'Total vendor refund' },
                { callName: 'N2', value: 'Total account collection' },
            ];
            TotalColumnHeader.forEach((head) => {
                worksheet.getCell(head.callName).value = head.value;
                worksheet.getCell(head.callName).style = {
                    font: { bold: true },
                };
            });
            const MonthlySummaryData = [
                [
                    data.monthlySalesAmount[0].sales_total,
                    data.monthlyPurches[0].total_cost,
                    data.monthlyExpenseAmount[0].expense_total,
                    data.monthlyClientRefund[0].client_refund_total,
                    data.monthlyVendorRefund[0].vendor_refund_total,
                    data.monthlyAccountCollection[0].account_collection,
                ],
            ];
            MonthlySummaryData.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    worksheet.getCell(rowIndex + 3, columnIndex + 8).value = value;
                    worksheet.getCell(rowIndex + 3, columnIndex + 8).style = {
                        alignment: { horizontal: 'left' },
                    };
                });
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Monthly Summary Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * COUNTRY WISE REPORT
         */
        this.getCountryWiseReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { country_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.countryWiseReport(country_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('COUNTRY WISE REPORT');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/countryWiseReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Invoice', key: 'invoice_no', width: 20 },
                { header: 'Name', key: 'passport_name', width: 20 },
                { header: 'Passport No', key: 'passport_passport_no', width: 20 },
                { header: 'Date of Birth', key: 'passport_date_of_birth', width: 20 },
                { header: 'Country', key: 'country_name', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.passport_date_of_birth = report.passport_date_of_birth
                    ? formateDate(report.passport_date_of_birth)
                    : '';
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`country wise report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * Pre Registration Report
         */
        this.getPreRegistrationReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _k;
            const { possible_year, page, size } = req.body;
            const conn = this.models.reportModel(req);
            const data = yield conn.preRegistrationList(possible_year, 1, 200);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Pre Registration Report');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/preRegistrationReport.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Client Name', key: 'client_name', width: 20 },
                { header: 'Total Haj', key: 'total_haj', width: 20 },
                { header: 'Haji NID', key: 'hajiinfo_nid', width: 20 },
                { header: 'Haji Name', key: 'hajiinfo_name', width: 20 },
                { header: 'Tracking ID', key: 'hajiinfo_tracking_number', width: 20 },
                { header: 'Vouchar No', key: 'haji_info_vouchar_no', width: 20 },
                { header: 'Group', key: 'group_name', width: 20 },
            ];
            // Loop through data and populate rows
            (_k = data === null || data === void 0 ? void 0 : data.data) === null || _k === void 0 ? void 0 : _k.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Pre Registration Report report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * User Login History
         */
        this.getUserLoginHistoryExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.userLoginHistory(user_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('User Login History');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/userLoginHistory.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'User Full Name', key: 'user_full_name', width: 20 },
                { header: 'User Name', key: 'login_user', width: 20 },
                { header: 'User Role', key: 'user_role', width: 20 },
                { header: 'Login Time', key: 'login_date_and_time', width: 20 },
                { header: 'Login IP', key: 'login_ip_address', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.login_date_and_time = formateDate(report.login_date_and_time);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`User Login History Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * void  list
         */
        this.getVoidListExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const { data } = yield conn.voidInvoices(from_date, to_date, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Void List');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/voidList.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Create Date', key: 'invoice_create_date', width: 20 },
                { header: 'Invoice Name', key: 'invcat_title', width: 20 },
                { header: 'Client Name', key: 'client_name', width: 20 },
                { header: 'Invoice No', key: 'invoice_no', width: 20 },
                { header: 'Net Total', key: 'invoice_net_total', width: 20 },
                { header: 'Type', key: 'invoices_trash_type', width: 20 },
                { header: 'Void Charge', key: 'invoice_void_charge', width: 20 },
                { header: 'Created By', key: 'user_name', width: 20 },
            ];
            worksheet.getColumn('C').width = 30;
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.invoice_create_date = formateDate(report.invoice_create_date);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Void List Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * AuditTrail
         */
        this.getAuditTrailExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _l;
            const { user_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getAuditHistory(user_id, String(from_date), String(to_date), 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Audit Trail');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/AuditTrail.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Audit Id', key: 'audit_id', width: 20 },
                { header: 'Action', key: 'audit_action', width: 20 },
                { header: 'Descriptions', key: 'audit_content', width: 20 },
                { header: 'Date', key: 'audit_action_date_time', width: 20 },
            ];
            worksheet.getColumn('D').width = 35;
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            (_l = data === null || data === void 0 ? void 0 : data.data) === null || _l === void 0 ? void 0 : _l.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.audit_action_date_time = formateDate(report.audit_action_date_time);
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Audit Trail Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * account transaction history
         */
        this.getAccountTransactionHistoryExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, trash, page, size } = req.query;
            let account_id = req.params.account_id;
            account_id = account_id === 'all' ? undefined : account_id;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getTransHistory(account_id, from_date, to_date, 1, this.rowSize);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Account Transaction History');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/accountTransactionHistory.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'actransaction_created_date', width: 20 },
                { header: 'Transaction Type', key: 'trxntype_name', width: 20 },
                { header: 'Payment Method', key: 'acctype_name', width: 20 },
                { header: 'Details', key: 'account_name', width: 20 },
                { header: 'Debit', key: 'debit_amount', width: 20 },
                { header: 'Credit', key: 'credit_amount', width: 20 },
                { header: 'Amount', key: 'actransaction_amount', width: 20 },
                { header: 'Added By', key: 'actransaction_created_by', width: 20 },
            ];
            worksheet.getColumn('C').width = 30;
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.actransaction_created_date = formateDate(report.actransaction_created_date);
                report.debit_amount =
                    report.actransaction_type === 'DEBIT' ? report.actransaction_amount : 0;
                report.credit_amount =
                    report.actransaction_type === 'CREDIT'
                        ? report.actransaction_amount
                        : 0;
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Account Transaction History Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * Client And Combined Client
         */
        this.getAllClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search } = req.query;
            const conn = this.models.clientModel(req);
            const data = yield conn.getAllClients(1, 200, search);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('All Clients');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/ClientAll.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Name', key: 'client_name', width: 20 },
                { header: 'Email', key: 'email', width: 20 },
                { header: 'Mobile', key: 'mobile', width: 20 },
                { header: 'Client Type', key: '', width: 20 },
                { header: 'Present Due/Advance', key: 'due_adcvance', width: 20 },
                { header: 'Created By', key: 'client_created_by_name', width: 20 },
                { header: 'Status', key: 'client_activity_status', width: 20 },
            ];
            const formateDate = (dateInput) => {
                const date = new Date(dateInput);
                const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                return formattedDate;
            };
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.actransaction_created_date = formateDate(report.actransaction_created_date);
                report.client_activity_status =
                    report.client_activity_status !== 0 ? 'Active' : 'InActive';
                const balance = parseFloat(report.client_last_balance);
                const formattedBalance = balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                if (balance < 0) {
                    report.due_adcvance = `Due ${formattedBalance}`;
                }
                else if (balance > 0) {
                    report.due_adcvance = `Advance ${formattedBalance}`;
                }
                else {
                    report.due_adcvance = formattedBalance;
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Account Transaction History Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        this.getAllCombinedClientExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search } = req.query;
            const conn = this.models.combineClientModel(req);
            const data = yield conn.getAllCombines(Number(trash) || 0, 1, this.rowSize, search);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('All Combined Clients');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/CombinedClientAll.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Name', key: 'combine_name', width: 20 },
                { header: 'Created By', key: 'created_by', width: 20 },
                { header: 'Email', key: 'combine_email', width: 20 },
                { header: 'Contact', key: 'combine_mobile', width: 20 },
                { header: 'Present Due/Advance', key: 'due_adcvance', width: 20 },
                { header: 'Status', key: 'combine_client_status', width: 20 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.combine_client_status =
                    report.combine_client_status !== 0 ? 'Active' : 'InActive';
                const balance = parseFloat(report.combine_lastbalance_amount);
                const formattedBalance = balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                if (balance < 0) {
                    report.due_adcvance = `Due ${formattedBalance}`;
                }
                else if (balance > 0) {
                    report.due_adcvance = `Advance ${formattedBalance}`;
                }
                else {
                    report.due_adcvance = formattedBalance;
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Combined Client All Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        /**
         * vendor
         */
        this.getVendorAllExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { size, page, search } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getAllVendors(1, 200, search);
            const vendors = [];
            for (const iterator of data.data) {
                const commission_rate = yield conn.getVendorCommission(iterator.vendor_id);
                vendors.push(Object.assign(Object.assign({}, iterator), commission_rate));
            }
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('All Vendors');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/vendorAll.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Name', key: 'vendor_name', width: 20 },
                { header: 'Email', key: 'vendor_email', width: 20 },
                { header: 'Mobile', key: 'vendor_mobile', width: 20 },
                { header: 'Commission %', key: 'vproduct_commission_rate', width: 20 },
                { header: 'Fixed Balance', key: 'vendor_fixed_advance', width: 20 },
                { header: 'Present Balance', key: 'lbalance_amount', width: 20 },
                { header: 'Status', key: 'vendor_activity_status', width: 20 },
            ];
            // Loop through data and populate rows
            vendors.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.vendor_activity_status =
                    report.vendor_activity_status !== 0 ? 'Active' : 'InActive';
                const balance = parseFloat(report.lbalance_amount);
                const formattedBalance = balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                if (balance < 0) {
                    report.lbalance_amount = `Due ${formattedBalance}`;
                }
                else if (balance > 0) {
                    report.lbalance_amount = `Advance ${formattedBalance}`;
                }
                else {
                    report.lbalance_amount = `Balanced : ${formattedBalance}`;
                }
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Vendor All Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
    }
}
exports.default = ReportExcelServices;
//# sourceMappingURL=reportExcel.services.js.map