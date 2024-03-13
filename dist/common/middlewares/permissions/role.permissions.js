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
const accesscontrol_1 = require("accesscontrol");
const database_1 = require("../../../app/database");
const admin_auth_models_1 = __importDefault(require("../../../auth/admin_auth.models"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
class CheckPermissions {
    constructor() {
        this.check = (resource_name, action) => (req, _res, next) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authModel = new admin_auth_models_1.default(database_1.db, req);
                    const roles = yield authModel.getRole(req.role_id || 1);
                    if (roles) {
                        const { role_name, role_permissions } = roles;
                        const ac = new accesscontrol_1.AccessControl(JSON.parse(role_permissions));
                        const checkPerm = ac.can(role_name)[action](resource_name);
                        if (checkPerm.granted) {
                            next();
                        }
                        else {
                            next(new customError_1.default('You are not Authorized for this action', 403, 'Unauthorized user'));
                        }
                    }
                    else {
                        next(new customError_1.default('Cannot find any role for this Id', 400, 'Role not found'));
                    }
                }
                catch (err) {
                    next(new customError_1.default(err.message, 500, 'Internal server error'));
                }
            }))();
        };
    }
}
exports.default = CheckPermissions;
//# sourceMappingURL=role.permissions.js.map