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
    AZURE_STORAGE_CONNECTION_STRING:
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    OTP_URL: process.env.OTP_URL,
    SENDER_ID: process.env.SENDER_ID,
  };
};


const getSanitizedConfig = (config: ENV): Config => {
  return config as Config;
};

const configuration = getConfig();

const config = getSanitizedConfig(configuration);

export default config;
