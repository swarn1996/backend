import mysql from "mysql";
import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB_DATABASE,
});

// Export the pool
export default pool;


