"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.db_name = void 0;
const knex_1 = __importDefault(require("knex"));
const config_1 = __importDefault(require("../config/config"));
exports.db_name = 'trabill';
const createDbConn = () => {
    const conn = (0, knex_1.default)({
        client: 'mysql2',
        connection: {
            database: exports.db_name,
            port: Number(config_1.default.DB_PORT),
            host: config_1.default.DB_HOST,
            user: config_1.default.DB_USER,
            password: config_1.default.DB_PASS,
            // timezone: 'Z',
        },
        pool: { min: 0, max: 1000 },
    });
    console.log(`Connected to the database at ${config_1.default.DB_HOST}.`);
    return conn;
};
exports.db = createDbConn();
//# sourceMappingURL=database.js.map