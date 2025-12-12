import { Request, Response } from "express";
import Provider from "../models/Provider";

// Get all providers (only verified ones for frontend)
const getProviders = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const query: Record<string, any> = {
      status: "verified" // Only show verified providers
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { location: { $regex: search as string, $options: "i" } },
        { services: { $regex: search as string, $options: "i" } }
      ];
    }

    const providers = await Provider.find(query).sort({ rating: -1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get featured providers
const getFeaturedProviders = async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find({
      isPremium: true,
      isAvailable: true,
      status: "verified" // Only show verified providers
    })
      .sort({ rating: -1 })
      .limit(4);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get single provider
const getProviderById = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update provider profile
const updateProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (provider) {
      provider.name = req.body.name || provider.name;
      provider.phone = req.body.phone || provider.phone;
      provider.whatsapp = req.body.whatsapp || provider.whatsapp;
      provider.location = req.body.location || provider.location;
      provider.description = req.body.description || provider.description;
      provider.services = req.body.services || provider.services;
      provider.availability = req.body.availability || provider.availability;
      provider.priceRange = req.body.priceRange || provider.priceRange;
      provider.isAvailable = req.body.isAvailable !== undefined
        ? req.body.isAvailable
        : provider.isAvailable;

      const updatedProvider = await provider.save();
      res.json(updatedProvider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Verify provider
const verifyProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (provider) {
      provider.status = "verified";
      provider.verifiedAt = new Date();

      const updatedProvider = await provider.save();
      res.json(updatedProvider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get all pending providers
const getPendingProviders = async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find({ status: "pending" });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Reject provider
const rejectProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (provider) {
      provider.status = "rejected";

      const updatedProvider = await provider.save();
      res.json(updatedProvider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export {
  getProviders,
  getFeaturedProviders,
  getProviderById,
  updateProvider,
  verifyProvider,
  getPendingProviders,
  rejectProvider
};