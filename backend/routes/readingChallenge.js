import express from "express";
import User from "../models/User.js";  // Assuming the User model is in the 'models' folder
import { authenticate } from "../middleware/auth.js";  // Assuming authentication middleware is in the 'middleware' folder

const router = express.Router();

// Route to get the reading challenge goal for a user in the current year
// Route to get the reading challenge goal for a user in the current year
router.get("/getChallenge/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;
  const currentYear = new Date().getFullYear().toString();  // Get the current year

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const goal = user.bookChallenge.get(currentYear);  // Get the goal for the current year
    if (goal !== undefined) {
      return res.json({ goal });
    } else {
      return res.json({ goal: null });
    }
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Route to set or update the reading challenge goal for the current year
router.put("/setChallenge/:userId/:year", authenticate, async (req, res) => {
  const { userId, year } = req.params;
  const { goal } = req.body;

  if (typeof goal !== "number" || goal <= 0) {
    return res.status(400).json({ message: "Goal must be a positive number" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set or update the reading challenge goal for the specified year
    user.bookChallenge.set(year, goal);
    await user.save();

    return res.status(200).json({ message: `Goal for ${year} set to ${goal} books` });
  } catch (error) {
    console.error("Error setting challenge:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


// Route to update the book status
router.post("/updateBookStatus", async (req, res) => {
  const { userId, bookId, status } = req.body;
  
  console.log("Received update request:", req.body);

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the book already exists in the user's book list
    const book = user.books.find(book => book.bookId === bookId);

    if (book) {
      // Book exists, update the status and timestamp
      book.status = status;
      book.timestamp = Date.now(); // Update the timestamp for when the status is changed
    } else {
      // Book doesn't exist, add the new book to the list
      const newBook = {
        bookId,
        status,
        timestamp: Date.now(), // Set the timestamp for when the book is first added
      };
      user.books.push(newBook);
    }

    await user.save();
    console.log("Book status updated or added successfully");
    res.status(200).json({ message: "Book status updated or added successfully" });
  } catch (error) {
    console.error("Error updating book status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/removeBook', async (req, res) => {
  const { userId, bookId } = req.body; // Get userId and bookId from request body

  if (!userId || !bookId) {
    return res.status(400).json({ message: 'User ID and Book ID are required.' });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's book list and remove it
    const bookIndex = user.books.findIndex(book => book.bookId === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in the user\'s list.' });
    }

    // Remove the book from the user's books array
    user.books.splice(bookIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Book successfully removed from the list.' });
  } catch (error) {
    console.error('Error removing book from list:', error);
    return res.status(500).json({ message: 'Server error while removing the book.' });
  }
});

// Sample endpoint to get user data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert user document to a plain object (including bookChallenge)
    const userObj = user.toObject();

    // Debug log to check bookChallenge field
    console.log('Book Challenge Data:', userObj.bookChallenge);

    // Get current year as a string (since Map keys are usually strings)
    const currentYear = new Date().getFullYear().toString();

    // Safely extract the challenge goal
    let challengeGoal = 0;

    // Check if bookChallenge is a Map (Mongoose can return Map instances)
    if (user.bookChallenge instanceof Map) {
      challengeGoal = user.bookChallenge.get(currentYear) || 0;
    } else if (typeof userObj.bookChallenge === 'object' && userObj.bookChallenge !== null) {
      challengeGoal = userObj.bookChallenge[currentYear] || 0;
    }

    console.log('Challenge Goal:', challengeGoal);

    // Filter books that were read this year
    const booksReadThisYear = userObj.books.filter(book => {
      return book.status === 'read' && new Date(book.timestamp).getFullYear().toString() === currentYear;
    });

    const booksReadCount = booksReadThisYear.length;

    // Log the ratio
    if (challengeGoal === 0) {
      console.log(`Books read this year: ${booksReadCount} / Challenge goal: ${challengeGoal} (Goal not set for this year)`);
    } else {
      console.log(`Books read this year: ${booksReadCount} / Challenge goal: ${challengeGoal}`);
      console.log(`Books read this year / Challenge goal ratio: ${booksReadCount} / ${challengeGoal} = ${booksReadCount / challengeGoal}`);
    }

    // Return data
    res.json({
      user: userObj,
      booksReadThisYearCount: booksReadCount,
      books: userObj.books,
      challengeGoal: challengeGoal,  // Include challengeGoal in the response
    });
    
  } catch (err) {
    console.error('Error in GET /:userId:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
