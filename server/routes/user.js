import express from "express";
import { addReading, deleteReading, getReadings, updateReading } from "../controllers/user";

const router = express.Router();

// User functional routes
router.post("/reading", addReading);
router.get("/readings", getReadings);
router.patch("/reading/:readingId", updateReading);
router.delete("/reading/:readingId", deleteReading);

export default router;