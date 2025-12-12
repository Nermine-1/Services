import mongoose from "mongoose";
import dotenv from "dotenv";
import Provider from "./models/Provider";
import bcrypt from "bcryptjs";

dotenv.config();

const providers = [
  {
    name: "Ahmed Ben Salem",
    email: "ahmed@example.com",
    password: "password123",
    phone: "+216 98 765 432",
    whatsapp: "+21698765432",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    category: "electricity",
    location: "Tunis, La Marsa",
    description: "Électricien professionnel avec 15 ans d'expérience. Installation, dépannage, mise aux normes.",
    services: "Installation électrique, Dépannage, Mise aux normes, Tableau électrique",
    availability: "Lun-Sam 8h-18h",
    isAvailable: true,
    isPremium: true,
    priceRange: "50-150 DT",
    rating: 4.8,
    reviewCount: 124,
    status: "pending" // Start as pending for admin to approve
  },
  {
    name: "Fatma Khelifi",
    email: "fatma@example.com",
    password: "password123",
    phone: "+216 55 123 456",
    whatsapp: "+21655123456",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    category: "cleaning",
    location: "Tunis, Lac 2",
    description: "Service de nettoyage professionnel pour maisons et bureaux. Produits écologiques.",
    services: "Nettoyage maison, Nettoyage bureau, Nettoyage après travaux, Repassage",
    availability: "Tous les jours 7h-20h",
    isAvailable: true,
    isPremium: false,
    priceRange: "30-80 DT",
    rating: 4.9,
    reviewCount: 89,
    status: "pending" // Start as pending for admin to approve
  },
  {
    name: "Mohamed Trabelsi",
    email: "mohamed@example.com",
    password: "password123",
    phone: "+216 22 987 654",
    whatsapp: "+21622987654",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    category: "plumbing",
    location: "Sousse, Hammam Sousse",
    description: "Plombier qualifié. Réparation, installation sanitaire, chauffage.",
    services: "Réparation fuite, Installation sanitaire, Chauffe-eau, Débouchage",
    availability: "Lun-Ven 8h-17h",
    isAvailable: false,
    isPremium: true,
    priceRange: "40-120 DT",
    rating: 4.7,
    reviewCount: 156,
    status: "pending" // Start as pending for admin to approve
  },
  {
    name: "Leila Mansouri",
    email: "leila@example.com",
    password: "password123",
    phone: "+216 99 456 789",
    whatsapp: "+21699456789",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    category: "beauty",
    location: "Tunis, Menzah 6",
    description: "Esthéticienne diplômée. Soins visage, manucure, maquillage, coiffure à domicile.",
    services: "Soins visage, Manucure/Pédicure, Maquillage, Coiffure",
    availability: "Sur rendez-vous",
    isAvailable: true,
    isPremium: true,
    priceRange: "25-100 DT",
    rating: 5.0,
    reviewCount: 203,
    status: "pending" // Start as pending for admin to approve
  },
  {
    name: "Karim Bouazizi",
    email: "karim@example.com",
    password: "password123",
    phone: "+216 50 321 987",
    whatsapp: "+21650321987",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    category: "it",
    location: "Sfax, Centre ville",
    description: "Technicien informatique. Réparation PC/Mac, installation réseau, récupération données.",
    services: "Réparation PC, Installation réseau, Récupération données, Formation",
    availability: "Lun-Sam 9h-19h",
    isAvailable: true,
    isPremium: false,
    priceRange: "35-150 DT",
    rating: 4.6,
    reviewCount: 67,
    status: "pending" // Start as pending for admin to approve
  },
  {
    name: "Sonia Ben Ali",
    email: "sonia@example.com",
    password: "password123",
    phone: "+216 27 654 321",
    whatsapp: "+21627654321",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    category: "gardening",
    location: "Tunis, Carthage",
    description: "Paysagiste professionnelle. Création jardins, entretien espaces verts, arrosage automatique.",
    services: "Création jardin, Entretien, Arrosage automatique, Taille arbres",
    availability: "Lun-Ven 7h-16h",
    isAvailable: true,
    isPremium: false,
    priceRange: "50-200 DT",
    rating: 4.8,
    reviewCount: 45,
    status: "pending" // Start as pending for admin to approve
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/servicek");
    console.log("Connected to MongoDB");
    
    // Clear existing data
    await Provider.deleteMany({});
    console.log("Cleared existing providers");
    
    // Hash passwords and create providers
    for (const providerData of providers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(providerData.password, salt);
      
      const provider = new Provider({
        ...providerData,
        password: hashedPassword
      });
      
      await provider.save();
      console.log(`Created provider: ${provider.name}`);
    }
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();