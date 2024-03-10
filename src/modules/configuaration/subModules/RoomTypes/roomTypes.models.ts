import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { RoomTypeReqBody } from '../../types/configuration.interfaces';

class RoomTypeModel extends AbstractModels {
  public async createRoomType(data: RoomTypeReqBody) {
    const roomType = await this.query()
      .insert({ ...data, rtype_org_agency: this.org_agency })
      .into('trabill_room_types');

    return roomType[0];
  }

  public async viewRoomTypes(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .from('trabill_room_types')
      .select(
        'rtype_id',
        'rtype_name',
        'rtype_create_date',
        'rtype_org_agency as agency_id'
      )
      .where('rtype_org_agency', null)
      .orWhere('rtype_org_agency', this.org_agency)
      .andWhere('rtype_is_deleted', 0)
      .orderBy('rtype_id', 'desc')
      .limit(size)
      .offset(page_number);
  }

  public async countRoomTypeDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_room_types')
      .where('rtype_is_deleted', 0)
      .andWhere('rtype_org_agency', null)
      .orWhere('rtype_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllRoomTypes() {
    const by_clients = await this.query()
      .from('trabill_room_types')
      .select(
        'rtype_id',
        'rtype_name',
        'rtype_create_date',
        'rtype_org_agency as agency_id'
      )
      .where('rtype_org_agency', this.org_agency)
      .andWhere('rtype_is_deleted', 0)
      .orderBy('rtype_name');

    const by_default = await this.query()
      .from('trabill_room_types')
      .select(
        'rtype_id',
        'rtype_name',
        'rtype_create_date',
        'rtype_org_agency as agency_id'
      )
      .where('rtype_org_agency', null)
      .andWhere('rtype_is_deleted', 0)
      .orderBy('rtype_name');

    return [...by_clients, ...by_default];
  }

  public async editRoomType(data: RoomTypeReqBody, id: idType) {
    return await this.query()
      .into('trabill_room_types')
      .update(data)
      .where('rtype_id', id)
      .whereNot('rtype_is_deleted', 1)
      .andWhereNot('rtype_org_agency', null);
  }

  public async deleteRoomType(id: idType) {
    return await this.query()
      .into('trabill_room_types')
      .update({ rtype_is_deleted: 1 })
      .where('rtype_id', id)
      .andWhereNot('rtype_org_agency', null);
  }
}

export default RoomTypeModel;
