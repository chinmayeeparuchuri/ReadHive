import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(`/api/books/search?q=${query}`);
        setResults(res.data.items || []);
      } catch (err) {
        console.error("Error searching books:", err);
      }
    };

    const timeoutId = setTimeout(fetchBooks, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>🔍 Search for Books</h2>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          style={styles.input}
        />

        {showDropdown && results.length > 0 && (
          <div style={styles.dropdown} ref={dropdownRef}>
            {results.map((book) => {
              const info = book.volumeInfo;
              return (
                <div key={book.id} style={styles.resultItem}>
                  <img
                    src={info.imageLinks?.thumbnail}
                    alt={info.title}
                    style={styles.thumbnail}
                  />
                  <div>
                    <p style={styles.resultTitle}>{info.title}</p>
                    <p style={styles.resultAuthor}>
                      {info.authors?.join(", ") || "Unknown Author"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8c572", // Honey yellow
    minHeight: "100vh",
    paddingTop: "80px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "26px",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },
  dropdown: {
    backgroundColor: "#fff7d6", // Pastel yellow
    marginTop: "10px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    maxHeight: "300px",
    overflowY: "auto",
    padding: "10px",
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    borderBottom: "1px solid #eee",
  },
  thumbnail: {
    width: "50px",
    height: "75px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  resultTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#333",
  },
  resultAuthor: {
    fontSize: "13px",
    color: "#666",
  },
};

export default Search;
