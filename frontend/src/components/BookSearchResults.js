import React, { useEffect, useState } from "react";
import axios from "axios";

const BookSearchResults = ({ query }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/books/search?q=${query}`);
        setBooks(res.data.items || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div style={styles.container}>
      {books.map((book) => {
        const info = book.volumeInfo;
        return (
          <div key={book.id} style={styles.card}>
            <img src={info.imageLinks?.thumbnail} alt={info.title} style={styles.thumbnail} />
            <div>
              <h3>{info.title}</h3>
              <p><strong>Author:</strong> {info.authors?.join(", ")}</p>
              <p>{info.description?.slice(0, 120)}...</p>
              <a href={info.infoLink} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    padding: "80px 20px 20px", // account for fixed navbar
    display: "grid",
    gap: "16px",
  },
  card: {
    display: "flex",
    gap: "16px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  thumbnail: {
    width: "100px",
    height: "auto",
    objectFit: "cover",
  },
};

export default BookSearchResults;
