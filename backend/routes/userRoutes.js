import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile); // Protected route

export default router;
