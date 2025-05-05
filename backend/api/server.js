import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import readingChallengeRoutes from "./routes/readingChallenge.js";
import serverless from "serverless-http";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("ReadHive API is Running on Vercel...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/readingChallenge", readingChallengeRoutes);

// Export as serverless function
export const handler = serverless(app);
