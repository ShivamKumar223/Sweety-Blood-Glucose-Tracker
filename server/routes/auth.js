import express from "express";
import { handleLogin, handleSignup } from "../controllers/auth.js";

const router = express.Router();

// auth routes
router.post("/signup", handleSignup);
router.post("/login", handleLogin);

export default router;