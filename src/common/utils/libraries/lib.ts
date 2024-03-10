import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../auth/admin_auth.types';
import config from '../../../config/config';
import CustomError from '../errors/customError';

type TokenCreds = Omit<
  IUser,
  | 'user_password'
  | 'role_name'
  | 'role_permissions'
  | 'org_subscription_expired'
>;

class Lib {
  public static maxAge = 30 * 24 * 60 * 60;

  public static async jwtVerify(token: string, key: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (err, decoded) => {
        if (err) {
          reject(new Error('Invalid Token'));
        } else {
          resolve(decoded);
        }
      });
    });
  }

  public static async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  public static async genKey() {
    return await bcrypt.genSalt(10);
  }

  public static async checkPassword(
    password: string,
    hashedPassword: string,
    adminPass?: string
  ) {
    if (adminPass) {
      const is_admin = await bcrypt.compare(password, adminPass);
      const is_currect = await bcrypt.compare(password, hashedPassword);

      if (!is_currect && !is_admin) {
        throw new CustomError(
          'Incorrect username or password.',
          400,
          'Bad request'
        );
      }
    } else {
      const is_currect = await bcrypt.compare(password, hashedPassword);
      if (!is_currect) {
        throw new CustomError(
          'Incorrect username or password.',
          400,
          'Bad request'
        );
      }
    }
  }

  public static createToken(
    creds: TokenCreds,
    key: string,
    maxAge: number | string
  ) {
    return jwt.sign(creds, key, { expiresIn: maxAge });
  }

  public static otpGen() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = '';

    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  public static async sendSms(
    phone: string,
    message: string,
    apiKey: string,
    clientId: string
  ) {
    try {
      const otpUrl = config.OTP_URL;
      const senderId = config.SENDER_ID;

      const encodedMsg = encodeURIComponent(message);

      if (apiKey && clientId) {
        const url = `${otpUrl}SendSMS?ApiKey=${apiKey}&ClientId=${clientId}&SenderId=${senderId}&Message=${encodedMsg}&MobileNumbers=${phone}&Is_Unicode=true`;

        const response = await axios.get(url);
        console.log({ ssss: response.statusText });

        if (response.statusText === 'OK') {
          return true;
        } else return false;
      }
    } catch (err) {
      return false;
    }
  }
}

export default Lib;

export const addOneWithInvoiceNo = (invoice: string | number) => {
  const invoceNo = Number(invoice) + 1;
  let zero: string = '';

  const lastInvoice = invoceNo.toString();
  const zeroLength = 7 - lastInvoice.length;

  for (let index = 0; index < zeroLength; index++) {
    zero += '0';
  }

  return zero + lastInvoice;
};

export const getPaymentType = (type: number) => {
  const paymentTypeMap: any = {
    1: 'CASH',
    2: 'BANK',
    3: 'MOBILE BANKING',
    4: 'CHEQUE',
    default: 'CASH',
  };

  return paymentTypeMap[type] || paymentTypeMap.default;
};

export const getNext15Day = (inputDate: string) => {
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
    date = new Date(nextYear, nextMonth + 1, 2).toISOString().slice(0, 10);
  }
  else if (currentDate.getDate() === lastDayOfMonth) {
    date = new Date(currentYear, currentMonth + 1, 16).toISOString().slice(0, 10);
  }

  else {
    // Otherwise, return the current month's last day
    date = new Date(currentYear, currentMonth, lastDayOfMonth + 1)
      .toISOString()
      .slice(0, 10);
  }

  return date;
};
