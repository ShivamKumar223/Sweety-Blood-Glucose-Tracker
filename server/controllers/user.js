import pool from "../config/db.js";

// =>
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT id, name, email
            FROM users
            WHERE id = $1
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    }
    catch (error) {
        console.log("Profile Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =>
export const addReading = async (req, res) =>{
   try {
        const { date, time_slot, value } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!date || !time_slot) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        // validate value
        if (value === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please enter a glucose value."
            });
        }

        // Validate reading value
        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                success: false,
                message: "Reading must be an integer between 40 and 600."
            });
        } 
        
        // Validate time slot
        const validSlots = [
            "Morning",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                success: false,
                message: "Invalid time slot."
            });
        }

        // Check future date
        const today = new Date().toISOString().split("T")[0];

        if (date > today) {
            return res.status(400).json({
            success: false,
            message: "Date cannot be in the future."
        });
       }

        // Check existing reading
        const checkQuery = `
            SELECT id FROM readings
            WHERE user_id = $1 AND date = $2 AND time_slot = $3
        `;

        const existingReading = await pool.query(
            checkQuery,
            [userId, date, time_slot]
        );

        if (existingReading.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: `You already have ${time_slot=="Morning"?"a":"an"} ${time_slot} reading for this date.`
            });
        }
        
        // Insert reading
        const insertQuery = `
            INSERT INTO readings (user_id, date, time_slot, value)
            VALUES ($1, $2, $3, $4)
            RETURNING id, date, time_slot, value
        `;

        const result = await pool.query(
            insertQuery,
            [userId, date, time_slot, value]
        );
        
        return res.status(201).json({
            success: true,
            message: "Reading added successfully.",
            reading: result.rows[0]
        });

    }
    catch(error){
        console.log("Add reading error : ", error.message);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}


// => extract all readings
export const getReadings = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all readings of logged-in user
        const query = `
            SELECT id, date, time_slot, value
            FROM readings
            WHERE user_id = $1
            ORDER BY date DESC
        `;

        const result = await pool.query(query, [userId]);

        return res.status(200).json({
            success: true,
            message: "Readings fetched successfully.",
            data : result.rows
        });

    } catch (error) {
        console.log("Get Readings Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


// => update existing reading
export const updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time_slot, value } = req.body;

        const userId = req.user.userId;

        // Validate required fields
        if (!date || !time_slot || value === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check future date
        const today = new Date().toISOString().split("T")[0];

        if (date > today) {
            return res.status(400).json({
                success: false,
                message: "Future date is not allowed."
            });
        }

        // check this reading in records
        const checkQuery = `
            SELECT id FROM readings
            WHERE user_id = $1 AND date = $2 AND time_slot = $3
        `;
        const existingReading = await pool.query(
            checkQuery,
            [userId, date, time_slot]
        );

        if (existingReading.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Reading already exists for this time slot."
            });
        }

        // check reading value
        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
            success: false,
            message: "Reading must be an integer between 40 and 600."
        });
        }

        // Update reading
        const query = `
            UPDATE readings
            SET date = $1, time_slot = $2, value = $3
            WHERE id = $4 AND user_id = $5
            RETURNING id, date, time_slot, value
        `;

        const result = await pool.query(query, [
            date,
            time_slot,
            value,
            id,
            userId
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reading not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reading updated successfully.",
            reading: result.rows[0]
        });

    } catch (error) {
        console.log("Update Reading Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


// => Delete existing reading
export const deleteReading = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Delete reading
        const query = `
            DELETE FROM readings
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;

        const result = await pool.query(query, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reading not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reading deleted successfully."
        });

    } catch (error) {
        console.log("Delete Reading Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
