import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { ExpenseHeadReqBody } from '../../types/configuration.interfaces';

class ExpenseHeadModel extends AbstractModels {
  public async createExpenseHead(data: ExpenseHeadReqBody) {
    const expenseHead = await this.query()
      .insert({ ...data, head_org_agency: this.org_agency })
      .into('trabill_expense_head');

    return expenseHead[0];
  }

  public async editExpenseHead(data: ExpenseHeadReqBody, head_id: idType) {
    return await this.query()
      .into('trabill_expense_head')
      .update(data)
      .where('head_id', head_id);
  }

  public async viewExpenseHeads(page: number, size: number) {
    const page_number = (page - 1) * size;

    const data = await this.query()
      .from('trabill_expense_head')
      .select(
        'head_id',
        'head_create_date',
        'head_name',
        'head_org_agency as agency_id'
      )
      .where('head_status', 1)
      .andWhere('head_org_agency', this.org_agency)
      .andWhereNot('head_is_deleted', 1)
      .orderBy('head_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_expense_head')
      .where('head_status', 1)
      .andWhereNot('head_is_deleted', 1)
      .andWhere('head_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getAllExpenseHeads() {
    const by_clients = await this.query()
      .from('trabill_expense_head')
      .select(
        'head_id',
        'head_create_date',
        'head_name',
        'head_org_agency as agency_id'
      )
      .where('head_status', 1)
      .andWhereNot('head_is_deleted', 1)
      .andWhere('head_org_agency', this.org_agency)
      .orderBy('head_name');

    const by_default = await this.query()
      .from('trabill_expense_head')
      .select(
        'head_id',
        'head_create_date',
        'head_name',
        'head_org_agency as agency_id'
      )
      .where('head_status', 1)
      .andWhereNot('head_is_deleted', 1)
      .andWhere('head_org_agency', null)
      .orderBy('head_name');

    return [...by_clients, ...by_default];
  }

  public async deleteExpenseHead(head_id: idType, head_deleted_by: idType) {
    return await this.query()
      .into('trabill_expense_head')
      .update({ head_status: 0, head_is_deleted: 1, head_deleted_by })
      .where('head_id', head_id);
  }
}

export default ExpenseHeadModel;
