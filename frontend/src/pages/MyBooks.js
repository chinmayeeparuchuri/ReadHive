import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from '../components/Navbar';
import axios from 'axios';

const MyBooks = () => {
  const [selectedShelf, setSelectedShelf] = useState('All');
  const [userBooks, setUserBooks] = useState([]);
  const [userId, setUserId] = useState(null);

  const [booksReadThisYearCount, setBooksReadThisYearCount] = useState(0);
  const [challengeGoal, setChallengeGoal] = useState(0);
  const [booksReadThisYear, setBooksReadThisYear] = useState([]);
  const [bookDetails, setBookDetails] = useState({}); // Store book details

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);

      axios.get(`http://localhost:5001/api/readingChallenge/${storedUserId}`)
        .then((response) => {
          const userData = response.data;
          console.log('User Data:', userData);

          setUserBooks(userData.books);
          setBooksReadThisYearCount(userData.booksReadThisYearCount || 0);
          setChallengeGoal(userData.challengeGoal || 0);

          const currentYear = new Date().getFullYear();
          const booksThisYear = userData.books.filter(book => 
            book.status === 'read' && 
            new Date(book.timestamp).getFullYear() === currentYear
          );
          setBooksReadThisYear(booksThisYear);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.log('No user logged in');
    }
  }, []);

  const fetchBook = async (id) => {
    try {
      console.log(`Fetching book with ID: ${id}`);
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
      console.log("Fetched book details:", res.data);
      setBookDetails((prevDetails) => ({
        ...prevDetails,
        [id]: res.data,
      }));
    } catch (error) {
      console.error("Failed to fetch book:", error);
    }
  };

  const handleShelfChange = (shelf) => {
    setSelectedShelf(shelf);
  };

  const renderBooks = () => {
    if (selectedShelf === 'Reading Challenge') {
      const booksLeft = Math.max(challengeGoal - booksReadThisYearCount, 0);

      return (
        <div style={{ textAlign: 'center' }}>
          <p>Books read this year: {booksReadThisYearCount}</p>
          <p>Challenge goal: {challengeGoal}</p>
          <p>Status: {booksReadThisYearCount}/{challengeGoal} ({booksLeft} more {booksLeft === 1 ? 'book' : 'books'} to go!)</p>

          {booksReadThisYear.length === 0 ? (
            <p style={styles.noBooksMessage}>No books read yet this year</p>
          ) : (
            <div style={styles.bookCards}>
              {booksReadThisYear.map((book, index) => (
                <Link to={`/book/${book.bookId}`} key={index} style={{ textDecoration: "none", color: "inherit" }}>
                  <BookCard
                    bookId={book.bookId}
                    fetchBook={fetchBook} // Pass fetchBook function
                    bookDetails={bookDetails[book.bookId]}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    let filteredBooks = userBooks;

    if (selectedShelf !== 'All') {
      filteredBooks = userBooks.filter(book => book.status === selectedShelf.toLowerCase());
    }

    if (filteredBooks.length === 0) {
      return <p style={styles.noBooksMessage}>No books in this shelf</p>;
    }

    return (
      <div style={styles.bookCards}>
        {filteredBooks.map((book, index) => (
          <Link to={`/book/${book.bookId}`} key={index} style={{ textDecoration: "none", color: "inherit" }}>
            <BookCard
              bookId={book.bookId}
              fetchBook={fetchBook} // Pass fetchBook function
              bookDetails={bookDetails[book.bookId]}
            />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.myBooksTitle}>My Books</h1>
      <div style={styles.shelfTabs}>
        <button
          style={selectedShelf === 'All' ? { ...styles.shelfTab, ...styles.selectedButton } : styles.shelfTab}
          onClick={() => handleShelfChange('All')}
        >
          All
        </button>
        <button
          style={selectedShelf === 'Read' ? { ...styles.shelfTab, ...styles.selectedButton } : styles.shelfTab}
          onClick={() => handleShelfChange('Read')}
        >
          Read
        </button>
        <button
          style={selectedShelf === 'Currently Reading' ? { ...styles.shelfTab, ...styles.selectedButton } : styles.shelfTab}
          onClick={() => handleShelfChange('Reading')}
        >
          Currently Reading
        </button>
        <button
          style={selectedShelf === 'Want to Read' ? { ...styles.shelfTab, ...styles.selectedButton } : styles.shelfTab}
          onClick={() => handleShelfChange('Will Read')}
        >
          Want to Read
        </button>
        <button
          style={selectedShelf === 'Reading Challenge' ? { ...styles.shelfTab, ...styles.selectedButton } : styles.shelfTab}
          onClick={() => handleShelfChange('Reading Challenge')}
        >
          Reading Challenge
        </button>
      </div>

      <div style={styles.bookList}>
        {renderBooks()}
      </div>
    </div>
  );
};

const BookCard = ({ bookId, fetchBook, bookDetails }) => {
  useEffect(() => {
    if (bookId && !bookDetails) {
      fetchBook(bookId); // Fetch book details if not already fetched
    }
  }, [bookId, bookDetails, fetchBook]);

  if (!bookDetails) {
    return <div>Loading book details...</div>;
  }

  const { volumeInfo } = bookDetails;
  const { title, authors, imageLinks } = volumeInfo || {};

  return (
    <div style={styles.bookCard}>
      <img
        src={imageLinks ? imageLinks.thumbnail : '/default-book-image.jpg'}
        alt={title}
        style={styles.bookImage}
      />
      <div style={styles.bookInfo}>
        <h3 style={styles.bookTitle}>{title}</h3>
        {authors && <p style={styles.bookAuthors}>{authors.join(', ')}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8c572',
    minHeight: '100vh',
    paddingTop: '70px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  myBooksTitle: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '80px',
  },
  shelfTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  shelfTab: {
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: '600',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  selectedButton: {
    backgroundColor: '#f44336',
  },
  bookList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '300px',
  },
  bookCards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  bookImage: {
    width: '100px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  bookInfo: {
    marginTop: '10px',
  },
  bookTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthors: {
    fontSize: '14px',
    color: '#777',
  },
  noBooksMessage: {
    fontSize: '1.5em',
    color: '#777',
    fontWeight: '400',
  },
};

export default MyBooks;
