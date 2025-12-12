import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites
} from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = express.Router();

// User profile routes
router.get("/:id", auth, getUserProfile);
router.put("/:id", auth, updateUserProfile);

// Favorites routes
router.post("/favorites", auth, addToFavorites);
router.delete("/favorites", auth, removeFromFavorites);

export default router;