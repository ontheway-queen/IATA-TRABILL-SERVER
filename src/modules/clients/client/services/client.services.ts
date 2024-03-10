import { Request } from 'express';
import moment from 'moment';
import puppeteer from 'puppeteer';
import AbstractServices from '../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { getClientOrCombId } from '../../../../common/helpers/invoice.helpers';
import SendEmailHelper from '../../../../common/helpers/sendEmail.helper';
import CustomError from '../../../../common/utils/errors/customError';
import AddClientService from './narrowServices/addClient.services';
import EditClientService from './narrowServices/editClient.services';
import IncentiveIncomeClientServices from './narrowServices/incentiveIncomeClient.services';
class ClientServices extends AbstractServices {
  constructor() {
    super();
  }

  public getAllClientAndCombined = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.clientModel(req);

    const data = await conn.getAllClientsAndCombined(search as string);

    return { success: true, data };
  };

  public checkCreditLimit = async (req: Request) => {


    return { success: true, data: 1 };


    const { amount, combClient } = req.body as {
      amount: number;
      combClient: string;
    };

    const clientCom = combClient.split('-');

    const client_type = clientCom[0].toUpperCase() as 'CLIENT' | 'COMBINED';
    const client_id = Number(clientCom[1]);

    const common_conn = this.models.CommonInvoiceModel(req);

    const data = await common_conn.checkCreditLimit(
      client_type,
      client_id,
      amount
    );



    return { success: true, data };
  };

  public updateClientStatus = async (req: Request) => {
    const conn = this.models.clientModel(req);

    const { client_id } = req.params;

    const { status, created_by } = req.body;

    await conn.updateClientStatus(client_id, status);

    const message = `Client status updated into ${status}`;
    await this.insertAudit(req, 'update', message, created_by, 'ACCOUNTS');

    return { success: true, message: 'Client activate status changed' };
  };

  public getAllClients = async (req: Request) => {
    const { trash, page, size, search } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
    };

    const conn = this.models.clientModel(req);

    const clients = await conn.getAllClients(
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    const count = await conn.countClientDataRow(search);

    return { success: true, count, data: clients };
  };

  public viewAllClient = async (req: Request) => {
    const { search } = req.query;

    const conn = this.models.clientModel(req);

    const data = await conn.viewAllClient(search as string);

    return { success: true, data };
  };

  public getSingleClient = async (req: Request) => {
    const conn = this.models.clientModel(req);
    const combined_conn = this.models.combineClientModel(req);

    let data;

    const { client_id, combined_id } = separateCombClientToId(req.params.id);

    if (client_id) {
      data = await conn.getSingleClient(client_id);
    } else if (combined_id) {
      data = await combined_conn.getSingleCombinedClient(combined_id);
    } else {
      throw new CustomError('Please provide a valid id', 400, 'Bad request');
    }

    return { success: true, data };
  };

  public deleteClient = async (req: Request) => {
    const { client_id } = req.params;
    const { client_updated_by } = req.body;

    const clientId = Number(client_id);

    if (!clientId) {
      throw new CustomError(
        'Please provide a valid Id to delete a client',
        400,
        'Invalid client Id'
      );
    }

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.clientModel(req, trx);

      const clientTrxnCount = await conn.getTraxn(clientId);

      if (clientTrxnCount === 0) {
        await conn.deleteClient(clientId, client_updated_by);
      } else {
        throw new CustomError(
          'Account has a valid transaction',
          400,
          'Bad Request'
        );
      }

      const message = `Client has been deleted`;
      await this.insertAudit(
        req,
        'delete',
        message,
        client_updated_by,
        'ACCOUNTS'
      );

      return { success: true, message: 'Client Deleted Successfully' };
    });
  };

  public generateExcelReport = async (req: Request) => {
    const conn = this.models.clientModel(req);

    const clients = await conn.getClientExcelData();

    const clientsData = clients.map((item: any) => {
      const data = item;
      const moibleData = JSON.parse(item.mobile).map(
        (itemm: string) => `(${itemm[0]})` + '-' + itemm[1]
      );

      data.mobile = moibleData[0];
      data.client_activity_status =
        item.client_activity_status === 1 ? 'Active' : 'Inactive';

      return data;
    });

    return { success: true, data: clientsData };
  };

  public clientAllInvoices = async (req: Request) => {
    const PClient = req.params.client_id;

    const { page, size } = req.query;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      PClient
    );

    const conn = this.models.clientModel(req);

    const data = await conn.clientAllInvoices(
      invoice_client_id as number,
      invoice_combined_id as number,
      Number(page),
      Number(size)
    );

    return { success: true, ...data };
  };

  public clientAllMoneyReceipts = async (req: Request) => {
    const PClient = req.params.client_id;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      PClient
    );

    const conn = this.models.clientModel(req);

    const data = await conn.clientMoneyReceipts(invoice_client_id as number);

    return { success: true, data };
  };

  public clientAllQuotations = async (req: Request) => {
    const PClient = req.params.client_id;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      PClient
    );

    const conn = this.models.clientModel(req);

    const data = await conn.clientAllQuotations(invoice_client_id as number);

    return { success: true, data };
  };

  public clientAllRefund = async (req: Request) => {
    const PClient = req.params.client_id;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      PClient
    );

    const conn = this.models.clientModel(req);

    const clientAirticketRefund = await conn.clientAirticketRefund(
      invoice_client_id as number
    );
    const clientOtherRefund = await conn.clientOtherRefund(
      invoice_client_id as number
    );
    const clientTourRefund = await conn.clientTourRefund(
      invoice_client_id as number
    );

    return {
      success: true,
      data: { clientAirticketRefund, clientOtherRefund, clientTourRefund },
    };
  };

  public clientAllPassport = async (req: Request) => {
    const PClient = req.params.client_id;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      PClient
    );

    const conn = this.models.clientModel(req);

    const data = await conn.clientAllPassport(invoice_client_id as number);

    return { success: true, data };
  };

  public getClLastBalanceById = async (req: Request) => {
    const { client_id } = req.params;

    const conn = this.models.clientModel(req);

    const data = await conn.getClLastBalanceById(client_id);

    return { success: true, data };
  };

  public getCombClientLBalance = async (req: Request) => {
    const { client } = req.params;

    const { client_id, combined_id } = separateCombClientToId(client);

    const conn = this.models.clientModel(req);
    const combine_conn = this.models.combineClientModel(req);

    if (client_id) {
      const data = await conn.getClLastBalanceById(client_id);

      return { success: true, data };
    } else {
      const data = await combine_conn.getCombinedLastBalance(
        combined_id as number
      );

      return { success: true, data };
    }
  };

  public getClientCombinedIncentiveIncome = async (req: Request) => {
    const { page, size } = req.query;

    const conn = this.models.clientModel(req);

    const data = await conn.getClientCombinedIncentiveIncome(
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getSingleClientCombinedIncentiveIncome = async (req: Request) => {
    const { incentive_id } = req.params;

    const conn = this.models.clientModel(req);

    const data = await conn.getSingleClientCombinedIncentiveIncome(
      incentive_id
    );

    return { success: true, data };
  };

  // SEND MAIL
  public sendEmailToClinet = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.invoiceAirticketModel(req);

    const invoice_id = 1;
    const agency_name = 'Trabill';

    const data = await common_conn.getViewInvoiceInfo(invoice_id);
    const ticketInfo = await conn.getAirticketItems(invoice_id);

    const emailBody = `<div style="font-family: Arial, sans-serif;">
    <div style="padding: 3px;">
        <div style="display: block;margin-bottom: 20px;">
            <h2 style="margin: 0; text-align: center; border-bottom: 2px dotted #ddd;">Invoice</h2>
        </div>
        <div>
          <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 500;">Invoice Date :
              <span>${moment(new Date(data?.invoice_sales_date)).format(
      'DD-MM-YYYY'
    )}</span></p>
          <p style="margin:  0;padding: 0, 3px;  font-size: 15px; font-weight: 500;">Invoice Number :
              <span>${data?.invoice_no}</span>
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
        </div>`
      }
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content on the page
    await page.setContent(emailBody);

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'Letter', // You can adjust the format as needed
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

    const mail = await SendEmailHelper.sendEmail(message);

    return {
      success: true,
      message: 'Message send to client successfuly',
      messsageID: mail.messageId,
    };
  };

  //=========================================================//
  //====================narrowed services====================//
  //=========================================================//

  // Create a client
  public addClient = new AddClientService().addClient;

  // Edit client
  public editClient = new EditClientService().editClient;

  public addIncentiveIncomeClient = new IncentiveIncomeClientServices()
    .addIncentiveIncomeClient;

  public editIncentiveIncomeCombClient = new IncentiveIncomeClientServices()
    .editIncentiveIncomeCombClient;

  public deleteIncentiveIncomeCombClient = new IncentiveIncomeClientServices()
    .deleteIncentiveIncomeCombClient;
}

export default ClientServices;
