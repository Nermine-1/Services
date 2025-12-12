import { Request, Response } from "express";
import User from "../models/User";

// Get user profile
const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        favorites: user.favorites
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update user profile
const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        favorites: updatedUser.favorites
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Add to favorites
const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, providerId } = req.body;
    
    const user = await User.findById(userId);
    
    if (user) {
      if (!user.favorites.includes(providerId)) {
        user.favorites.push(providerId);
        await user.save();
      }
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Remove from favorites
const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, providerId } = req.body;
    
    const user = await User.findById(userId);
    
    if (user) {
      user.favorites = user.favorites.filter((id: string) => id !== providerId);
      await user.save();
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites
};