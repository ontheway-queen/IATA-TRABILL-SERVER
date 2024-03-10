import nodemailer from 'nodemailer';
abstract class SendEmailHelper {
  public static sendEmail = async (message: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'trabilllead@gmail.com',
          pass: 'mbkrrbbbwxulzvwi',
        },
      });

      const info = await transporter.sendMail({
        from: `trabilllead@gmail.com`,
        ...message,
      });

      return info;
    } catch (error) {
      // Handle the error here
      console.error('Error sending email:', error);
      throw error; // Rethrow the error if needed for further handling
    }
  };
}

/**
 * {
 *  email: sabbir.m360ict@gmail.com
 *  pass: hrdrnznfzyhzyscn
 * },{
 *  email: trabilllead@gmail.com
 *  pass: mbkrrbbbwxulzvwi
 * }
 */
export default SendEmailHelper;
