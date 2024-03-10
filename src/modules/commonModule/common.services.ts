import { Request } from 'express';
import { VoucherType } from '../../common/types/common.types';
import CommonModels from './common.models';

class CommonServices {
  private conn: CommonModels;

  constructor(conn: CommonModels) {
    this.conn = conn;
  }

  public generateVouchers = async (req: Request) => {
    const voucher_type = req.params.type as VoucherType;

    const data = await this.conn.generateVoucher(voucher_type);

    return {
      success: true,
      message: `Voucher number for ${voucher_type}`,
      data,
    };
  };

  public insertAudit = async (
    audit_action: 'update' | 'delete' | 'create',
    audit_content: string,
    audit_user_id: number,
    audit_module_type?:
      | 'INVOICES'
      | 'MONEY_RECEIPT'
      | 'VENDOR_PAYMENT'
      | 'REFUND'
      | 'OTHERS'
  ) => {
    await this.conn.insertAuditData(
      audit_action,
      audit_content,
      audit_user_id,
      audit_module_type
    );
  };

  public generateVoucher = async (req: Request, type: VoucherType) => {
    return await this.conn.generateVoucher(type);
  };

  public updateVoucher = async (req: Request, type: VoucherType) => {
    return await this.conn.updateVoucher(type);
  };
}

export default CommonServices;
