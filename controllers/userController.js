const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { JWT_SECRET } = require("../config");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Register a new user
exports.registerUser = async (req, res) => {
  const { phone, email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phone,
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("token-->", token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user with OTP (dummy implementation)
exports.loginUserWithOtp = async (req, res) => {
  // Dummy implementation for OTP login
  res.status(200).json({ message: "Login with OTP successful" });
};

// Get

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user profile
exports.updateUserProfile = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { name, email, experience, skills, education } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.experience = experience || user.experience;
      user.skills = skills || user.skills;
      user.education = education || user.education;
      if (req.file) {
        user.photo = `/uploads/${req.file.filename}`;
      }

      await user.save();

      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
];
