const User = require("../models/User");
const Destination = require("../models/Destination");
const Review = require("../models/Review");

const getAdminStats = async (_req, res) => {
  const [totalUsers, totalDestinations, totalReviews, topRecommended] = await Promise.all([
    User.countDocuments(),
    Destination.countDocuments(),
    Review.countDocuments(),
    Destination.find().sort({ ratingsCount: -1, ratingsAverage: -1 }).limit(5)
  ]);

  res.json({ totalUsers, totalDestinations, totalReviews, topRecommended });
};

const listUsers = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.status(400).json({ message: "Cannot delete admin" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = { getAdminStats, listUsers, deleteUser };
