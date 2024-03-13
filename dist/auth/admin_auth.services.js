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
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../abstracts/abstract.services"));
const common_helper_1 = require("../common/helpers/common.helper");
const sendEmail_helper_1 = __importDefault(require("../common/helpers/sendEmail.helper"));
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../common/utils/libraries/lib"));
const admin_auth_util_1 = __importDefault(require("./admin_auth.util"));
class AdminAuthServices extends abstract_services_1.default {
    constructor() {
        super();
        this.forgotPasswordOrUsername = (req) => __awaiter(this, void 0, void 0, function* () {
            const adminConn = this.models.adminPanel(req);
            const agencyEmail = req.query.email;
            const isNotExist = yield adminConn.checkUsername('agency-email', agencyEmail);
            if (isNotExist) {
                throw new customError_1.default('Pleace provide a valid email address', 400, 'Invalid email');
            }
            const otp = (0, common_helper_1.generateOTP)(6);
            const message = {
                to: agencyEmail,
                subject: 'OTP Verification',
                text: 'Plain text body',
                html: `<div style="color: #ccc; ">
                <h4>Hello,</h4>
                <h4>Please use the following OTP to verify your account</h4>
                <h4 style="color: black;">OTP: ${otp}</h4>
                <h4 style="color: black;">This OTP is valid for 3 minutes.</h4>
                <h4 style="color: black;">If you didn't request this OTP, please ignore this email.</h4>
                <h3 style="color: black;">Best regards,</h3>
                <h3 style="color: black;">Trabill Team</h3>
                <img style="max-width: 90px;" src="https://www.trabill.biz/static/media/trabill_logo.de474cc7f1c95f09b04d.png" alt="Logo" />
            </div>`,
            };
            yield sendEmail_helper_1.default.sendEmail(message);
            this.stored_otp = otp;
            return {
                success: true,
                agencyEmail,
                message: 'Sand otp to this emal address',
            };
        });
        this.varifyOTPandChangeUsernamePassword = (req) => __awaiter(this, void 0, void 0, function* () {
            const authConn = this.models.adminAuthModel(req);
            const { otp, password } = req.body;
            if (otp !== this.stored_otp) {
                throw new customError_1.default('Otp does not match. Please try again or generate a new one.', 400, 'Invalid otp');
            }
            if (password) {
                const user_password = yield lib_1.default.hashPass(password);
                const email = req.query.email;
                yield authConn.updateUsernameAndPassword(email, user_password);
            }
            return {
                success: true,
                message: 'Your OTP is valid',
            };
        });
        this._updateUserAndPassword = (req) => __awaiter(this, void 0, void 0, function* () {
            const { username, password, user_id, dev_secret } = req.body;
            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
            const secret = currentHour * 100 + currentMinute;
            const secret2 = currentDate.getTime().toString();
            const secret3 = 'dev' + secret2.slice(0, 2) + secret.toString();
            let message = 'Please provide all info in body';
            if (username && password && user_id && secret3 == dev_secret) {
                const authConn = this.models.adminAuthModel(req);
                const user_password = yield lib_1.default.hashPass(password);
                yield authConn._updateUserAndPass(username, user_password, user_id);
                message = 'Username & password updated!';
            }
            return {
                success: true,
                message,
            };
        });
    }
    loginUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const currentDate = new Date();
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const authConn = this.models.adminAuthModel(req, trx);
                const user = yield authConn.getUserByUsername(username);
                const { user_username, user_full_name, user_password, user_role_id, user_id, user_role, role_permissions, user_agency_id, org_is_active, role_name, org_subscription_expired, role_user_type, } = user;
                const current_date = (0, dayjs_1.default)(currentDate);
                const expired_date = (0, dayjs_1.default)(org_subscription_expired);
                const remaining_days = expired_date.diff(current_date, 'day');
                const adminPass = yield authConn.adminPassword();
                yield lib_1.default.checkPassword(password, user_password, adminPass);
                const tokenCreds = {
                    user_username,
                    user_full_name,
                    user_role_id,
                    user_id,
                    user_agency_id,
                };
                const { loginInfo, newAccessToken, newRefreshToken, session_id } = yield admin_auth_util_1.default.generateTokens(tokenCreds, req.ip);
                yield authConn.insertUserLoginInfo(loginInfo);
                if (org_is_active === 0 ||
                    currentDate > new Date(org_subscription_expired)) {
                    return {
                        success: true,
                        session_id,
                        message: 'Your subscription has expired.',
                        user: {
                            user_id,
                            user_full_name,
                            user_agency_id,
                            role_name,
                            user_role: 'DEACTIVATE',
                        },
                        token: {
                            refreshToken: newRefreshToken,
                            accessToken: newAccessToken,
                        },
                    };
                }
                const loginHistory = {
                    login_user_id: user_id,
                    login_ip_address: req.ip,
                };
                yield authConn.updateUserLoginHistory(loginHistory);
                const modules = yield authConn.getUserModules(user_agency_id);
                const organization_info = yield authConn.getAgencyInfo(user_agency_id);
                return {
                    success: true,
                    session_id,
                    user: {
                        user_id,
                        user_full_name,
                        role_user_type,
                        user_agency_id,
                        user_role,
                        role_name,
                        remaining_days,
                        organization_info,
                        modules,
                        role_permissions,
                    },
                    token: { refreshToken: newRefreshToken, accessToken: newAccessToken },
                };
            }));
        });
    }
    getStartupToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { session_id } = req.query;
            if (!session_id) {
                throw new customError_1.default('Please provide user Id in query string like `?user_id=some_number`', 400, 'Provide User Id');
            }
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const authConn = this.models.adminAuthModel(req, trx);
                const currentDate = new Date();
                const data = yield authConn.getLastTokens(session_id);
                const { accessToken, accessTokenSecret, refreshToken, refreshTokenSecret, } = data;
                if (accessToken &&
                    accessTokenSecret &&
                    refreshToken &&
                    refreshTokenSecret) {
                    try {
                        const { user_full_name, user_id, user_role_id, user_username, user_agency_id, } = (yield lib_1.default.jwtVerify(accessToken, accessTokenSecret));
                        const tokenCreds = {
                            user_full_name,
                            user_id,
                            user_role_id,
                            user_username,
                            user_agency_id,
                        };
                        const { role_permissions, role_user_type, user_role, role_name, org_is_active, org_subscription_expired, } = (yield authConn.getUserById(tokenCreds.user_id))[0];
                        const current_date = (0, dayjs_1.default)(currentDate);
                        const expired_date = (0, dayjs_1.default)(org_subscription_expired);
                        const remaining_days = expired_date.diff(current_date, 'day');
                        if (org_is_active === 0 ||
                            currentDate > new Date(org_subscription_expired)) {
                            return {
                                success: true,
                                session_id,
                                message: 'Your subscription has expired.',
                                user: {
                                    user_id,
                                    user_full_name,
                                    user_agency_id,
                                    role_name,
                                    user_role: 'DEACTIVATE',
                                },
                                token: {
                                    refreshToken,
                                    accessToken,
                                },
                            };
                        }
                        const modules = yield authConn.getUserModules(user_agency_id);
                        const organization_info = yield authConn.getAgencyInfo(user_agency_id);
                        return {
                            success: true,
                            user: {
                                user_id,
                                user_full_name,
                                role_user_type,
                                user_agency_id,
                                user_role,
                                role_name,
                                remaining_days,
                                organization_info,
                                modules,
                                role_permissions,
                            },
                            token: {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                            },
                            session_id: session_id,
                        };
                    }
                    catch (err) {
                        try {
                            const { user_full_name, user_id, user_role_id, user_username, user_agency_id, } = (yield lib_1.default.jwtVerify(refreshToken, refreshTokenSecret));
                            const tokenCreds = {
                                user_full_name,
                                user_id,
                                user_role_id,
                                user_username,
                                user_agency_id,
                            };
                            const { role_permissions, role_user_type, user_role, role_name, org_is_active, org_subscription_expired, } = (yield authConn.getUserById(tokenCreds.user_id))[0];
                            if (org_is_active === 0 ||
                                currentDate > new Date(org_subscription_expired)) {
                                return {
                                    success: true,
                                    session_id,
                                    message: 'Your subscription has expired.',
                                    user: {
                                        user_id,
                                        user_full_name,
                                        user_agency_id,
                                        role_name,
                                        user_role: 'DEACTIVATE',
                                    },
                                    token: {
                                        refreshToken,
                                        accessToken,
                                    },
                                };
                            }
                            const modules = yield authConn.getUserModules(user_agency_id);
                            const organization_info = yield authConn.getAgencyInfo(user_agency_id);
                            return {
                                success: true,
                                user: {
                                    user_id,
                                    user_full_name,
                                    role_user_type,
                                    user_agency_id,
                                    user_role,
                                    role_name,
                                    organization_info,
                                    modules,
                                    role_permissions,
                                },
                                token: {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                },
                                session_id: session_id,
                            };
                        }
                        catch (err) {
                            throw new customError_1.default('Token out of date', 400, 'Session expired');
                        }
                    }
                }
                else {
                    throw new customError_1.default('No token 2', 400, 'User has no token');
                }
            }));
        });
    }
    loginAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const authConn = this.models.adminAuthModel(req, trx);
                const adminConn = this.models.adminPanel(req, trx);
                const user = yield authConn.getUserByUsername(username);
                if ((user === null || user === void 0 ? void 0 : user.user_role) !== 'DEV_ADMIN') {
                    yield adminConn.insertAdminActivity({
                        activity_description: `${username} try to login with admin panel`,
                        activity_type: 'LOGIN',
                    });
                    throw new customError_1.default('You are not authorized to access the admin panel', 403, 'Access Denied');
                }
                const { user_username, user_full_name, user_password, user_role_id, user_id, user_role, user_agency_id, role_name, } = user;
                yield lib_1.default.checkPassword(password, user_password);
                const tokenCreds = {
                    user_username,
                    user_full_name,
                    user_role_id,
                    user_id,
                    user_agency_id,
                };
                const { loginInfo, newAccessToken, newRefreshToken, session_id } = yield admin_auth_util_1.default.generateTokens(tokenCreds, req.ip);
                yield authConn.insertUserLoginInfo(loginInfo);
                const loginHistory = {
                    login_user_id: user_id,
                    login_ip_address: req.ip,
                };
                yield authConn.updateUserLoginHistory(loginHistory);
                yield adminConn.insertAdminActivity({
                    activity_description: `${user_username} login successfully`,
                    activity_type: 'LOGIN',
                });
                return {
                    success: true,
                    session_id,
                    user: {
                        user_id,
                        user_full_name,
                        user_agency_id,
                        user_role,
                        role_name,
                    },
                    token: { refreshToken: newRefreshToken, accessToken: newAccessToken },
                };
            }));
        });
    }
    logoutUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { session_id } = req.query;
            if (session_id) {
                const conn = this.models.adminAuthModel(req);
                yield conn.deleteUserLoginInfo(session_id);
                return { success: true };
            }
            else {
                throw new customError_1.default('Please provide user session Id in query string like `?session_id=1a1d1-ad4f-123-54ads1f`', 400, 'Provide User Id');
            }
        });
    }
    logout(authConn, message, session_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield authConn.deleteUserLoginInfo(session_id);
            return new customError_1.default(message, 400, 'Invalid Token');
        });
    }
    getRefreshToken(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { session_id } = req.query;
            const bearerToken = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (session_id && bearerToken) {
                return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const authConn = this.models.adminAuthModel(req, trx);
                    const login_refresh_token_secret = yield authConn.getRefreshTokenSecret(session_id);
                    let tokenCreds;
                    if (login_refresh_token_secret) {
                        try {
                            const { user_username, user_full_name, user_role_id, user_id, user_agency_id, } = (yield lib_1.default.jwtVerify(bearerToken, login_refresh_token_secret));
                            tokenCreds = {
                                user_username,
                                user_full_name,
                                user_role_id,
                                user_id: Number(user_id),
                                user_agency_id,
                            };
                        }
                        catch (err) {
                            return yield this.logout(authConn, 'Token has been expired', session_id);
                        }
                    }
                    else {
                        return yield this.logout(authConn, 'Please Provide a valid token', session_id);
                    }
                    const { loginInfo, newAccessToken, newRefreshToken, session_id: sessionId, } = yield admin_auth_util_1.default.generateTokens(tokenCreds, req.ip);
                    yield authConn.updateUserLoginInfo(session_id, loginInfo);
                    return {
                        success: true,
                        session_id: sessionId,
                        token: {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        },
                    };
                }));
            }
            else {
                throw new customError_1.default('Cannot find any token', 400, 'Bad request');
            }
        });
    }
}
exports.default = AdminAuthServices;
//# sourceMappingURL=admin_auth.services.js.map