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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.separateCombClientToId = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const customError_1 = __importDefault(require("../utils/errors/customError"));
// SEPARATE CLIENT ID
const separateCombClientToId = (comb_client) => {
    if (!comb_client ||
        ['all', 'undefined'].includes(comb_client.toLowerCase())) {
        return { client_id: null, combined_id: null, vendor_id: null };
    }
    if (!comb_client) {
        throw new customError_1.default('Please provide valid client or vendor id', 400, 'Invalid client or vendor');
    }
    const clientCom = comb_client.split('-');
    const client_type = clientCom[0];
    if (!['client', 'combined', 'vendor'].includes(client_type)) {
        throw new customError_1.default('Client type must be client, combined or vendor', 400, 'Invalid type');
    }
    let client_id = null;
    let combined_id = null;
    let vendor_id = null;
    if (client_type === 'client') {
        client_id = Number(clientCom[1]);
    }
    else if (client_type === 'combined') {
        combined_id = Number(clientCom[1]);
    }
    else if (client_type === 'vendor') {
        vendor_id = Number(clientCom[1]);
    }
    return { client_id, combined_id, vendor_id };
};
exports.separateCombClientToId = separateCombClientToId;
const generateOTP = (length) => {
    const chars = '0123456789';
    const otp = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        otp.push(chars[randomIndex]);
    }
    return otp.join('');
};
exports.generateOTP = generateOTP;
class SendEmailHelper {
}
_a = SendEmailHelper;
SendEmailHelper.sendEmail = (email, emailSub, emailBody) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'sabbir.m360ict@gmail.com',
            pass: 'vjxlkgbowsmagcmz',
        },
    });
    const info = yield transporter.sendMail({
        from: `sabbir.m360ict@gmail.com`,
        to: email,
        subject: emailSub,
        html: emailBody,
    });
    return info;
});
exports.default = SendEmailHelper;
//# sourceMappingURL=common.helper.js.map