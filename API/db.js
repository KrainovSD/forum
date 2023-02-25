import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  password: "010542",
  user: "postgres",
  database: "forum",
});

export default pool;
