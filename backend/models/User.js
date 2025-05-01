import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteGenres: { type: [String], default: [] }, // Array of strings for favorite genres
  books: [
    {
      bookId: { type: String, required: true }, // Store only bookId
      status: { type: String, enum: ['reading', 'will read', 'read'], required: true }, // Status only
      timestamp: { type: Date, default: Date.now },
    }
  ],
  bookChallenge: {
    type: Map,
    of: Number, // The value will represent the number of books to be read in that year
    default: {},
  },
  createdAt: { type: Date, default: Date.now }, // To determine the year of account creation
});

export default mongoose.model("User", UserSchema);
