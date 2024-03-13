"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agency_model_1 = __importDefault(require("../../modules/configuaration/subModules/Agency/agency.model"));
const airlines_modals_1 = __importDefault(require("../../modules/configuaration/subModules/Airlines/airlines.modals"));
const airports_model_1 = __importDefault(require("../../modules/configuaration/subModules/Airports/airports.model"));
const clientCategories_model_1 = __importDefault(require("../../modules/configuaration/subModules/ClientCategories/clientCategories.model"));
const companies_model_1 = __importDefault(require("../../modules/configuaration/subModules/Companies/companies.model"));
const departments_models_1 = __importDefault(require("../../modules/configuaration/subModules/Departments/departments.models"));
const designations_models_1 = __importDefault(require("../../modules/configuaration/subModules/Designations/designations.models"));
const employee_models_1 = __importDefault(require("../../modules/configuaration/subModules/Employee/employee.models"));
const expenseHead_models_1 = __importDefault(require("../../modules/configuaration/subModules/ExpenseHead/expenseHead.models"));
const groups_models_1 = __importDefault(require("../../modules/configuaration/subModules/Groups/groups.models"));
const mahram_models_1 = __importDefault(require("../../modules/configuaration/subModules/Mahram/mahram.models"));
const passportStatus_models_1 = __importDefault(require("../../modules/configuaration/subModules/PassportStatus/passportStatus.models"));
const products_models_1 = __importDefault(require("../../modules/configuaration/subModules/Products/products.models"));
const roomTypes_models_1 = __importDefault(require("../../modules/configuaration/subModules/RoomTypes/roomTypes.models"));
const transportTypes_models_1 = __importDefault(require("../../modules/configuaration/subModules/TransportType/transportTypes.models"));
const user_models_1 = __importDefault(require("../../modules/configuaration/subModules/User/user.models"));
const visaTypes_models_1 = __importDefault(require("../../modules/configuaration/subModules/VisaTypes/visaTypes.models"));
const appConfig_models_1 = __importDefault(require("../../modules/configuaration/subModules/appConfig/appConfig.models"));
class ConfigModel {
    constructor(db) {
        this.db = db;
    }
    appConfig(req, trx) {
        return new appConfig_models_1.default(trx || this.db, req);
    }
    visaTypeModel(req, trx) {
        return new visaTypes_models_1.default(trx || this.db, req);
    }
    agencyModel(req, trx) {
        return new agency_model_1.default(trx || this.db, req);
    }
    airlineModel(req, trx) {
        return new airlines_modals_1.default(trx || this.db, req);
    }
    airportsModel(req, trx) {
        return new airports_model_1.default(trx || this.db, req);
    }
    clientCategoryModel(req, trx) {
        return new clientCategories_model_1.default(trx || this.db, req);
    }
    companyModel(req, trx) {
        return new companies_model_1.default(trx || this.db, req);
    }
    departmentsModel(req, trx) {
        return new departments_models_1.default(trx || this.db, req);
    }
    designationModel(req, trx) {
        return new designations_models_1.default(trx || this.db, req);
    }
    employeeModel(req, trx) {
        return new employee_models_1.default(trx || this.db, req);
    }
    expenseHeadModel(req, trx) {
        return new expenseHead_models_1.default(trx || this.db, req);
    }
    groupModel(req, trx) {
        return new groups_models_1.default(trx || this.db, req);
    }
    mahramModel(req, trx) {
        return new mahram_models_1.default(trx || this.db, req);
    }
    passportStatusModel(req, trx) {
        return new passportStatus_models_1.default(trx || this.db, req);
    }
    productsModel(req, trx) {
        return new products_models_1.default(trx || this.db, req);
    }
    roomTypeModel(req, trx) {
        return new roomTypes_models_1.default(trx || this.db, req);
    }
    userModel(req, trx) {
        return new user_models_1.default(trx || this.db, req);
    }
    TransportTypeModel(req, trx) {
        return new transportTypes_models_1.default(trx || this.db, req);
    }
}
exports.default = ConfigModel;
//# sourceMappingURL=ConfigModels.js.map