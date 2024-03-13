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
class AirTicketExcelReport extends abstract_services_1.default {
    constructor() {
        super(...arguments);
        this.rowSize = 500;
        this.airTicketTotalReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, client } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getAirTicketTotalReport(from_date, to_date, 1, this.rowSize, client);
            const reports = data.data;
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Air ticket total summary');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/air_ticket_total_summary.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Date', key: 'invoice_create_date', width: 7 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'Client', key: 'client_name', width: 20 },
                { header: 'PNR', key: 'pnr', width: 20 },
                { header: 'Gross Fare', key: 'total_gross_fare', width: 20 },
                { header: 'Commission', key: 'commission', width: 20 },
                { header: 'AIT', key: 'ait', width: 20 },
                { header: 'Gross Profit/Loss', key: 'gross_profit', width: 20 },
                { header: 'Purchase', key: 'total_purchase', width: 20 },
                { header: 'Ticket Discount', key: 'discount', width: 30 },
                { header: 'Overall Discount', key: 'overall_discount', width: 30 },
                { header: 'Client Total', key: 'client_amount', width: 30 },
                { header: 'Received Amount', key: 'receive_amount', width: 20 },
                { header: 'Due Amount', key: 'receive_amount', width: 20 },
                { header: 'Due Amount', key: 'due_amount', width: 20 },
                { header: 'Ticket Nos', key: 'tickets', width: 20 },
            ];
            // Loop through data and populate rows
            reports.forEach((report, index) => {
                report.serial = index + 1;
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                report.due_amount =
                    Number(report.client_amount) - Number(report.receive_amount);
                report.commission = Number(report.commission).toFixed(2);
                report.total_gross_fare = Number(report.total_gross_fare).toFixed(2);
                report.total_purchase = Number(report.total_purchase).toFixed(2);
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
                        throw new Error(`Error is: ${err}`);
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
        this.airTicketDetailsReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, client } = req.query;
            const conn = this.models.reportModel(req);
            const reports = yield conn.airTicketDetailsReport(from_date, to_date, 1, this.rowSize, client);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Air ticket details');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/air_ticket_details.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Sales Date', key: 'sales_date', width: 20 },
                { header: 'Invoice No.', key: 'invoice_no', width: 20 },
                { header: 'PNR', key: 'airticket_pnr', width: 20 },
                { header: 'Ticket No.', key: 'airticket_ticket_no', width: 20 },
                { header: 'Name of Traveler', key: 'passport_name', width: 20 },
                { header: 'Departure Date', key: 'airticket_journey_date', width: 20 },
                { header: 'Route', key: 'airticket_routes', width: 20 },
                { header: 'Fare', key: 'airticket_client_price', width: 20 },
                { header: 'Issued By', key: 'issued_by', width: 20 },
                { header: 'Created At', key: 'create_date', width: 20 },
            ];
            // Loop through data and populate rows
            reports.forEach((report, index) => {
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
                        throw new Error(`Error is: ${err}`);
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
        this.customAirTicketReportExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { from_date, to_date } = req.query;
            const fieldKays = body.fields.map((item) => item.key);
            const conn = this.models.invoiceAirticketModel(req);
            const data = yield conn.selectCustomAirTicketReport(fieldKays, 1, this.rowSize, from_date, to_date);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Air ticket details');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/custom_airticket_details.xlsx`;
            worksheet.columns = body.fields.map((item) => {
                return { header: item.level, key: item.key, width: 20 };
            });
            // Loop through data and populate rows
            data.forEach((report, index) => {
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
                        throw new Error(`Error is: ${err}`);
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
exports.default = AirTicketExcelReport;
//# sourceMappingURL=airTicketReport.excels.js.map