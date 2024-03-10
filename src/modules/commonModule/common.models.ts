import AbstractModels from '../../abstracts/abstract.models';
import { VoucherType, idType } from '../../common/types/common.types';
import { actionType, auditModuleType } from '../report/types/report.interfaces';

class CommonModels extends AbstractModels {
  public async insertAuditData(
    audit_action: actionType,
    audit_content: string,
    audit_user_id: idType,
    audit_module_type?: auditModuleType
  ) {
    await this.db
      .queryBuilder()
      .insert({
        audit_action,
        audit_content,
        audit_user_id,
        audit_module_type,
        audit_org_agency: this.org_agency,
      })
      .into('trabill_audit_history');
  }

  generateVoucher = async (voucher_type: VoucherType) => {
    const [[[voucher]]] = await this.db.raw(
      `call ${this.database}.get_voucher_num('${voucher_type}', ${this.org_agency})`
    );

    return voucher.voucher_number;
  };

  updateVoucher = async (voucher_type: VoucherType) => {
    await this.db.raw(
      `call ${this.database}.updateVoucherNumber('${voucher_type}', ${this.org_agency})`
    );
  };
}

export default CommonModels;
