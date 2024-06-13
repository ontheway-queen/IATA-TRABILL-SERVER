import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  IAdminActivity,
  IAdminAgencyData,
  IAgencyOrganization,
  IAirportData,
  IClientCategory,
  IDepartmentData,
  IDesignationData,
  IModules,
  INotice,
  IPassportStatusData,
  IProductsData,
  IRoomTypeData,
  ISalesInfo,
  ITrabillSalesman,
  ITransportTypeData,
  IUpdateAgencyOrganization,
  IUpdateAgencyProfile,
  IVisaTypeData,
} from '../Interfaces/adminPanel.interfaces';
class AdminPanelModels extends AbstractModels {
  // @modules
  insertModules = async (data: IModules) => {
    await this.query().insert(data).into('trabill_modules');
  };
  updateModules = async (data: IModules, module_id: idType) => {
    const is_update = await this.query()
      .update(data)
      .from('trabill_modules')
      .where('module_id', module_id);

    if (!is_update) {
      throw new CustomError(
        'Please provide a valid module id',
        400,
        'Invalid id'
      );
    }
  };
  deleteModules = async (module_id: idType) => {
    const is_del = await this.query()
      .update({ module_isdeleted: 1 })
      .from('trabill_modules')
      .where('module_id', module_id);

    if (!is_del) {
      throw new CustomError(
        'Please provide a valid module id',
        400,
        'Invalid id'
      );
    }
  };
  getAllModules = async () => {
    return await this.query()
      .select('*')
      .from('trabill_modules')
      .whereNot('module_isdeleted', 1);
  };

  // @agency
  public async insertAgency(data: IAgencyOrganization) {
    const [agency_id] = await this.query()
      .insert(data)
      .into('trabill_agency_organization_information');
    return agency_id;
  }

  public async updateAgency(
    data: IUpdateAgencyOrganization,
    agency_id: idType
  ) {
    const is_update = await this.query()
      .update(data)
      .into('trabill_agency_organization_information')
      .where('org_id', agency_id);

    if (!is_update) {
      throw new CustomError(
        'Please provide a valid agency id',
        400,
        'Invalid id'
      );
    }
  }

  // @Agency_modules
  insertAgencyModule = async (
    data: {
      agmod_org_id: number;
      agmod_module_id: number;
    }[]
  ) => {
    await this.query().insert(data).into('trabill_agency_moduls');
  };

  public async updateAgencySubscription(
    agency_id: idType,
    data: {
      subcript_amount: number;
      subcript_type: 'yearly' | 'monthly' | 'quarterly';
    }
  ) {
    return await this.query()
      .update(data)
      .into('trabill_agency_subscription')
      .where('subcript_org_agency', agency_id);
  }

  updateAgencyModule = async (
    data: {
      agmod_org_id: idType;
      agmod_module_id: number;
    }[],
    agency_id: idType
  ) => {
    await this.query()
      .delete()
      .from('trabill_agency_moduls')
      .where('agmod_org_id', agency_id);

    await this.query().insert(data).into('trabill_agency_moduls');
  };

  updatesSalesInfo = async (data: ISalesInfo) => {
    await this.query()
      .insert(data)
      .onConflict('subcript_org_agency')
      .merge(data)
      .into('trabill_agency_subscription');
  };

  public async getAllAgency(
    page: idType = 1,
    size: idType = 10,
    search_text: string,
    isDelete = 0,
    expired: 'true'
  ) {
    size = Number(size);

    const offset = (Number(page) - 1) * size;

    const data = await this.db
      .select('*')
      .from('v_org_agency')
      .where('org_isdelete', isDelete)
      .modify((e) => {
        if (search_text) {
          e.where(function () {
            this.where('org_name', 'like', `%${search_text}%`).orWhere(
              'mobile_no',
              'like',
              `%${search_text}%`
            );
          }).orderByRaw(
            'CASE WHEN org_name LIKE ? THEN 1 ELSE 2 END, MATCH(org_name) AGAINST(? IN NATURAL LANGUAGE MODE) DESC',
            [`${search_text}%`, search_text]
          );
        } else {
          e.offset(offset);
          e.limit(Number(size));
        }

        if (expired === 'true') {
          e.whereRaw('DATE(org_subscription_expired) < CURDATE()');
        } else {
          e.offset(offset);
          e.limit(Number(size));
        }
      });

    const [count] = await this.query()
      .select(this.db.raw('count(*) as total'))
      .from('v_org_agency')
      .where('org_isdelete', isDelete)
      .modify((e) => {
        if (search_text) {
          e.where(function () {
            this.where('org_name', 'like', `%${search_text}%`).orWhere(
              'mobile_no',
              'like',
              `%${search_text}%`
            );
          }).orderByRaw(
            'CASE WHEN org_name LIKE ? THEN 1 ELSE 2 END, MATCH(org_name) AGAINST(? IN NATURAL LANGUAGE MODE) DESC',
            [`${search_text}%`, search_text]
          );
        }

        if (expired === 'true') {
          e.whereRaw('DATE(org_subscription_expired) < CURDATE()');
        }
      });

    return { count: count.total, data };
  }

