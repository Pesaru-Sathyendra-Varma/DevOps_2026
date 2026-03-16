const { validationResult } = require("express-validator");
const Review = require("../models/Review");
const Destination = require("../models/Destination");

const refreshDestinationRating = async (destinationId) => {
  const stats = await Review.aggregate([
    { $match: { destination: destinationId } },
    {
      $group: {
        _id: "$destination",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  const ratingsAverage = stats[0]?.avgRating || 0;
  const ratingsCount = stats[0]?.count || 0;

  await Destination.findByIdAndUpdate(destinationId, {
    ratingsAverage: Number(ratingsAverage.toFixed(1)),
    ratingsCount
  });
};

const addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { destination, rating, comment } = req.body;

  const existing = await Review.findOne({ destination, user: req.user._id });
  if (existing) return res.status(409).json({ message: "You already reviewed this destination" });

  const review = await Review.create({ destination, rating, comment, user: req.user._id });
  await refreshDestinationRating(destination);

  const populated = await review.populate("user", "name");
  res.status(201).json(populated);
};

const updateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (String(review.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();

  await refreshDestinationRating(review.destination);
  const populated = await review.populate("user", "name");
  res.json(populated);
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (String(review.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const destinationId = review.destination;
  await review.deleteOne();
  await refreshDestinationRating(destinationId);

  res.json({ message: "Review deleted" });
};

const getMyReviews = async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).populate("destination", "name").sort({ createdAt: -1 });
  res.json(reviews);
};

module.exports = { addReview, updateReview, deleteReview, getMyReviews };
