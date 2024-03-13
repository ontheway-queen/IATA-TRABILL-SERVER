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
const groups_services_1 = __importDefault(require("./groups.services"));
const groups_validators_1 = __importDefault(require("./groups.validators"));
class ControllersGroups extends abstract_controllers_1.default {
    constructor() {
        super();
        this.service_groups = new groups_services_1.default();
        this.validator = new groups_validators_1.default();
        this.createControllerGroups = this.assyncWrapper.wrap(this.validator.createGroup, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service_groups.T_createGroups(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerGroups = this.assyncWrapper.wrap(this.validator.editGroup, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service_groups.T_updateGroups(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewGroups = this.assyncWrapper.wrap(this.validator.readGroup, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service_groups.viewGroups(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllGroups = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service_groups.getAllGroups(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerGroups = this.assyncWrapper.wrap(this.validator.deleteGroup, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service_groups.T_deleteGroups(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersGroups;
//# sourceMappingURL=groups.controllers.js.map