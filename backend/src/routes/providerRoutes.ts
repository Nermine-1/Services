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
router.get("/:id", getProviderById);

// Provider routes (authenticated)
router.put("/:id", auth, updateProvider);

// Admin routes
router.put("/:id/verify", adminAuth, verifyProvider);
router.put("/:id/reject", adminAuth, rejectProvider);
router.get("/pending", adminAuth, getPendingProviders);

export default router;