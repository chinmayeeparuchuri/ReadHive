import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Navbar import

const ReadingChallenge = () => {
  const { userId, year } = useParams(); // Get userId and year from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booksWithTitles, setBooksWithTitles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/readingChallenge/${userId}`);
        console.log("User data fetched:", response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch book titles using the Google Books API
  useEffect(() => {
    const fetchBooks = async () => {
      const booksRead = userData?.books.filter(
        (book) =>
          book.status === "read" &&
          new Date(book.timestamp).getFullYear().toString() === year
      );

      if (booksRead) {
        const booksWithDetails = await Promise.all(
          booksRead.map(async (book) => {
            try {
              console.log(`Fetching book with ID: ${book.bookId}`);
              const res = await axios.get(
                `https://www.googleapis.com/books/v1/volumes/${book.bookId}`
              );
              console.log("Fetched book details:", res.data); // Log fetched book details
              return {
                ...book,
                title: res.data.volumeInfo.title || "Untitled",
                author: res.data.volumeInfo.authors?.join(", ") || "Unknown author",
              };
            } catch (error) {
              console.error(`Failed to fetch book with ID ${book.bookId}`, error);
              return {
                ...book,
                title: "Unknown Title",
                author: "Unknown Author",
              };
            }
          })
        );

        setBooksWithTitles(booksWithDetails);
      }
    };

    if (userData) {
      fetchBooks();
    }
  }, [userData, year]);

  if (loading) return <div>Loading...</div>;

  if (!userData) {
    return <div>Error: Could not fetch user data. Please try again later.</div>;
  }

  const currentYear = new Date().getFullYear();
  const challengeGoal = userData.challengeGoal;
  const totalBooksRead = booksWithTitles.length;

  const endDate = new Date(year, 11, 31);
  const today = new Date();
  const timeRemaining = endDate - today;
  const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  const progressPercentage =
    challengeGoal > 0 ? (totalBooksRead / challengeGoal) * 100 : 0;

  const isChallengeOver =
    year < currentYear || (year === currentYear && daysLeft <= 0);

  return (
    <>
      <Navbar /> {/* ✅ Navbar component */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Welcome to Reading Challenge {year}</h1>
          {isChallengeOver ? (
            <p style={styles.subHeader}>
              Challenge has ended. Go to this year's challenge for fun!
            </p>
          ) : (
            <p style={styles.subHeader}>
              Days left till over: {daysLeft > 0 ? daysLeft : "Challenge Ended"}
            </p>
          )}
        </div>

        {challengeGoal === 0 ? (
          <div style={styles.challengeNotStarted}>
            <p style={styles.challengeStatus}>Challenge not started yet!</p>
          </div>
        ) : (
          <div style={styles.challengeStarted}>
            <p>
              <strong>Goal:</strong> {challengeGoal} books
            </p>
            <p>
              <strong>Books Read:</strong> {totalBooksRead}
            </p>
            <p>
              <strong>Current Progress:</strong> {totalBooksRead} / {challengeGoal}
            </p>

            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <div style={styles.booksList}>
              <h3>Books Read:</h3>
              <ul>
                {booksWithTitles.map((book, index) => (
                  <li key={index}>
                    {book.title} by {book.author}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate(`/editreadingchallenge/${userId}`)}
            style={styles.editButton}
          >
            Edit Challenge
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8c572", // Honey yellow
    minHeight: "100vh",
    paddingTop: "70px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  subHeader: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#666",
  },
  challengeNotStarted: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "18px",
    color: "#ff6e61",
  },
  challengeStatus: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#ff6e61",
  },
  challengeStarted: {
    textAlign: "center",
    marginTop: "20px",
    color: "#444",
  },
  progressBarContainer: {
    marginTop: "20px",
    height: "20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    width: "100%",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff6e61",
    borderRadius: "10px 0 0 10px",
  },
  booksList: {
    marginTop: "20px",
    textAlign: "left",
    maxWidth: "600px",
    margin: "0 auto",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  editButton: {
    backgroundColor: "#ff6e61",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
  },
  editIcon: {
    fontSize: "18px",
  },
};

export default ReadingChallenge;
