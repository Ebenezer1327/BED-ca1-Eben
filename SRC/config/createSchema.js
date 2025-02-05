//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const db = require("./db.js");

//////////////////////////////////////////////////////
// GET DATABASE NAME FROM ENV
//////////////////////////////////////////////////////
const database = process.env.DB_DATABASE;

//////////////////////////////////////////////////////
// SET DATABASE NAME TO NULL IN POOL CONFIG
// 
// This is necessary because the database must be created
//////////////////////////////////////////////////////
process.env.DB_DATABASE = null; // set database to null to create the database

//////////////////////////////////////////////////////
// DEFINE SQL STATEMENTS
//////////////////////////////////////////////////////
const CHECK_DB_SQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`;
const CREATE_DB_SQL = `CREATE DATABASE IF NOT EXISTS \`${database}\``;

//////////////////////////////////////////////////////
// RUN SQL STATEMENTS (Async/Await)
//////////////////////////////////////////////////////
(async () => {
  try {
    const [results] = await db.query(CHECK_DB_SQL, [database]); // Use parameterized queries for safety

    if (results.length === 0) {
      console.log(`Database "${database}" does not exist. Creating it...`);
      
      await db.query(CREATE_DB_SQL);
      
      console.log(`Database "${database}" has been created successfully`);
    } else {
      console.log(`Database "${database}" already exists`);
    }

    process.exit();
  } catch (error) {
    console.error("Database operation error:", error);
    process.exit(1);
  }
})();