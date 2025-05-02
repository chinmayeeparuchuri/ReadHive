import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Browse = () => {
  const [books, setBooks] = useState([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All Books");
  const [selectedRatings, setSelectedRatings] = useState(["4-5"]);
  const [sortOrder, setSortOrder] = useState("desc");

  const genres = [
    "Fiction", "Non-fiction", "Sci-Fi", "Fantasy", "Romance", "Mystery", "Thriller", "Horror", "Historical Fiction", "Biography", "Autobiography", "Memoir", "Self-help", "Philosophy", "Young Adult", "Dystopian", "Adventure", "Crime", "Poetry", "Literary Fiction", "Cookbooks", "Travel", "Health & Wellness", "Art & Photography", "Science", "True Crime", "Business & Economics", "Parenting & Family", "Graphic Novels", "Spirituality", "Religion"
  ];

  const ratingRanges = ["Below 1", "1-2", "2-3", "3-4", "4-5"];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/books/search?q=${selectedGenre}`);
        let filtered = res.data.items || [];

        filtered = filtered.filter((book) => {
          const rating = book.volumeInfo.averageRating || 0;
          return selectedRatings.some((range) => {
            if (range === "Below 1") return rating < 1;
            const [min, max] = range.split("-").map(Number);
            return rating >= min && rating <= max;
          });
        });

        filtered.sort((a, b) => {
          const ra = a.volumeInfo.averageRating || 0;
          const rb = b.volumeInfo.averageRating || 0;
          return sortOrder === "desc" ? rb - ra : ra - rb;
        });

        setBooks(filtered);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [selectedGenre, selectedRatings, sortOrder]);

  const toggleRating = (range) => {
    setSelectedRatings((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.header}>🍯 Browse Books</h1>

        {/* Filter Controls */}
        <div style={styles.filterControls}>
          <button style={styles.sortButton} onClick={() => setGenreOpen(!genreOpen)}>
            Genres ⌄
          </button>
          <button style={styles.sortButton} onClick={() => setRatingOpen(!ratingOpen)}>
            Ratings ⌄
          </button>
        </div>

        {genreOpen && (
          <div style={styles.genreSelector}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  ...styles.genreButton,
                  backgroundColor: selectedGenre === genre ? "#ff6e61" : "#fff",
                  color: selectedGenre === genre ? "#fff" : "#333",
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {ratingOpen && (
          <div style={styles.ratingFilter}>
            <div>
              {ratingRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => toggleRating(range)}
                  style={{
                    ...styles.ratingButton,
                    backgroundColor: selectedRatings.includes(range)
                      ? "#ff6e61"
                      : "#fff",
                    color: selectedRatings.includes(range) ? "#fff" : "#333",
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => setSortOrder("asc")}
                style={{
                  ...styles.sortToggle,
                  backgroundColor: sortOrder === "asc" ? "#ff6e61" : "#fff",
                  color: sortOrder === "asc" ? "#fff" : "#333",
                }}
              >
                Ascending
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                style={{
                  ...styles.sortToggle,
                  backgroundColor: sortOrder === "desc" ? "#ff6e61" : "#fff",
                  color: sortOrder === "desc" ? "#fff" : "#333",
                }}
              >
                Descending
              </button>
            </div>
          </div>
        )}

        {/* Book Grid */}
        <div style={styles.booksGrid}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BookCard = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.bookCard}>
      <Link to={`/book/${book.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
            {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
          </p>
          <p>{book.volumeInfo.averageRating || "N/A"} ⭐</p>
        </div>
      </Link>
    </div>
  );
};

const styles = {
  container: { backgroundColor: "#f8c572", minHeight: "100vh", paddingTop: "70px" },
  content: { padding: "20px 40px" },
  header: { fontSize: "28px", color: "#333", marginBottom: "20px" },
  filterControls: { display: "flex", gap: "10px", marginBottom: "10px" },
  sortButton: {
    padding: "8px 14px", borderRadius: "20px", border: "1px solid #ddd",
    background: "#fff", cursor: "pointer", fontWeight: 500,
  },
  genreSelector: {
    display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px",
  },
  genreButton: {
    padding: "6px 14px", borderRadius: "20px", border: "1px solid #ccc",
    cursor: "pointer", fontSize: "14px",
  },
  ratingFilter: {
    marginBottom: "20px",
  },
  ratingButton: {
    margin: "5px", padding: "6px 12px", borderRadius: "20px",
    border: "1px solid #ccc", cursor: "pointer", fontSize: "14px",
  },
  sortToggle: {
    marginRight: "10px", padding: "6px 12px", borderRadius: "20px",
    border: "1px solid #ccc", cursor: "pointer",
  },
  booksGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px",
  },
  bookCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", padding: "10px",
    textAlign: "center", position: "relative",
  },
  bookImage: { width: "100px", height: "150px", objectFit: "cover", borderRadius: "4px" },
  bookInfo: { padding: "10px 5px" },
  bookTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "6px", color: "#333" },
  bookAuthor: { fontSize: "14px", color: "#555" },
  addToListButton: {
    backgroundColor: "#ff6e61", color: "#fff", border: "none", marginTop: "10px",
    padding: "6px 12px", borderRadius: "5px", cursor: "pointer",
  },
  dropdown: {
    position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
    backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: "10px",
    borderRadius: "5px", marginTop: "5px", zIndex: 1,
  },
  dropdownItem: {
    backgroundColor: "#f0f0f0", border: "none", padding: "8px 10px",
    cursor: "pointer", fontSize: "14px", width: "100%", textAlign: "left",
  },
};

export default Browse;
