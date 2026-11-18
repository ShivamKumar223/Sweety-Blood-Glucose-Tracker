import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// connection event provided by Pool
pool.on("connect", () => {
    console.log("PostgreSQL connected successfully!");
});

// Error event provided by Pool
pool.on("error", (err) => {
    console.error("Unexpected database error:", err);
});

console.log("pg database connected");
export default pool;