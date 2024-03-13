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
const HajjiManagement_Services_1 = __importDefault(require("../Services/HajjiManagement.Services"));
const HajjiManagement_Validators_1 = __importDefault(require("../Validators/HajjiManagement.Validators"));
class HajjiMangementControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new HajjiManagement_Services_1.default();
        this.validator = new HajjiManagement_Validators_1.default();
        // ================ client to client ===================
        this.deleteClientToClient = this.assyncWrapper.wrap(this.validator.c2cDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteClientToClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateClientToClient = this.assyncWrapper.wrap(this.validator.c2cUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateClientToClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addClientToClient = this.assyncWrapper.wrap(this.validator.postClientToClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addClientToClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getTrackingNoByClient = this.assyncWrapper.wrap(this.validator.readCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTrackingNoByClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getTrackingNoByGroup = this.assyncWrapper.wrap(this.validator.readCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTrackingNoByGroup(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getHajjPreReg = this.assyncWrapper.wrap(this.validator.readCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllClientToClient = this.assyncWrapper.wrap(this.validator.c2cList, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllClientToClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDetailsClientToClient = this.assyncWrapper.wrap(this.validator.c2cRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDetailsClientToClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewClientTransaction = this.assyncWrapper.wrap(this.validator.c2cRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewClientTransaction(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ====================== group transaction ========================
        this.addGroupToGroup = this.assyncWrapper.wrap(this.validator.addGroupTransaction, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addGroupToGroup(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllGroupTransaction = this.assyncWrapper.wrap(this.validator.g2gList, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllGroupTransaction(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDetailsGroupTransactioon = this.assyncWrapper.wrap(this.validator.g2gRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDetailsGroupTransactioon(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewGroupTransfer = this.assyncWrapper.wrap(this.validator.g2gRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewGroupTransfer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateGroupToGroup = this.assyncWrapper.wrap(this.validator.g2gUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateGroupToGroup(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteGroupTransaction = this.assyncWrapper.wrap(this.validator.g2gDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteGroupTransaction(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ========================= transfer in =======================
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.transferInRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addTransferIn = this.assyncWrapper.wrap(this.validator.addTransferIn, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addTransferIn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateTransferIn = this.assyncWrapper.wrap(this.validator.transferInUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTransferIn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteTransferIn = this.assyncWrapper.wrap(this.validator.transferInDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteTransferIn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllHajiTransfer = this.assyncWrapper.wrap(this.validator.transferInRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllHajiTransfer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ============================== Transfer Out ===========================
        this.addTransferOut = this.assyncWrapper.wrap(this.validator.transferOutCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addTransferOut(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateTransferOut = this.assyncWrapper.wrap(this.validator.transferOutUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateTransferOut(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // =============== cancel pre reg
        this.createCancelPreReg = this.assyncWrapper.wrap(this.validator.addCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createCancelPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllCancelPreReg = this.assyncWrapper.wrap(this.validator.readCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCancelPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteCancelPreReg = this.assyncWrapper.wrap(this.validator.deleteCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteCancelPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getHajjiInfoByTrakingNo = this.assyncWrapper.wrap(this.validator.readCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjiInfoByTrakingNo(req);
            res.status(200).json(data);
        }));
        this.getHajjTrackingList = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjTrackingList(req);
            res.status(200).json(data);
        }));
        this.createCancelHajjReg = this.assyncWrapper.wrap(this.validator.createCancelHajjReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createCancelHajjReg(req);
            res.status(200).json(data);
        }));
        this.deleteCancelHajjReg = this.assyncWrapper.wrap(this.validator.deleteCancelPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteCancelHajjReg(req);
            res.status(200).json(data);
        }));
        this.getCancelHajjRegList = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCancelHajjRegList(req);
            res.status(200).json(data);
        }));
        this.getHajjHajiInfo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjHajiInfo(req);
            res.status(200).json(data);
        }));
    }
}
exports.default = HajjiMangementControllers;
//# sourceMappingURL=HajjiManagement.Controllers.js.map