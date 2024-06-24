const express = require("express");
const {
  registerUser,
  loginUser,
  loginUserWithOtp,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-otp", loginUserWithOtp);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get("/user", authMiddleware, getUserProfile);
router.post("/update-profile", authMiddleware, updateUserProfile);

module.exports = router;
