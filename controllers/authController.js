const { sendOtp, verifyOtp } = require("../services/twilioService");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    await sendOtp(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verification = await verifyOtp(phone, code);
    if (verification.status === "approved") {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP", error });
  }
};
