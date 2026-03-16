const express = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("travelPreference").notEmpty(),
    body("budget").notEmpty(),
    body("location").notEmpty()
  ],
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);
router.get("/me", protect, me);

module.exports = router;
