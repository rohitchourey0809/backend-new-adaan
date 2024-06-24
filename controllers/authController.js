const { sendOtp, verifyOtp } = require("../services/twilioService");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  console.log("phone----------->", phone);
  try {
    await sendOtp(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verificationCheck = await verifyOtp(phone, code);
    if (verificationCheck.status === "approved") {
      const user = await User.findOne({ phone });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
};
