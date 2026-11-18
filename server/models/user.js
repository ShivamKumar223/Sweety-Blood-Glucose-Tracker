import pool from "../config/db.js";

const createUserTable = async () =>{
    const query = `
    CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try{
        await pool.query(query);
        console.log("Users table created successfully!");
    }
    catch(error){
        console.log("Error creating reading table : ", error.message);
    }
};

export default createUserTable;