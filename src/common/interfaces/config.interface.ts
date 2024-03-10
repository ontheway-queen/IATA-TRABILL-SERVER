export interface ENV {
  DB_PASS?: string;
  DB_USER?: string;
  DB_PORT?: string;
  DB_HOST?: string;
  PORT?: number;
  COOKIE_SECRET?: string;
  OTP_URL?: string;
  SENDER_ID?: string;
  AZURE_STORAGE_CONNECTION_STRING?: string;
}

export interface Config {
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: string;
  DB_HOST: string;
  PORT: number;
  COOKIE_SECRET: string;
  OTP_URL: string;
  SENDER_ID: string;
  AZURE_STORAGE_CONNECTION_STRING: string;
}
