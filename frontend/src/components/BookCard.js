import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div style={styles.card}>
      {/* Book Cover */}
      <img src={book.coverUrl} alt={book.title} style={styles.cardImage} />
      
      {/* Book Name */}
      <h2 style={styles.cardTitle}>{book.title}</h2>
      
      {/* Book Rating */}
      <p style={styles.cardRating}>Rating: {book.rating} / 5</p>
      
      {/* Link to navigate to detailed view */}
      <Link to={`/book/${book.bookId}`} style={styles.cardLink}>
        View Details
      </Link>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    width: '200px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  cardTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  cardRating: {
    fontSize: '1em',
    color: '#f44336', // Or any color that fits
    marginTop: '5px',
  },
  cardLink: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#f44336',
    textDecoration: 'none',
  },
};

export default BookCard;
