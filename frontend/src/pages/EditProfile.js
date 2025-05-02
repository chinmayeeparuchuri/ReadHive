import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import your Navbar component

// Styles
const styles = {
  container: {
    backgroundColor: "#f8c572", // Honey yellow background for the whole page
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "500px",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
    display: "block",
    textAlign: "left", // Make labels align to the left
  },
  label: {
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  checkboxContainer: {
    textAlign: "left",
    marginTop: "10px",
    display: "flex", // Align checkboxes horizontally
    flexWrap: "wrap", // Allow wrapping if there are many genres
    gap: "10px", // Space between checkboxes
  },
  checkboxLabel: {
    marginLeft: "5px", // Add some space between the checkbox and label
  },
  button: {
    backgroundColor: "#ff6e61",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    margin: "0 10px"
  },
  buttonContainer: {
    marginTop: "20px",
  },
  successMessage: {
    color: "green",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    width: "350px", // Larger width for the modal
  },
  modalButtons: {
    marginTop: "20px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  okayButton: {
    backgroundColor: "#ff6e61",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const EditProfile = () => {
  const [userData, setUserData] = useState(null); // state to store user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // state for auth status
  const [username, setUsername] = useState(''); // state for editable username
  const [favoriteGenres, setFavoriteGenres] = useState([]); // state for favorite genres
  const [loading, setLoading] = useState(false); // state for loading status
  const [allGenres, setAllGenres] = useState([
    "Fiction", "Non-fiction", "Sci-Fi", "Fantasy", "Romance", "Mystery", "Thriller", "Horror", "Historical Fiction", "Biography", "Autobiography", "Memoir", "Self-help", "Philosophy", "Young Adult", "Dystopian", "Adventure", "Crime", "Poetry", "Literary Fiction", "Cookbooks", "Travel", "Health & Wellness", "Art & Photography", "Science", "True Crime", "Business & Economics", "Parenting & Family", "Graphic Novels", "Spirituality", "Religion"
  ]); // List of genres (this can be dynamic if you fetch it from the server)
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  const navigate = useNavigate(); // Hook to navigate between pages

  useEffect(() => {
    

    

    if (userId) {
      // Make an API call to fetch user data based on the userId
      axios.get(`http://localhost:5001/api/auth/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token in headers
        }
      })
        .then((response) => {
          setUserData(response.data); // Assuming the response contains user data
          setUsername(response.data.username); // Set the initial username value
          setFavoriteGenres(response.data.favoriteGenres); // Set the initial favoriteGenres value
          setIsAuthenticated(true); // User is authenticated
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false); // Treat as unauthenticated if fetching fails
        });
    } else {
      setIsAuthenticated(false); 
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    setFavoriteGenres((prevGenres) => {
      if (prevGenres.includes(selectedGenre)) {
        return prevGenres.filter((genre) => genre !== selectedGenre); // Remove from favorites
      } else {
        return [...prevGenres, selectedGenre]; // Add to favorites
      }
    });
  };

  const handleUpdate = () => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.log("No user ID found in localStorage.");
      return;
    }
  
    // Validate data before sending
    if (!username || !favoriteGenres || !Array.isArray(favoriteGenres)) {
      console.log("Invalid input: username or favoriteGenres is missing or malformed.");
      return;
    }
  
    setLoading(true); // Show loading indicator while updating
  
    axios.put(`http://localhost:5001/api/auth/user/${userId}`, { username, favoriteGenres }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token in headers
      }
    })
      .then((response) => {
        setUserData(response.data); // Update user data in state
        setLoading(false); // Hide loading indicator
      })
      .catch((error) => {
        console.error("Error updating user:", error.response || error);
        setLoading(false); // Hide loading indicator
      });
  };
  

  if (!isAuthenticated) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  return (
    <div style={styles.container}>
      <Navbar /> {/* Import Navbar here */}
      <div style={styles.formContainer}>
        <h1>Edit Profile</h1>
        <form>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Favorite Genres:</label>
            <div>
              {allGenres.map((genre) => (
                <div key={genre} style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id={genre}
                    value={genre}
                    checked={favoriteGenres.includes(genre)}
                    onChange={handleGenreChange}
                  />
                  <label style={styles.checkboxLabel} htmlFor={genre}>{genre}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {/* Buttons to navigate */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate(`/editreadingchallenge/${userId}`)} // Navigate to Edit Reading Challenge page
            style={styles.button}
          >
            Edit Reading Challenge
          </button>

          <button
            onClick={() => navigate(`/profile/${userData.userId}`)} // Navigate back to Profile page
            style={styles.button}
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
