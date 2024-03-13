"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_permissions_1 = __importDefault(require("../common/middlewares/permissions/role.permissions"));
const common_types_1 = require("../common/types/common.types");
class AbstractValidator {
    constructor() {
        this.permissions = new role_permissions_1.default();
        this.resources = common_types_1.Resources;
    }
}
exports.default = AbstractValidator;
//# sourceMappingURL=abstract.validators.js.map