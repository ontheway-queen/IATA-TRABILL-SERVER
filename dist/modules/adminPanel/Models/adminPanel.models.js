"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class AdminPanelModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // @modules
        this.insertModules = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_modules');
        });
        this.updateModules = (data, module_id) => __awaiter(this, void 0, void 0, function* () {
            const is_update = yield this.query()
                .update(data)
                .from('trabill_modules')
                .where('module_id', module_id);
            if (!is_update) {
                throw new customError_1.default('Pleace provide a valid module id', 400, 'Invalid id');
            }
        });
        this.deleteModules = (module_id) => __awaiter(this, void 0, void 0, function* () {
            const is_del = yield this.query()
                .update({ module_isdeleted: 1 })
                .from('trabill_modules')
                .where('module_id', module_id);
            if (!is_del) {
                throw new customError_1.default('Pleace provide a valid module id', 400, 'Invalid id');
            }
        });
        this.getAllModules = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('trabill_modules')
                .whereNot('module_isdeleted', 1);
        });
        // @Agency_modules
        this.insertAgencyModule = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_agency_moduls');
        });
        this.updateAgencyModule = (data, agency_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .delete()
                .from('trabill_agency_moduls')
                .where('agmod_org_id', agency_id);
            yield this.query().insert(data).into('trabill_agency_moduls');
        });
        this.updatesSalesInfo = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .onConflict('subcript_org_agency')
                .merge(data)
                .into('trabill_agency_subscription');
        });
        this.updateAirTicketType = (tac_airticket_type, tac_org_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
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
        });
        this.checkUsername = (search_type, search_text) => __awaiter(this, void 0, void 0, function* () {
            const [[[is_unique]]] = yield this.db.raw(`CALL CheckUsernameUnique('${search_type}', '${search_text}');`);
            if (is_unique && is_unique.is_in !== 0) {
                return false;
            }
            else {
                return true;
            }
        });
        this.updateAgencyActiveStatus = (org_is_active, agency_id) => __awaiter(this, void 0, void 0, function* () {
            const is_update = yield this.query()
                .update({ org_is_active })
                .into('trabill_agency_organization_information')
                .where('org_id', agency_id);
            if (is_update) {
                const users = yield this.query()
                    .select('user_id')
                    .from('trabill_users')
                    .where('user_agency_id', agency_id)
                    .andWhereNot('user_is_deleted', 1);
                for (const item of users) {
                    yield this.query()
                        .delete()
                        .from('trabill_users_login_info')
                        .where('login_user_id', item.user_id);
                }
            }
            else {
                throw new customError_1.default('Pleace provice valid agency id', 400, 'Invalid agency');
            }
        });
        this.updateAgencyExpired = (org_subscription_expired, agency_id) => __awaiter(this, void 0, void 0, function* () {
            const is_update = yield this.query()
                .update({ org_subscription_expired })
                .into('trabill_agency_organization_information')
                .where('org_id', agency_id);
            if (!is_update) {
                throw new customError_1.default('Pleace provice valid agency id', 400, 'Invalid agency');
            }
        });
        this.updateAgencyLogo = (logo_url, agency_id) => __awaiter(this, void 0, void 0, function* () {
            const [previous_logo] = yield this.query()
                .select('org_logo')
                .from('trabill_agency_organization_information')
                .where('org_id', agency_id);
            const is_update = yield this.query()
                .update('org_logo', logo_url)
                .into('trabill_agency_organization_information')
                .where('org_id', agency_id);
            if (!is_update) {
                throw new customError_1.default('Pleace provice valid agency id', 400, 'Invalid agency');
            }
            return previous_logo.org_logo;
        });
        this.getAgencyCurrentPassword = (agency_id) => __awaiter(this, void 0, void 0, function* () {
            const [password] = yield this.query()
                .select('user_password as agency_password')
                .into('trabill_users')
                .where('user_agency_id', agency_id)
                .andWhere('user_role', 'SUPER_ADMIN');
            return password;
        });
        this.resetAgencyDatabase = (agency_id) => __awaiter(this, void 0, void 0, function* () {
            if (!agency_id) {
                throw new customError_1.default('Please provide a valid agency ID', 500, 'Bad request');
            }
            yield this.db.raw(`call ${this.database}.resetDatabase(${agency_id});`);
        });
        this.resetAgencyPassword = (user_password, agency_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ user_password })
                .from('trabill_users')
                .where('user_role', 'SUPER_ADMIN')
                .andWhere('user_agency_id', agency_id);
        });
        this.agencyActivity = () => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('COUNT(*) AS total_agency'), this.db.raw('SUM(CASE WHEN org_is_active = 1 THEN 1 ELSE 0 END) AS active_agency'), this.db.raw('SUM(CASE WHEN org_is_active = 0 THEN 1 ELSE 0 END) AS inactive_agency'))
                .from('trabill_agency_organization_information')
                .whereNot('org_isdelete', 1);
            return data;
        });
        this.agencyActivityReport = (page, size) => __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('org_id', 'org_owner_email', 'activity_id', 'activity_type', 'activity_description', 'activity_timestamp', 'org_name', 'org_logo')
                .from('trabill_admin_activity')
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'activity_org_id',
            })
                .orderBy('activity_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_admin_activity');
            return { count: row_count, data };
        });
        // CONFIGURATION FOR ADMIN PANEL
        this.getAllClientCategory = (page = 1, size = 20) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw('CALL GetAdminClientCategories(?, ?, @total_rows);', [page, size]);
                const query2 = trx.raw('SELECT @total_rows AS total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
            return result;
        });
        this.getClientCategoryForSelect = (search) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('category_id', 'category_title', 'category_prefix')
                .from('trabill_client_categories')
                .whereNot('category_is_deleted', 1)
                .orderBy('category_id', 'desc')
                .modify((event) => {
                if (search) {
                    event
                        .andWhere('category_title', 'LIKE', `%${search}%`)
                        .orWhere('category_prefix', 'LIKE', `%${search}%`);
                }
                else {
                    event.limit(20);
                }
            });
        });
        this.insertClientCategory = (data) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { airline_org_agency: this.org_agency }))
                .into('trabill_client_categories');
            if (!id) {
                throw new customError_1.default(`Duplicate previx not allow`, 400, 'Bad request');
            }
            return id;
        });
        this.updateClientCategory = (data, category_id) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .update(data)
                .into('trabill_client_categories')
                .where('category_id', category_id);
            return id;
        });
        this.deleteClientCate = (category_id) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db.raw(`CALL DeleteAdminClientCate(?);`, [
                category_id,
            ]);
            return id;
        });
        this.getProductCategoryForSelect = (search) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('category_id as product_category_id', 'category_title')
                .from('trabill_product_categories')
                .whereNot('category_is_deleted', 1)
                .orderBy('category_id', 'desc')
                .modify((event) => {
                if (search) {
                    event.andWhere('category_title', 'LIKE', `%${search}%`);
                }
                else {
                    event.limit(20);
                }
            });
        });
        this.deleteOrgAgency = (agencyId) => __awaiter(this, void 0, void 0, function* () {
            const is_success = yield this.query()
                .update('org_isdelete', 1)
                .into('trabill_agency_organization_information')
                .where('org_id', agencyId);
            if (is_success) {
                yield this.db.raw(`call ${this.database}.resetDatabase(${agencyId});`);
                return 'Agency delete successfully!';
            }
            else {
                throw new customError_1.default('Invalid agency', 400, 'Please provide a valid agency');
            }
        });
        this.restoreOrgAgency = (agencyId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('org_isdelete', 0)
                .into('trabill_agency_organization_information')
                .where('org_id', agencyId);
        });
        // admin activity
        this.insertAdminActivity = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_admin_activity');
        });
    }
    // @agency
    insertAgency(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [agency_id] = yield this.query()
                .insert(data)
                .into('trabill_agency_organization_information');
            return agency_id;
        });
    }
    updateAgency(data, agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const is_update = yield this.query()
                .update(data)
                .into('trabill_agency_organization_information')
                .where('org_id', agency_id);
            if (!is_update) {
                throw new customError_1.default('Pleace provide a valid agency id', 400, 'Invalid id');
            }
        });
    }
    updateAgencySubscription(agency_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_agency_subscription')
                .where('subcript_org_agency', agency_id);
        });
    }
    getAllAgency(page = 1, size = 10, search_text, isDelete = 0, expired) {
        return __awaiter(this, void 0, void 0, function* () {
            size = Number(size);
            const offset = (Number(page) - 1) * size;
            const data = yield this.db
                .select('*')
                .from('v_org_agency')
                .where('org_isdelete', isDelete)
                .modify((e) => {
                if (search_text) {
                    e.where(function () {
                        this.where('org_name', 'like', `%${search_text}%`).orWhere('mobile_no', 'like', `%${search_text}%`);
                    }).orderByRaw('CASE WHEN org_name LIKE ? THEN 1 ELSE 2 END, MATCH(org_name) AGAINST(? IN NATURAL LANGUAGE MODE) DESC', [`${search_text}%`, search_text]);
                }
                else {
                    e.offset(offset);
                    e.limit(Number(size));
                }
                if (expired === 'true') {
                    e.whereRaw('DATE(org_subscription_expired) < CURDATE()');
                }
                else {
                    e.offset(offset);
                    e.limit(Number(size));
                }
            });
            const [count] = yield this.query()
                .select(this.db.raw('count(*) as total'))
                .from('v_org_agency')
                .where('org_isdelete', isDelete)
                .modify((e) => {
                if (search_text) {
                    e.where(function () {
                        this.where('org_name', 'like', `%${search_text}%`).orWhere('mobile_no', 'like', `%${search_text}%`);
                    }).orderByRaw('CASE WHEN org_name LIKE ? THEN 1 ELSE 2 END, MATCH(org_name) AGAINST(? IN NATURAL LANGUAGE MODE) DESC', [`${search_text}%`, search_text]);
                }
                if (expired === 'true') {
                    e.whereRaw('DATE(org_subscription_expired) < CURDATE()');
                }
            });
            return { count: count.total, data };
        });
    }
    getForEdit(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('org_name', 'user_first_name', 'user_last_name', 'org_owner_email', 'org_logo', 'org_address1', 'org_address2', 'org_facebook', 'org_website', 'org_mobile_number', 'user_username', 'org_subscription_expired', 'org_sms_api_key', 'org_sms_client_id', 'org_extra_info', 'org_logo_width', 'org_logo_height', 'org_currency', 'salesman_name', 'subcript_amount', 'subcript_salesman as org_trabill_salesman_id', 'subcript_type', 'org_module_type')
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
                throw new customError_1.default('Pleace provide a valid agency id', 400, 'Invalid id');
            }
            const modules = yield this.query()
                .select('agmod_module_id', 'agmod_active_status')
                .from('trabill_agency_moduls')
                .where('agmod_org_id', agency_id);
            const modules_id = modules === null || modules === void 0 ? void 0 : modules.map((item) => item.agmod_module_id);
            return Object.assign(Object.assign({}, data), { modules_id });
        });
    }
    // get agency users by agency
    getUsersByAgency(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('user_id', 'user_role', this.db.raw("concat(user_first_name,' ',user_last_name) as user_full_name"), this.db.raw(`concat(user_dial_code,user_mobile) as mobile_no`), 'user_email', 'user_username', 'user_status')
                .from('trabill_agency_organization_information')
                .leftJoin('trabill_users', { user_agency_id: 'org_id' })
                .where('org_id', agency_id);
            return data;
        });
    }
    resentAgency() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select('*')
                .from('v_org_agency')
                .whereNot('org_isdelete', 1)
                .orderBy('org_created_date', 'desc')
                .limit(20);
        });
    }
    // CREATE AGENCY EXCEL REPORT BY  CREATE DATE
    agencyExcelReportCreateDate(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db
                .select('trabill_agency_organization_information.org_name', 'trabill_agency_organization_information.org_owner_email', 'trabill_agency_subscription.subcript_amount', 'trabill_agency_subscription.subcript_type', 'trabill_agency_subscription.sbcript_sales_date', 'trabill_agency_organization_information.org_created_date', 'trabill_agency_organization_information.org_subscription_expired', this.db.raw(`
        CONCAT(
          COALESCE(trabill_agency_organization_information.org_mobile_number, '')
        ) AS mobile_no
      `), 'trabill_office_salesman.salesman_name')
                .from('trabill_agency_organization_information')
                .whereNot('org_isdelete', 1)
                .leftJoin('trabill_agency_subscription', 'trabill_agency_subscription.subcript_org_agency', 'trabill_agency_organization_information.org_id')
                .leftJoin('trabill_office_salesman', 'trabill_office_salesman.salesman_id', 'trabill_agency_subscription.subcript_salesman')
                .whereBetween('trabill_agency_organization_information.org_created_date', [from_date, to_date])
                .orderBy('org_name');
            return data;
        });
    }
    // CREATE AGENCY EXCEL REPORT BY  CREATE DATE
    agencyExcelReportSalesDate(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db
                .select('trabill_agency_organization_information.org_name', 'trabill_agency_organization_information.org_owner_email', 'trabill_agency_subscription.subcript_amount', 'trabill_agency_subscription.subcript_type', 'trabill_agency_subscription.sbcript_sales_date', 'trabill_agency_organization_information.org_created_date', 'trabill_agency_organization_information.org_subscription_expired', this.db.raw(`
        CONCAT(
          COALESCE(trabill_agency_organization_information.org_mobile_number, '')
        ) AS mobile_no
      `), 'trabill_office_salesman.salesman_name')
                .from('trabill_agency_organization_information')
                .whereNot('org_isdelete', 1)
                .leftJoin('trabill_agency_subscription', 'trabill_agency_subscription.subcript_org_agency', 'trabill_agency_organization_information.org_id')
                .leftJoin('trabill_office_salesman', 'trabill_office_salesman.salesman_id', 'trabill_agency_subscription.subcript_salesman')
                .whereBetween('trabill_agency_subscription.sbcript_sales_date', [
                from_date,
                to_date,
            ])
                .orderBy('org_name');
            return data;
        });
    }
    getAllAirports(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminAirports(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows AS total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
            return result;
        });
    }
    insertAirports(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { airline_created_by: 3 }))
                .into('trabill_airports');
            return id;
        });
    }
    deleteAirports(id, airline_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const airport_id = yield this.query()
                .update({ airline_is_deleted: 1, airline_deleted_by })
                .into('trabill_airports')
                .where('airline_id', id);
            return airport_id;
        });
    }
    updateAirports(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const airport_id = yield this.query()
                .update(data)
                .into('trabill_airports')
                .where('airline_id', id);
            return airport_id;
        });
    }
    getAllProducts(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminProducts(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insetProducts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { product_created_by: 3 }))
                .into('trabill_products');
            return id;
        });
    }
    updateProducts(data, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_products')
                .where('product_id', product_id);
        });
    }
    deleteProducts(product_id, product_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ products_is_deleted: 1, product_deleted_by })
                .into('trabill_products')
                .where('product_id', product_id);
        });
    }
    getAllVisaType(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminVisaType(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertVisaType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(data).into('trabill_visa_types');
        });
    }
    updateVisaType(data, visa_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_visa_types')
                .where('type_id', visa_id);
        });
    }
    deleteVisaType(visa_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ type_is_deleted: 1 })
                .into('trabill_visa_types')
                .where('type_id', visa_id);
        });
    }
    getAllDepartment(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminDepartment(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertDepartment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(Object.assign(Object.assign({}, data), { department_org_agency: this.org_agency }))
                .into('trabill_departments');
        });
    }
    updateDepartment(data, department_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_departments')
                .where('department_id', department_id);
        });
    }
    deleteDepartment(department_id, department_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ department_is_deleted: 1, department_deleted_by })
                .into('trabill_departments')
                .where('department_id', department_id);
        });
    }
    getAllRoomType(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminRoomType(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertRoomType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(data).into('trabill_room_types');
        });
    }
    updateRoomType(data, rtype_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_room_types')
                .where('rtype_id', rtype_id);
        });
    }
    deleteRoomType(rtype_id, rtype_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ rtype_is_deleted: 1, rtype_deleted_by })
                .into('trabill_room_types')
                .where('rtype_id', rtype_id);
        });
    }
    getAllTransportType(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminTransportType(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertTransportType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(data).into('trabill_transport_types');
        });
    }
    updateTransportType(data, ttype_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_transport_types')
                .where('ttype_id', ttype_id);
        });
    }
    updateTransportTypeStatus(ttype_status, ttype_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ ttype_status })
                .into('trabill_transport_types')
                .where('ttype_id', ttype_id);
        });
    }
    deleteTransportType(ttype_id, ttype_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ ttype_has_deleted: 1, ttype_deleted_by })
                .into('trabill_transport_types')
                .where('ttype_id', ttype_id);
        });
    }
    getAllDesignation(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminDesignations(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertDesignation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(Object.assign(Object.assign({}, data), { designation_org_agency: this.org_agency }))
                .into('trabill_designations');
        });
    }
    updateDesignation(data, designation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_designations')
                .where('designation_id', designation_id);
        });
    }
    deleteDesignation(designation_id, designation_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ designation_is_deleted: 1, designation_deleted_by })
                .into('trabill_designations')
                .where('designation_id', designation_id);
        });
    }
    getAllPassportStatus(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminPassportStatus(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertPassportStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(data).into('trabill_passport_status');
        });
    }
    updatePassportStatus(data, pstatus_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_passport_status')
                .where('pstatus_id', pstatus_id);
        });
    }
    deletePassportStatus(pstatus_id, pstatus_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ pstatus_is_deleted: 1, pstatus_deleted_by })
                .into('trabill_passport_status')
                .where('pstatus_id', pstatus_id);
        });
    }
    getAllAdminAgency(page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL GetAdminAgency(?,?,@total_rows);`, [
                    page,
                    size,
                ]);
                const query2 = trx.raw('SELECT @total_rows as total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { totalCount, data };
            }));
        });
    }
    insertAdminAgency(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().insert(data).into('trabill_agency');
        });
    }
    updateAdminAgency(data, agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_agency')
                .where('agency_id', agency_id);
        });
    }
    deleteAdminAgency(agency_id, agency_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ agency_is_deleted: 1, agency_deleted_by })
                .into('trabill_agency')
                .where('agency_id', agency_id);
        });
    }
    getOfficeSalesman(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('salesman_id', 'salesman_name', 'salesman_email', 'salesman_number', 'trabill_office_salesman.salesman_designation', 'salesman_created_date', this.db.raw('(SELECT COUNT(*) FROM trabill_agency_subscription WHERE trabill_agency_subscription.subcript_salesman = trabill_office_salesman.salesman_id) AS total_sold'))
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
                .groupBy('salesman_id', 'salesman_name', 'salesman_email', 'salesman_created_date')
                .limit(size)
                .offset(page_number);
        });
    }
    countGetOfficeSalesman(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ row_count }] = yield this.query()
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
        });
    }
    getTrabillEmployeeForSelect(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('salesman_id', 'salesman_name')
                .from('trabill_office_salesman')
                .where('salesman_is_delete', 0)
                .modify((event) => {
                if (search) {
                    event.andWhere('salesman_name', 'LIKE', `%${search}%`);
                }
                else {
                    event.limit(20);
                }
            })
                .orderBy('salesman_created_date', 'desc');
        });
    }
    viewOfficeSalesman(salesman_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const salesman = yield this.query()
                .select('salesman_id', 'salesman_name', 'salesman_email', 'salesman_number', 'trabill_office_salesman.salesman_designation', 'salesman_created_date', this.db.raw('(SELECT COUNT(*) FROM trabill_agency_subscription WHERE trabill_agency_subscription.subcript_salesman = trabill_office_salesman.salesman_id) AS total_sold'))
                .from('trabill_office_salesman')
                .leftJoin('trabill_agency_subscription', {
                subcript_salesman: 'salesman_id',
            })
                .where('salesman_is_delete', 0)
                .andWhere('salesman_id', salesman_id);
            if (!salesman[0]) {
                throw new customError_1.default('Please provide a valid salesman Id', 400, 'Bad request');
            }
            return salesman[0];
        });
    }
    insertOfficeSalesman(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_office_salesman');
            return id;
        });
    }
    updateOfficeSalesman(data, salesman_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_office_salesman')
                .where({ salesman_id });
        });
    }
    deleteOfficeSalesman(salesman_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ salesman_is_delete: 1 })
                .into('trabill_office_salesman')
                .where({ salesman_id });
        });
    }
    getAgencySaleBy(salesman_id, page, size, search, month) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, moment_1.default)(month, 'YYYY-MM', true).isValid()) {
                month = (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            }
            else {
                month = '';
            }
            const page_number = (page - 1) * size;
            const query = this.query()
                .select('org_id', 'org_name', 'org_logo', 'org_owner_full_name', 'org_owner_email', 'org_address1', 'org_mobile_number', 'org_created_date', 'org_subscription_expired')
                .from('trabill_agency_organization_information')
                .leftJoin('trabill_agency_subscription', 'subcript_org_agency', '=', 'org_id')
                .where('subcript_salesman', salesman_id)
                .andWhereNot('org_isdelete', 1)
                .modify((queryBuilder) => __awaiter(this, void 0, void 0, function* () {
                if (search) {
                    queryBuilder.andWhere(function () {
                        this.where('org_name', 'LIKE', `%${search}%`)
                            .orWhere('org_owner_full_name', 'LIKE', `%${search}%`)
                            .orWhere('org_owner_email', 'LIKE', `%${search}%`);
                    });
                }
                if (month) {
                    queryBuilder.whereRaw("DATE_FORMAT(org_created_date, '%Y-%m') = ?", month);
                }
                else {
                    queryBuilder.limit(20);
                }
            }))
                .limit(size)
                .offset(page_number);
            const [data, count] = yield Promise.all([
                query,
                query.clone().clearSelect().clearOrder().count('* as total'),
            ]);
            return { count: count[0].total, data };
        });
    }
    getSalesmanSalesForChart(salesmanId, year_month) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, moment_1.default)(year_month, 'YYYY-MM', true).isValid()) {
                year_month = (0, moment_1.default)(new Date(year_month)).format('YYYY-MM');
            }
            else {
                year_month = '';
            }
            const [salesman] = yield this.query()
                .select(this.db.raw(`COALESCE(COUNT(*), 0) as total_sold`), 'salesman_name')
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
                    event.whereRaw("DATE_FORMAT(org_created_date, '%Y-%m') = ?", year_month);
                }
            })
                .groupBy('subcript_salesman');
            return salesman;
        });
    }
    getTrabillSalesmanSales(year_month) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, moment_1.default)(year_month, 'YYYY-MM', true).isValid()) {
                year_month = (0, moment_1.default)(new Date(year_month)).format('YYYY-MM');
            }
            else {
                year_month = '';
            }
            if (!(0, moment_1.default)(year_month, 'YYYY-MM', true).isValid()) {
                throw new customError_1.default('Please provide a valid year', 400, 'Bad request');
            }
            const [total_sales] = yield this.query()
                .select(this.db.raw(`COALESCE(COUNT(*), 0) as total_sold`), this.db.raw(`COALESCE(SUM(subcript_amount),0) AS sold_amount`))
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
                    event.whereRaw("DATE_FORMAT(org_created_date, '%Y-%m') LIKE ?", year_month);
                }
            });
            return total_sales;
        });
    }
    getAgencyProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('org_id', 'org_name', 'org_owner_full_name', 'org_owner_email', 'org_logo', 'org_address1', 'org_address2', 'org_dial_code', 'org_mobile_number', 'org_facebook', 'org_website', 'org_extra_info')
                .from('trabill_agency_organization_information')
                .where('org_id', this.org_agency);
            return data;
        });
    }
    updateAgencyProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_agency_organization_information')
                .where('org_id', this.org_agency);
        });
    }
    getAllNotice(page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
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
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('count(*) as row_count'))
                .from(`trabill_agency_notice`);
            return { count: row_count, data };
        });
    }
    getActiveNotice() {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('*')
                .from('trabill_agency_notice')
                .where('ntc_status', 1)
                .orderBy('ntc_id', 'desc');
            return data;
        });
    }
    getNoticeImageURL(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('ntc_bg_img')
                .from('trabill_agency_notice')
                .where('ntc_id', id)
                .orderBy('ntc_id', 'desc');
            return data;
        });
    }
    addNotice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(Object.assign({}, data))
                .into('trabill_agency_notice');
        });
    }
    editNotice(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(Object.assign({}, data))
                .into('trabill_agency_notice')
                .where('ntc_id', id);
        });
    }
    // Database backup option
    bk_account() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_accounts')
                .where('account_org_agency', this.org_agency);
            return data;
        });
    }
    bk_client() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_clients')
                .where('client_org_agency', this.org_agency);
            return data;
        });
    }
    bk_client_trnx() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trxn.client_trxn')
                .where('ctrxn_agency_id', this.org_agency);
            return data;
        });
    }
    bk_com_client() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_combined_clients')
                .where('combine_org_agency', this.org_agency);
            return data;
        });
    }
    bk_com_client_trnx() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from(`${this.trxn}.comb_trxn`)
                .where('comtrxn_agency_id', this.org_agency);
            return data;
        });
    }
    bk_vendor() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_vendors')
                .where('vendor_org_agency', this.org_agency);
            return data;
        });
    }
    bk_vendor_trnx() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from(`${this.trxn}.vendor_trxn`)
                .where('vtrxn_agency_id', this.org_agency);
            return data;
        });
    }
}
exports.default = AdminPanelModels;
//# sourceMappingURL=adminPanel.models.js.map