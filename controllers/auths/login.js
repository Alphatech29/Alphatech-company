// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../../model/db");

const SECRET_KEY = process.env.JWT_TOKEN;

// Ensure JWT secret is defined
if (!SECRET_KEY) {
  throw new Error("JWT_TOKEN is not defined in .env!");
}

// Email validation regex
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Minimum password length
const MIN_PASSWORD_LENGTH = 6;

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Email/Username and password are required." });
    }

    if (isValidEmail(identifier)) {
      // Valid email format, proceed
    } else if (identifier.length < 3) { // optional: basic username validation
      return res.status(400).json({ success: false, message: "Invalid username." });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    }

    // Fetch user from DB using email OR username
    const [rows] = await pool.query(
      "SELECT * FROM admin WHERE email = ? OR username = ?",
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = rows[0];

    // Compare password asynchronously
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // Generate JWT (including only id and role)
    const token = jwt.sign(
      { id: user.id, role: user.role || "admin" },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Exclude password from response
    const { password: _, ...userData } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { login };
