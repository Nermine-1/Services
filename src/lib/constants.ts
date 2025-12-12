import {
  Laptop,
  Zap,
  Wrench,
  Sparkles,
  Flower2,
  Truck,
  Scissors,
  PaintBucket,
  Home,
  Car,
  Camera,
  UtensilsCrossed
} from "lucide-react";

export const SERVICE_CATEGORIES = [
  { id: "it", nameEn: "IT", name: "Informatique", nameAr: "معلوماتية", icon: Laptop, color: "from-blue-500 to-cyan-400" },
  { id: "electricity", nameEn: "Electricity", name: "Électricité", nameAr: "كهرباء", icon: Zap, color: "from-yellow-500 to-orange-400" },
  { id: "plumbing", nameEn: "Plumbing", name: "Plomberie", nameAr: "سباكة", icon: Wrench, color: "from-sky-500 to-blue-400" },
  { id: "cleaning", nameEn: "Cleaning", name: "Nettoyage", nameAr: "تنظيف", icon: Sparkles, color: "from-emerald-500 to-teal-400" },
  { id: "gardening", nameEn: "Gardening", name: "Jardinage", nameAr: "بستنة", icon: Flower2, color: "from-green-500 to-lime-400" },
  { id: "delivery", nameEn: "Delivery", name: "Livraison", nameAr: "توصيل", icon: Truck, color: "from-purple-500 to-pink-400" },
  { id: "beauty", nameEn: "Beauty", name: "Beauté", nameAr: "تجميل", icon: Scissors, color: "from-pink-500 to-rose-400" },
  { id: "painting", nameEn: "Painting", name: "Peinture", nameAr: "دهان", icon: PaintBucket, color: "from-indigo-500 to-violet-400" },
  { id: "renovation", nameEn: "Renovation", name: "Rénovation", nameAr: "ترميم", icon: Home, color: "from-amber-500 to-yellow-400" },
  { id: "automotive", nameEn: "Automotive", name: "Automobile", nameAr: "سيارات", icon: Car, color: "from-slate-500 to-gray-400" },
  { id: "photo", nameEn: "Photography", name: "Photographie", nameAr: "تصوير", icon: Camera, color: "from-fuchsia-500 to-purple-400" },
  { id: "catering", nameEn: "Catering", name: "Traiteur", nameAr: "تموين", icon: UtensilsCrossed, color: "from-red-500 to-orange-400" },
];

export type Provider = {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  category: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  location: string;
  description: string;
  services: string;
  availability: string;
  isAvailable: boolean;
  isPremium: boolean;
  priceRange: string;
  certifications?: string;
  serviceArea?: string;
  status?: "pending" | "verified" | "rejected";
  createdAt?: string;
  verifiedAt?: string;
};

export type Category = typeof SERVICE_CATEGORIES[0];
