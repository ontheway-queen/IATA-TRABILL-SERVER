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
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const refund_services_1 = __importDefault(require("../services/refund.services"));
const refund_validator_1 = __importDefault(require("../validators/refund.validator"));
class RefundController extends abstract_controllers_1.default {
    constructor() {
        super(...arguments);
        this.validator = new refund_validator_1.default();
        this.services = new refund_services_1.default();
        this.getTicketNo = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTicketNo(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Get ticker number ...');
            }
        }));
        this.airTicketInfos = this.assyncWrapper.wrap(this.validator.getAirTicketInfos, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.airTicketInfos(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Air ticket infos ...');
            }
        }));
        this.addAirTicketRefund = this.assyncWrapper.wrap(this.validator.addAirTicketRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addAirTicketRefund(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Air ticket refund added');
            }
        }));
        this.getAllAirTicketRefund = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAirTicketRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get All air ticket refunds...');
            }
        }));
        this.getRefundDescription = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getRefundDescription(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get single air ticket refunds...');
            }
        }));
        this.singleAirTicketRefund = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singleATRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get single air ticket refunds...');
            }
        }));
        this.deleteAirTicketRefund = this.assyncWrapper.wrap(this.validator.deleteAirTicketRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAirticketRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get single air ticket refunds...');
            }
        }));
        this.invoiceOtherByClient = this.assyncWrapper.wrap(this.validator.readOtherClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.invoiceOtherByClient(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Invoice other by client id... ');
            }
        }));
        this.getBillingInfo = this.assyncWrapper.wrap(this.validator.readOtherClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBillingInfo(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Get refund info...');
            }
        }));
        this.getRefundInfoVendor = this.assyncWrapper.wrap(this.validator.readOtherVendor, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getRefundInfoVendor(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Get vendor refund info...');
            }
        }));
        this.addOtherRefund = this.assyncWrapper.wrap(this.validator.addOtherRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addOtherRefund(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Client refund added');
            }
        }));
        this.getAllRefunds = this.assyncWrapper.wrap(this.validator.readOtherClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllRefunds(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get All refund other client...');
            }
        }));
        this.singleOtherRefund = this.assyncWrapper.wrap(this.validator.readOtherClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singleOtherRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Single refund other client...');
            }
        }));
        this.deleteOtherRefund = this.assyncWrapper.wrap(this.validator.deleteOtherRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteOtherRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Restore other refunds...');
            }
        }));
        this.invoiceOtherByVendor = this.assyncWrapper.wrap(this.validator.readOtherVendor, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.invoiceOtherByVendor(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Invoice other by vendor id... ');
            }
        }));
        this.getTourInvoice = this.assyncWrapper.wrap(this.validator.readTourPakageInfo, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTourInvoice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour invoice');
            }
        }));
        this.addTourPackRefund = this.assyncWrapper.wrap(this.validator.createTourPackRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addTourPackRefund(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('tour refund add');
            }
        }));
        this.getAllTourPackRefund = this.assyncWrapper.wrap(this.validator.readTourPakageInfo, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTourPackRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get tour refund...');
            }
        }));
        this.viewTourForEdit = this.assyncWrapper.wrap(this.validator.readTourPakageInfo, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewTourForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view tour for edit...');
            }
        }));
        this.deleteTourPackRefund = this.assyncWrapper.wrap(this.validator.deleteTourPackage, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTourPackRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.addPartialRefund = this.assyncWrapper.wrap(this.validator.addPartialRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addPartialRefund(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.getPersialRefundTickets = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPersialRefundTickets(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.getPersialRefundTicketsByInvoice = this.assyncWrapper.wrap(this.validator.readAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPersialRefundTicketsByInvoice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.DeletePartialRefund = this.assyncWrapper.wrap(this.validator.DeletePartialRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.DeletePartialRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.getPersialRefund = this.assyncWrapper.wrap(this.validator.readPersialRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPersialRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.getSinglePersialRefund = this.assyncWrapper.wrap(this.validator.readPersialRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSinglePersialRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
        this.getPertialAirticketInfo = this.assyncWrapper.wrap(this.validator.readPersialRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPertialAirticketInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('tour refund delete');
            }
        }));
    }
}
exports.default = RefundController;
//# sourceMappingURL=refund.controllers.js.map