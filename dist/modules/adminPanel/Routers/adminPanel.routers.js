"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const ImageUploadToAzure_trabill_1 = require("../../../common/helpers/ImageUploadToAzure_trabill");
const adminConfiguration_controllers_1 = __importDefault(require("../Controllers/adminConfiguration.controllers"));
const adminPanel_controllers_1 = __importDefault(require("../Controllers/adminPanel.controllers"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class AdminPanelRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new adminPanel_controllers_1.default();
        this.configControllers = new adminConfiguration_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/isunique/:search_type', this.controllers.checkUsername);
        this.routers.get('/activity-agency', this.controllers.agencyActivity);
        this.routers.get('/activity-report', this.controllers.agencyActivityReport);
        this.routers
            .route('/reset-agency/:agency_id')
            .put(this.controllers.agencyDatabaseReset)
            .patch(this.controllers.resetAgencyPassword);
        this.routers
            .route('/modules')
            .post(this.controllers.createModules)
            .get(this.controllers.getAllModules);
        this.routers
            .route('/modules/:module_id')
            .patch(this.controllers.updateModules)
            .delete(this.controllers.deleteModules);
        this.routers
            .route('/agency')
            .post(this.uploader.imageUpload('logos'), this.controllers.createAgency)
            .get(this.controllers.getAllAgency);
        this.routers.get('/agency/recent', this.controllers.resentAgency);
        this.routers.get('/agency-excel-download', this.controllers.agencyExcelReport);
        this.routers
            .route('/logo/:agency_id')
            .put(this.uploader.imageUpload('logos'), this.controllers.updateAgencyLogo);
        this.routers.patch('/agency/sales-info', this.controllers.updatesSalesInfo);
        this.routers
            .route('/agency/:agency_id')
            .patch(this.controllers.updateAgency)
            .get(this.controllers.getForEdit)
            .put(this.controllers.updateAgencyAcitiveStatus)
            .delete(this.controllers.deleteOrgAgency);
        // CONFIGURATION
        this.routers
            .route('/config/client-category')
            .get(this.configControllers.getAllClientCategory)
            .post(this.configControllers.insertClientCategory);
        this.routers
            .route('/config/client-category/:category_id')
            .delete(this.configControllers.deleteClientCate)
            .patch(this.configControllers.updateClientCategory);
        this.routers.get('/client-categorys', this.configControllers.getClientCategoryForSelect);
        this.routers
            .route('/config/airports')
            .get(this.configControllers.getAllAirports)
            .post(this.configControllers.insertAirports);
        this.routers
            .route('/config/airports/:id')
            .patch(this.configControllers.updateAirports)
            .delete(this.configControllers.deleteAirports);
        this.routers
            .route('/config/products')
            .get(this.configControllers.getAllProducts)
            .post(this.configControllers.insetProducts);
        this.routers
            .route('/config/products/:product_id')
            .patch(this.configControllers.updateProducts)
            .delete(this.configControllers.deleteProducts);
        this.routers.get('/config/product-category', this.configControllers.getProductCategoryForSelect);
        this.routers
            .route('/config/visa-type')
            .get(this.configControllers.getAllVisaType)
            .post(this.configControllers.inserVisaType);
        this.routers
            .route('/config/visa-type/:visa_id')
            .patch(this.configControllers.updateVisaType)
            .delete(this.configControllers.deleteVisaType);
        this.routers
            .route('/config/department')
            .get(this.configControllers.getAllDepartment)
            .post(this.configControllers.inserDepartment);
        this.routers
            .route('/config/department/:department_id')
            .patch(this.configControllers.updateDepartment)
            .delete(this.configControllers.deleteDepartment);
        this.routers
            .route('/config/room-type')
            .get(this.configControllers.getAllRoomType)
            .post(this.configControllers.inserRoomType);
        this.routers
            .route('/config/room-type/:type_id')
            .patch(this.configControllers.updateRoomType)
            .delete(this.configControllers.deleteRoomType);
        this.routers
            .route('/config/transport-type')
            .get(this.configControllers.getAllTransportType)
            .post(this.configControllers.inserTransportType);
        this.routers
            .route('/config/transport-type/:type_id')
            .patch(this.configControllers.updateTransportType)
            .put(this.configControllers.updateTransportTypeStatus)
            .delete(this.configControllers.deleteTransportType);
        this.routers
            .route('/config/designation')
            .get(this.configControllers.getAllDesignation)
            .post(this.configControllers.inserDesignation);
        this.routers
            .route('/config/designation/:type_id')
            .patch(this.configControllers.updateDesignation)
            .delete(this.configControllers.deleteDesignation);
        this.routers
            .route('/config/passport-status')
            .get(this.configControllers.getAllPassportStatus)
            .post(this.configControllers.inserPassportStatus);
        this.routers
            .route('/config/passport-status/:type_id')
            .patch(this.configControllers.updatePassportStatus)
            .delete(this.configControllers.deletePassportStatus);
        this.routers
            .route('/config/agency')
            .get(this.configControllers.getAllAdminAgency)
            .post(this.configControllers.inserAdminAgency);
        this.routers
            .route('/config/agency/:type_id')
            .patch(this.configControllers.updateAdminAgency)
            .delete(this.configControllers.deleteAdminAgency);
        this.routers
            .route('/trabill-salesman')
            .get(this.configControllers.getOfficeSalesman)
            .post(this.configControllers.insertOfficeSalesman);
        this.routers
            .route('/trabill-salesman/:salesman_id')
            .get(this.configControllers.viewOfficeSalesman)
            .patch(this.configControllers.updateOfficeSalesman)
            .delete(this.configControllers.deleteOfficeSalesman);
        this.routers.get('/salesman/:salesman_id', this.configControllers.getAgencySaleBy);
        this.routers.get('/salesman-chart/:salesman_id', this.configControllers.getSalesmanSalesForChart);
        this.routers.get('/salesman', this.configControllers.getTrabillEmployeeForSelect);
        this.routers.get('/trabill_sales', this.configControllers.getTrabillSalesmanSales);
        this.routers
            .route('/agency_profile')
            .get(this.controllers.getAgencyProfile)
            .put(this.controllers.updateAgencyProfile);
        // Notice
        this.routers
            .route('/notice')
            .get(this.configControllers.getAllNotice)
            .post(upload.fields([{ name: 'ntc_bg_img', maxCount: 1 }]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.configControllers.addNotice)
            .patch(upload.fields([{ name: 'ntc_bg_img', maxCount: 1 }]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.configControllers.editNotice);
        this.routers
            .route('/active-notice')
            .get(this.configControllers.getActiveNotice);
        // DB Backup
        this.routers.route('/db-backup').get(this.configControllers.downloadDB);
    }
}
exports.default = AdminPanelRouters;
//# sourceMappingURL=adminPanel.routers.js.map