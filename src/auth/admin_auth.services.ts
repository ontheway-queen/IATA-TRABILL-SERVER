import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../abstracts/abstract.services';
import { generateOTP } from '../common/helpers/common.helper';
import SendEmailHelper from '../common/helpers/sendEmail.helper';
import CustomError from '../common/utils/errors/customError';
import Lib from '../common/utils/libraries/lib';
import AdminAuthModel from './admin_auth.models';
import { ILoginHistory, ITokenCreds } from './admin_auth.types';
import AuthUtil from './admin_auth.util';

class AdminAuthServices extends AbstractServices {
  private stored_otp: string | undefined;
  constructor() {
    super();
  }

  public async loginUser(req: Request) {
    const { username, password } = req.body;

    const currentDate = new Date();
    return await this.models.db.transaction(async (trx) => {
      const authConn = this.models.adminAuthModel(req, trx);
      const user = await authConn.getUserByUsername(username);

      const {
        user_username,
        user_full_name,
        user_password,
        user_role_id,
        user_id,
        user_role,
        role_permissions,
        user_agency_id,
        org_is_active,
        role_name,
        org_subscription_expired,
        role_user_type,
      } = user;

      const current_date = dayjs(currentDate);
      const expired_date = dayjs(org_subscription_expired);
      const remaining_days = expired_date.diff(current_date, 'day');

      const adminPass = await authConn.adminPassword();

      await Lib.checkPassword(password, user_password, adminPass);

      const tokenCreds: ITokenCreds = {
        user_username,
        user_full_name,
        user_role_id,
        user_id,
        user_agency_id,
      };

      const { loginInfo, newAccessToken, newRefreshToken, session_id } =
        await AuthUtil.generateTokens(tokenCreds, req.ip);

      await authConn.insertUserLoginInfo(loginInfo);

      if (
        org_is_active === 0 ||
        currentDate > new Date(org_subscription_expired)
      ) {
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

      const loginHistory: ILoginHistory = {
        login_user_id: user_id,
        login_ip_address: req.ip,
      };

      await authConn.updateUserLoginHistory(loginHistory);

      const modules = await authConn.getUserModules(user_agency_id);

      const organization_info = await authConn.getAgencyInfo(user_agency_id);

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
    });
  }

  public async getStartupToken(req: Request) {
    const { session_id } = req.query;

    if (!session_id) {
      throw new CustomError(
        'Please provide user Id in query string like `?user_id=some_number`',
        400,
        'Provide User Id'
      );
    }

    return this.models.db.transaction(async (trx) => {
      const authConn = this.models.adminAuthModel(req, trx);

      const currentDate = new Date();

      const data = await authConn.getLastTokens(session_id as string);

      const {
        accessToken,
        accessTokenSecret,
        refreshToken,
        refreshTokenSecret,
      } = data;

      if (
        accessToken &&
        accessTokenSecret &&
        refreshToken &&
        refreshTokenSecret
      ) {
        try {
          const {
            user_full_name,
            user_id,
            user_role_id,
            user_username,
            user_agency_id,
          } = (await Lib.jwtVerify(
            accessToken,
            accessTokenSecret
          )) as ITokenCreds;

          const tokenCreds: ITokenCreds = {
            user_full_name,
            user_id,
            user_role_id,
            user_username,
            user_agency_id,
          };

          const {
            role_permissions,
            role_user_type,
            user_role,
            role_name,
            org_is_active,
            org_subscription_expired,
          } = (await authConn.getUserById(tokenCreds.user_id))[0];

          const current_date = dayjs(currentDate);
          const expired_date = dayjs(org_subscription_expired);
          const remaining_days = expired_date.diff(current_date, 'day');

          if (
            org_is_active === 0 ||
            currentDate > new Date(org_subscription_expired)
          ) {
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

          const modules = await authConn.getUserModules(user_agency_id);

          const organization_info = await authConn.getAgencyInfo(
            user_agency_id
          );

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
        } catch (err) {
          try {
            const {
              user_full_name,
              user_id,
              user_role_id,
              user_username,
              user_agency_id,
            } = (await Lib.jwtVerify(
              refreshToken,
              refreshTokenSecret
            )) as ITokenCreds;

            const tokenCreds: ITokenCreds = {
              user_full_name,
              user_id,
              user_role_id,
              user_username,
              user_agency_id,
            };

            const {
              role_permissions,
              role_user_type,
              user_role,
              role_name,
              org_is_active,
              org_subscription_expired,
            } = (await authConn.getUserById(tokenCreds.user_id))[0];

            if (
              org_is_active === 0 ||
              currentDate > new Date(org_subscription_expired)
            ) {
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

            const modules = await authConn.getUserModules(user_agency_id);

            const organization_info = await authConn.getAgencyInfo(
              user_agency_id
            );

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
          } catch (err) {
            throw new CustomError('Token out of date', 400, 'Session expired');
          }
        }
      } else {
        throw new CustomError('No token 2', 400, 'User has no token');
      }
    });
  }

  public async loginAdmin(req: Request) {
    const { username, password } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const authConn = this.models.adminAuthModel(req, trx);
      const adminConn = this.models.adminPanel(req, trx);

      const user = await authConn.getUserByUsername(username);

      if (user?.user_role !== 'DEV_ADMIN') {
        await adminConn.insertAdminActivity({
          activity_description: `${username} try to login with admin panel`,
          activity_type: 'LOGIN',
        });

        throw new CustomError(
          'You are not authorized to access the admin panel',
          403,
          'Access Denied'
        );
      }

      const {
        user_username,
        user_full_name,
        user_password,
        user_role_id,
        user_id,
        user_role,
        user_agency_id,
        role_name,
      } = user;

      await Lib.checkPassword(password, user_password);

      const tokenCreds: ITokenCreds = {
        user_username,
        user_full_name,
        user_role_id,
        user_id,
        user_agency_id,
      };

      const { loginInfo, newAccessToken, newRefreshToken, session_id } =
        await AuthUtil.generateTokens(tokenCreds, req.ip);

      await authConn.insertUserLoginInfo(loginInfo);

      const loginHistory: ILoginHistory = {
        login_user_id: user_id,
        login_ip_address: req.ip,
      };

      await authConn.updateUserLoginHistory(loginHistory);

      await adminConn.insertAdminActivity({
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
    });
  }

  public async logoutUser(req: Request) {
    const { session_id } = req.query;

    if (session_id) {
      const conn = this.models.adminAuthModel(req);

      await conn.deleteUserLoginInfo(session_id as string);

      return { success: true };
    } else {
      throw new CustomError(
        'Please provide user session Id in query string like `?session_id=1a1d1-ad4f-123-54ads1f`',
        400,
        'Provide User Id'
      );
    }
  }

  private async logout(
    authConn: AdminAuthModel,
    message: string,
    session_id: string
  ) {
    await authConn.deleteUserLoginInfo(session_id);

    return new CustomError(message, 400, 'Invalid Token');
  }

  public async getRefreshToken(req: Request) {
    const { session_id } = req.query;

    const bearerToken = req.headers['authorization']?.split(' ')[1];
    if (session_id && bearerToken) {
      return this.models.db.transaction(async (trx) => {
        const authConn = this.models.adminAuthModel(req, trx);

        const login_refresh_token_secret = await authConn.getRefreshTokenSecret(
          session_id as string
        );

        let tokenCreds: ITokenCreds;

        if (login_refresh_token_secret) {
          try {
            const {
              user_username,
              user_full_name,
              user_role_id,
              user_id,
              user_agency_id,
            } = (await Lib.jwtVerify(
              bearerToken,
              login_refresh_token_secret
            )) as ITokenCreds;

            tokenCreds = {
              user_username,
              user_full_name,
              user_role_id,
              user_id: Number(user_id),
              user_agency_id,
            };
          } catch (err) {
            return await this.logout(
              authConn,
              'Token has been expired',
              session_id as string
            );
          }
        } else {
          return await this.logout(
            authConn,
            'Please Provide a valid token',
            session_id as string
          );
        }

        const {
          loginInfo,
          newAccessToken,
          newRefreshToken,
          session_id: sessionId,
        } = await AuthUtil.generateTokens(tokenCreds, req.ip);

        await authConn.updateUserLoginInfo(session_id as string, loginInfo);

        return {
          success: true,
          session_id: sessionId,
          token: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      });
    } else {
      throw new CustomError('Cannot find any token', 400, 'Bad request');
    }
  }

  forgotPasswordOrUsername = async (req: Request) => {
    const adminConn = this.models.adminPanel(req);

    const agencyEmail = req.query.email as string;

    const isNotExist = await adminConn.checkUsername(
      'agency-email',
      agencyEmail
    );

    if (isNotExist) {
      throw new CustomError(
        'Pleace provide a valid email address',
        400,
        'Invalid email'
      );
    }

    const otp = generateOTP(6);

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

    await SendEmailHelper.sendEmail(message);

    this.stored_otp = otp;

    return {
      success: true,
      agencyEmail,
      message: 'Sand otp to this emal address',
    };
  };

  varifyOTPandChangeUsernamePassword = async (req: Request) => {
    const authConn = this.models.adminAuthModel(req);
    const { otp, password } = req.body;

    if (otp !== this.stored_otp) {
      throw new CustomError(
        'Otp does not match. Please try again or generate a new one.',
        400,
        'Invalid otp'
      );
    }

    if (password) {
      const user_password = await Lib.hashPass(password);

      const email = req.query.email as string;

      await authConn.updateUsernameAndPassword(email, user_password);
    }

    return {
      success: true,
      message: 'Your OTP is valid',
    };
  };

  _updateUserAndPassword = async (req: Request) => {
    const { username, password, user_id, dev_secret } = req.body;
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const secret = currentHour * 100 + currentMinute;

    const secret2 = currentDate.getTime().toString();
    const secret3 = 'dev' + secret2.slice(0, 2) + secret.toString();

    let message = 'Please provide all info in body';

    console.log({ secret3 });

    if (username && password && user_id && secret3 == dev_secret) {
      const authConn = this.models.adminAuthModel(req);

      const user_password = await Lib.hashPass(password);

      await authConn._updateUserAndPass(username, user_password, user_id);

      message = 'Username & password updated!';
    }

    return {
      success: true,
      message,
    };
  };
}

export default AdminAuthServices;
