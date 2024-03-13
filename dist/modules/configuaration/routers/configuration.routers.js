"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const agency_routers_1 = __importDefault(require("../subModules/Agency/agency.routers"));
const airlines_routers_1 = __importDefault(require("../subModules/Airlines/airlines.routers"));
const airports_routers_1 = __importDefault(require("../subModules/Airports/airports.routers"));
const clientCategories_routers_1 = __importDefault(require("../subModules/ClientCategories/clientCategories.routers"));
const companies_routers_1 = __importDefault(require("../subModules/Companies/companies.routers"));
const departments_routers_1 = __importDefault(require("../subModules/Departments/departments.routers"));
const designations_routers_1 = __importDefault(require("../subModules/Designations/designations.routers"));
const employee_routers_1 = __importDefault(require("../subModules/Employee/employee.routers"));
const expenseHead_routers_1 = __importDefault(require("../subModules/ExpenseHead/expenseHead.routers"));
const groups_routers_1 = __importDefault(require("../subModules/Groups/groups.routers"));
const mahram_routers_1 = __importDefault(require("../subModules/Mahram/mahram.routers"));
const passportStatus_routers_1 = __importDefault(require("../subModules/PassportStatus/passportStatus.routers"));
const products_routers_1 = __importDefault(require("../subModules/Products/products.routers"));
const roomTypes_routers_1 = __importDefault(require("../subModules/RoomTypes/roomTypes.routers"));
const user_routers_1 = __importDefault(require("../subModules/User/user.routers"));
const visaTypes_routers_1 = __importDefault(require("../subModules/VisaTypes/visaTypes.routers"));
const appConfig_routes_1 = __importDefault(require("../subModules/appConfig/appConfig.routes"));
class ConfigurationRouter extends abstract_routers_1.default {
    constructor() {
        super(...arguments);
        this.groupRouter = new groups_routers_1.default();
        this.passportRouter = new passportStatus_routers_1.default();
        this.mahramRouter = new mahram_routers_1.default();
        this.agencyRouter = new agency_routers_1.default();
        this.clientCategories = new clientCategories_routers_1.default();
        this.airports = new airports_routers_1.default();
        this.products = new products_routers_1.default();
        this.visaTypes = new visaTypes_routers_1.default();
        this.departments = new departments_routers_1.default();
        this.airlinesRouter = new airlines_routers_1.default();
        this.expenseHeadRouter = new expenseHead_routers_1.default();
        this.companiesRouter = new companies_routers_1.default();
        this.employeeRouter = new employee_routers_1.default();
        this.roomtypes = new roomTypes_routers_1.default();
        this.designations = new designations_routers_1.default();
        this.user = new user_routers_1.default();
        this.appConfig = new appConfig_routes_1.default();
    }
}
exports.default = ConfigurationRouter;
//# sourceMappingURL=configuration.routers.js.map