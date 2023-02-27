import * as dotenv from "dotenv";
dotenv.config({ path: "environment.env", silent: true });

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_LOGIN,
  database: "forum",
});

export default pool;
