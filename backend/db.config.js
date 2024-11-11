const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "todo_db",
  password: "secret",
  port: 5432
});

pool
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

module.exports = pool;
