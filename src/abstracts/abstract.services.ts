import { Request } from 'express';
import Models from '../common/model/Models';
import { VoucherType, idType } from '../common/types/common.types';
import CustomError from '../common/utils/errors/customError';
import DeleteFile from '../common/utils/fileRemover/deleteFIle';
import {
  actionType,
  auditModuleType,
} from '../modules/report/types/report.interfaces';

abstract class AbstractServices {
  protected deleteFile = new DeleteFile();

  // @Models
  protected models = new Models();

  public generateVoucher = async (req: Request, type: VoucherType) => {
    const conn = this.models.CommonModels(req);

    const voucher = await conn.generateVoucher(type);

    return voucher as string;
  };

  public updateVoucher = async (req: Request, type: VoucherType) => {
    const conn = this.models.CommonModels(req);

    await conn.updateVoucher(type);
  };

  public insertAudit = async (
    req: Request,
    audit_action: actionType,
    audit_content: string,
    audit_user_id: idType,
    audit_module_type: auditModuleType
  ) => {
    const conn = this.models.CommonModels(req);

    if (!audit_user_id) {
      throw new CustomError(
        'Please provide user id for add audit',
        400,
        'Empty user id'
      );
    }

    await conn.insertAuditData(
      audit_action,
      audit_content,
      audit_user_id,
      audit_module_type
    );
  };
}

export default AbstractServices;
