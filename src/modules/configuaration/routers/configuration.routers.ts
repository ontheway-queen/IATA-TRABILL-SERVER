import AbstractRouter from '../../../abstracts/abstract.routers';
import RoutersAgency from '../subModules/Agency/agency.routers';
import RoutersAirlines from '../subModules/Airlines/airlines.routers';
import RoutersAirports from '../subModules/Airports/airports.routers';
import RoutersClientCategories from '../subModules/ClientCategories/clientCategories.routers';
import RoutersCompanies from '../subModules/Companies/companies.routers';
import RoutersDepartments from '../subModules/Departments/departments.routers';
import RoutersDesignations from '../subModules/Designations/designations.routers';
import RoutersEmployee from '../subModules/Employee/employee.routers';
import RoutersExpenseHead from '../subModules/ExpenseHead/expenseHead.routers';
import RoutersGroup from '../subModules/Groups/groups.routers';
import RouterMahram from '../subModules/Mahram/mahram.routers';
import RoutersPassportStatus from '../subModules/PassportStatus/passportStatus.routers';
import RoutersProducts from '../subModules/Products/products.routers';
import RoutersRoomTypes from '../subModules/RoomTypes/roomTypes.routers';
import UserRouters from '../subModules/User/user.routers';
import RoutersVisaTypes from '../subModules/VisaTypes/visaTypes.routers';
import AppConfigRoutes from '../subModules/appConfig/appConfig.routes';

class ConfigurationRouter extends AbstractRouter {
  public groupRouter = new RoutersGroup();
  public passportRouter = new RoutersPassportStatus();
  public mahramRouter = new RouterMahram();
  public agencyRouter = new RoutersAgency();
  public clientCategories = new RoutersClientCategories();
  public airports = new RoutersAirports();
  public products = new RoutersProducts();
  public visaTypes = new RoutersVisaTypes();
  public departments = new RoutersDepartments();
  public airlinesRouter = new RoutersAirlines();
  public expenseHeadRouter = new RoutersExpenseHead();
  public companiesRouter = new RoutersCompanies();
  public employeeRouter = new RoutersEmployee();
  public roomtypes = new RoutersRoomTypes();
  public designations = new RoutersDesignations();
  public user = new UserRouters();
  public appConfig = new AppConfigRoutes();
}

export default ConfigurationRouter;
