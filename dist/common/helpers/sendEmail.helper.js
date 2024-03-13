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
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendEmailHelper {
}
_a = SendEmailHelper;
SendEmailHelper.sendEmail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'trabilllead@gmail.com',
                pass: 'mbkrrbbbwxulzvwi',
            },
        });
        const info = yield transporter.sendMail(Object.assign({ from: `trabilllead@gmail.com` }, message));
        return info;
    }
    catch (error) {
        // Handle the error here
        console.error('Error sending email:', error);
        throw error; // Rethrow the error if needed for further handling
    }
});
/**
 * {
 *  email: sabbir.m360ict@gmail.com
 *  pass: hrdrnznfzyhzyscn
 * },{
 *  email: trabilllead@gmail.com
 *  pass: mbkrrbbbwxulzvwi
 * }
 */
exports.default = SendEmailHelper;
//# sourceMappingURL=sendEmail.helper.js.map