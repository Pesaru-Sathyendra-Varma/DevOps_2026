const { validationResult } = require("express-validator");
const Destination = require("../models/Destination");
const Review = require("../models/Review");

const listDestinations = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { location: { $regex: req.query.search, $options: "i" } }
    ];
  }

  const [items, total] = await Promise.all([
    Destination.find(filter).sort({ ratingsAverage: -1, createdAt: -1 }).skip(skip).limit(limit),
    Destination.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};

const getFeatured = async (_req, res) => {
  const items = await Destination.find({ isFeatured: true }).limit(6);
  res.json(items);
};

const getDestinationById = async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ message: "Destination not found" });

  const reviews = await Review.find({ destination: destination._id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({ destination, reviews });
};

const recommendDestinations = async (req, res) => {
  const user = req.user;
  const destinations = await Destination.find();

  const scored = destinations
    .map((destination) => {
      let score = 0;
      if (destination.category.toLowerCase() === user.travelPreference.toLowerCase()) score += 40;
      if (destination.location.toLowerCase().includes(user.location.toLowerCase())) score += 25;
      if (destination.budgetRange.toLowerCase() === user.budget.toLowerCase()) score += 20;
      score += destination.ratingsAverage * 3;
      score += Math.min(destination.ratingsCount, 20) * 0.5;

      return { ...destination.toObject(), recommendationScore: Number(score.toFixed(2)) };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);

  res.json(scored);
};

const createDestination = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const destination = await Destination.create(req.body);
  res.status(201).json(destination);
};

const updateDestination = async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!destination) return res.status(404).json({ message: "Destination not found" });
  res.json(destination);
};

const deleteDestination = async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ message: "Destination not found" });

  await Review.deleteMany({ destination: destination._id });
  await destination.deleteOne();
  res.json({ message: "Destination deleted" });
};

module.exports = {
  listDestinations,
  getFeatured,
  getDestinationById,
  recommendDestinations,
  createDestination,
  updateDestination,
  deleteDestination
};
