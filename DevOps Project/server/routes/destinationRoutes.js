const express = require("express");
const { body } = require("express-validator");
const {
  listDestinations,
  getFeatured,
  getDestinationById,
  recommendDestinations,
  createDestination,
  updateDestination,
  deleteDestination
} = require("../controllers/destinationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", listDestinations);
router.get("/featured", getFeatured);
router.get("/recommendations", protect, recommendDestinations);
router.get("/:id", getDestinationById);

router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("name").notEmpty(),
    body("category").notEmpty(),
    body("location").notEmpty(),
    body("budgetRange").notEmpty(),
    body("description").notEmpty(),
    body("shortDescription").notEmpty(),
    body("image").notEmpty()
  ],
  createDestination
);
router.put("/:id", protect, authorize("admin"), updateDestination);
router.delete("/:id", protect, authorize("admin"), deleteDestination);

module.exports = router;
