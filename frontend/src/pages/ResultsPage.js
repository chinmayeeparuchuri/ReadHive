import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books/search?q=${query}`);
        setResults(res.data.items || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>
          Results for: <span style={{ color: "#ff6e61" }}>{query}</span>
        </h2>

        {loading ? (
          <p style={styles.loading}>Searching...</p>
        ) : results.length === 0 ? (
          <p style={styles.noResults}>No books found.</p>
        ) : (
          <div style={styles.grid}>
            {results.map((book) => {
              const info = book.volumeInfo;
              return (
                <Link
                  to={`/book/${book.id}`}
                  key={book.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={styles.card}>
                    <img
                      src={
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/128x195?text=No+Image"
                      }
                      alt={info.title}
                      style={styles.thumbnail}
                    />
                    <h4 style={styles.bookTitle}>{info.title}</h4>
                    <p style={styles.author}>
                      {info.authors?.join(", ") || "Unknown Author"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8c572",
    paddingTop: "100px",
    paddingBottom: "60px",
    paddingLeft: "40px",
    paddingRight: "40px",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  loading: {
    fontSize: "18px",
  },
  noResults: {
    fontSize: "18px",
    color: "#777",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#fffef5",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease",
  },
  thumbnail: {
    width: "100px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  bookTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  author: {
    fontSize: "14px",
    color: "#777",
  },
};

export default ResultsPage;