  updateAirTicketType = async (
    tac_airticket_type: 'IATA' | 'NON_IATA',
    tac_org_id: idType
  ) => {
    await this.query()
      .insert({
        tac_airticket_type,
        tac_org_id,
      })

      .onConflict('tac_org_id')
      .merge({
        tac_airticket_type,
        tac_org_id,
      })

      .into('trabill_app_config');
  };

  public async getForEdit(agency_id: idType) {
    const [data] = await this.query()
      .select(
        'org_name',
        'user_first_name',
        'user_last_name',
        'org_owner_email',
        'org_logo',
        'org_address1',
        'org_address2',
        'org_facebook',
        'org_website',
        'org_mobile_number',
        'user_username',
        'org_subscription_expired',
        'org_sms_api_key',
        'org_sms_client_id',
        'org_extra_info',
        'org_logo_width',
        'org_logo_height',
        'org_currency',
        'salesman_name',
        'subcript_amount',
        'subcript_salesman as org_trabill_salesman_id',
        'subcript_type',
        'org_module_type'
      )
      .from('trabill_agency_organization_information')
      .leftJoin('trabill_users', { user_agency_id: 'org_id' })
      .leftJoin('trabill_agency_subscription', {
        subcript_org_agency: 'org_id',
      })
      .leftJoin('trabill_office_salesman', {
        salesman_id: 'subcript_salesman',
      })
      .where('org_id', agency_id);

    if (!data) {
      throw new CustomError(
        'Please provide a valid agency id',
        400,
        'Invalid id'
      );
    }

    const modules = await this.query()
      .select('agmod_module_id', 'agmod_active_status')
      .from('trabill_agency_moduls')
      .where('agmod_org_id', agency_id);

    const modules_id = modules?.map((item) => item.agmod_module_id);

    return { ...data, modules_id };
  }

  // get agency users by agency
  public async getUsersByAgency(agency_id: idType) {
    const data = await this.query()
      .select(
        'user_id',
        'user_role',
        this.db.raw(
          "concat(user_first_name,' ',user_last_name) as user_full_name"
        ),
        this.db.raw(`concat(user_dial_code,user_mobile) as mobile_no`),
        'user_email',
        'user_username',
        'user_status'
      )
      .from('trabill_agency_organization_information')
      .leftJoin('trabill_users', { user_agency_id: 'org_id' })
      .where('org_id', agency_id);

    return data;
  }

  checkUsername = async (search_type: string, search_text: string) => {
    const [[[is_unique]]] = await this.db.raw(
      `CALL CheckUsernameUnique('${search_type}', '${search_text}');`
    );

    if (is_unique && is_unique.is_in !== 0) {
      return false;
    } else {
      return true;
    }
  };

  updateAgencyActiveStatus = async (
    org_is_active: string,
    agency_id: idType
  ) => {
    const is_update = await this.query()
      .update({ org_is_active })
      .into('trabill_agency_organization_information')
      .where('org_id', agency_id);

    if (is_update) {
      const users = await this.query()
        .select('user_id')
        .from('trabill_users')
        .where('user_agency_id', agency_id)
        .andWhereNot('user_is_deleted', 1);

      for (const item of users) {
        await this.query()
          .delete()
          .from('trabill_users_login_info')
          .where('login_user_id', item.user_id);
      }
    } else {
      throw new CustomError(
        'Please provice valid agency id',
        400,
        'Invalid agency'
      );
    }
  };

