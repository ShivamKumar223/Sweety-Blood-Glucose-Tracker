import express from "express";
import { addReading, deleteReading, getProfile, getReadings, updateReading } from "../controllers/user.js";

const router = express.Router();

// verify user
router.get("/verify", (req, res) => {
    return res.status(200).json({
        success: true,
    });
});

// User functional routes
router.get("/profile", getProfile);
router.post("/reading", addReading);
router.get("/readings", getReadings);
router.patch("/reading/:readingId", updateReading);
router.delete("/reading/:readingId", deleteReading);

export default router;