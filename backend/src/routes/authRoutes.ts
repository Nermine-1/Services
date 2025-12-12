import express from "express";
import {
  registerUser,
  loginUser,
  registerProvider,
  loginProvider
} from "../controllers/authController";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Provider routes
router.post("/provider-register", registerProvider);
router.post("/provider-login", loginProvider);

export default router;