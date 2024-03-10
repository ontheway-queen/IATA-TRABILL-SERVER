import nodemailer from 'nodemailer';
import { ClientComType } from '../types/common.types';
import CustomError from '../utils/errors/customError';

// SEPARATE CLIENT ID
export const separateCombClientToId = (comb_client: string) => {
  if (
    !comb_client ||
    ['all', 'undefined'].includes(comb_client.toLowerCase())
  ) {
    return { client_id: null, combined_id: null, vendor_id: null };
  }

  if (!comb_client) {
    throw new CustomError(
      'Please provide valid client or vendor id',
      400,
      'Invalid client or vendor'
    );
  }
  const clientCom = comb_client.split('-');

  const client_type = clientCom[0] as ClientComType;

  if (!['client', 'combined', 'vendor'].includes(client_type)) {
    throw new CustomError(
      'Client type must be client, combined or vendor',
      400,
      'Invalid type'
    );
  }

  let client_id: number | null = null;
  let combined_id: number | null = null;
  let vendor_id: number | null = null;

  if (client_type === 'client') {
    client_id = Number(clientCom[1]);
  } else if (client_type === 'combined') {
    combined_id = Number(clientCom[1]);
  } else if (client_type === 'vendor') {
    vendor_id = Number(clientCom[1]);
  }

  return { client_id, combined_id, vendor_id };
};

export const generateOTP = (length: number) => {
  const chars = '0123456789';
  const otp = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp.push(chars[randomIndex]);
  }

  return otp.join('');
};

abstract class SendEmailHelper {
  public static sendEmail = async (
    email: string,
    emailSub: string,
    emailBody: string
  ) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sabbir.m360ict@gmail.com',
        pass: 'vjxlkgbowsmagcmz',
      },
    });

    const info = await transporter.sendMail({
      from: `sabbir.m360ict@gmail.com`,
      to: email,
      subject: emailSub,
      html: emailBody,
    });

    return info;
  };
}
export default SendEmailHelper;
