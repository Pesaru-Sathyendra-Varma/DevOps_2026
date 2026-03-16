const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    budgetRange: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    travelTips: [{ type: String }],
    nearbyHotels: [{ type: String }],
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
