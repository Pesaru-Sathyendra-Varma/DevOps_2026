const express = require("express");
const { body } = require("express-validator");
const { addReview, updateReview, deleteReview, getMyReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/mine", protect, getMyReviews);
router.post(
  "/",
  protect,
  [
    body("destination").notEmpty().withMessage("Destination is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment").isLength({ min: 3 }).withMessage("Comment is too short")
  ],
  addReview
);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
