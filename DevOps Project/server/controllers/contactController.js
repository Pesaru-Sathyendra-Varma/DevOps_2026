const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const contact = await Contact.create(req.body);
  return res.status(201).json({ message: "Message sent successfully", contact });
};

module.exports = { submitContact };
