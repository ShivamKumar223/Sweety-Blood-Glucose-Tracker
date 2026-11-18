import pool from "../config/db.js";

const createReadingTable = async () => {

    const query = `
    CREATE TABLE IF NOT EXISTS readings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_time_slot CHECK (
     time_slot IN (
     'Morning',
     'After breakfast',
     'After lunch',
     'After dinner'
     )
    ),

    CONSTRAINT valid_glucose_value CHECK (
      value BETWEEN 40 AND 600
    ),

    CONSTRAINT unique_reading_per_slot
    UNIQUE (user_id, date, time_slot)
    );
    `;

    try{
        await pool.query(query);
        console.log("Readings table create successfully !");
    }
    catch(error){
        console.log("Error creating readings table : ", error.message);
    }
};

export default createReadingTable;