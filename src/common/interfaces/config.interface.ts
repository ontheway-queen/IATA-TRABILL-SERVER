export interface ENV {
  DB_PASS?: string;
  DB_USER?: string;
  DB_PORT?: string;
  DB_HOST?: string;
  PORT?: number;
  OTP_URL?: string;
  SENDER_ID?: string;
  AWS_S3_BUCKET?: string;
  AWS_S3_ACCESS_KEY?: string;
  AWS_S3_SECRET_KEY?: string;
}

export interface Config {
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: string;
  DB_HOST: string;
  PORT: number;
  OTP_URL: string;
  SENDER_ID: string;
  AWS_S3_BUCKET: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
}
