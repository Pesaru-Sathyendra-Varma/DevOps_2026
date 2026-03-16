const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, travelPreference, budget, location } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, travelPreference, budget, location });
  const token = signToken(user._id);

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      travelPreference: user.travelPreference,
      budget: user.budget,
      location: user.location,
      role: user.role
    }
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id);
  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      travelPreference: user.travelPreference,
      budget: user.budget,
      location: user.location,
      role: user.role
    }
  });
};

const me = async (req, res) => {
  return res.json(req.user);
};

module.exports = { register, login, me };
