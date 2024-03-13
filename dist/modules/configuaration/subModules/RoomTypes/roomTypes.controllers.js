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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const roomTypes_services_1 = __importDefault(require("./roomTypes.services"));
const roomTypes_validators_1 = __importDefault(require("./roomTypes.validators"));
class ControllersRoomTypes extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesRoomTypes = new roomTypes_services_1.default();
        this.validator = new roomTypes_validators_1.default();
        this.createRoomType = this.assyncWrapper.wrap(this.validator.createRoomTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesRoomTypes.createRoomType(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('create room type controller');
            }
        }));
        this.viewRoomTypes = this.assyncWrapper.wrap(this.validator.readRoomTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesRoomTypes.viewRoomTypes(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getAllRoomTypes = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesRoomTypes.getAllRoomTypes(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteRoomType = this.assyncWrapper.wrap(this.validator.deleteRoomTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesRoomTypes.deleteRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editRoomType = this.assyncWrapper.wrap(this.validator.editRoomTypes, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesRoomTypes.editRoomType(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = ControllersRoomTypes;
//# sourceMappingURL=roomTypes.controllers.js.map