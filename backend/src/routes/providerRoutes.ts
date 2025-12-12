import express from "express";
import {
  getProviders,
  getFeaturedProviders,
  getProviderById,
  updateProvider,
  verifyProvider,
  getPendingProviders,
  rejectProvider
} from "../controllers/providerController";
import { auth, adminAuth } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getProviders);
router.get("/featured", getFeaturedProviders);

// Admin routes (must come before /:id to avoid route conflicts)
router.get("/pending", adminAuth, getPendingProviders);
router.put("/:id/verify", adminAuth, verifyProvider);
router.put("/:id/reject", adminAuth, rejectProvider);

// Provider routes (authenticated)
router.put("/:id", auth, updateProvider);

// Public route (must come last to avoid conflicts)
router.get("/:id", getProviderById);

export default router;