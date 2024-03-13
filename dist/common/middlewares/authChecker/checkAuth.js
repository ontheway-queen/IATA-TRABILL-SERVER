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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const lib_1 = __importDefault(require("../../utils/libraries/lib"));
class AuthChecker extends abstract_services_1.default {
    constructor() {
        super(...arguments);
        this.check = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bearerToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            const session_id = req.headers.sessionid;
            if (bearerToken && session_id) {
                try {
                    const authConn = this.models.adminAuthModel(req);
                    const data = yield authConn.getAccessTokenSecret(session_id);
                    if (data) {
                        const { login_access_token_secret } = data;
                        const userInfo = (yield lib_1.default.jwtVerify(bearerToken, login_access_token_secret));
                        req.role_id = userInfo.user_role_id;
                        req.user_id = userInfo.user_id;
                        req.agency_id = userInfo.user_agency_id;
                        // call the next middleware
                        next();
                    }
                    else {
                        yield authConn.deleteUserLoginInfo(session_id);
                        next(new customError_1.default('Token expired', 401, 'Token expired'));
                    }
                }
                catch (err) {
                    next(new customError_1.default('Cannot give access to this resource as token expired', 401, `Token expired ${session_id}`));
                }
            }
            else {
                next(new customError_1.default('Please provide a token to get access to this resource', 401, `Token empty ${bearerToken}`));
            }
        });
    }
}
exports.default = AuthChecker;
//# sourceMappingURL=checkAuth.js.map