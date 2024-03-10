import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import {
  IAcTrxn,
  IClTrxnBody,
  IVTrxn,
} from '../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../common/utils/errors/customError';
import { Icheque } from '../../Interfaces/Notification.Interfaces';

class ChequeCollectionStatusUpdate extends AbstractServices {
  constructor() {
    super();
  }

  // UPDATE CHEQUE STATUS
  public chequeCollectionStatusUpdate = async (req: Request) => {
    const {
      account_id,
      chequeTable,
      cheque_status,
      client_id,
      date,
      note,
      amount,
      user_id,
      vendor_id,
      chequeId,
    } = req.body as Icheque;

    // LOAN_CHEQUE || MONEY_RECEIPT || VENDOR_ADVR ||

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.NotificationModals(req, trx);

      let chequeMessage: any = '';

      //   LOAN CHEQUE
      if (chequeTable === 'LOAN_CHEQUE') {
        if (cheque_status === 'DEPOSIT') {
          const AccTrxnBody: IAcTrxn = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: '',
            acctrxn_amount: Number(amount),
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: note,
            acctrxn_particular_id: 47,
            acctrxn_particular_type: 'Collection cheque',
            acctrxn_pay_type: 'CASH',
          };

          await new Trxns(req, trx).AccTrxnInsert(AccTrxnBody);

          //   UPDATE CHEQUE TABLE
          const data = {
            lcheque_status: cheque_status,
            lcheque_deposit_date: date,
            lcheque_deposit_note: note,
          };
          await conn.updateLChequeStatus(data, chequeId);

          chequeMessage = `Loan cheque has been deposit ${amount}/-`;
        } else if (cheque_status === 'BOUNCE') {
          const data = {
            lcheque_status: cheque_status,
            lcheque_bounce_date: date,
            lcheque_bounce_note: note,
          };
          await conn.updateLChequeStatus(data, chequeId);

          chequeMessage = `Loan cheque has been bounce`;
        } else if (cheque_status === 'RETURN') {
          const data = {
            lcheque_status: cheque_status,
            lcheque_return_date: date,
            lcheque_return_note: note,
          };

          await conn.updateLChequeStatus(data, chequeId);

          chequeMessage = `Loan cheque has been return`;
        }
        return {
          success: true,
          message: 'Loan cheque status has been updated',
        };
      }

      //   MONEY RECEIPT
      else if (chequeTable === 'MONEY_RECEIPT') {
        if (cheque_status === 'DEPOSIT') {
          // ================ @ TRANSACTIONS @ ==================

          const AccTrxnBody: IAcTrxn = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: '',
            acctrxn_amount: Number(amount),
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: note,
            acctrxn_particular_id: 32,
            acctrxn_particular_type: 'Collection cheques',
            acctrxn_pay_type: 'CASH',
          };

          await new Trxns(req, trx).AccTrxnInsert(AccTrxnBody);

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: Number(amount),
            ctrxn_cl: `client-${client_id}`,
            ctrxn_voucher: '',
            ctrxn_particular_id: 32,
            ctrxn_created_at: date,
            ctrxn_note: note,
            ctrxn_particular_type: 'Collection cheques',
            ctrxn_user_id: user_id,
          };

          await new Trxns(req, trx).clTrxnInsert(clTrxnBody);

          const data = {
            cheque_status,
            cheque_deposit_date: date,
            cheque_deposit_note: note,
          };
          await conn.updateMoneyReceiptCheque(data, chequeId);

