const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  experience: { type: String },
  skills: { type: [String] },
  education: { type: String },
});

const User = mongoose.model("UserAdaan", userSchema);

module.exports = User;
