import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Provider from "../models/Provider";
import generateToken from "../utils/generateToken";
import { Types } from "mongoose";

// User Registration
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// User Login
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// Provider Registration
const registerProvider = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, whatsapp, category, location,
      description, services, availability, priceRange } = req.body;

    // Check if provider exists
    const providerExists = await Provider.findOne({ email });
    if (providerExists) {
      return res.status(400).json({ message: "Provider already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create provider
    const provider = await Provider.create({
      name,
      email,
      password: hashedPassword,
      phone,
      whatsapp,
      category,
      location,
      description,
      services,
      availability,
      priceRange,
      isAvailable: false,
      isPremium: false,
      rating: 0,
      reviewCount: 0,
      status: "pending"
    });

    if (provider) {
      res.status(201).json({
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        token: generateToken(provider._id.toString(), "provider")
      });
    } else {
      res.status(400).json({ message: "Invalid provider data" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Provider Login
const loginProvider = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for provider
    const provider = await Provider.findOne({ email });

    if (provider && (await bcrypt.compare(password, provider.password))) {
      // Check if provider is verified
      if (provider.status === "pending") {
        return res.status(403).json({
          message: "Votre compte est en attente d'approbation par l'administrateur",
          status: "pending"
        });
      }

      if (provider.status === "rejected") {
        return res.status(403).json({
          message: "Votre compte a été rejeté. Veuillez contacter l'administrateur",
          status: "rejected"
        });
      }

      res.json({
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        category: provider.category,
        status: provider.status,
        token: generateToken(provider._id.toString(), "provider")
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export { registerUser, loginUser, registerProvider, loginProvider };