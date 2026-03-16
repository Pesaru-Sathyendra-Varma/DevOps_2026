require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Destination = require("../models/Destination");
const User = require("../models/User");

const destinations = [
  {
    name: "Bali Escape",
    category: "Beach",
    location: "Indonesia",
    budgetRange: "Medium",
    shortDescription: "Tropical beaches with vibrant culture and wellness retreats.",
    description: "Bali offers surf-ready beaches, spiritual temples, waterfalls, and a rich culinary scene.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Visit during April-October", "Use scooters for local travel"],
    nearbyHotels: ["Ubud Serenity Resort", "Seminyak Ocean View Hotel"],
    isFeatured: true, ratingsAverage: 4.7, ratingsCount: 124
  },
  {
    name: "Swiss Alpine Adventure",
    category: "Adventure",
    location: "Switzerland",
    budgetRange: "High",
    shortDescription: "Ski slopes, scenic railways, and glacier landscapes.",
    description: "Explore mountain villages, panoramic trails, and world-class winter sports destinations.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Carry warm layered clothing", "Book scenic train routes early"],
    nearbyHotels: ["Zermatt Glacier Lodge", "Interlaken Grand Stay"],
    isFeatured: true, ratingsAverage: 4.8, ratingsCount: 89
  },
  {
    name: "Kyoto Heritage Trail",
    category: "Cultural",
    location: "Japan",
    budgetRange: "Medium",
    shortDescription: "Historic temples, gardens, and traditional Japanese neighborhoods.",
    description: "Experience iconic shrines, tea houses, geisha districts, and seasonal festivals in Japan.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Use day-passes for buses", "Respect temple etiquette"],
    nearbyHotels: ["Gion Central Inn", "Kyoto Garden Suites"],
    isFeatured: true, ratingsAverage: 4.6, ratingsCount: 104
  },
  {
    name: "Santorini Sunset",
    category: "Luxury",
    location: "Greece",
    budgetRange: "High",
    shortDescription: "Iconic white-washed villages above breathtaking blue waters.",
    description: "Santorini dazzles with caldera views, luxury cave hotels, and world-renowned sunsets over the Aegean Sea.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Book sunset-view hotels early", "Visit Oia village for best views"],
    nearbyHotels: ["Caldera Royal Suites", "Oia Cliffside Villas"],
    isFeatured: false, ratingsAverage: 4.9, ratingsCount: 211
  },
  {
    name: "Amazon Rainforest Trek",
    category: "Nature",
    location: "Brazil",
    budgetRange: "Low",
    shortDescription: "Uncharted jungle biodiversity with river cruises and wildlife encounters.",
    description: "Immerse yourself in the world's largest rainforest, teeming with exotic wildlife and indigenous cultures.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Pack insect repellent", "Hire a certified local guide"],
    nearbyHotels: ["Manaus Jungle Lodge", "Anavilhanas Eco Resort"],
    isFeatured: false, ratingsAverage: 4.4, ratingsCount: 56
  },
  {
    name: "Machu Picchu Explorer",
    category: "Adventure",
    location: "Peru",
    budgetRange: "Medium",
    shortDescription: "Ancient Inca citadel high in the Andes, a world wonder.",
    description: "Hike the Inca Trail to the legendary Sun Gate and explore stone temples of Machu Picchu.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80"
    ],
    travelTips: ["Acclimatize in Cusco first", "Book tickets in advance"],
    nearbyHotels: ["Belmond Sanctuary Lodge", "Aguas Calientes Hostel"],
    isFeatured: false, ratingsAverage: 4.8, ratingsCount: 178
  }
];

const seed = async () => {
  await connectDB();
  await Destination.deleteMany();
  const adminExists = await User.findOne({ email: "admin@smarttourism.com" });
  if (!adminExists) {
    await User.create({ name: "Platform Admin", email: "admin@smarttourism.com", password: "Admin@123", travelPreference: "Adventure", budget: "High", location: "Global", role: "admin" });
    console.log("Admin user created");
  }
  await Destination.insertMany(destinations);
  console.log(destinations.length + " destinations inserted");
  await mongoose.connection.close();
};

seed();
