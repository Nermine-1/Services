import mongoose, { Document, Schema } from "mongoose";

export interface IProvider extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  whatsapp: string;
  photo?: string;
  category: string;
  location: string;
  description: string;
  services: string;
  availability: string;
  isAvailable: boolean;
  isPremium: boolean;
  priceRange: string;
  certifications?: string;
  serviceArea?: string;
  rating: number;
  reviewCount: number;
  status: "pending" | "verified" | "rejected";
  createdAt: Date;
  verifiedAt?: Date;
}

const ProviderSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  photo: { type: String },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  services: { type: String, required: true },
  availability: { type: String, required: true },
  isAvailable: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  priceRange: { type: String, required: true },
  certifications: { type: String },
  serviceArea: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});

export default mongoose.model<IProvider>("Provider", ProviderSchema);