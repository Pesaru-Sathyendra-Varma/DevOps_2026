const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAdminStats, listUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
