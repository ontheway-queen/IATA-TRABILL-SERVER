import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { GroupReqBody } from '../../types/configuration.interfaces';

class GroupModel extends AbstractModels {
  public async createGroup(data: GroupReqBody) {
    const group = await this.query()
      .insert({ ...data, group_org_agency: this.org_agency })
      .into('trabill_haji_group');

    return group[0];
  }

  public async updateGroup(data: GroupReqBody, group_id: string | number) {
    return this.query()
      .into('trabill_haji_group')
      .update(data)
      .where('group_id', group_id);
  }
  public async getGroupName(group_id: number) {
    const data = await this.query()
      .from('trabill_haji_group')
      .select('group_name')
      .where('group_id', group_id);

    return data[0].group_name;
  }

  public async viewGroups(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .from('trabill_haji_group')
      .select(
        'group_id',
        'group_type',
        'group_name',
        'group_org_agency as agency_id'
      )
      .where('group_org_agency', null)
      .orWhere('group_org_agency', this.org_agency)
      .andWhereNot('group_is_deleted', 1)
      .orderBy('group_create_date', 'desc')
      .limit(size)
      .offset(page_number);
  }

  public async countGroupsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_haji_group')
      .where('group_org_agency', null)
      .orWhere('group_org_agency', this.org_agency)
      .andWhereNot('group_is_deleted', 1);

    return count.row_count;
  }

  public async getAllGroups() {
    const clients = await this.query()
      .from('trabill_haji_group')
      .select(
        'group_id',
        'group_type',
        'group_name',
        'group_org_agency as agency_id'
      )
      .where('group_org_agency', this.org_agency)
      .andWhereNot('group_is_deleted', 1)
      .orderBy('group_create_date', 'desc');

    const agencys = await this.query()
      .from('trabill_haji_group')
      .select(
        'group_id',
        'group_type',
        'group_name',
        'group_org_agency as agency_id'
      )
      .where('group_org_agency', null)
      .andWhereNot('group_is_deleted', 1)
      .orderBy('group_create_date', 'desc');

    return [...clients, ...agencys];
  }

  public async deleteGroups(group_id: idType, group_deleted_by: idType) {
    return this.query()
      .from('trabill_haji_group')
      .update({ group_is_deleted: 1, group_deleted_by })
      .where('group_id', group_id);
  }
}

export default GroupModel;
