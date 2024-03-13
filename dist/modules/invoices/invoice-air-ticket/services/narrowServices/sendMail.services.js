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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const sendEmail_helper_1 = __importDefault(require("../../../../../common/helpers/sendEmail.helper"));
const customError_1 = __importDefault(require("../../../../../common/utils/errors/customError"));
const moment_1 = __importDefault(require("moment"));
class SendMail extends abstract_services_1.default {
    constructor() {
        super();
        this.sendEmail = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                // start querys
                const { client_id, combined_id, invoice_org_agency, invoice_no, invoice_sales_date, } = yield conn.getInvoiceClientInfo(invoice_id);
                const { org_name, org_logo, org_mobile_number, org_owner_email, org_address1, } = yield conn.getAgencyInfo(invoice_org_agency);
                const pax_details = yield common_conn.getInvoiceAirTicketPaxDetails(invoice_id);
                const data = yield common_conn.getViewInvoiceInfo(invoice_id);
                const flights = yield conn.getAirTicketFlights(invoice_id);
                const airticket_information = yield conn.getViewAirticketItems(invoice_id);
                const emailBody = `
      <div style="font-family: Arial, sans-serif;">
          <div style="display: flex; flex-direction: column; align-content: space-between">
              <div>
                  <div style="padding: 3px;">
                      <div style="display: block; margin-bottom: 20px;">
                          <h2 style="margin: 0; text-align: center; border-bottom: 2px dotted #ddd;">Invoice</h2>
                      </div>
                      <div
                          style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
                          <div>
                              <img style="height: 50px;"
                                  src="${org_logo}"
                                  alt="">
                              <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 600;">Invoice Date :
                                  <span style="font-weight: 500;">${(0, moment_1.default)(new Date(invoice_sales_date)).format('DD-MM-YYYY')}</span>
                              </p>
                              <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 600;">Invoice No :
                                  <span style="font-weight: 500;">${invoice_no}</span>
                              </p>
                          </div>
                          <div style="min-width: 200px;">
                              
                              <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 600;">Name :
                                  <span style="font-weight: 500;">${org_name}</span>
                              </p>
                              <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 600;">Mobile :
                                  <span style="font-weight: 500;">${org_mobile_number}</span>
                              </p>
                              <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 600;">Address :
                                  <span style="font-weight: 500;">${org_address1}</span>
                              </p>
                          </div>
                      </div>
                  </div>
                  <br />
                  <br />
                  ${flights.length
                    ? `
                          <div style="margin-top: 10px;">
                            <h4 style="margin: 0; padding: 0;">FLIGHT/ROUTE DETAILS</h4>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                              <thead style="color: #485452;">
                                <tr>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">SL.</th>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">From</th>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">To</th>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">Airline</th>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">Departure Time</th>
                                  <th style="padding: 5px 10px; text-align: left; width: auto; background-color: #e3e9eb; border: 1px solid #ddd;">Arrival Time</th>
                                </tr>
                              </thead>
                              ${flights
                        .map((f_info, index) => `
                                <tbody>
                                  <tr>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${index + 1}</td>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${f_info === null || f_info === void 0 ? void 0 : f_info.flight_from}</td>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${f_info === null || f_info === void 0 ? void 0 : f_info.flight_to}</td>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${f_info === null || f_info === void 0 ? void 0 : f_info.airline_name}</td>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${(f_info === null || f_info === void 0 ? void 0 : f_info.fltdetails_departure_time) || ''}</td>
                                    <td style="padding: 5px; text-align: center; width: auto; border: 1px solid #ddd;">${(f_info === null || f_info === void 0 ? void 0 : f_info.fltdetails_arrival_time) || ''}</td>
                                  </tr>
                                </tbody>
                              `)
                        .join('')}
                            </table>
                          </div>
                          <br>
                        `
                    : ''}
                  ${pax_details.length
                    ? `<div style="margin-top: 10px;">
                      <h4 style="margin: 0;padding: 0;">PAX DETAILS</h4>
                      <table style="width: 100%;border-collapse: collapse; margin-top: 5px;">
                          <thead style="color:#485452;">
                              <tr>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      SL.</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Pax Name</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Pax Type</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Passport No</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      NID</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Mobile</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Issue Date</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Expire Date</th>
                              </tr>
                          </thead>
                          ${pax_details
                        .map((pax_info, index) => `
                              <tbody>
                                  <tr>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${index + 1}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_name) || ''}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_person_type) || ''}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_passport_no) || ''}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                                          ${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_nid_no) || ''}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                                          ${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_mobile_no) || ''}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                                          ${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_date_of_issue)
                        ? (0, moment_1.default)(new Date(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_date_of_issue)).format('DD-MM-YYYY')
                        : 'N/A'}
                                      </td>
                                      <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">
                                          ${(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_date_of_expire)
                        ? (0, moment_1.default)(new Date(pax_info === null || pax_info === void 0 ? void 0 : pax_info.passport_date_of_expire)).format('DD-MM-YYYY')
                        : 'N/A'}
                                      </td>
                                  </tr>
                              </tbody>
                            `)
                        .join('')}
                          
                      </table>
                  </div>
                  <br>`
                    : ''}
                  ${airticket_information.length
                    ? `
                  <div style="margin-top: 10px;">
                      <h4 style="margin: 2px;">BILLING INFO</h4>
                      <table style="width: 100%;border-collapse: collapse;">
                          <thead style="color:#485452;">
                              <tr>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      SL.</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Ticket No</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      PNR</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Class</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Route</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Journey Date</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Return Date</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Unit Price</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Discount</th>
                                  <th
                                      style="padding: 5px 10px;text-align: left;width: auto;background-color: #e3e9eb; border: 1px solid #ddd;">
                                      Total</th>                                
                              </tr>
                          </thead>
  
                          ${airticket_information
                        .map((ait_billing, index) => `
                          <tbody>
                              <tr>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${index + 1}
                                  </td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_ticket_no) || ''}
                                  </td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_pnr) || ''}
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_classes) || ''}
                                  </td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_routes) || ''}</td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_journey_date)
                        ? (0, moment_1.default)(new Date(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_journey_date)).format('DD-MM-YYYY')
                        : 'N/A'}
                                  </td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_return_date)
                        ? (0, moment_1.default)(new Date(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_return_date)).format('DD-MM-YYYY')
                        : 'N/A'}</td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_gross_fare) || 0}</td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_discount_total) || 0}
                                  </td>
                                  <td style="padding: 5px;text-align: center;width: auto; border: 1px solid #ddd;">${(ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_gross_fare) -
                        (ait_billing === null || ait_billing === void 0 ? void 0 : ait_billing.airticket_discount_total) || 0}
                                  </td>
                              </tr>
                          </tbody>
                        `)
                        .join('')}
                      </table>
                  </div>
                  `
                    : ''}
                  <div
                      style="border: 1px solid #ddd; width: 400px; margin-left: auto; margin-top: 20px; border-radius: 5px; display: grid; grid-gap: 2px;">
                      <div style="display: flex; ">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Sub Total</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_sub_total) || 0}</p>
                      </div>
                      <div style="display: flex;  border-top: 1px solid #ddd;">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Service Charge</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_service_charge) || 0}</p>
                      </div>
                      <div style="display: flex;  border-top: 1px solid #ddd;">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Discount</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_discount) || 0}</p>
                      </div>
                      <div style="display: flex;  border-top: 1px solid #ddd;">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Vat/Tax</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_vat) || 0}</p>
                      </div>
                      <div style="display: flex; border-top: 1px solid #ddd; ">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Net Total</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_net_total) || 0}</p>
                      </div>
                      <div style="display: flex; border-top: 1px solid #ddd; ">
                          <p
                              style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                              Paid</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_pay) || 0}</p>
                      </div>
                      <div style="display: flex; border-top: 1px solid #ddd; ">
                        <p
                        style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                        Inv Due</p>
                        <p style="padding: 2px 10px; width: 50%; margin: 0px;">${(data === null || data === void 0 ? void 0 : data.invoice_due) || 0}</p>
                      </div>
                      ${(data === null || data === void 0 ? void 0 : data.invoice_show_prev_due)
                    ? `
                        <div style="display: flex; border-top: 1px solid #ddd; ">
                          <p
                          style="padding: 5px 10px;margin: 0px; border-right: 1px solid #ddd; font-size: 14px; width: 50%; color: #485452; font-weight: 600; background-color: #e3e9eb;">
                          Client Prev Due</p>
                          <p style="padding: 2px 10px; width: 50%; margin: 0px;">${''}</p>
                        </div>
                      `
                    : ''}
                  </div>
              </div>
              <div
                  style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0px; margin-top: 50px;">
                  <p style="border-top: 2px dashed #ddd; font-size: 16px; color: #222222;">Customer Signature</p>
                  <p style="border-top: 2px dashed #ddd; font-size: 16px; color: #222222;">Authorize Signature</p>
              </div>
          </div>
      </div>
      `;
                const browser = yield puppeteer_1.default.launch({
                    headless: 'new',
                });
                const page = yield browser.newPage();
                yield page.setContent(emailBody);
                const pdfBuffer = yield page.pdf({
                    format: 'Letter',
                    margin: {
                        top: '20px',
                        right: '20px',
                        bottom: '20px',
                        left: '20px',
                    },
                });
                const { client_email } = yield conn.getClientCombineClientMail(client_id, combined_id);
                const message = {
                    to: client_email,
                    subject: 'Your Invoice',
                    attachments: {
                        filename: 'invoice.pdf',
                        content: pdfBuffer,
                    },
                };
                const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                let mail;
                if (client_email && expression.test(client_email)) {
                    mail = yield sendEmail_helper_1.default.sendEmail(message);
                }
                else {
                    throw new customError_1.default('Please provide a valid email', 400, 'Bad request');
                }
                return {
                    success: true,
                    message: 'Mail send successfuly',
                    messsageID: mail.messageId,
                };
            }));
        });
    }
}
exports.default = SendMail;
//# sourceMappingURL=sendMail.services.js.map