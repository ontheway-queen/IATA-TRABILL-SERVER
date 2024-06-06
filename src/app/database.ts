import knex from 'knex';
import config from '../config/config';

export const db_name = 'trabill';

const createDbConn = () => {
  const conn = knex({
    client: 'mysql2',
    connection: {
      database: db_name,
      port: Number(config.DB_PORT),
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASS,
      // timezone: 'Z',
    },
    pool: { min: 0, max: 1000 },
  });

  console.log(`Connected to the database at ${config.DB_HOST}.`);

  return conn;
};

export const db = createDbConn();
