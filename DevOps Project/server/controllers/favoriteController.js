const Favorite = require("../models/Favorite");

const getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate("destination");
  res.json(favorites.map((item) => item.destination));
};

const toggleFavorite = async (req, res) => {
  const { destinationId } = req.body;
  const existing = await Favorite.findOne({ user: req.user._id, destination: destinationId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ message: "Removed from favorites", active: false });
  }

  await Favorite.create({ user: req.user._id, destination: destinationId });
  return res.json({ message: "Saved to favorites", active: true });
};

module.exports = { getFavorites, toggleFavorite };
