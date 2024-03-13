"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const visaStatus_services_1 = __importDefault(require("./visaStatus.services"));
const visaStatus_validator_1 = __importDefault(require("./visaStatus.validator"));
class VisaStatusControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new visaStatus_services_1.default();
        this.validator = new visaStatus_validator_1.default();
    }
}
exports.default = VisaStatusControllers;
//# sourceMappingURL=visaStatus.constrollers.js.map