          chequeMessage = `Money receipt cheque has been deposit ${amount}/-`;
        } else if (cheque_status === 'BOUNCE') {
          const data = {
            cheque_status,
            cheque_bounce_date: date,
            cheque_bounce_note: note,
          };
          await conn.updateMoneyReceiptCheque(data, chequeId);

          chequeMessage = `Money receipt cheque has been bounce`;
        } else if (cheque_status === 'RETURN') {
          const data = {
            cheque_status,
            cheque_return_date: date,
            cheque_return_note: note,
          };
          await conn.updateMoneyReceiptCheque(data, chequeId);
        }

        chequeMessage = `Money receipt cheque has been return`;
        return {
          success: true,
          message: 'Money receipt cheque status has been updated',
        };
      }

      // CLIENT REFUND
      else if (chequeTable === 'CLIENT_REFUND') {
        if (cheque_status === 'DEPOSIT') {
          // TRANSACTIONS
          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: Number(amount),
            ctrxn_cl: `client-${client_id}`,
            ctrxn_voucher: '',
            ctrxn_particular_id: 8,
            ctrxn_created_at: date,
            ctrxn_note: note,
            ctrxn_particular_type: 'Client refund',
            ctrxn_user_id: user_id,
          };

          await new Trxns(req, trx).clTrxnInsert(clTrxnBody);

          const data = {
            rcheque_status: cheque_status,
            rcheque_deposit_date: date,
            rcheque_deposit_note: note,
          };
          await conn.updateClientRefundChequ(data, chequeId);

          chequeMessage = `Client refund cheque has been deposit ${amount}/-`;
        } else if (cheque_status === 'BOUNCE') {
          const data = {
            rcheque_status: cheque_status,
            rcheque_bounce_date: date,
            rcheque_bounce_note: note,
          };
          await conn.updateClientRefundChequ(data, chequeId);

          chequeMessage = `Client refund cheque has been bounce`;
        } else if (cheque_status === 'RETURN') {
          const data = {
            rcheque_status: cheque_status,
            rcheque_return_date: date,
            rcheque_return_note: note,
          };
          await conn.updateClientRefundChequ(data, chequeId);

          chequeMessage = `Client refund cheque has been return`;
        }

        return {
          success: true,
          message: 'Client refund cheque has been updated',
        };
      }

      // VENDOR REFUND
      else if (chequeTable === 'VENDOR_REFUND') {
        if (cheque_status === 'DEPOSIT') {
          const VTrxnBody: IVTrxn = {
            comb_vendor: `vendor-${vendor_id}`,
            vtrxn_amount: Number(amount),
            vtrxn_created_at: date,
            vtrxn_note: note,
            vtrxn_particular_id: 7,
            vtrxn_particular_type: 'Vendor refund cheque',
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: user_id,
            vtrxn_voucher: '',
          };

          await new Trxns(req, trx).VTrxnInsert(VTrxnBody);

          const data = {
            rcheque_status: cheque_status,
            rcheque_deposit_date: date,
            rcheque_deposit_note: note,
          };
          await conn.updateVendorRefundChequ(data, chequeId);

          chequeMessage = `Vendor refund cheque has been deposit ${amount}/-`;
        } else if (cheque_status === 'BOUNCE') {
          const data = {
            rcheque_status: cheque_status,
            rcheque_bounce_date: date,
            rcheque_bounce_note: note,
          };
          await conn.updateVendorRefundChequ(data, chequeId);

          chequeMessage = `Vendor refund cheque has been bounce`;
        } else if (cheque_status === 'RETURN') {
          const data = {
            rcheque_status: cheque_status,
            rcheque_return_date: date,
            rcheque_return_note: note,
          };
          await conn.updateVendorRefundChequ(data, chequeId);

          chequeMessage = `Vendor refund cheque has been return`;
        }

        return {
          success: true,
          message: 'Vendor refund cheque has been updated',
        };
      }

      //   VENDOR ADVACE RETURN
      else if (chequeTable === 'VENDOR_ADVR') {
        if (cheque_status === 'DEPOSIT') {
          const VTrxnBody: IVTrxn = {
            comb_vendor: `vendor-${vendor_id}`,
            vtrxn_amount: Number(amount),
            vtrxn_created_at: date,
            vtrxn_note: note,
            vtrxn_particular_id: 32,
            vtrxn_particular_type: 'Vendor advance return',
            vtrxn_type: 'DEBIT',
            vtrxn_user_id: user_id,
            vtrxn_voucher: '',
          };

          await new Trxns(req, trx).VTrxnInsert(VTrxnBody);

          const data = {
            cheque_status,
            cheque_deposit_date: date,
            cheque_deposit_note: note,
          };

          await conn.updateVendorAdvrChequeStatus(data, chequeId);

          chequeMessage = `Vendor advance return cheque has been deposit ${amount}/-`;
        } else if (cheque_status === 'BOUNCE') {
          const data = {
            cheque_status,
            cheque_bounce_date: date,
            cheque_bounce_note: note,
          };
          await conn.updateVendorAdvrChequeStatus(data, chequeId);

          chequeMessage = `Vendor advance return cheque has been bounce`;
        } else if (cheque_status === 'RETURN') {
          const data = {
            cheque_status,
            cheque_return_date: date,
            cheque_return_note: note,
          };
          await conn.updateVendorAdvrChequeStatus(data, chequeId);

          chequeMessage = `Vendor advance return cheque has been return`;
        }

        await this.insertAudit(req, 'delete', chequeMessage, user_id, 'CHEQUE');

        return {
          success: true,
          message: 'Vendor advance return cheque has been updated',
        };
      } else {
        throw new CustomError('Please provide valid data', 400, 'Invalid data');
      }
    });
  };
}

export default ChequeCollectionStatusUpdate;
