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
const moment_1 = __importDefault(require("moment"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
const sendEmail_helper_1 = __importDefault(require("../../../../common/helpers/sendEmail.helper"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
const addClient_services_1 = __importDefault(require("./narrowServices/addClient.services"));
const editClient_services_1 = __importDefault(require("./narrowServices/editClient.services"));
const incentiveIncomeClient_services_1 = __importDefault(require("./narrowServices/incentiveIncomeClient.services"));
class ClientServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllClientAndCombined = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.clientModel(req);
            const data = yield conn.getAllClientsAndCombined(search);
            return { success: true, data };
        });
        this.checkCreditLimit = (req) => __awaiter(this, void 0, void 0, function* () {
            return { success: true, data: 1 };
            const { amount, combClient } = req.body;
            const clientCom = combClient.split('-');
            const client_type = clientCom[0].toUpperCase();
            const client_id = Number(clientCom[1]);
            const common_conn = this.models.CommonInvoiceModel(req);
            const data = yield common_conn.checkCreditLimit(client_type, client_id, amount);
            return { success: true, data };
        });
        this.updateClientStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.clientModel(req);
            const { client_id } = req.params;
            const { status, created_by } = req.body;
            yield conn.updateClientStatus(client_id, status);
            const message = `Client status updated into ${status}`;
            yield this.insertAudit(req, 'update', message, created_by, 'ACCOUNTS');
            return { success: true, message: 'Client activate status changed' };
        });
        this.getAllClients = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search } = req.query;
            const conn = this.models.clientModel(req);
            const clients = yield conn.getAllClients(Number(page) || 1, Number(size) || 20, search);
            const count = yield conn.countClientDataRow(search);
            return { success: true, count, data: clients };
        });
        this.viewAllClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.clientModel(req);
            const data = yield conn.viewAllClient(search);
            return { success: true, data };
        });
        this.getSingleClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.clientModel(req);
            const combined_conn = this.models.combineClientModel(req);
            let data;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(req.params.id);
            if (client_id) {
                data = yield conn.getSingleClient(client_id);
            }
            else if (combined_id) {
                data = yield combined_conn.getSingleCombinedClient(combined_id);
            }
            else {
                throw new customError_1.default('Please provide a valid id', 400, 'Bad request');
            }
            return { success: true, data };
        });
        this.deleteClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { client_updated_by } = req.body;
            const clientId = Number(client_id);
            if (!clientId) {
                throw new customError_1.default('Please provide a valid Id to delete a client', 400, 'Invalid client Id');
            }
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.clientModel(req, trx);
                const clientTrxnCount = yield conn.getTraxn(clientId);
                if (clientTrxnCount === 0) {
                    yield conn.deleteClient(clientId, client_updated_by);
                }
                else {
                    throw new customError_1.default('Account has a valid transaction', 400, 'Bad Request');
                }
                const message = `Client has been deleted`;
                yield this.insertAudit(req, 'delete', message, client_updated_by, 'ACCOUNTS');
                return { success: true, message: 'Client Deleted Successfully' };
            }));
        });
        this.generateExcelReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.clientModel(req);
            const clients = yield conn.getClientExcelData();
            const clientsData = clients.map((item) => {
                const data = item;
                const moibleData = JSON.parse(item.mobile).map((itemm) => `(${itemm[0]})` + '-' + itemm[1]);
                data.mobile = moibleData[0];
                data.client_activity_status =
                    item.client_activity_status === 1 ? 'Active' : 'Inactive';
                return data;
            });
            return { success: true, data: clientsData };
        });
        this.clientAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const PClient = req.params.client_id;
            const { page, size } = req.query;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(PClient);
            const conn = this.models.clientModel(req);
            const data = yield conn.clientAllInvoices(invoice_client_id, invoice_combined_id, Number(page), Number(size));
            return Object.assign({ success: true }, data);
        });
        this.clientAllMoneyReceipts = (req) => __awaiter(this, void 0, void 0, function* () {
            const PClient = req.params.client_id;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(PClient);
            const conn = this.models.clientModel(req);
            const data = yield conn.clientMoneyReceipts(invoice_client_id);
            return { success: true, data };
        });
        this.clientAllQuotations = (req) => __awaiter(this, void 0, void 0, function* () {
            const PClient = req.params.client_id;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(PClient);
            const conn = this.models.clientModel(req);
            const data = yield conn.clientAllQuotations(invoice_client_id);
            return { success: true, data };
        });
        this.clientAllRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const PClient = req.params.client_id;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(PClient);
            const conn = this.models.clientModel(req);
            const clientAirticketRefund = yield conn.clientAirticketRefund(invoice_client_id);
            const clientOtherRefund = yield conn.clientOtherRefund(invoice_client_id);
            const clientTourRefund = yield conn.clientTourRefund(invoice_client_id);
            return {
                success: true,
                data: { clientAirticketRefund, clientOtherRefund, clientTourRefund },
            };
        });
        this.clientAllPassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const PClient = req.params.client_id;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(PClient);
            const conn = this.models.clientModel(req);
            const data = yield conn.clientAllPassport(invoice_client_id);
            return { success: true, data };
        });
        this.getClLastBalanceById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const conn = this.models.clientModel(req);
            const data = yield conn.getClLastBalanceById(client_id);
            return { success: true, data };
        });
        this.getCombClientLBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client } = req.params;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            const conn = this.models.clientModel(req);
            const combine_conn = this.models.combineClientModel(req);
            if (client_id) {
                const data = yield conn.getClLastBalanceById(client_id);
                return { success: true, data };
            }
            else {
                const data = yield combine_conn.getCombinedLastBalance(combined_id);
                return { success: true, data };
            }
        });
        this.getClientCombinedIncentiveIncome = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.clientModel(req);
            const data = yield conn.getClientCombinedIncentiveIncome(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getSingleClientCombinedIncentiveIncome = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const conn = this.models.clientModel(req);
            const data = yield conn.getSingleClientCombinedIncentiveIncome(incentive_id);
            return { success: true, data };
        });
        // SEND MAIL
        this.sendEmailToClinet = (req) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.invoiceAirticketModel(req);
            const invoice_id = 1;
            const agency_name = 'Trabill';
            const data = yield common_conn.getViewInvoiceInfo(invoice_id);
            const ticketInfo = yield conn.getAirticketItems(invoice_id);
            const emailBody = `<div style="font-family: Arial, sans-serif;">
    <div style="padding: 3px;">
        <div style="display: block;margin-bottom: 20px;">
            <h2 style="margin: 0; text-align: center; border-bottom: 2px dotted #ddd;">Invoice</h2>
        </div>
        <div>
          <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 500;">Invoice Date :
              <span>${(0, moment_1.default)(new Date(data === null || data === void 0 ? void 0 : data.invoice_sales_date)).format('DD-MM-YYYY')}</span></p>
          <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 500;">Invoice Number :
              <span>${data === null || data === void 0 ? void 0 : data.invoice_no}</span>
          </p>
        </div>
        ${ticketInfo[0].flight_details &&
                `<div style="margin-top: 10px;">
            <h4 style="margin: 0;padding: 0;">FLIGHT/ROUTE DETAILS</h4>
            <table style="width: 100%;border-collapse: collapse; margin-top: 5px;">
                <thead style="background-color: #e3e9eb;color:#485452;">
                    <tr>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">From</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">To</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Airline</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Departure Time</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Arrival Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            ${'Dhaka'}</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            ${'Cox,bazar'}</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            ${'Biman Bangladesh'}</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            ${'12:00 AM'}</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            ${'12:30 AM'}</td>
                    </tr>
                </tbody>
            </table>
        </div>`}
        <br />
        <div style="margin-top: 10px;">
            <h4 style="margin: 0;padding: 0;">PAX DETAILS</h4>
            <table style="width: 100%;border-collapse: collapse; margin-top: 5px;">
                <thead style="background-color: #e3e9eb;color:#485452;">
                    <tr>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Passport No</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">NID</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Mobile</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Issue Date</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Expire Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">234234</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">9412</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                            +88-01774199966
                        </td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">8-06-2023
                        </td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">8-06-2023
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <div style="margin-top: 10px;">
            <h4 style="margin: 2px;">BILLING INFO</h4>
            <table style="width: 100%;border-collapse: collapse;">
                <thead style="background-color: #e3e9eb;color:#485452;">
                    <tr>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Pax Name</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Pax Type</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Route</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Ticket No</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">PNR</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Class</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Journey Date</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Return Date</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Unit Price</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Discount</th>
                        <th style="padding: 5px 10px;text-align: left;width: auto;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">My New</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">Adult</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;"></td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">001 5641561
                        </td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;"></td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;"></td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">N/A</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">N/A</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">56465</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">0</td>
                        <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">56465</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <div style="border: 1px solid #ddd; width: 200px; margin-left: auto; margin-top: 20px; border-radius: 5px;">
            <div style="display: flex; ">
                <p
                    style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                    Sub Total</p>
                <p style="padding: 2px 10px; width: 50%; margin: 0px;">10200</p>
            </div>
            <div style="display: flex; border-top: 1px solid #ddd; ">
                <p
                    style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                    Net Total</p>
                <p style="padding: 2px 10px; width: 50%; margin: 0px;">10200</p>
            </div>
            <div style="display: flex; border-top: 1px solid #ddd; ">
                <p
                    style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                    Due</p>
                <p style="padding: 2px 10px; width: 50%; margin: 0px;">10200</p>
            </div>
        </div>
    </div>
</div>`;
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            // Set the HTML content on the page
            yield page.setContent(emailBody);
            // Generate the PDF
            const pdfBuffer = yield page.pdf({
                format: 'Letter',
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px',
                },
            });
            const message = {
                to: req.body.email,
                subject: 'Your Invoice',
                text: 'Plain text body',
                html: emailBody,
            };
            const mail = yield sendEmail_helper_1.default.sendEmail(message);
            return {
                success: true,
                message: 'Message send to client successfuly',
                messsageID: mail.messageId,
            };
        });
        //=========================================================//
        //====================narrowed services====================//
        //=========================================================//
        // Create a client
        this.addClient = new addClient_services_1.default().addClient;
        // Edit client
        this.editClient = new editClient_services_1.default().editClient;
        this.addIncentiveIncomeClient = new incentiveIncomeClient_services_1.default()
            .addIncentiveIncomeClient;
        this.editIncentiveIncomeCombClient = new incentiveIncomeClient_services_1.default()
            .editIncentiveIncomeCombClient;
        this.deleteIncentiveIncomeCombClient = new incentiveIncomeClient_services_1.default()
            .deleteIncentiveIncomeCombClient;
    }
}
exports.default = ClientServices;
//# sourceMappingURL=client.services.js.map