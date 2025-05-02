import axios from "axios";
import React, { createContext, useState, useContext } from "react";

// Create the context
export const AuthContext = createContext();

// Create and export the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        username,
        password,
      });
  
      if (response.status === 200 && response.data && response.data.user && response.data.token) {
        const { _id, username, email } = response.data.user;
  
        // Store userId and token in localStorage
        localStorage.setItem("userId", _id);
        localStorage.setItem("token", response.data.token);
  
        // Update user context
        setUser({
          userId: _id,
          username,
          email,
        });
  
        return true;
      } else {
        console.error("Login failed", response.data?.message || "Unknown error");
        setErrorMessage(response.data?.message || "Login failed. Try again.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "Login failed: " + (error.response?.data?.message || error.message || "Please try again.")
      );
      return false;
    }
  };
  

  const register = async (username, email, password, confirmPassword) => {
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });

      const userData = res.data;

      localStorage.setItem("userId", userData.userId); // Store the user ID
      localStorage.setItem("token", userData.token); // Optionally store token

      setUser({
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
      });

      return true;
    } catch (err) {
      console.error("Registration failed:", err);
      setErrorMessage(
        "Registration failed: " + (err.response?.data?.message || "Please try again.")
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); // Optionally remove token as well
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        errorMessage,
        setErrorMessage,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
