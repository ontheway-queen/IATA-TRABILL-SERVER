import dotenv from 'dotenv';
import path from 'path';
import { Config, ENV } from '../common/interfaces/config.interface';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getConfig = (): ENV => {
  return {
    DB_PASS: process.env.DB_PASS,
    DB_USER: process.env.DB_USER,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    OTP_URL: process.env.OTP_URL,
    SENDER_ID: process.env.SENDER_ID,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  return config as Config;
};

const configuration = getConfig();

const config = getSanitizedConfig(configuration);

export default config;
