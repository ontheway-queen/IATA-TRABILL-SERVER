import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { IChequeStatusBody, TChequeStatus } from '../types/cheques.interface';
import ChequeManagementHelpers from '../utils/chequeManagement.helpers';
class chequesServices extends AbstractServices {
  constructor() {
    super();
  }

  // get all cheques
  public getAllCheques = async (req: Request) => {
    const { status } = req.query as { status: TChequeStatus };
    const { page, size } = req.query;
    const conn = this.models.chequesModels(req);

    const data = await conn.getAllCheques(
      status,
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      message: 'All cheques',
      ...data,
    };
  };

  // UPDATE CHEQUE STATUS
  public updateChequeStatus = async (req: Request) => {
    const { cheque_type, user_id } = req.body as IChequeStatusBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.chequesModels(req, trx);
      const agent_conn = this.models.agentProfileModel(req, trx);

      let message = 'Cheque updated';

      if (cheque_type === 'MR_ADVR') {
        message = await ChequeManagementHelpers.moneyReceiptAdvrChequeStatus(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'EXPENSE') {
        message = await ChequeManagementHelpers.expenseChequeStatus(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'LOAN') {
        message = await ChequeManagementHelpers.loanChequeStatusUpdate(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'LOAN_PAYMENT') {
        message = await ChequeManagementHelpers.loanPaymentChequeStatus(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'LOAN_RECEIVED') {
        message = await ChequeManagementHelpers.loanReceivedChequeStatus(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'MONEY_RECEIPT') {
        message = await ChequeManagementHelpers.moneyReceiptChequeUpdate(
          req,
          conn,
          trx,
          agent_conn
        );
      } else if (cheque_type === 'PAYROLL') {
        message = await ChequeManagementHelpers.payrollChequeUpdate(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'VENDOR_ADVR') {
        message = await ChequeManagementHelpers.vendorAdvanceRetrundCheque(
          req,
          conn,
          trx
        );
      } else if (cheque_type === 'VENDOR_PAYMENT') {
        message = await ChequeManagementHelpers.vendorPaymentCheque(
          req,
          conn,
          trx
        );
      }

      await this.insertAudit(req, 'update', message, user_id, 'CHEQUE');

      return { success: true, message };
    });
  };
}
export default chequesServices;
