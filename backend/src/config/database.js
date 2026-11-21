import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';

dotenv.config({path:fileURLToPath(new URL('../../.env',import.meta.url))});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool;
