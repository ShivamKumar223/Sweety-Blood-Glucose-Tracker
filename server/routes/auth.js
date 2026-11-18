import express from "express";
import { handleLogin, handleSignup } from "../controllers/auth";

const router = express.Router();

// auth routes
router.post("/signup", handleSignup);
router.get("/login", handleLogin);

export default router;