  updateAgencyExpired = async (
    org_subscription_expired: string,
    agency_id: idType
  ) => {
    const is_update = await this.query()
      .update({ org_subscription_expired })
      .into('trabill_agency_organization_information')
      .where('org_id', agency_id);

    if (!is_update) {
      throw new CustomError(
        'Please provice valid agency id',
        400,
        'Invalid agency'
      );
    }
  };

  updateAgencyLogo = async (logo_url: string, agency_id: idType) => {
    const [previous_logo] = (await this.query()
      .select('org_logo')
      .from('trabill_agency_organization_information')
      .where('org_id', agency_id)) as { org_logo: string }[];

    const is_update = await this.query()
      .update('org_logo', logo_url)
      .into('trabill_agency_organization_information')
      .where('org_id', agency_id);

    if (!is_update) {
      throw new CustomError(
        'Please provide valid agency id',
        400,
        'Invalid agency'
      );
    }

    return previous_logo.org_logo;
  };

  getAgencyCurrentPassword = async (agency_id: idType) => {
    const [password] = await this.query()
      .select('user_password as agency_password')
      .into('trabill_users')
      .where('user_agency_id', agency_id)
      .andWhere('user_role', 'SUPER_ADMIN');

    return password as { agency_password: string };
  };

  resetAgencyDatabase = async (agency_id: idType) => {
    if (!agency_id) {
      throw new CustomError(
        'Please provide a valid agency ID',
        500,
        'Bad request'
      );
    }
    await this.db.raw(`call ${this.database}.resetDatabase(${agency_id});`);
  };

  resetAgencyPassword = async (user_password: string, agency_id: idType) => {
    await this.query()
      .update({ user_password })
      .from('trabill_users')
      .where('user_role', 'SUPER_ADMIN')
      .andWhere('user_agency_id', agency_id);
  };

  public async resentAgency() {
    return await this.db
      .select('*')
      .from('v_org_agency')
      .whereNot('org_isdelete', 1)
      .orderBy('org_created_date', 'desc')
      .limit(20);
  }

  // CREATE AGENCY EXCEL REPORT BY  CREATE DATE
  public async agencyExcelReportCreateDate(from_date: string, to_date: string) {
    const data = await this.db
      .select(
        'trabill_agency_organization_information.org_name',
        'trabill_agency_organization_information.org_owner_email',
        'trabill_agency_subscription.subcript_amount',
        'trabill_agency_subscription.subcript_type',
        'trabill_agency_subscription.sbcript_sales_date',
        'trabill_agency_organization_information.org_created_date',
        'trabill_agency_organization_information.org_subscription_expired',
        this.db.raw(`
        CONCAT(
          COALESCE(trabill_agency_organization_information.org_mobile_number, '')
        ) AS mobile_no
      `),
        'trabill_office_salesman.salesman_name'
      )
      .from('trabill_agency_organization_information')
      .whereNot('org_isdelete', 1)
      .leftJoin(
        'trabill_agency_subscription',
        'trabill_agency_subscription.subcript_org_agency',
        'trabill_agency_organization_information.org_id'
      )
      .leftJoin(
        'trabill_office_salesman',
        'trabill_office_salesman.salesman_id',
        'trabill_agency_subscription.subcript_salesman'
      )
      .whereBetween(
        'trabill_agency_organization_information.org_created_date',
        [from_date, to_date]
      )
      .orderBy('org_name');

    return data;
  }

  // CREATE AGENCY EXCEL REPORT BY  CREATE DATE
  public async agencyExcelReportSalesDate(from_date: string, to_date: string) {
    const data = await this.db
      .select(
        'trabill_agency_organization_information.org_name',
        'trabill_agency_organization_information.org_owner_email',
        'trabill_agency_subscription.subcript_amount',
        'trabill_agency_subscription.subcript_type',
        'trabill_agency_subscription.sbcript_sales_date',
        'trabill_agency_organization_information.org_created_date',
        'trabill_agency_organization_information.org_subscription_expired',
        this.db.raw(`
        CONCAT(
          COALESCE(trabill_agency_organization_information.org_mobile_number, '')
        ) AS mobile_no
      `),
        'trabill_office_salesman.salesman_name'
      )
      .from('trabill_agency_organization_information')
      .whereNot('org_isdelete', 1)
      .leftJoin(
        'trabill_agency_subscription',
        'trabill_agency_subscription.subcript_org_agency',
        'trabill_agency_organization_information.org_id'
      )
      .leftJoin(
        'trabill_office_salesman',
        'trabill_office_salesman.salesman_id',
        'trabill_agency_subscription.subcript_salesman'
      )
      .whereBetween('trabill_agency_subscription.sbcript_sales_date', [
        from_date,
        to_date,
      ])
      .orderBy('org_name');

    return data;
  }

