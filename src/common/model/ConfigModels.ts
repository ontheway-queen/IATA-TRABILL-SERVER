import { Knex } from 'knex';
import AgencyModel from '../../modules/configuaration/subModules/Agency/agency.model';
import AirlineModel from '../../modules/configuaration/subModules/Airlines/airlines.modals';
import AirportsModel from '../../modules/configuaration/subModules/Airports/airports.model';
import ClientCategoryModel from '../../modules/configuaration/subModules/ClientCategories/clientCategories.model';
import CompanyModel from '../../modules/configuaration/subModules/Companies/companies.model';
import DepartmentsModel from '../../modules/configuaration/subModules/Departments/departments.models';
import DesignationModel from '../../modules/configuaration/subModules/Designations/designations.models';
import EmployeeModel from '../../modules/configuaration/subModules/Employee/employee.models';
import ExpenseHeadModel from '../../modules/configuaration/subModules/ExpenseHead/expenseHead.models';

import GroupModel from '../../modules/configuaration/subModules/Groups/groups.models';
import MahramModel from '../../modules/configuaration/subModules/Mahram/mahram.models';
import PassportStatusModel from '../../modules/configuaration/subModules/PassportStatus/passportStatus.models';
import ProductsModel from '../../modules/configuaration/subModules/Products/products.models';
import RoomTypeModel from '../../modules/configuaration/subModules/RoomTypes/roomTypes.models';
import TransportTypeModels from '../../modules/configuaration/subModules/TransportType/transportTypes.models';
import UserModel from '../../modules/configuaration/subModules/User/user.models';
import VisaTypeModel from '../../modules/configuaration/subModules/VisaTypes/visaTypes.models';
import { Request } from 'express';
import AppConfigModels from '../../modules/configuaration/subModules/appConfig/appConfig.models';

class ConfigModel {
  public db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  appConfig(req: Request, trx?: Knex.Transaction) {
    return new AppConfigModels(trx || this.db, req);
  }

  visaTypeModel(req: Request, trx?: Knex.Transaction) {
    return new VisaTypeModel(trx || this.db, req);
  }
  agencyModel(req: Request, trx?: Knex.Transaction) {
    return new AgencyModel(trx || this.db, req);
  }
  airlineModel(req: Request, trx?: Knex.Transaction) {
    return new AirlineModel(trx || this.db, req);
  }
  airportsModel(req: Request, trx?: Knex.Transaction) {
    return new AirportsModel(trx || this.db, req);
  }
  clientCategoryModel(req: Request, trx?: Knex.Transaction) {
    return new ClientCategoryModel(trx || this.db, req);
  }
  companyModel(req: Request, trx?: Knex.Transaction) {
    return new CompanyModel(trx || this.db, req);
  }
  departmentsModel(req: Request, trx?: Knex.Transaction) {
    return new DepartmentsModel(trx || this.db, req);
  }
  designationModel(req: Request, trx?: Knex.Transaction) {
    return new DesignationModel(trx || this.db, req);
  }
  employeeModel(req: Request, trx?: Knex.Transaction) {
    return new EmployeeModel(trx || this.db, req);
  }
  expenseHeadModel(req: Request, trx?: Knex.Transaction) {
    return new ExpenseHeadModel(trx || this.db, req);
  }

  groupModel(req: Request, trx?: Knex.Transaction) {
    return new GroupModel(trx || this.db, req);
  }
  mahramModel(req: Request, trx?: Knex.Transaction) {
    return new MahramModel(trx || this.db, req);
  }
  passportStatusModel(req: Request, trx?: Knex.Transaction) {
    return new PassportStatusModel(trx || this.db, req);
  }
  productsModel(req: Request, trx?: Knex.Transaction) {
    return new ProductsModel(trx || this.db, req);
  }
  roomTypeModel(req: Request, trx?: Knex.Transaction) {
    return new RoomTypeModel(trx || this.db, req);
  }
  userModel(req: Request, trx?: Knex.Transaction) {
    return new UserModel(trx || this.db, req);
  }

  public TransportTypeModel(req: Request, trx?: Knex.Transaction) {
    return new TransportTypeModels(trx || this.db, req);
  }
}

export default ConfigModel;
