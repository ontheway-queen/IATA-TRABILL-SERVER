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
const uuid_1 = require("uuid");
const lib_1 = __importDefault(require("../common/utils/libraries/lib"));
class AuthUtil {
    static generateTokens(tokenCreds, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRefreshKey = yield lib_1.default.genKey();
            const newRefreshToken = lib_1.default.createToken(tokenCreds, newRefreshKey, '7d');
            const newAccessKey = yield lib_1.default.genKey();
            const newAccessToken = lib_1.default.createToken(tokenCreds, newAccessKey, '7d');
            const session_id = (0, uuid_1.v4)();
            const loginInfo = {
                login_user_id: tokenCreds.user_id,
                login_ip_address: ip,
                login_session_id: session_id,
                login_access_token_secret: newAccessKey,
                login_refresh_token_secret: newRefreshKey,
                login_last_refresh_token: newRefreshToken,
                login_last_access_token: newAccessToken,
            };
            return {
                loginInfo,
                newAccessKey,
                newAccessToken,
                newRefreshKey,
                newRefreshToken,
                session_id,
            };
        });
    }
}
exports.default = AuthUtil;
//# sourceMappingURL=admin_auth.util.js.map