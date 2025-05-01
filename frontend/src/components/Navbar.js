import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // ✅ FIX: Get userId safely

  const currentYear = new Date().getFullYear(); // Define currentYear

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`/api/books/search?q=${query}`);
        setSuggestions(res.data.items || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/results?query=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Optional: clear tokens
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to={`/home/${userId}`} style={styles.brand}>
          📚 ReadHive
        </Link>
      </div>

      <ul style={styles.navLinks}>
        <li>
          <Link to={`/home/${userId}`} style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to={`/mybooks/${userId}`} style={styles.link}>
            My Books
          </Link>
        </li>
        <li>
          <Link to="/browse" style={styles.link}>
            Browse
          </Link>
        </li>
      </ul>

      <div style={styles.rightSection}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search books..."
            style={styles.searchBar}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {suggestions.length > 0 && (
            <div style={styles.dropdown}>
              {suggestions.slice(0, 5).map((book) => (
                <Link
                  to={`/book/${book.id}`}
                  key={book.id}
                  style={{
                    ...styles.dropdownItem,
                    textDecoration: "none",
                    color: "#333",
                  }}
                  onClick={() => setSuggestions([])}
                >
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt="cover"
                      style={styles.thumbnail}
                    />
                  )}
                  <span>{book.volumeInfo.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={styles.profile} onClick={handleProfileClick}>
          <FaUserCircle size={28} color="#ff6e61" />
        </div>

        {isDropdownOpen && (
          <div style={styles.dropdownMenu}>
            <button style={styles.dropdownButton}>
              <Link to={`/profile/${userId}`} style={styles.link}>View Profile</Link>
            </button>
            <button style={styles.dropdownButton}>
              <Link to={`/editprofile/${userId}`} style={styles.link}>Edit Profile</Link>
            </button>
            <button style={styles.dropdownButton}>
              <Link to={`/readingchallenge/${userId}/${currentYear}`} style={styles.link}>Reading Challenge</Link>
            </button>
            <button
              style={styles.dropdownButton}
              onClick={handleLogout}
            >
              <span style={styles.link}>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    backdropFilter: "blur(6px)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  brand: {
    textDecoration: "none",
    color: "#ff6e61",
    fontSize: "22px",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#444",
    fontSize: "16px",
    fontWeight: "500",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginRight: "50px",
    position: "relative",
  },
  searchBar: {
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    width: "200px",
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    left: 0,
    backgroundColor: "#fffbe6",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 10,
    width: "250px",
    padding: "8px",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 4px",
    borderBottom: "1px solid #f0e6cc",
    fontSize: "14px",
  },
  thumbnail: {
    width: "30px",
    height: "45px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  profile: {
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#fffbe6",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 10,
    width: "200px",
    padding: "8px",
  },
  dropdownButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    textAlign: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#444",
    borderBottom: "1px solid #f0e6cc",
  },
};

export default Navbar;