  agencyActivity = async () => {
    const [data] = await this.query()
      .select(
        this.db.raw('COUNT(*) AS total_agency'),
        this.db.raw(
          'SUM(CASE WHEN org_is_active = 1 THEN 1 ELSE 0 END) AS active_agency'
        ),
        this.db.raw(
          'SUM(CASE WHEN org_is_active = 0 THEN 1 ELSE 0 END) AS inactive_agency'
        )
      )
      .from('trabill_agency_organization_information')
      .whereNot('org_isdelete', 1);

    return data;
  };

  public agencyActivityReport = async (page: number, size: number) => {
    const page_number = (page - 1) * size;
    const data = await this.query()
      .select(
        'org_id',
        'org_owner_email',
        'activity_id',
        'activity_type',
        'activity_description',
        'activity_timestamp',
        'org_name',
        'org_logo'
      )
      .from('trabill_admin_activity')
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'activity_org_id',
      })
      .orderBy('activity_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_admin_activity');
    return { count: row_count, data };
  };

  // CONFIGURATION FOR ADMIN PANEL
  getAllClientCategory = async (page: idType = 1, size: idType = 20) => {
    const result = await this.db.transaction(async (trx) => {
      const query1 = trx.raw(
        'CALL GetAdminClientCategories(?, ?, @total_rows);',
        [page, size]
      );
      const query2 = trx.raw('SELECT @total_rows AS total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });

    return result;
  };

  getClientCategoryForSelect = async (search: string) => {
    return await this.query()
      .select('category_id', 'category_title', 'category_prefix')
      .from('trabill_client_categories')
      .whereNot('category_is_deleted', 1)
      .orderBy('category_id', 'desc')
      .modify((event) => {
        if (search) {
          event
            .andWhere('category_title', 'LIKE', `%${search}%`)
            .orWhere('category_prefix', 'LIKE', `%${search}%`);
        } else {
          event.limit(20);
        }
      });
  };

  insertClientCategory = async (data: IClientCategory) => {
    const [id] = await this.query()
      .insert({ ...data, airline_org_agency: this.org_agency })
      .into('trabill_client_categories');

    if (!id) {
      throw new CustomError(`Duplicate previx not allow`, 400, 'Bad request');
    }

    return id;
  };
  updateClientCategory = async (data: IClientCategory, category_id: idType) => {
    const id = await this.query()
      .update(data)
      .into('trabill_client_categories')
      .where('category_id', category_id);

    return id;
  };

  deleteClientCate = async (category_id: idType) => {
    const [id] = await this.db.raw(`CALL DeleteAdminClientCate(?);`, [
      category_id,
    ]);

    return id;
  };

  public async getAllAirports(page: idType = 1, size: idType = 20) {
    const result = await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminAirports(?,?,@total_rows);`, [
        page,
        size,
      ]);
      const query2 = trx.raw('SELECT @total_rows AS total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });

    return result;
  }

  public async insertAirports(data: IAirportData) {
    const [id] = await this.query()
      .insert({ ...data, airline_created_by: 3 })
      .into('trabill_airports');

    return id;
  }
  public async deleteAirports(id: idType, airline_deleted_by: idType) {
    const airport_id = await this.query()
      .update({ airline_is_deleted: 1, airline_deleted_by })
      .into('trabill_airports')
      .where('airline_id', id);
    return airport_id;
  }
  public async updateAirports(data: IAirportData, id: idType) {
    const airport_id = await this.query()
      .update(data)
      .into('trabill_airports')
      .where('airline_id', id);

    return airport_id;
  }

  public async getAllProducts(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminProducts(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }

  getProductCategoryForSelect = async (search: string) => {
    return await this.query()
      .select('category_id as product_category_id', 'category_title')
      .from('trabill_product_categories')
      .whereNot('category_is_deleted', 1)
      .orderBy('category_id', 'desc')
      .modify((event) => {
        if (search) {
          event.andWhere('category_title', 'LIKE', `%${search}%`);
        } else {
          event.limit(20);
        }
      });
  };

  public async insetProducts(data: IProductsData) {
    const [id] = await this.query()
      .insert({ ...data, product_created_by: 3 })
      .into('trabill_products');

    return id;
  }
  public async updateProducts(data: IProductsData, product_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_products')
      .where('product_id', product_id);
  }

  public async deleteProducts(product_id: idType, product_deleted_by: idType) {
    return await this.query()
      .update({ products_is_deleted: 1, product_deleted_by })
      .into('trabill_products')
      .where('product_id', product_id);
  }

  public async getAllVisaType(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminVisaType(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertVisaType(data: IVisaTypeData) {
    return await this.query().insert(data).into('trabill_visa_types');
  }
  public async updateVisaType(data: IVisaTypeData, visa_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_visa_types')
      .where('type_id', visa_id);
  }
  public async deleteVisaType(visa_id: idType) {
    return await this.query()
      .update({ type_is_deleted: 1 })
      .into('trabill_visa_types')
      .where('type_id', visa_id);
  }

  public async getAllDepartment(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminDepartment(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertDepartment(data: IDepartmentData) {
    return await this.query()
      .insert({ ...data, department_org_agency: this.org_agency })
      .into('trabill_departments');
  }
  public async updateDepartment(data: IDepartmentData, department_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_departments')
      .where('department_id', department_id);
  }
  public async deleteDepartment(
    department_id: idType,
    department_deleted_by: idType
  ) {
    return await this.query()
      .update({ department_is_deleted: 1, department_deleted_by })
      .into('trabill_departments')
      .where('department_id', department_id);
  }

  public async getAllRoomType(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminRoomType(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertRoomType(data: IRoomTypeData) {
    return await this.query().insert(data).into('trabill_room_types');
  }
  public async updateRoomType(data: IRoomTypeData, rtype_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_room_types')
      .where('rtype_id', rtype_id);
  }

  public async deleteRoomType(rtype_id: idType, rtype_deleted_by: idType) {
    return await this.query()
      .update({ rtype_is_deleted: 1, rtype_deleted_by })
      .into('trabill_room_types')
      .where('rtype_id', rtype_id);
  }

  public async getAllTransportType(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminTransportType(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertTransportType(data: ITransportTypeData) {
    return await this.query().insert(data).into('trabill_transport_types');
  }
  public async updateTransportType(data: ITransportTypeData, ttype_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_transport_types')
      .where('ttype_id', ttype_id);
  }
  public async updateTransportTypeStatus(
    ttype_status: number,
    ttype_id: idType
  ) {
    return await this.query()
      .update({ ttype_status })
      .into('trabill_transport_types')
      .where('ttype_id', ttype_id);
  }
  public async deleteTransportType(ttype_id: idType, ttype_deleted_by: idType) {
    return await this.query()
      .update({ ttype_has_deleted: 1, ttype_deleted_by })
      .into('trabill_transport_types')
      .where('ttype_id', ttype_id);
  }

  public async getAllDesignation(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminDesignations(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertDesignation(data: IDesignationData) {
    return await this.query()
      .insert({ ...data, designation_org_agency: this.org_agency })
      .into('trabill_designations');
  }
  public async updateDesignation(
    data: IDesignationData,
    designation_id: idType
  ) {
    return await this.query()
      .update(data)
      .into('trabill_designations')
      .where('designation_id', designation_id);
  }
  public async deleteDesignation(
    designation_id: idType,
    designation_deleted_by: idType
  ) {
    return await this.query()
      .update({ designation_is_deleted: 1, designation_deleted_by })
      .into('trabill_designations')
      .where('designation_id', designation_id);
  }

  public async getAllPassportStatus(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminPassportStatus(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }
  public async insertPassportStatus(data: IPassportStatusData) {
    return await this.query().insert(data).into('trabill_passport_status');
  }
  public async updatePassportStatus(
    data: IPassportStatusData,
    pstatus_id: idType
  ) {
    return await this.query()
      .update(data)
      .into('trabill_passport_status')
      .where('pstatus_id', pstatus_id);
  }
  public async deletePassportStatus(
    pstatus_id: idType,
    pstatus_deleted_by: idType
  ) {
    return await this.query()
      .update({ pstatus_is_deleted: 1, pstatus_deleted_by })
      .into('trabill_passport_status')
      .where('pstatus_id', pstatus_id);
  }

  public async getAllAdminAgency(page: idType = 1, size: idType = 20) {
    return await this.db.transaction(async (trx) => {
      const query1 = trx.raw(`CALL GetAdminAgency(?,?,@total_rows);`, [
        page,
        size,
      ]);

      const query2 = trx.raw('SELECT @total_rows as total_rows;');

      const [[[data]], [[totalRows]]] = await Promise.all([query1, query2]);

      const totalCount = totalRows.total_rows;

      return { totalCount, data };
    });
  }

  public async insertAdminAgency(data: IAdminAgencyData) {
    return await this.query().insert(data).into('trabill_agency');
  }

  public async updateAdminAgency(data: IAdminAgencyData, agency_id: idType) {
    return await this.query()
      .update(data)
      .into('trabill_agency')
      .where('agency_id', agency_id);
  }

  public async deleteAdminAgency(agency_id: idType, agency_deleted_by: idType) {
    return await this.query()
      .update({ agency_is_deleted: 1, agency_deleted_by })
      .into('trabill_agency')
      .where('agency_id', agency_id);
  }

  public async getOfficeSalesman(page: number, size: number, search: string) {
    const page_number = (page - 1) * size;
    return await this.query()
      .select(
        'salesman_id',
        'salesman_name',
        'salesman_email',
        'salesman_number',
        'trabill_office_salesman.salesman_designation',
        'salesman_created_date',
        this.db.raw(
          '(SELECT COUNT(*) FROM trabill_agency_subscription WHERE trabill_agency_subscription.subcript_salesman = trabill_office_salesman.salesman_id) AS total_sold'
        )
      )
      .from('trabill_office_salesman')
      .leftJoin('trabill_agency_subscription', {
        subcript_salesman: 'salesman_id',
      })
      .where('salesman_is_delete', 0)
      .modify((event) => {
        if (search && search.length > 0) {
          event
            .andWhere('salesman_name', 'LIKE', `%${search}%`)
            .orWhere('salesman_number', 'LIKE', `%${search}%`)
            .orWhere('salesman_email', 'LIKE', `%${search}%`);
        }
      })
      .groupBy(
        'salesman_id',
        'salesman_name',
        'salesman_email',
        'salesman_created_date'
      )
      .limit(size)
      .offset(page_number);
  }
  public async countGetOfficeSalesman(search: string) {
    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_office_salesman')
      .where('salesman_is_delete', 0)
      .modify((event) => {
        if (search && search.length > 0) {
          event
            .andWhere('salesman_name', 'LIKE', `%${search}%`)
            .orWhere('salesman_number', 'LIKE', `%${search}%`)
            .orWhere('salesman_email', 'LIKE', `%${search}%`);
        }
      });

    return row_count;
  }
  public async getTrabillEmployeeForSelect(search: string) {
    return await this.query()
      .select('salesman_id', 'salesman_name')
      .from('trabill_office_salesman')
      .where('salesman_is_delete', 0)
      .modify((event) => {
        if (search) {
          event.andWhere('salesman_name', 'LIKE', `%${search}%`);
        } else {
          event.limit(20);
        }
      })
      .orderBy('salesman_created_date', 'desc');
  }
  public async viewOfficeSalesman(salesman_id: idType) {
    const salesman = await this.query()
      .select(
        'salesman_id',
        'salesman_name',
        'salesman_email',
        'salesman_number',
        'trabill_office_salesman.salesman_designation',
        'salesman_created_date',
        this.db.raw(
          '(SELECT COUNT(*) FROM trabill_agency_subscription WHERE trabill_agency_subscription.subcript_salesman = trabill_office_salesman.salesman_id) AS total_sold'
        )
      )
      .from('trabill_office_salesman')
      .leftJoin('trabill_agency_subscription', {
        subcript_salesman: 'salesman_id',
      })
      .where('salesman_is_delete', 0)
      .andWhere('salesman_id', salesman_id);

    if (!salesman[0]) {
      throw new CustomError(
        'Please provide a valid salesman Id',
        400,
        'Bad request'
      );
    }
    return salesman[0];
  }
  public async insertOfficeSalesman(data: ITrabillSalesman) {
    const [id] = await this.query()
      .insert(data)
      .into('trabill_office_salesman');

    return id;
  }
  public async updateOfficeSalesman(
    data: ITrabillSalesman,
    salesman_id: idType
  ) {
    return await this.query()
      .update(data)
      .into('trabill_office_salesman')
      .where({ salesman_id });
  }

  public async deleteOfficeSalesman(salesman_id: idType) {
    return await this.query()
      .update({ salesman_is_delete: 1 })
      .into('trabill_office_salesman')
      .where({ salesman_id });
  }

  public async getAgencySaleBy(
    salesman_id: idType,
    page: number,
    size: number,
    search: string,
    month: string
  ) {
    if (moment(month, 'YYYY-MM', true).isValid()) {
      month = moment(new Date(month)).format('YYYY-MM');
    } else {
      month = '';
    }

    const page_number = (page - 1) * size;

    const query = this.query()
      .select(
        'org_id',
        'org_name',
        'org_logo',
        'org_owner_full_name',
        'org_owner_email',
        'org_address1',
        'org_mobile_number',
        'org_created_date',
        'org_subscription_expired'
      )
      .from('trabill_agency_organization_information')
      .leftJoin(
        'trabill_agency_subscription',
        'subcript_org_agency',
        '=',
        'org_id'
      )
      .where('subcript_salesman', salesman_id)
      .andWhereNot('org_isdelete', 1)
      .modify(async (queryBuilder) => {
        if (search) {
          queryBuilder.andWhere(function () {
            this.where('org_name', 'LIKE', `%${search}%`)
              .orWhere('org_owner_full_name', 'LIKE', `%${search}%`)
              .orWhere('org_owner_email', 'LIKE', `%${search}%`);
          });
        }
        if (month) {
          queryBuilder.whereRaw(
            "DATE_FORMAT(org_created_date, '%Y-%m') = ?",
            month
          );
        } else {
          queryBuilder.limit(20);
        }
      })
      .limit(size)
      .offset(page_number);

    const [data, count] = await Promise.all([
      query,
      query.clone().clearSelect().clearOrder().count('* as total'),
    ]);

    return { count: count[0].total, data };
  }

  public async getSalesmanSalesForChart(
    salesmanId: idType,
    year_month: idType
  ) {
    if (moment(year_month, 'YYYY-MM', true).isValid()) {
      year_month = moment(new Date(year_month)).format('YYYY-MM');
    } else {
      year_month = '';
    }
    const [salesman] = await this.query()
      .select(
        this.db.raw(`COALESCE(COUNT(*), 0) as total_sold`),
        'salesman_name'
      )
      .from('trabill_agency_subscription')
      .leftJoin('trabill_agency_organization_information', {
        org_id: 'subcript_org_agency',
      })
      .leftJoin('trabill_office_salesman', {
        salesman_id: 'subcript_salesman',
      })
      .where('subcript_salesman', salesmanId)
      .andWhereNot('salesman_is_delete', 1)
      .modify((event) => {
        if (year_month) {
          event.whereRaw(
            "DATE_FORMAT(org_created_date, '%Y-%m') = ?",
            year_month
          );
        }
      })
      .groupBy('subcript_salesman');

    return salesman;
  }

  public async getTrabillSalesmanSales(year_month: string) {
    if (moment(year_month, 'YYYY-MM', true).isValid()) {
      year_month = moment(new Date(year_month)).format('YYYY-MM');
    } else {
      year_month = '';
    }

    if (!moment(year_month, 'YYYY-MM', true).isValid()) {
      throw new CustomError('Please provide a valid year', 400, 'Bad request');
    }
    const [total_sales] = await this.query()
      .select(
        this.db.raw(`COALESCE(COUNT(*), 0) as total_sold`),
        this.db.raw(`COALESCE(SUM(subcript_amount),0) AS sold_amount`)
      )
      .from('trabill_agency_organization_information')
      .leftJoin('trabill_agency_subscription', {
        subcript_org_agency: 'org_id',
      })
      .leftJoin('trabill_office_salesman', {
        salesman_id: 'subcript_salesman',
      })
      .whereNot('salesman_is_delete', 1)
      .andWhereNot('org_isdelete', 1)
      .modify((event) => {
        if (year_month) {
          event.whereRaw(
            "DATE_FORMAT(org_created_date, '%Y-%m') LIKE ?",
            year_month
          );
        }
      });

    return total_sales;
  }

  public async getAgencyProfile() {
    const [data] = await this.query()
      .select(
        'org_id',
        'org_name',
        'org_owner_full_name',
        'org_owner_email',
        'org_logo',
        'org_address1',
        'org_address2',
        'org_dial_code',
        'org_mobile_number',
        'org_facebook',
        'org_website',
        'org_extra_info'
      )
      .from('trabill_agency_organization_information')
      .where('org_id', this.org_agency);

    return data;
  }

  public async updateAgencyProfile(data: IUpdateAgencyProfile) {
    return await this.query()
      .update(data)
      .into('trabill_agency_organization_information')
      .where('org_id', this.org_agency);
  }

  deleteOrgAgency = async (agencyId: idType) => {
    const is_success = await this.query()
      .update('org_isdelete', 1)
      .into('trabill_agency_organization_information')
      .where('org_id', agencyId);

    if (is_success) {
      await this.db.raw(`call ${this.database}.resetDatabase(${agencyId});`);

      return 'Agency delete successfully!';
    } else {
      throw new CustomError(
        'Invalid agency',
        400,
        'Please provide a valid agency'
      );
    }
  };

  restoreOrgAgency = async (agencyId: idType) => {
    await this.query()
      .update('org_isdelete', 0)
      .into('trabill_agency_organization_information')
      .where('org_id', agencyId);
  };

  // admin activity
  insertAdminActivity = async (data: IAdminActivity) => {
    await this.query().insert(data).into('trabill_admin_activity');
  };

  public async getAllNotice(page: number, size: number, search?: string) {
    const offset = (page - 1) * size;

    const data = await this.query()
      .select('*')
      .from('trabill_agency_notice')
      .modify((e) => {
        if (search) {
          e.whereRaw(`LOWER(rc.rclient_name) LIKE ? `, [
            `%${search}%`,
          ]).orWhereRaw(`LOWER(rc.rclient_phone) LIKE ? `, [`%${search}%`]);
        }
      })

      .limit(size)
      .offset(offset)
      .orderBy('ntc_status', 'desc');

    const [{ row_count }] = await this.query()
      .select(this.db.raw('count(*) as row_count'))
      .from(`trabill_agency_notice`);

    return { count: row_count, data };
  }

  public async getActiveNotice() {
    const [data] = await this.query()
      .select('*')
      .from('trabill_agency_notice')
      .where('ntc_status', 1)
      .orderBy('ntc_id', 'desc');

    return data;
  }

  public async getNoticeImageURL(id: idType) {
    const [data] = (await this.query()
      .select('ntc_bg_img')
      .from('trabill_agency_notice')
      .where('ntc_id', id)
      .orderBy('ntc_id', 'desc')) as { ntc_bg_img: string }[];

    return data;
  }

  public async addNotice(data: INotice) {
    return await this.query()
      .insert({ ...data })
      .into('trabill_agency_notice');
  }

  public async editNotice(data: INotice, id: idType) {
    return await this.query()
      .update({ ...data })
      .into('trabill_agency_notice')
      .where('ntc_id', id);
  }

  // Database backup option

  public async bk_account() {
    const data = await this.query()
      .select('*')
      .from('trabill_accounts')
      .where('account_org_agency', this.org_agency);

    return data;
  }

  public async bk_client() {
    const data = await this.query()
      .select('*')
      .from('trabill_clients')
      .where('client_org_agency', this.org_agency);

    return data;
  }

  public async bk_client_trnx() {
    const data = await this.query()
      .select('*')
      .from('trxn.client_trxn')
      .where('ctrxn_agency_id', this.org_agency);

    return data;
  }

  public async bk_com_client() {
    const data = await this.query()
      .select('*')
      .from('trabill_combined_clients')
      .where('combine_org_agency', this.org_agency);

    return data;
  }

  public async bk_com_client_trnx() {
    const data = await this.query()
      .select('*')
      .from(`${this.trxn}.comb_trxn`)
      .where('comtrxn_agency_id', this.org_agency);

    return data;
  }

  public async bk_vendor() {
    const data = await this.query()
      .select('*')
      .from('trabill_vendors')
      .where('vendor_org_agency', this.org_agency);

    return data;
  }

  public async bk_vendor_trnx() {
    const data = await this.query()
      .select('*')
      .from(`${this.trxn}.vendor_trxn`)
      .where('vtrxn_agency_id', this.org_agency);

    return data;
  }
}

export default AdminPanelModels;
