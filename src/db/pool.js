const { Pool } = requier("pg");
requier("dotemv").config();

const pool = new Pool({
  user: process.env.Db_USER,
  host: process.env.Db_HOST,
  database: process.env.Db_NAME,
  password: process.env.Db_PASSWORD,
  port: process.env.Db_PORT,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

pool.on("error", (err) => {
  console.log("error connecting to the db", err);
});

module.exports = pool;
