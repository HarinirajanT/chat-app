import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// Use POST instead of GET for routes that create or modify data
router.post("/signup", signup);  // POST method for signup
router.post("/login", login);     // POST method for login
router.post("/logout", logout);   // POST method for logout

export default router;
