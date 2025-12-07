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
  { id: "it", name: "Informatique", nameAr: "معلوماتية", icon: Laptop, color: "from-blue-500 to-cyan-400" },
  { id: "electricity", name: "Électricité", nameAr: "كهرباء", icon: Zap, color: "from-yellow-500 to-orange-400" },
  { id: "plumbing", name: "Plomberie", nameAr: "سباكة", icon: Wrench, color: "from-sky-500 to-blue-400" },
  { id: "cleaning", name: "Nettoyage", nameAr: "تنظيف", icon: Sparkles, color: "from-emerald-500 to-teal-400" },
  { id: "gardening", name: "Jardinage", nameAr: "بستنة", icon: Flower2, color: "from-green-500 to-lime-400" },
  { id: "delivery", name: "Livraison", nameAr: "توصيل", icon: Truck, color: "from-purple-500 to-pink-400" },
  { id: "beauty", name: "Beauté", nameAr: "تجميل", icon: Scissors, color: "from-pink-500 to-rose-400" },
  { id: "painting", name: "Peinture", nameAr: "دهان", icon: PaintBucket, color: "from-indigo-500 to-violet-400" },
  { id: "renovation", name: "Rénovation", nameAr: "ترميم", icon: Home, color: "from-amber-500 to-yellow-400" },
  { id: "automotive", name: "Automobile", nameAr: "سيارات", icon: Car, color: "from-slate-500 to-gray-400" },
  { id: "photo", name: "Photographie", nameAr: "تصوير", icon: Camera, color: "from-fuchsia-500 to-purple-400" },
  { id: "catering", name: "Traiteur", nameAr: "تموين", icon: UtensilsCrossed, color: "from-red-500 to-orange-400" },
];

export type Provider = {
  id: string;
  name: string;
  photo: string;
  category: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  location: string;
  description: string;
  services: string[];
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

export const PROVIDERS = [
  {
    id: "1",
    name: "Ahmed Ben Salem",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    category: "electricity",
    rating: 4.8,
    reviewCount: 124,
    phone: "+216 98 765 432",
    whatsapp: "+21698765432",
    location: "Tunis, La Marsa",
    description: "Électricien professionnel avec 15 ans d'expérience. Installation, dépannage, mise aux normes.",
    services: ["Installation électrique", "Dépannage", "Mise aux normes", "Tableau électrique"],
    availability: "Lun-Sam 8h-18h",
    isAvailable: true,
    isPremium: true,
    priceRange: "50-150 DT",
  },
  {
    id: "2",
    name: "Fatma Khelifi",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    category: "cleaning",
    rating: 4.9,
    reviewCount: 89,
    phone: "+216 55 123 456",
    whatsapp: "+21655123456",
    location: "Tunis, Lac 2",
    description: "Service de nettoyage professionnel pour maisons et bureaux. Produits écologiques.",
    services: ["Nettoyage maison", "Nettoyage bureau", "Nettoyage après travaux", "Repassage"],
    availability: "Tous les jours 7h-20h",
    isAvailable: true,
    isPremium: false,
    priceRange: "30-80 DT",
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    category: "plumbing",
    rating: 4.7,
    reviewCount: 156,
    phone: "+216 22 987 654",
    whatsapp: "+21622987654",
    location: "Sousse, Hammam Sousse",
    description: "Plombier qualifié. Réparation, installation sanitaire, chauffage.",
    services: ["Réparation fuite", "Installation sanitaire", "Chauffe-eau", "Débouchage"],
    availability: "Lun-Ven 8h-17h",
    isAvailable: false,
    isPremium: true,
    priceRange: "40-120 DT",
  },
  {
    id: "4",
    name: "Leila Mansouri",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    category: "beauty",
    rating: 5.0,
    reviewCount: 203,
    phone: "+216 99 456 789",
    whatsapp: "+21699456789",
    location: "Tunis, Menzah 6",
    description: "Esthéticienne diplômée. Soins visage, manucure, maquillage, coiffure à domicile.",
    services: ["Soins visage", "Manucure/Pédicure", "Maquillage", "Coiffure"],
    availability: "Sur rendez-vous",
    isAvailable: true,
    isPremium: true,
    priceRange: "25-100 DT",
  },
  {
    id: "5",
    name: "Karim Bouazizi",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    category: "it",
    rating: 4.6,
    reviewCount: 67,
    phone: "+216 50 321 987",
    whatsapp: "+21650321987",
    location: "Sfax, Centre ville",
    description: "Technicien informatique. Réparation PC/Mac, installation réseau, récupération données.",
    services: ["Réparation PC", "Installation réseau", "Récupération données", "Formation"],
    availability: "Lun-Sam 9h-19h",
    isAvailable: true,
    isPremium: false,
    priceRange: "35-150 DT",
  },
  {
    id: "6",
    name: "Sonia Ben Ali",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    category: "gardening",
    rating: 4.8,
    reviewCount: 45,
    phone: "+216 27 654 321",
    whatsapp: "+21627654321",
    location: "Tunis, Carthage",
    description: "Paysagiste professionnelle. Création jardins, entretien espaces verts, arrosage automatique.",
    services: ["Création jardin", "Entretien", "Arrosage automatique", "Taille arbres"],
    availability: "Lun-Ven 7h-16h",
    isAvailable: true,
    isPremium: false,
    priceRange: "50-200 DT",
  },
];

export type Category = typeof SERVICE_CATEGORIES[0];
