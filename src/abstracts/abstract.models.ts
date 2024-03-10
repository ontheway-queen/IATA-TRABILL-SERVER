import { db_name } from '../app/database';
import { IUserRequest } from '../common/model/Models';
import { TDB, idType } from '../common/types/common.types';

abstract class AbstractModels {
  protected db: TDB;
  protected org_agency: idType;
  protected database = db_name;
  protected trxn = 'trxn';

  constructor(db: TDB, req: IUserRequest) {
    this.db = db;
    this.org_agency = req.agency_id;
  }

  protected query() {
    return this.db.queryBuilder();
  }
}

export default AbstractModels;
