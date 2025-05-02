import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [noFavGenres, setNoFavGenres] = useState(false);

  // Fetch user's favorite genres from the DB
  useEffect(() => {
    const fetchUserGenres = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId) {
        console.error("No userId found in localStorage");
        return;
      }
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        // Fetch user profile to get favorite genres
        const res = await fetch(`/api/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        const favGenres = data.favoriteGenres || [];

        if (favGenres.length === 0) {
          setNoFavGenres(true);
        } else {
          setNoFavGenres(false);
        }

        setGenres(favGenres.length > 0 ? favGenres : ["Fiction", "Non-fiction", "Fantasy"]);
        setSelectedGenre(favGenres[0] || "Fiction");

      } catch (err) {
        console.error("Error fetching favorite genres:", err);
        const fallbackGenres = ["Fiction", "Non-fiction", "Fantasy"];
        setGenres(fallbackGenres);
        setSelectedGenre(fallbackGenres[0]);
      }
    };

    fetchUserGenres();
  }, []);

  // Fetch books when selectedGenre changes
  useEffect(() => {
    if (!selectedGenre) return;

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/books/search?q=${selectedGenre}`);
        setBooks(res.data.items || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.header}>
           Discover {selectedGenre ? selectedGenre : "Genres"} Reads
        </h1>

        <div style={styles.genreSelector}>
          {noFavGenres ? (
            <p>FAVOURITE GENRE NOT SELECTED. GO TO EDIT PROFILE TO SELECT.</p>
          ) : genres.length > 0 ? (
            genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                onMouseEnter={() => setHoveredGenre(genre)}
                onMouseLeave={() => setHoveredGenre(null)}
                style={{
                  ...styles.genreButton,
                  backgroundColor: selectedGenre === genre ? "#ff6e61" : "#fff",
                  color: selectedGenre === genre ? "#fff" : "#333",
                  boxShadow: hoveredGenre === genre ? "0 0 6px #ff6e61" : "none",
                  fontWeight: selectedGenre === genre ? "bold" : "normal",
                  border: selectedGenre === genre ? "2px solid #ff6e61" : "1px solid #ddd",
                }}
              >
                {genre}
              </button>
            ))
          ) : (
            <p>No genres available</p>
          )}
        </div>

        <div style={styles.booksGrid}>
          {books.length > 0 ? (
            books.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.bookCard}>
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      style={styles.bookImage}
                    />
                  )}
                  <div style={styles.bookInfo}>
                    <h3 style={styles.bookTitle}>{book.volumeInfo.title}</h3>
                    <p style={styles.bookAuthor}>
                      {book.volumeInfo.authors
                        ? book.volumeInfo.authors.join(", ")
                        : "Unknown Author"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ color: "#333" }}>No books found for this genre...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8c572", // Honey yellow
    minHeight: "100vh",
    paddingTop: "70px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  content: {
    padding: "20px 40px",
  },
  header: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "20px",
  },
  genreSelector: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  genreButton: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
  },
  bookCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  bookImage: {
    width: "100px",
    height: "150px",
    objectFit: "cover",
    marginBottom: "10px",
    borderRadius: "4px",
  },
  bookInfo: {
    padding: "0 5px",
  },
  bookTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  bookAuthor: {
    fontSize: "14px",
    color: "#555",
  },
};

export default Home;
