import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../abstracts/abstract.services';
import { VoucherType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import Lib from '../../../common/utils/libraries/lib';
import {
  ICreateUser,
  IUpdateUserAdmin,
} from '../../configuaration/subModules/User/user.interfaces';
import {
  IAdminActivity,
  IAgencyOrgBody,
  IAgencyOrganization,
  IModules,
  ISalesInfo,
  ITrabillSalesman,
  IUpdateAgencyOrgBody,
  IUpdateAgencyOrganization,
  IUpdateAgencyProfile,
} from '../Interfaces/adminPanel.interfaces';
import AdminConfiguration from './NarrowServices/configuration.services';

class AdminPanelServices extends AbstractServices {
  conn(req: Request, trx?: Knex.Transaction) {
    return this.models.adminPanel(req, trx);
  }
  constructor() {
    super();
  }

  // @MODULES
  createModules = async (req: Request) => {
    const body = req.body as IModules;

    const message = 'Module created';
    await this.insertAudit(
      req,
      'create',
      message,
      body.module_created_by,
      'OTHERS'
    );

    return { success: true, message, data: 'Cannot update now!' };
  };

  updateModules = async (req: Request) => {
    const body = req.body as IModules;
    const module_id = req.params.module_id;

    await this.conn(req).updateModules(body, module_id as string);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Update agency module : module_name - ${body.module_name}`,
      activity_type: 'UPDATE',
    };
    await this.conn(req).insertAdminActivity(activityData);

    return { success: true };
  };

  deleteModules = async (req: Request) => {
    const module_id = req.params.module_id;

    await this.conn(req).deleteModules(module_id as string);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Delete agency module module_id - ${module_id}`,
      activity_type: 'DELETE',
    };
    await this.conn(req).insertAdminActivity(activityData);

    return { success: true, message: 'Delete agency module module_id' };
  };

  getAllModules = async (req: Request) => {
    const data = await this.conn(req).getAllModules();

    const message = 'All trabill modules';

    return { success: true, message, data };
  };

  // @AGENCY
  createAgency = async (req: Request) => {
    const {
      password,
      org_owner_email,
      user_first_name,
      user_last_name,
      user_username,
      org_mobile_number,
      org_address1,
      org_address2,
      org_facebook,
      org_website,
      org_name,
      modules_id,
      org_subscription_expired,
      org_sms_api_key,
      org_sms_client_id,
      org_extra_info,
      org_logo_width,
      org_logo_height,
      org_currency,
      org_trabill_salesman_id,
      subcript_amount,
      subcript_type,
      org_module_type,
      air_ticket_type,
    } = req.body as IAgencyOrgBody;

    let lastName = user_last_name === 'undefined' ? undefined : user_last_name;

    const date = new Date(Date.parse(org_subscription_expired));

    return await this.models.db.transaction(async (trx) => {
      const conn = this.conn(req, trx);

      const user_conn = this.models.configModel.userModel(req, trx);

      // agency
      const agencyOrgData: IAgencyOrganization = {
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
        org_sms_api_key:
          org_sms_api_key === 'undefined' ? undefined : org_sms_api_key,
        org_sms_client_id:
          org_sms_client_id === 'undefined' ? undefined : org_sms_client_id,
        org_logo_width,
        org_logo_height,
        org_currency,
        org_module_type,
      };

      const user_agency_id = await conn.insertAgency(agencyOrgData);

      // agency modules

      const modules: number[] = JSON.parse(modules_id || '');

      const agencyModules = modules.map((agmod_module_id) => {
        return { agmod_module_id, agmod_org_id: user_agency_id };
      });

      await conn.insertAgencyModule(agencyModules);

      // create user
      const user_password = await Lib.hashPass(password);

      const userInfo: ICreateUser = {
        user_password,
        user_mobile: org_mobile_number,
        user_email: org_owner_email,
        user_first_name,
        user_last_name: lastName,
        user_role_id: 1, // you need to create a super admin roles and set super admin role_id
        user_username,
        user_agency_id,
        user_role: 'SUPER_ADMIN',
      };

      const user_id = await user_conn.createAgencyUser(userInfo);

      const salesInfo: ISalesInfo = {
        subcript_amount,
        subcript_org_agency: user_agency_id,
        subcript_salesman: org_trabill_salesman_id,
        subcript_type,
      };

      await conn.updatesSalesInfo(salesInfo);

      // UPDATE AGENCY APP CONFIG FOR AIR TICKET TYPE
      if (air_ticket_type) {
        await conn.updateAirTicketType(air_ticket_type, user_agency_id);
      }

      const message = 'Agency created';

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `New agency has been created and user_id= ${user_id}, user_agency_id= ${user_agency_id}`,
        activity_type: 'CREATE',
        activity_org_id: user_agency_id,
      };
      await this.conn(req).insertAdminActivity(activityData);

      return { success: true, message, data: { user_id, user_agency_id } };
    });
  };

  updateAgency = async (req: Request) => {
    const {
      org_owner_email,
      user_first_name,
      user_last_name,
      org_mobile_number,
      org_address1,
      org_address2,
      org_facebook,
      org_website,
      org_name,
      modules_id,
      org_subscription_expired,
      password,
      current_password,
      org_sms_api_key,
      org_sms_client_id,
      org_extra_info,
      org_logo_width,
      org_logo_height,
      org_currency,
      org_module_type,
      air_ticket_type,
    } = req.body as IUpdateAgencyOrgBody;
    const date = new Date(Date.parse(org_subscription_expired));

    const agency_id = req.params.agency_id;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.conn(req, trx);

      const user_conn = this.models.configModel.userModel(req, trx);

      // agency
      const agencyOrgData: IUpdateAgencyOrganization = {
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

      await conn.updateAgency(agencyOrgData, agency_id);

      // agency modules

      const agencyModules = modules_id.map((agmod_module_id) => {
        return { agmod_module_id, agmod_org_id: agency_id };
      });

      await conn.updateAgencyModule(agencyModules, agency_id);

      // update user
      let user_password = undefined;
      if (password) {
        user_password = await Lib.hashPass(password);
        const { agency_password } = await conn.getAgencyCurrentPassword(
          agency_id
        );

        await Lib.checkPassword(current_password as string, agency_password);
      }

      const userInfo: IUpdateUserAdmin = {
        user_password,
        user_mobile: org_mobile_number,
        user_email: org_owner_email,
        user_first_name,
        user_last_name,
      };

      await user_conn.updateAgencyUser(userInfo, agency_id);

      // UPDATE AGENCY APP CONFIG FOR AIR TICKET TYPE
      if (air_ticket_type) {
        await conn.updateAirTicketType(air_ticket_type, agency_id);
      }

      const message = 'Agency has been updated';

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `${message} and agency_id= ${agency_id}`,
        activity_type: 'UPDATE',
        activity_org_id: agency_id,
      };
      await this.conn(req).insertAdminActivity(activityData);

      return { success: true, message };
    });
  };

  updatesSalesInfo = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const data = req.body as ISalesInfo;

    await conn.updatesSalesInfo(data);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Update sales info, sub-type:${data.subcript_type}, amount:${data.subcript_amount}/-`,
      activity_type: 'UPDATE',
      activity_org_id: data.subcript_org_agency,
    };

    await this.conn(req).insertAdminActivity(activityData);

    return { success: true };
  };

  getForEdit = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const agency_id = req.params.agency_id;

    const data = await conn.getForEdit(agency_id);

    return { success: true, data };
  };

  // @Generate_voucher
  public generateVouchers = async (req: Request) => {
    const type = req.params.type as VoucherType;

    const data = await this.generateVoucher(req, type);

    return { success: true, data };
  };

  public getAllAgency = async (req: Request) => {
    const { page, size, search, trash, expired } = req.query as {
      page: string;
      size: string;
      search: string;
      trash: 'true';
      expired: 'true';
    };

    const trashParm = trash ? 1 : 0;

    const data = await this.models
      .adminPanel(req)
      .getAllAgency(page, size, search, trashParm, expired);

    return { success: true, data };
  };

  public resentAgency = async (req: Request) => {
    const data = await this.models.adminPanel(req).resentAgency();
    return { success: true, data };
  };

  public checkUsername = async (req: Request) => {
    const search_type = req.params.search_type;
    const search_text = req.query.search_text as string;

    const data = await this.conn(req).checkUsername(search_type, search_text);

    return { success: true, message: data ? 'Unique' : 'Already exist', data };
  };

  public updateAgencyActiveStatus = async (req: Request) => {
    const agency_id = req.params.agency_id;
    const active_status = req.query.status as string;

    const { org_subscription_expired } = req.body;

    if (org_subscription_expired) {
      await this.conn(req).updateAgencyExpired(
        org_subscription_expired,
        agency_id
      );
    } else {
      await this.conn(req).updateAgencyActiveStatus(active_status, agency_id);
    }

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Update agency active status and agency_id =${agency_id}`,
      activity_type: 'UPDATE',
      activity_org_id: agency_id,
    };
    await this.conn(req).insertAdminActivity(activityData);

    return {
      success: true,
      message: `Agency ${
        org_subscription_expired ? 'expired date' : 'activity status'
      }  has been changed`,
    };
  };

  agencyDatabaseReset = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const agency_id = req.params.agency_id;

    const agency_email = req.body.agency_email;

    const { org_owner_email } = await conn.getForEdit(agency_id);

    if (org_owner_email && agency_email && org_owner_email === agency_email) {
      await conn.resetAgencyDatabase(agency_id);

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `Reset agency database and agency_id =${agency_id}`,
        activity_type: 'DELETE',
        activity_org_id: agency_id,
      };
      await this.conn(req).insertAdminActivity(activityData);

      return { success: true, message: 'Agency database reset' };
    } else {
      throw new CustomError(
        'Make sure you are authorized for this action',
        400,
        'Bad Request!'
      );
    }
  };

  resetAgencyPassword = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const agency_id = req.params.agency_id;

    const { agency_email, new_password } = req.body;

    const { org_owner_email } = await conn.getForEdit(agency_id);

    if (org_owner_email && agency_email && org_owner_email === agency_email) {
      const user_password = await Lib.hashPass(new_password);

      await conn.resetAgencyPassword(user_password, agency_id);

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `Reset agency password and agency_id =${agency_id}`,
        activity_type: 'UPDATE',
        activity_org_id: agency_id,
      };
      await this.conn(req).insertAdminActivity(activityData);

      return { success: true, message: 'Agency password has been reset' };
    } else {
      throw new CustomError(
        'Make sure you are authorized for this action',
        400,
        'Bad Request!'
      );
    }
  };

  updateAgencyLogo = async (req: Request) => {
    const agency_id = req.params.agency_id;

    const conn = this.models.adminPanel(req);

    const new_logo = req.image_files['scan_copy_0'];

    console.log({ new_logo });

    if (new_logo) {
      const previous_logo = await conn.updateAgencyLogo(new_logo, agency_id);

      await this.deleteFile.delete_image(previous_logo);
    }

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Update agency logo`,
      activity_type: 'UPDATE',
      activity_org_id: agency_id,
    };
    await this.conn(req).insertAdminActivity(activityData);

    return { success: true, message: 'Agency logo updated ' };
  };

  agencyActivity = async (req: Request) => {
    const conn = this.models.adminPanel(req);

    const data = await conn.agencyActivity();

    return { success: true, data };
  };

  public getAgencyActivityReport = async (req: Request) => {
    const { page, size } = req.query as {
      page: string;
      size: string;
    };

    const conn = this.models.adminPanel(req);

    const data = await conn.agencyActivityReport(
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getOfficeSalesman = async (req: Request) => {
    const { page, size, search } = req.query as {
      page: string;
      size: string;
      search: string;
    };

    const conn = this.models.adminPanel(req);

    const data = await conn.getOfficeSalesman(
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    const count = await conn.countGetOfficeSalesman(search);

    return {
      success: true,
      message: 'All Trabill Salesman',
      count,
      data,
    };
  };

  public getTrabillEmployeeForSelect = async (req: Request) => {
    const { search } = req.query as { search: string };
    const conn = this.models.adminPanel(req);

    const data = await conn.getTrabillEmployeeForSelect(search);

    return { success: true, data };
  };

  public viewOfficeSalesman = async (req: Request) => {
    const { salesman_id } = req.params;

    const conn = this.models.adminPanel(req);

    const data = await conn.viewOfficeSalesman(salesman_id);

    return {
      success: true,
      message: 'Single Trabill Salesman',
      data,
    };
  };

  public insertOfficeSalesman = async (req: Request) => {
    const conn = this.models.adminPanel(req);
    const body = req.body as ITrabillSalesman;
    const data = await conn.insertOfficeSalesman(body);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Create new salesman, name: ${body.salesman_name}`,
      activity_type: 'CREATE',
    };
    await this.conn(req).insertAdminActivity(activityData);

    return {
      success: true,
      message: 'Create trabill office salesman successfully',
      data,
    };
  };

  public updateOfficeSalesman = async (req: Request) => {
    const { salesman_id } = req.params as { salesman_id: string };

    const conn = this.models.adminPanel(req);
    const body = req.body as ITrabillSalesman;

    const data = await conn.updateOfficeSalesman(body, salesman_id);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Update office salesman info, name: ${body.salesman_name}`,
      activity_type: 'CREATE',
    };
    await this.conn(req).insertAdminActivity(activityData);

    return {
      success: true,
      message: 'Trabill salesman updated successfully!',
      data,
    };
  };

  public deleteOfficeSalesman = async (req: Request) => {
    const { salesman_id } = req.params as { salesman_id: string };

    const conn = this.models.adminPanel(req);

    const data = await conn.deleteOfficeSalesman(salesman_id);

    // Insert Admin Activity
    const activityData: IAdminActivity = {
      activity_description: `Delete salesman and salesman_id=${salesman_id}`,
      activity_type: 'DELETE',
    };
    await this.conn(req).insertAdminActivity(activityData);

    return {
      success: true,
      message: 'Trabill salesman deleted successfully!',
      data,
    };
  };

  public getAgencySaleBy = async (req: Request) => {
    const { salesman_id } = req.params as { salesman_id: string };
    const { page, size, search, month } = req.query as {
      page: string;
      size: string;
      search: string;
      month: string;
    };

    const conn = this.models.adminPanel(req);

    const data = await conn.getAgencySaleBy(
      salesman_id,
      Number(page) || 1,
      Number(size) || 20,
      search,
      month
    );

    return { success: true, ...data };
  };

  getSalesmanSalesForChart = async (req: Request) => {
    const { salesman_id } = req.params as { salesman_id: string };
    const { year } = req.query as { year: string };

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

    const data: any[] = [];

    const conn = this.models.adminPanel(req);

    for (const month of months) {
      const year_month = year
        ? `${year}-${month.month_id}`
        : `${new Date().getFullYear()}-${month.month_id}`;

      const salesman = await conn.getSalesmanSalesForChart(
        salesman_id,
        year_month
      );

      const sales_man_info = {
        total_sold: salesman ? salesman.total_sold || 0 : 0,
        salesman_name: salesman ? salesman.salesman_name || null : null,
      };

      data.push({ ...sales_man_info, month: month.month_name });
    }

    return {
      success: true,
      data,
    };
  };

  public getTrabillSalesmanSales = async (req: Request) => {
    const { year } = req.query as { year: string };

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

    let data: any[] = [];
    for (const month of months) {
      const sales_year = year
        ? `${year}-${month.month_id}`
        : `${new Date().getFullYear()}-${month.month_id}`;

      const sales = await this.models
        .adminPanel(req)
        .getTrabillSalesmanSales(String(sales_year));

      data.push({ ...sales, month: month.month_name });
    }

    return { success: true, data };
  };

  public getAgencyProfile = async (req: Request) => {
    const data = await this.conn(req).getAgencyProfile();

    return {
      success: true,
      data,
    };
  };

  public updateAgencyProfile = async (req: Request) => {
    const body = req.body as IUpdateAgencyProfile;

    await this.conn(req).updateAgencyProfile(body);

    return {
      success: true,
      message: 'Agency Profile has been updated successfully',
    };
  };

  public deleteOrgAgency = async (req: Request, res: Response) => {
    const conn = this.models.adminPanel(req);
    const isRestore = req.query.restore;
    const agency = req.params.agency_id;

    let message;

    if (isRestore) {
      await conn.restoreOrgAgency(agency);
      message = 'Agency has been restored!';

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `${message} and agency_id=${agency}`,
        activity_type: 'RESTORED',
        activity_org_id: agency,
      };
      await this.conn(req).insertAdminActivity(activityData);
    } else {
      await conn.deleteOrgAgency(agency);
      message = 'Agency has been delete!';

      // Insert Admin Activity
      const activityData: IAdminActivity = {
        activity_description: `${message} and agency_id=${agency}`,
        activity_type: 'DELETE',
        activity_org_id: agency,
      };
      await this.conn(req).insertAdminActivity(activityData);
    }

    return { success: true, message };
  };

  public agencyExcelReport = async (req: Request, res: Response) => {
    const {
      created_from_date,
      created_to_date,
      sales_from_date,
      sales_to_date,
    } = req.query as {
      created_from_date: string;
      created_to_date: string;
      sales_from_date: string;
      sales_to_date: string;
    };

    let data: any[] = [];
    if (
      created_from_date &&
      created_to_date &&
      created_from_date !== 'undefined' &&
      created_to_date !== 'undefined'
    ) {
      data = await this.models
        .adminPanel(req)
        .agencyExcelReportCreateDate(created_from_date, created_to_date);
    } else if (
      sales_from_date &&
      sales_to_date &&
      sales_from_date !== 'undefined' &&
      sales_to_date !== 'undefined'
    ) {
      data = await this.models
        .adminPanel(req)
        .agencyExcelReportSalesDate(sales_from_date, sales_to_date);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Agency');
    const dirPath = path.join(__dirname, '../files');
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
    data.forEach((report: any, index: number) => {
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
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      await workbook.xlsx.writeFile(filePath);
      // response download
      res.download(filePath, filePath, (err: string) => {
        if (err) {
          throw new Error(
            `Agency All Report file not download, error is: ${err}`
          );
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (err: any | unknown) {
      throw new Error(
        `Something went wrong! Internal server error, error is: ${err}`
      );
    }
  };

  // configuration
  public getAllClientCategory = new AdminConfiguration().getAllClientCategory;
  public getClientCategoryForSelect = new AdminConfiguration()
    .getClientCategoryForSelect;
  public insertClientCategory = new AdminConfiguration().insertClientCategory;
  public deleteClientCate = new AdminConfiguration().deleteClientCate;
  public updateClientCategory = new AdminConfiguration().updateClientCategory;

  public getAllAirports = new AdminConfiguration().getAllAirports;
  public inserAirports = new AdminConfiguration().insertAirports;
  public deleteAirports = new AdminConfiguration().deleteAirports;
  public updateAirports = new AdminConfiguration().updateAirports;

  public getAllProducts = new AdminConfiguration().getAllProducts;
  public getProductCategoryForSelect = new AdminConfiguration()
    .getProductCategoryForSelect;
  public insetProducts = new AdminConfiguration().insetProducts;
  public updateProducts = new AdminConfiguration().updateProducts;
  public deleteProducts = new AdminConfiguration().deleteProducts;

  public getAllVisaType = new AdminConfiguration().getAllVisaType;
  public inserVisaType = new AdminConfiguration().inserVisaType;
  public updateVisaType = new AdminConfiguration().updateVisaType;
  public deleteVisaType = new AdminConfiguration().deleteVisaType;

  public getAllDepartment = new AdminConfiguration().getAllDepartment;
  public inserDepartment = new AdminConfiguration().inserDepartment;
  public updateDepartment = new AdminConfiguration().updateDepartment;
  public deleteDepartment = new AdminConfiguration().deleteDepartment;

  public getAllRoomType = new AdminConfiguration().getAllRoomType;
  public inserRoomType = new AdminConfiguration().inserRoomType;
  public updateRoomType = new AdminConfiguration().updateRoomType;
  public deleteRoomType = new AdminConfiguration().deleteRoomType;

  public getAllTransportType = new AdminConfiguration().getAllTransportType;
  public inserTransportType = new AdminConfiguration().inserTransportType;
  public updateTransportType = new AdminConfiguration().updateTransportType;
  public updateTransportTypeStatus = new AdminConfiguration()
    .updateTransportTypeStatus;
  public deleteTransportType = new AdminConfiguration().deleteTransportType;

  public getAllDesignation = new AdminConfiguration().getAllDesignation;
  public inserDesignation = new AdminConfiguration().inserDesignation;
  public updateDesignation = new AdminConfiguration().updateDesignation;
  public deleteDesignation = new AdminConfiguration().deleteDesignation;

  public getAllPassportStatus = new AdminConfiguration().getAllPassportStatus;
  public inserPassportStatus = new AdminConfiguration().inserPassportStatus;
  public updatePassportStatus = new AdminConfiguration().updatePassportStatus;
  public deletePassportStatus = new AdminConfiguration().deletePassportStatus;

  public getAllAdminAgency = new AdminConfiguration().getAllAdminAgency;
  public inserAdminAgency = new AdminConfiguration().inserAdminAgency;
  public updateAdminAgency = new AdminConfiguration().updateAdminAgency;
  public deleteAdminAgency = new AdminConfiguration().deleteAdminAgency;

  public getAllNotice = new AdminConfiguration().getAllNotice;
  public getActiveNotice = new AdminConfiguration().getActiveNotice;
  public addNotice = new AdminConfiguration().addNotice;
  public editNotice = new AdminConfiguration().editNotice;

  public downloadDB = new AdminConfiguration().downloadDB;
}

export default AdminPanelServices;
