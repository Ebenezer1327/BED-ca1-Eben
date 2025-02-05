const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    const connection = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    try {
        const database = process.env.DB_DATABASE;
        const [results] = await connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [database]);
        if (results.length === 0) {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
            console.log(`Database ${database} created successfully.`);
        } else {
            console.log(`Database ${database} already exists.`);
        }
    } catch (error) {
        console.error("Error creating database:", error);
    } finally {
        await connection.end();
    }
}

createDatabase();
