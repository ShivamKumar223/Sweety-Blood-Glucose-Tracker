import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import createUserTable from "./models/user.js";
import createReadingTable from "./models/readings.js";

// import routes
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware to parse the json data
app.use(express.json());

// Middleware to parse the cookies
app.use(cookieParser());

// Create user table
createUserTable();
// Create reading table
createReadingTable();
app.use(cors({
    origin : "http://localhost:5173",
    methods : ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials : true,
}));

app.get('/', (req, res)=> res.send("Welcome to Sweety server! Login to access your data"));

// routes
app.use("/api/auth/", authRoutes);

const PORT = process.env.PORT|| 7000;
app.listen(PORT, ()=>{
    console.log("Server running on port : ", PORT);
});