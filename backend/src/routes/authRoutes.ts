import express from "express";
import {
  registerUser,
  loginUser,
  registerProvider,
  loginProvider,
  loginAdmin
} from "../controllers/authController";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Provider routes
router.post("/provider-register", registerProvider);
router.post("/provider-login", loginProvider);

// Admin routes
router.post("/admin-login", loginAdmin);

// Handle GET requests to POST-only routes
router.get("/provider-register", (req, res) => {
  res.status(405).json({ 
    message: "Method not allowed. Use POST to register a provider.",
    method: "POST",
    endpoint: "/api/auth/provider-register"
  });
});

export default router;