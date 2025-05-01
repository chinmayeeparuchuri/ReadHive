import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Cute Popup Component (built inside)
const CutePopup = ({ message, onClose }) => {
  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.popup}>
        <p style={popupStyles.message}>{message}</p>
        <button onClick={onClose} style={popupStyles.button}>Okay!</button>
      </div>
    </div>
  );
};

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks before sending to server
    if (!validateEmail(email)) {
      setPopupMessage("Please enter a valid email address!");
      return;
    }

    if (!validatePassword(password)) {
      setPopupMessage("Password must have at least 8 characters, one uppercase letter, one number, and one special character!");
      return;
    }

    if (password !== confirmPassword) {
      setPopupMessage("Passwords do not match!");
      return;
    }

    // Try to register
    const success = await register(username, email, password, confirmPassword);

    if (success) {
      navigate("/login");
    } else {
      setPopupMessage("Registration failed. Try again with different username or email.");
    }
  };

  // Helper Functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?/~`-]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Your ReadHive Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>Register</button>
            <button type="button" style={styles.button} onClick={() => navigate("/login")}>Back to Login</button>
          </div>
        </form>
      </div>

      {/* Cute Popup */}
      {popupMessage && (
        <CutePopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
};

// Styles Object
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8c572", // Pastel background
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "40px 30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    color: "#ff6e61",
    fontSize: "22px",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "12px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  button: {
    width: "48%",
    padding: "12px",
    backgroundColor: "#ff6e61",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    color: "white",
    transition: "background 0.3s ease-in-out",
  },
};

// Cute Popup styles
const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff5e4",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
    textAlign: "center",
    width: "300px",
  },
  message: {
    fontSize: "16px",
    color: "#ff6e61",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#ffb5a7",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "white",
  },
};

export default Register;
