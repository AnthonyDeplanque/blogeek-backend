require('dotenv').config();
import mysql2 from 'mysql2';

const connection: mysql2.Pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = connection;