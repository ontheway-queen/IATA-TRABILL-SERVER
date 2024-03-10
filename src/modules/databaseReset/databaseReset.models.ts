import AbstractModels from '../../abstracts/abstract.models';
import { idType } from '../../common/types/common.types';
import CustomError from '../../common/utils/errors/customError';

class DatabaseResetModels extends AbstractModels {
  resetDatabase = async (tableName: string[]) => {
    await this.db.raw('SET FOREIGN_KEY_CHECKS = 0;');

    // delete all table data
    for (const talbe of tableName) {
      await this.query()
        .from(talbe)
        .del()
        .then(() => {
          return this.db.raw(
            `ALTER TABLE ${this.database}.${talbe} AUTO_INCREMENT = 1`
          );
        });
    }

    await this.db.raw('SET FOREIGN_KEY_CHECKS = 1;');
  };

  indexDatabase = async () => {
    await this.db.raw(
      'CREATE INDEX hajji_by_searching ON trabill_haji_informations (hajiinfo_tracking_number, hajiinfo_nid, hajiinfo_serial);'
    );
  };

  public async resetAllAgencyData(agency_id: idType) {
    if (!agency_id) {
      throw new CustomError(
        'Please provice a valid agency ID',
        500,
        'Bad request'
      );
    }
    return this.db.raw(`call ${this.database}.resetDatabase(${agency_id});`);
  }
}

export default DatabaseResetModels;
