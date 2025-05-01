import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const BookDetailPage = () => {
  const { id } = useParams(); // Book ID from URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    // Log the user ID from localStorage
    const userId = localStorage.getItem("userId"); // Or get it from another source
    console.log("User ID:", userId);

    const fetchBook = async () => {
      try {
        console.log(`Fetching book with ID: ${id}`);
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        console.log("Fetched book details:", res.data); // Log fetched book details
        setBook(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch book:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToList = async (listType) => {
    const userId = localStorage.getItem("userId"); // Get the user ID
    const bookId = id; // Book ID from URL

    // Log action in console
    console.log(`User ID: ${userId} added book ID: ${bookId} to ${listType} category.`);

    try {
      // Send the status update request to the backend
      console.log(`Sending POST request to update book status. URL: http://localhost:3000/api/readingChallenge/updateBookStatus`);
      const res = await axios.post('http://localhost:3000/api/readingChallenge/updateBookStatus', {
        userId,
        bookId,
        status: listType.toLowerCase(), // Convert to lowercase ('reading', 'will read', 'read')
      });

      console.log('Response from server:', res); // Log the response from the backend
      if (res.status === 200) {
        console.log(`Successfully updated status for book ID: ${bookId} to ${listType}`);
      } else {
        console.log(`Failed to update book status. Server returned status: ${res.status}`);
      }
      
      setIsOpen(false); // Close dropdown after selection
    } catch (error) {
      console.error('Failed to update book status:', error);
      console.log('Error response:', error.response); // Log the full error response if available
    }
  };

  const handleRemoveFromList = async () => {
    const userId = localStorage.getItem("userId"); // Get the user ID
    const bookId = id; // Book ID from URL
  
    console.log(`User ID: ${userId} removed book ID: ${bookId} from list.`);
  
    try {
      // Send the delete request to remove the book from the list
      console.log(`Sending DELETE request to remove book from the list. URL: http://localhost:3000/api/readingChallenge/removeBook`);
      const res = await axios.delete('http://localhost:3000/api/readingChallenge/removeBook', {
        data: {
          userId,
          bookId,
        },
      });
  
      console.log('Response from server:', res); // Log the response from the backend
      if (res.status === 200) {
        console.log(`Successfully removed book ID: ${bookId} from list`);
        
        // Fetch the book again to re-render the page with updated data
        const fetchBook = async () => {
          try {
            console.log(`Fetching book with ID: ${id}`);
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
            console.log("Fetched book details:", res.data); // Log fetched book details
            setBook(res.data);
            setLoading(false);
          } catch (error) {
            console.error("Failed to fetch book:", error);
            setLoading(false);
          }
        };
  
        fetchBook();
      } else {
        console.log(`Failed to remove book status. Server returned status: ${res.status}`);
      }
    } catch (error) {
      console.error('Failed to remove book from list:', error);
      console.log('Error response:', error.response); // Log the full error response if available
    }
  };
  

  if (loading) {
    console.log("Loading book details...");
    return <p>Loading...</p>;
  }

  if (!book) {
    console.log("No book found for the given ID.");
    return <p>Book not found.</p>;
  }

  const info = book.volumeInfo;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <img
          src={info.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
          alt={info.title}
          style={styles.thumbnail}
        />
        <div style={styles.details}>
          <h2>{info.title}</h2>
          <p><strong>Author(s):</strong> {info.authors?.join(", ") || "Unknown"}</p>
          <p><strong>Rating:</strong> {info.averageRating || "N/A"} ⭐</p>
          <p><strong>Description:</strong> {info.description || "No description available."}</p>

          {/* Buttons for adding to list or removing from list */}
          <div>
            <button
              style={styles.addToListButton}
              onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
            >
              Add to list
            </button>
            {isOpen && (
              <div style={styles.dropdown}>
                <button style={styles.dropdownItem} onClick={() => handleAddToList("Read")}>
                  Read
                </button>
                <button style={styles.dropdownItem} onClick={() => handleAddToList("Reading")}>
                  Reading
                </button>
                <button style={styles.dropdownItem} onClick={() => handleAddToList("Will Read")}>
                  Will Read
                </button>
              </div>
            )}

            {/* Remove from list button */}
            <button
              style={styles.removeFromListButton}
              onClick={handleRemoveFromList} // Handle removal from list
            >
              Remove from list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8c572",
    minHeight: "100vh",
    paddingTop: "70px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  content: {
    display: "flex",
    gap: "40px",
    padding: "40px",
  },
  thumbnail: {
    width: "200px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  details: {
    maxWidth: "600px",
    color: "#333",
  },
  addToListButton: {
    backgroundColor: "#ff6e61",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  removeFromListButton: {
    backgroundColor: "#f44336", // Red button for removal
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px", // Spacing between buttons
  },
  dropdown: {
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    position: "absolute",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    width: "200px",
  },
  dropdownItem: {
    backgroundColor: "#f0f0f0",
    border: "none",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "left",
    width: "100%",
  },
};

export default BookDetailPage;
