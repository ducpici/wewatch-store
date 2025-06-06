import { configDotenv } from "dotenv";
import mysql from "mysql2/promise";
configDotenv();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // host: 'localhost',
    // port: 3306,
    // database: 'watchshop',
    // user: 'root',
    // password: '',
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,
});

const checkConnection = async () => {
    try {
        const [rows] = await connection.query("SELECT 1");
        console.log("✅ Connect success to Database!");
    } catch (error) {
        console.error("❌ Connect fail to Database!", error.message);
    }
};

module.exports = { connection, checkConnection };
