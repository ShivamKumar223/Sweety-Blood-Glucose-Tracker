import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const handleSignup = async (req, res)=>{

    try{
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
            return res.status(400).json({
                success : false,
                message: "All fields are required"
            });
        }

    let query = "SELECT id FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if(result.rows.length > 0)
    {
        return res.status(409).json({
            success : false,
            message : "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into users table
    const insertQuery = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
    `;
    const result1 = await pool.query(insertQuery, [name, email, hashedPassword]);

    const user = result1.rows[0];

    return res.status(201).json({
        success : true,
        message : "Log created successfully.",
    })
}
catch(error){
    console.log("Signup Server Error : ", error.message);
    return res.status(500).json({
        success : false,
        message : "Internal Server error."
    })
}
}


// Handle Login
export const handleLogin = async(req, res) =>{
    
    try{
    const {email, password } = req.body;
    
    if( !email || !password)
    {
        return res.status(400).json({
            success : false,
            message : "Missing email or password!"
        })
    }

    // Retrive user by the email
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if(result.rows.length === 0)
    {
        return res.status(401).json({
            success : false,
            message : "User not found!"
        })
    }

    const user = result.rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
    {
        return res.status(401).json({
            success: false,
            message : "Invalid credentials!"
        })
    }

    // generate token
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    // store token in cookie
    res.cookie("token", token, {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json({
        success : true,
        message : "Login successful",
        data : {
            userId : user.id,
            name: user.name,
            email: user.email
        }
    });
}
catch(error)
{
    console.log("Login Server Error : ", error.message);
    res.status(500).json({
        success : false,
        message : "Internal server error.",
    });
}
};