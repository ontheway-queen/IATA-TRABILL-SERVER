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
const passport_services_1 = __importDefault(require("../services/passport.services"));
const passport_validator_1 = __importDefault(require("../validators/passport.validator"));
class PassportControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new passport_services_1.default();
        this.validator = new passport_validator_1.default();
        /**
         * add/ upload passport
         */
        this.addPassport = this.assyncWrapper.wrap(this.validator.addPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addPassport(req);
            // throw new Error('error');
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add/ upload passport');
            }
        }));
        this.deletePassport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deletePassport(req);
            // throw new Error('error');
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add/ upload passport');
            }
        }));
        this.editPassport = this.assyncWrapper.wrap(this.validator.editPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editPassport(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Edit passport');
            }
        }));
        this.allPassports = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.allPassports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All created passports');
            }
        }));
        this.getPassportsForSelect = this.assyncWrapper.wrap(this.validator.readPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPassportsForSelect(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All created passports');
            }
        }));
        this.singlePassport = this.assyncWrapper.wrap(this.validator.readPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singlePassport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All created passports');
            }
        }));
        this.changeStatus = this.assyncWrapper.wrap(this.validator.changePassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.changePassportSts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Change passport status');
            }
        }));
        this.getStatus = this.assyncWrapper.wrap(this.validator.readPassportStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get passport status');
            }
        }));
        this.passportNumberIsUnique = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.passportNumberIsUnique(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get passport status');
            }
        }));
    }
}
exports.default = PassportControllers;
//# sourceMappingURL=passport.controllers.js.map