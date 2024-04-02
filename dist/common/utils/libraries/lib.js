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
exports.getNext15Day = exports.getIataDateRange = exports.getPaymentType = exports.addOneWithInvoiceNo = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config/config"));
const customError_1 = __importDefault(require("../errors/customError"));
const dayjs_1 = __importDefault(require("dayjs"));
class Lib {
    static jwtVerify(token, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, key, (err, decoded) => {
                    if (err) {
                        reject(new Error('Invalid Token'));
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        });
    }
    static hashPass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    static genKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.genSalt(10);
        });
    }
    static checkPassword(password, hashedPassword, adminPass) {
        return __awaiter(this, void 0, void 0, function* () {
            if (adminPass) {
                const is_admin = yield bcrypt_1.default.compare(password, adminPass);
                const is_currect = yield bcrypt_1.default.compare(password, hashedPassword);
                if (!is_currect && !is_admin) {
                    throw new customError_1.default('Incorrect username or password.', 400, 'Bad request');
                }
            }
            else {
                const is_currect = yield bcrypt_1.default.compare(password, hashedPassword);
                if (!is_currect) {
                    throw new customError_1.default('Incorrect username or password.', 400, 'Bad request');
                }
            }
        });
    }
    static createToken(creds, key, maxAge) {
        return jsonwebtoken_1.default.sign(creds, key, { expiresIn: maxAge });
    }
    static otpGen() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let otp = '';
        for (let i = 0; i < 6; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            otp += numbers[randomNumber];
        }
        return otp;
    }
    static sendSms(phone, message, apiKey, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpUrl = config_1.default.OTP_URL;
                const senderId = config_1.default.SENDER_ID;
                const encodedMsg = encodeURIComponent(message);
                if (apiKey && clientId) {
                    const url = `${otpUrl}SendSMS?ApiKey=${apiKey}&ClientId=${clientId}&SenderId=${senderId}&Message=${encodedMsg}&MobileNumbers=${phone}&Is_Unicode=true`;
                    const response = yield axios_1.default.get(url);
                    if (response.statusText === 'OK') {
                        return true;
                    }
                    else
                        return false;
                }
            }
            catch (err) {
                return false;
            }
        });
    }
}
Lib.maxAge = 30 * 24 * 60 * 60;
exports.default = Lib;
const addOneWithInvoiceNo = (invoice) => {
    const invoceNo = Number(invoice) + 1;
    let zero = '';
    const lastInvoice = invoceNo.toString();
    const zeroLength = 7 - lastInvoice.length;
    for (let index = 0; index < zeroLength; index++) {
        zero += '0';
    }
    return zero + lastInvoice;
};
exports.addOneWithInvoiceNo = addOneWithInvoiceNo;
const getPaymentType = (type) => {
    const paymentTypeMap = {
        1: 'CASH',
        2: 'BANK',
        3: 'MOBILE BANKING',
        4: 'CHEQUE',
        default: 'CASH',
    };
    return paymentTypeMap[type] || paymentTypeMap.default;
};
exports.getPaymentType = getPaymentType;
const getIataDateRange = () => {
    const new_date = new Date();
    const today = (0, dayjs_1.default)().format('YYYY-MM-DD');
    const half_month = (0, dayjs_1.default)(`${new_date.getFullYear()}-${new_date.getMonth() + 1}-15`).format('YYYY-MM-DD');
    // SALES
    let sales_from_date;
    let sales_to_date;
    if (today <= half_month) {
        sales_from_date = (0, dayjs_1.default)(`${new_date.getFullYear()}-${new_date.getMonth()}-16`).format('YYYY-MM-DD');
        sales_to_date = (0, dayjs_1.default)(`${new_date.getFullYear()}-${new_date.getMonth() + 1}-00`).format('YYYY-MM-DD');
    }
    else {
        sales_from_date = (0, dayjs_1.default)(`${new_date.getFullYear()}-${new_date.getMonth() + 1}-01`).format('YYYY-MM-DD');
        sales_to_date = (0, dayjs_1.default)(`${new_date.getFullYear()}-${new_date.getMonth() + 1}-15`).format('YYYY-MM-DD');
    }
    return { sales_from_date, sales_to_date };
};
exports.getIataDateRange = getIataDateRange;
const getNext15Day = (inputDate) => {
    const currentDate = new Date(inputDate);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let date = '';
    if (currentDate.getDate() === 1) {
        // If input date is the last day of the month, return the next month's 15th date
        const nextMonth = currentMonth === 11 ? 0 : currentMonth;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        date = new Date(nextYear, nextMonth, 17).toISOString().slice(0, 10);
    }
    else if (currentDate.getDate() === 16) {
        // If input date is the last day of the month, return the next month's 15th date
        const nextMonth = currentMonth === 11 ? 0 : currentMonth;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        date = new Date(nextYear, nextMonth + 1, 1).toISOString().slice(0, 10);
    }
    else if (currentDate.getDate() === lastDayOfMonth) {
        date = new Date(currentYear, currentMonth + 1, 16)
            .toISOString()
            .slice(0, 10);
    }
    else {
        // Otherwise, return the current month's last day
        date = new Date(currentYear, currentMonth, lastDayOfMonth + 1)
            .toISOString()
            .slice(0, 10);
    }
    return date;
};
exports.getNext15Day = getNext15Day;
//# sourceMappingURL=lib.js.map