const express = require("express");
const { protect } = require("../middleware/auth");
const { getFavorites, toggleFavorite } = require("../controllers/favoriteController");

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/toggle", protect, toggleFavorite);

module.exports = router;
