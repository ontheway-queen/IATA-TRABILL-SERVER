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
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
const configuration_services_1 = __importDefault(require("./NarrowServices/configuration.services"));
class AdminPanelServices extends abstract_services_1.default {
    conn(req, trx) {
        return this.models.adminPanel(req, trx);
    }
    constructor() {
        super();
        // @MODULES
        this.createModules = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const message = 'Module created';
            yield this.insertAudit(req, 'create', message, body.module_created_by, 'OTHERS');
            return { success: true, message, data: 'Cannot update now!' };
        });
        this.updateModules = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const module_id = req.params.module_id;
            yield this.conn(req).updateModules(body, module_id);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Update agency module : module_name - ${body.module_name}`,
                activity_type: 'UPDATE',
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return { success: true };
        });
        this.deleteModules = (req) => __awaiter(this, void 0, void 0, function* () {
            const module_id = req.params.module_id;
            yield this.conn(req).deleteModules(module_id);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Delete agency module module_id - ${module_id}`,
                activity_type: 'DELETE',
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return { success: true, message: 'Delete agency module module_id' };
        });
        this.getAllModules = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.conn(req).getAllModules();
            const message = 'All trabill modules';
            return { success: true, message, data };
        });
        // @AGENCY
        this.createAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { password, org_owner_email, user_first_name, user_last_name, user_username, org_mobile_number, org_address1, org_address2, org_facebook, org_website, org_name, modules_id, org_subscription_expired, org_sms_api_key, org_sms_client_id, org_extra_info, org_logo_width, org_logo_height, org_currency, org_trabill_salesman_id, subcript_amount, subcript_type, org_module_type, air_ticket_type, } = req.body;
            let lastName = user_last_name === 'undefined' ? undefined : user_last_name;
            const date = new Date(Date.parse(org_subscription_expired));
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.conn(req, trx);
                const user_conn = this.models.configModel.userModel(req, trx);
                // agency
                const agencyOrgData = {
                    org_address1,
                    org_address2: org_address2 === 'undefined' ? null : org_address2,
                    org_facebook: org_facebook === 'undefined' ? null : org_facebook,
                    org_website: org_website === 'undefined' ? null : org_website,
                    org_extra_info: org_extra_info === 'undefined' ? null : org_extra_info,
                    org_mobile_number,
                    org_owner_email,
                    org_logo: req.image_files['scan_copy_0'],
                    org_name,
                    org_owner_full_name: user_first_name,
                    org_subscription_expired: date,
                    org_sms_api_key: org_sms_api_key === 'undefined' ? undefined : org_sms_api_key,
                    org_sms_client_id: org_sms_client_id === 'undefined' ? undefined : org_sms_client_id,
                    org_logo_width,
                    org_logo_height,
                    org_currency,
                    org_module_type,
                };
                const user_agency_id = yield conn.insertAgency(agencyOrgData);
                // agency modules
                const modules = JSON.parse(modules_id || '');
                const agencyModules = modules.map((agmod_module_id) => {
                    return { agmod_module_id, agmod_org_id: user_agency_id };
                });
                yield conn.insertAgencyModule(agencyModules);
                // create user
                const user_password = yield lib_1.default.hashPass(password);
                const userInfo = {
                    user_password,
                    user_mobile: org_mobile_number,
                    user_email: org_owner_email,
                    user_first_name,
                    user_last_name: lastName,
                    user_role_id: 1,
                    user_username,
                    user_agency_id,
                    user_role: 'SUPER_ADMIN',
                };
                const user_id = yield user_conn.createAgencyUser(userInfo);
                const salesInfo = {
                    subcript_amount,
                    subcript_org_agency: user_agency_id,
                    subcript_salesman: org_trabill_salesman_id,
                    subcript_type,
                };
                yield conn.updatesSalesInfo(salesInfo);
                // UPDATE AGENCY APP CONFIG FOR AIR TICKET TYPE
                if (air_ticket_type) {
                    yield conn.updateAirTicketType(air_ticket_type, user_agency_id);
                }
                const message = 'Agency created';
                // Insert Admin Activity
                const activityData = {
                    activity_description: `New agency has been created and user_id= ${user_id}, user_agency_id= ${user_agency_id}`,
                    activity_type: 'CREATE',
                    activity_org_id: user_agency_id,
                };
                yield this.conn(req).insertAdminActivity(activityData);
                return { success: true, message, data: { user_id, user_agency_id } };
            }));
        });
        this.updateAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { org_owner_email, user_first_name, user_last_name, org_mobile_number, org_address1, org_address2, org_facebook, org_website, org_name, modules_id, org_subscription_expired, password, current_password, org_sms_api_key, org_sms_client_id, org_extra_info, org_logo_width, org_logo_height, org_currency, org_module_type, air_ticket_type, } = req.body;
            const date = new Date(Date.parse(org_subscription_expired));
            const agency_id = req.params.agency_id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.conn(req, trx);
                const user_conn = this.models.configModel.userModel(req, trx);
                // agency
                const agencyOrgData = {
                    org_address1,
                    org_address2,
                    org_facebook: org_facebook || '',
                    org_website: org_website || '',
                    org_mobile_number,
                    org_owner_email,
                    org_name,
                    org_owner_full_name: user_first_name + ' ' + user_last_name,
                    org_subscription_expired: date,
                    org_sms_api_key,
                    org_sms_client_id,
                    org_extra_info,
                    org_logo_width,
                    org_currency,
                    org_module_type,
                };
                if (org_logo_height)
                    agencyOrgData.org_logo_height = Number(org_logo_height);
                yield conn.updateAgency(agencyOrgData, agency_id);
                // agency modules
                const agencyModules = modules_id.map((agmod_module_id) => {
                    return { agmod_module_id, agmod_org_id: agency_id };
                });
                yield conn.updateAgencyModule(agencyModules, agency_id);
                // update user
                let user_password = undefined;
                if (password) {
                    user_password = yield lib_1.default.hashPass(password);
                    const { agency_password } = yield conn.getAgencyCurrentPassword(agency_id);
                    yield lib_1.default.checkPassword(current_password, agency_password);
                }
                const userInfo = {
                    user_password,
                    user_mobile: org_mobile_number,
                    user_email: org_owner_email,
                    user_first_name,
                    user_last_name,
                };
                yield user_conn.updateAgencyUser(userInfo, agency_id);
                // UPDATE AGENCY APP CONFIG FOR AIR TICKET TYPE
                if (air_ticket_type) {
                    yield conn.updateAirTicketType(air_ticket_type, agency_id);
                }
                const message = 'Agency has been updated';
                // Insert Admin Activity
                const activityData = {
                    activity_description: `${message} and agency_id= ${agency_id}`,
                    activity_type: 'UPDATE',
                    activity_org_id: agency_id,
                };
                yield this.conn(req).insertAdminActivity(activityData);
                return { success: true, message };
            }));
        });
        this.updatesSalesInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const data = req.body;
            yield conn.updatesSalesInfo(data);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Update sales info, sub-type:${data.subcript_type}, amount:${data.subcript_amount}/-`,
                activity_type: 'UPDATE',
                activity_org_id: data.subcript_org_agency,
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return { success: true };
        });
        this.getForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const agency_id = req.params.agency_id;
            const data = yield conn.getForEdit(agency_id);
            return { success: true, data };
        });
        // @Generate_voucher
        this.generateVouchers = (req) => __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            const data = yield this.generateVoucher(req, type);
            return { success: true, data };
        });
        this.getAllAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, trash, expired } = req.query;
            const trashParm = trash ? 1 : 0;
            const data = yield this.models
                .adminPanel(req)
                .getAllAgency(page, size, search, trashParm, expired);
            return { success: true, data };
        });
        this.resentAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.adminPanel(req).resentAgency();
            return { success: true, data };
        });
        this.checkUsername = (req) => __awaiter(this, void 0, void 0, function* () {
            const search_type = req.params.search_type;
            const search_text = req.query.search_text;
            const data = yield this.conn(req).checkUsername(search_type, search_text);
            return { success: true, message: data ? 'Unique' : 'Already exist', data };
        });
        this.updateAgencyActiveStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const agency_id = req.params.agency_id;
            const active_status = req.query.status;
            const { org_subscription_expired } = req.body;
            if (org_subscription_expired) {
                yield this.conn(req).updateAgencyExpired(org_subscription_expired, agency_id);
            }
            else {
                yield this.conn(req).updateAgencyActiveStatus(active_status, agency_id);
            }
            // Insert Admin Activity
            const activityData = {
                activity_description: `Update agency active status and agency_id =${agency_id}`,
                activity_type: 'UPDATE',
                activity_org_id: agency_id,
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return {
                success: true,
                message: `Agency ${org_subscription_expired ? 'expired date' : 'activity status'}  has been changed`,
            };
        });
        this.agencyDatabaseReset = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const agency_id = req.params.agency_id;
            const agency_email = req.body.agency_email;
            const { org_owner_email } = yield conn.getForEdit(agency_id);
            if (org_owner_email && agency_email && org_owner_email === agency_email) {
                yield conn.resetAgencyDatabase(agency_id);
                // Insert Admin Activity
                const activityData = {
                    activity_description: `Reset agency database and agency_id =${agency_id}`,
                    activity_type: 'DELETE',
                    activity_org_id: agency_id,
                };
                yield this.conn(req).insertAdminActivity(activityData);
                return { success: true, message: 'Agency database reset' };
            }
            else {
                throw new customError_1.default('Make sure you are authorized for this action', 400, 'Bad Request!');
            }
        });
        this.resetAgencyPassword = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const agency_id = req.params.agency_id;
            const { agency_email, new_password } = req.body;
            const { org_owner_email } = yield conn.getForEdit(agency_id);
            if (org_owner_email && agency_email && org_owner_email === agency_email) {
                const user_password = yield lib_1.default.hashPass(new_password);
                yield conn.resetAgencyPassword(user_password, agency_id);
                // Insert Admin Activity
                const activityData = {
                    activity_description: `Reset agency password and agency_id =${agency_id}`,
                    activity_type: 'UPDATE',
                    activity_org_id: agency_id,
                };
                yield this.conn(req).insertAdminActivity(activityData);
                return { success: true, message: 'Agency password has been reset' };
            }
            else {
                throw new customError_1.default('Make sure you are authorized for this action', 400, 'Bad Request!');
            }
        });
        this.updateAgencyLogo = (req) => __awaiter(this, void 0, void 0, function* () {
            const agency_id = req.params.agency_id;
            const conn = this.models.adminPanel(req);
            const new_logo = req.image_files['scan_copy_0'];
            if (new_logo) {
                const previous_logo = yield conn.updateAgencyLogo(new_logo, agency_id);
                yield this.deleteFile.delete_image(previous_logo);
            }
            // Insert Admin Activity
            const activityData = {
                activity_description: `Update agency logo`,
                activity_type: 'UPDATE',
                activity_org_id: agency_id,
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return { success: true, message: 'Agency logo updated ' };
        });
        this.agencyActivity = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const data = yield conn.agencyActivity();
            return { success: true, data };
        });
        this.getAgencyActivityReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.agencyActivityReport(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getOfficeSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getOfficeSalesman(Number(page) || 1, Number(size) || 20, search);
            const count = yield conn.countGetOfficeSalesman(search);
            return {
                success: true,
                message: 'All Trabill Salesman',
                count,
                data,
            };
        });
        this.getTrabillEmployeeForSelect = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getTrabillEmployeeForSelect(search);
            return { success: true, data };
        });
        this.viewOfficeSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const { salesman_id } = req.params;
            const conn = this.models.adminPanel(req);
            const data = yield conn.viewOfficeSalesman(salesman_id);
            return {
                success: true,
                message: 'Single Trabill Salesman',
                data,
            };
        });
        this.insertOfficeSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const body = req.body;
            const data = yield conn.insertOfficeSalesman(body);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Create new salesman, name: ${body.salesman_name}`,
                activity_type: 'CREATE',
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return {
                success: true,
                message: 'Create trabill office salesman successfully',
                data,
            };
        });
        this.updateOfficeSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const { salesman_id } = req.params;
            const conn = this.models.adminPanel(req);
            const body = req.body;
            const data = yield conn.updateOfficeSalesman(body, salesman_id);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Update office salesman info, name: ${body.salesman_name}`,
                activity_type: 'CREATE',
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return {
                success: true,
                message: 'Trabill salesman updated successfully!',
                data,
            };
        });
        this.deleteOfficeSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const { salesman_id } = req.params;
            const conn = this.models.adminPanel(req);
            const data = yield conn.deleteOfficeSalesman(salesman_id);
            // Insert Admin Activity
            const activityData = {
                activity_description: `Delete salesman and salesman_id=${salesman_id}`,
                activity_type: 'DELETE',
            };
            yield this.conn(req).insertAdminActivity(activityData);
            return {
                success: true,
                message: 'Trabill salesman deleted successfully!',
                data,
            };
        });
        this.getAgencySaleBy = (req) => __awaiter(this, void 0, void 0, function* () {
            const { salesman_id } = req.params;
            const { page, size, search, month } = req.query;
            const conn = this.models.adminPanel(req);
            const data = yield conn.getAgencySaleBy(salesman_id, Number(page) || 1, Number(size) || 20, search, month);
            return Object.assign({ success: true }, data);
        });
        this.getSalesmanSalesForChart = (req) => __awaiter(this, void 0, void 0, function* () {
            const { salesman_id } = req.params;
            const { year } = req.query;
            const months = [
                { month_id: '01', month_name: 'January' },
                { month_id: '02', month_name: 'February' },
                { month_id: '03', month_name: 'March' },
                { month_id: '04', month_name: 'April' },
                { month_id: '05', month_name: 'May' },
                { month_id: '06', month_name: 'June' },
                { month_id: '07', month_name: 'July' },
                { month_id: '08', month_name: 'August' },
                { month_id: '09', month_name: 'September' },
                { month_id: '10', month_name: 'October' },
                { month_id: '11', month_name: 'November' },
                { month_id: '12', month_name: 'December' },
            ];
            const data = [];
            const conn = this.models.adminPanel(req);
            for (const month of months) {
                const year_month = year
                    ? `${year}-${month.month_id}`
                    : `${new Date().getFullYear()}-${month.month_id}`;
                const salesman = yield conn.getSalesmanSalesForChart(salesman_id, year_month);
                const sales_man_info = {
                    total_sold: salesman ? salesman.total_sold || 0 : 0,
                    salesman_name: salesman ? salesman.salesman_name || null : null,
                };
                data.push(Object.assign(Object.assign({}, sales_man_info), { month: month.month_name }));
            }
            return {
                success: true,
                data,
            };
        });
        this.getTrabillSalesmanSales = (req) => __awaiter(this, void 0, void 0, function* () {
            const { year } = req.query;
            const months = [
                { month_id: '01', month_name: 'January' },
                { month_id: '02', month_name: 'February' },
                { month_id: '03', month_name: 'March' },
                { month_id: '04', month_name: 'April' },
                { month_id: '05', month_name: 'May' },
                { month_id: '06', month_name: 'June' },
                { month_id: '07', month_name: 'July' },
                { month_id: '08', month_name: 'August' },
                { month_id: '09', month_name: 'September' },
                { month_id: '10', month_name: 'October' },
                { month_id: '11', month_name: 'November' },
                { month_id: '12', month_name: 'December' },
            ];
            let data = [];
            for (const month of months) {
                const sales_year = year
                    ? `${year}-${month.month_id}`
                    : `${new Date().getFullYear()}-${month.month_id}`;
                const sales = yield this.models
                    .adminPanel(req)
                    .getTrabillSalesmanSales(String(sales_year));
                data.push(Object.assign(Object.assign({}, sales), { month: month.month_name }));
            }
            return { success: true, data };
        });
        this.getAgencyProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.conn(req).getAgencyProfile();
            return {
                success: true,
                data,
            };
        });
        this.updateAgencyProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield this.conn(req).updateAgencyProfile(body);
            return {
                success: true,
                message: 'Agency Profile has been updated successfully',
            };
        });
        this.deleteOrgAgency = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.adminPanel(req);
            const isRestore = req.query.restore;
            const agency = req.params.agency_id;
            let message;
            if (isRestore) {
                yield conn.restoreOrgAgency(agency);
                message = 'Agency has been restored!';
                // Insert Admin Activity
                const activityData = {
                    activity_description: `${message} and agency_id=${agency}`,
                    activity_type: 'RESTORED',
                    activity_org_id: agency,
                };
                yield this.conn(req).insertAdminActivity(activityData);
            }
            else {
                yield conn.deleteOrgAgency(agency);
                message = 'Agency has been delete!';
                // Insert Admin Activity
                const activityData = {
                    activity_description: `${message} and agency_id=${agency}`,
                    activity_type: 'DELETE',
                    activity_org_id: agency,
                };
                yield this.conn(req).insertAdminActivity(activityData);
            }
            return { success: true, message };
        });
        this.agencyExcelReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { created_from_date, created_to_date, sales_from_date, sales_to_date, } = req.query;
            let data = [];
            if (created_from_date &&
                created_to_date &&
                created_from_date !== 'undefined' &&
                created_to_date !== 'undefined') {
                data = yield this.models
                    .adminPanel(req)
                    .agencyExcelReportCreateDate(created_from_date, created_to_date);
            }
            else if (sales_from_date &&
                sales_to_date &&
                sales_from_date !== 'undefined' &&
                sales_to_date !== 'undefined') {
                data = yield this.models
                    .adminPanel(req)
                    .agencyExcelReportSalesDate(sales_from_date, sales_to_date);
            }
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('All Agency');
            const dirPath = path_1.default.join(__dirname, '../files');
            const filePath = `${dirPath}/agencyAll.xlsx`;
            worksheet.columns = [
                { header: 'SL', key: 'serial', width: 7 },
                { header: 'Company Name', key: 'org_name', width: 40 },
                { header: 'Email', key: 'org_owner_email', width: 40 },
                { header: 'Contact', key: 'mobile_no', width: 40 },
                { header: 'Service Charge', key: 'subcript_amount', width: 20 },
                { header: 'Subscription Type', key: 'subcript_type', width: 20 },
                { header: 'Sales BY', key: 'salesman_name', width: 20 },
                { header: 'Sales Date', key: 'sales_date', width: 20 },
                { header: 'Created At', key: 'create_date', width: 20 },
                { header: 'Expired At', key: 'expire_date', width: 20 },
            ];
            // Loop through data and populate rows
            data.forEach((report, index) => {
                report.serial = index + 1;
                report.subcript_amount = Number(report.subcript_amount);
                report.sales_date = new Date(report.sbcript_sales_date);
                report.create_date = new Date(report.org_created_date);
                report.expire_date = new Date(report.org_subscription_expired);
                const cell = worksheet.getColumn('A');
                cell.style.alignment = { horizontal: 'center' };
                worksheet.addRow(report);
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            try {
                if (!fs_1.default.existsSync(dirPath)) {
                    fs_1.default.mkdirSync(dirPath);
                }
                yield workbook.xlsx.writeFile(filePath);
                // response download
                res.download(filePath, filePath, (err) => {
                    if (err) {
                        throw new Error(`Agency All Report file not download, error is: ${err}`);
                    }
                    else {
                        fs_1.default.unlinkSync(filePath);
                    }
                });
            }
            catch (err) {
                throw new Error(`Something went wrong! Internal server error, error is: ${err}`);
            }
        });
        // configuration
        this.getAllClientCategory = new configuration_services_1.default().getAllClientCategory;
        this.getClientCategoryForSelect = new configuration_services_1.default()
            .getClientCategoryForSelect;
        this.insertClientCategory = new configuration_services_1.default().insertClientCategory;
        this.deleteClientCate = new configuration_services_1.default().deleteClientCate;
        this.updateClientCategory = new configuration_services_1.default().updateClientCategory;
        this.getAllAirports = new configuration_services_1.default().getAllAirports;
        this.inserAirports = new configuration_services_1.default().insertAirports;
        this.deleteAirports = new configuration_services_1.default().deleteAirports;
        this.updateAirports = new configuration_services_1.default().updateAirports;
        this.getAllProducts = new configuration_services_1.default().getAllProducts;
        this.getProductCategoryForSelect = new configuration_services_1.default()
            .getProductCategoryForSelect;
        this.insetProducts = new configuration_services_1.default().insetProducts;
        this.updateProducts = new configuration_services_1.default().updateProducts;
        this.deleteProducts = new configuration_services_1.default().deleteProducts;
        this.getAllVisaType = new configuration_services_1.default().getAllVisaType;
        this.inserVisaType = new configuration_services_1.default().inserVisaType;
        this.updateVisaType = new configuration_services_1.default().updateVisaType;
        this.deleteVisaType = new configuration_services_1.default().deleteVisaType;
        this.getAllDepartment = new configuration_services_1.default().getAllDepartment;
        this.inserDepartment = new configuration_services_1.default().inserDepartment;
        this.updateDepartment = new configuration_services_1.default().updateDepartment;
        this.deleteDepartment = new configuration_services_1.default().deleteDepartment;
        this.getAllRoomType = new configuration_services_1.default().getAllRoomType;
        this.inserRoomType = new configuration_services_1.default().inserRoomType;
        this.updateRoomType = new configuration_services_1.default().updateRoomType;
        this.deleteRoomType = new configuration_services_1.default().deleteRoomType;
        this.getAllTransportType = new configuration_services_1.default().getAllTransportType;
        this.inserTransportType = new configuration_services_1.default().inserTransportType;
        this.updateTransportType = new configuration_services_1.default().updateTransportType;
        this.updateTransportTypeStatus = new configuration_services_1.default()
            .updateTransportTypeStatus;
        this.deleteTransportType = new configuration_services_1.default().deleteTransportType;
        this.getAllDesignation = new configuration_services_1.default().getAllDesignation;
        this.inserDesignation = new configuration_services_1.default().inserDesignation;
        this.updateDesignation = new configuration_services_1.default().updateDesignation;
        this.deleteDesignation = new configuration_services_1.default().deleteDesignation;
        this.getAllPassportStatus = new configuration_services_1.default().getAllPassportStatus;
        this.inserPassportStatus = new configuration_services_1.default().inserPassportStatus;
        this.updatePassportStatus = new configuration_services_1.default().updatePassportStatus;
        this.deletePassportStatus = new configuration_services_1.default().deletePassportStatus;
        this.getAllAdminAgency = new configuration_services_1.default().getAllAdminAgency;
        this.inserAdminAgency = new configuration_services_1.default().inserAdminAgency;
        this.updateAdminAgency = new configuration_services_1.default().updateAdminAgency;
        this.deleteAdminAgency = new configuration_services_1.default().deleteAdminAgency;
        this.getAllNotice = new configuration_services_1.default().getAllNotice;
        this.getActiveNotice = new configuration_services_1.default().getActiveNotice;
        this.addNotice = new configuration_services_1.default().addNotice;
        this.editNotice = new configuration_services_1.default().editNotice;
        this.downloadDB = new configuration_services_1.default().downloadDB;
    }
}
exports.default = AdminPanelServices;
//# sourceMappingURL=adminPanel.services.js.map