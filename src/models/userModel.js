const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    username: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    googleId: { type: String },
    verified: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
