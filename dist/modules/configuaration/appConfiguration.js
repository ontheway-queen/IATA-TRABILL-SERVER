"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configuration_routers_1 = __importDefault(require("./routers/configuration.routers"));
class AppConfiguration {
    constructor() {
        this.app = (0, express_1.default)();
        this.initRouters(new configuration_routers_1.default());
    }
    initRouters(router) {
        this.app.use('/group', router.groupRouter.routers);
        this.app.use('/passportStatus', router.passportRouter.routers);
        this.app.use('/mahram', router.mahramRouter.routers);
        this.app.use('/agency', router.agencyRouter.routers);
        this.app.use('/client-category', router.clientCategories.routers);
        this.app.use('/airports', router.airports.routers);
        this.app.use('/products', router.products.routers);
        this.app.use('/visa-types', router.visaTypes.routers);
        this.app.use('/departments', router.departments.routers);
        this.app.use('/airlines', router.airlinesRouter.routers);
        this.app.use('/expense_head', router.expenseHeadRouter.routers);
        this.app.use('/companies', router.companiesRouter.routers);
        this.app.use('/room-types', router.roomtypes.routers);
        this.app.use('/designations', router.designations.routers);
        this.app.use('/employee', router.employeeRouter.routers);
        this.app.use('/user', router.user.routers);
        this.app.use('/office', router.appConfig.routers);
    }
}
exports.default = AppConfiguration;
//# sourceMappingURL=appConfiguration.js.map