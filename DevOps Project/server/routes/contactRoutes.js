const express = require("express");
const { body } = require("express-validator");
const { submitContact } = require("../controllers/contactController");

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").isLength({ min: 5 }).withMessage("Message is too short")
  ],
  submitContact
);

module.exports = router;
