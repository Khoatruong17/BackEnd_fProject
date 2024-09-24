const User = require("../models/userModel");
const { compareSync } = require("bcryptjs");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("../models/userModel");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "Email and password required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server has a problem",
      error: error.message,
    });
  }
};

const Register = async (req, res) => {
  try {
    const { email, username, password } = req.body; // Include username
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email, username, and password" });
    }

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if the username already exists
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with both username and email
    let user = new userModel({
      email: email,
      username: username, // Save username
      passwordHash: hashedPassword,
    });

    await user.save();

    res.status(200).json({
      message: "User registered successfully",
      ec: 0,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server encountered a problem",
      ec: 1,
      error: error.message,
    });
  }
};

const Protected = (req, res) => {
  if (req.isAuthenticated()) {
    res.send("get Protected");
  } else {
    res.status(401).send("Unauthorized");
  }
  console.log(req.session);
};

const Logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.clearCookie("connect.sid");

    // Redirect tới trang logout của Google (tùy chọn)
    const googleLogoutUrl = "https://accounts.google.com/Logout";
    return res.redirect(googleLogoutUrl);
  });
};

const handleGoogleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }

    // Tạo JWT token
    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Gửi token về client
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: user,
    });
  })(req, res, next);
};

module.exports = {
  Login,
  Register,
  Logout,
  Protected,
  handleGoogleAuthCallback,
};
