import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from '../middleware/auth.js';  // Adjust path if necessary

const router = express.Router();

// =============================
// User Registration Route
// =============================
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must have at least one uppercase letter, one number, one special character, and minimum 8 characters."
    });
  }

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists. Please try a different username." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered. Please try a different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// =============================
// User Login Route
// =============================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Username does not exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// User Profile Routes
// =============================

// Get user profile by userId
router.get('/profile/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username || "Not Available",
      favoriteGenres: user.favoriteGenres || "Not yet selected",
      readingChallenge: user.readingChallenge || {
        year: "Not yet started",
        status: "Not yet started",
        progress: 0,
        previousChallenges: "Not available",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// Update user profile (username, favoriteGenres)
router.put("/updateProfile", authenticate, async (req, res) => {
  try {
    const { username, favoriteGenres } = req.body;
    const userId = req.user.id; // Get user ID from the JWT token

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, favoriteGenres },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =============================
// Password Change Route
// =============================
router.put("/changePassword", authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId); // Get user by ID
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword; // Update the user's password

    await user.save(); // Save the updated user

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =============================
// Other Utility Routes
// =============================

// GET user data by userId (for non-authenticated users)
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// New route: Update user data by userId (optional, replace the `/updateProfile` if you want this)
router.put('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, favoriteGenres } = req.body;

    // Validate input data
    if (!username || !favoriteGenres) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Update user in the database
    const user = await User.findByIdAndUpdate(userId, {
      username,
      favoriteGenres
    }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});




router.get('/favorites/genres/:userId', authenticate, async (req, res) => {
  console.log("Route hit!");

  const { userId } = req.params;
  console.log("Received request for userId:", userId);

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Received token:", token);

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token is valid:", decoded);

    if (decoded.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized: User ID mismatch" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User's favorite genres:", user.favoriteGenres);
    res.json({ favoriteGenres: user.favoriteGenres });
  } catch (err) {
    console.error('Error during token verification:', err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});


// Export the router
export default router;
