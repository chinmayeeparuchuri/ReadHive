import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditReadingChallenge = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentYear = new Date().getFullYear();

  const [goal, setGoal] = useState(null);
  const [goalInputVisible, setGoalInputVisible] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [editedGoal, setEditedGoal] = useState("");
  const [inspirationalMessageVisible, setInspirationalMessageVisible] = useState(false);

  console.log("[DEBUG] Extracted userId from URL:", userId);

  useEffect(() => {
    const fetchGoal = async () => {
      const token = localStorage.getItem("token");
      console.debug("[DEBUG] Fetching goal for year:", currentYear, "and user:", userId);
  
      try {
        const response = await fetch(
          `http://localhost:3000/api/readingChallenge/getChallenge/${userId}`,  // Only pass userId
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        console.debug("[DEBUG] Parsed goal data:", data);
  
        if (!response.ok) throw new Error(`[DEBUG] Error fetching goal: ${response.statusText}`);
  
        setGoal(data.goal);  // Update the state with the fetched goal
      } catch (error) {
        console.debug("[DEBUG] Caught error in fetchGoal:", error);
      }
    };
  
    fetchGoal();
  }, [currentYear, userId]);  // Make sure to run this every time the year or userId changes
  

  const startChallenge = () => {
    console.log("[DEBUG] Starting new challenge...");
    setGoalInputVisible(true);
    setConfirmationVisible(false);
  };

  const handleStartChallenge = async () => {
    const token = localStorage.getItem("token");
    console.debug("[DEBUG] Starting new challenge...");

    try {
      const response = await fetch(
        `http://localhost:3000/api/readingChallenge/setChallenge/${userId}/${currentYear}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ goal: Number(goalInput) }),

        }
      );

      const result = await response.text();
      console.debug("[DEBUG] PUT response from start challenge:", response);
      console.debug("[DEBUG] PUT raw text response:", result);

      if (!response.ok) throw new Error(`[DEBUG] Failed to update goal: ${response.statusText}`);

      setGoal(goalInput);
      setGoalInput(""); // Reset input box
    } catch (error) {
      console.debug("[DEBUG] Error saving reading challenge goal:", error);
    }
  };

  const handleEditGoal = () => {
    console.log("[DEBUG] Edit goal clicked");
    setGoalInputVisible(true);
    setConfirmationVisible(false);
  };

  const handleConfirmEditGoal = async () => {
    const parsedGoal = Number(goalInput);
    if (!parsedGoal || parsedGoal <= 0) {
      alert("Please enter a valid number of books.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/readingChallenge/setChallenge/${userId}/${currentYear}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ ADD THIS
          },
          body: JSON.stringify({ goal: parsedGoal }),
        }
      );
  
      const text = await response.text(); // Logging
      console.log("[DEBUG] PUT response from edit:", response);
      console.log("[DEBUG] PUT raw text response:", text);
  
      if (!response.ok) {
        throw new Error(`[DEBUG] Failed to update goal: ${response.statusText}`);
      }
  
      setGoal(parsedGoal);                 // ✅ Update state
      setEditedGoal(parsedGoal);          // Optional, depends on your use
      setConfirmationVisible(true);
      setGoalInput("");
      setGoalInputVisible(false);
    } catch (error) {
      console.error("[DEBUG] Error updating reading challenge goal:", error);
    }
  };
  

  return (
    <div style={styles.container}>
      <Navbar />
      <h2 style={styles.title}>Edit Reading Challenge</h2>

      <div style={styles.challengeInfo}>
        <p style={styles.infoText}>Current Year: {currentYear}</p>
        <p style={styles.infoText}>
          Days till challenge ends: {Math.ceil((new Date(currentYear, 11, 31) - new Date()) / (1000 * 60 * 60 * 24))}
        </p>

        <div style={styles.goalContainer}>
          {goal === null ? (
            <>
              <h3 style={styles.largeText}>You have not started this challenge yet</h3>
              <button onClick={startChallenge} style={styles.startButton}>Start Challenge</button>
            </>
          ) : (
            <>
              <h3 style={styles.largeText}>Your goal: {goal} books</h3>
              <button onClick={handleEditGoal} style={styles.editGoalButton}>Edit Goal</button>
            </>
          )}
        </div>

        {goalInputVisible && !confirmationVisible && goal === null && (
          <div style={styles.goalInputContainer}>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              style={styles.input}
              placeholder="Enter your goal"
            />
            <button onClick={handleStartChallenge} style={styles.letsGoButton}>Let's Go!</button>
          </div>
        )}

        {inspirationalMessageVisible && goal !== null && (
          <div style={styles.inspirationalMessage}>
            <h3>Welcome to the reading challenge! Excited to have you here. Hope you meet your goal of {goal} books.</h3>
          </div>
        )}

        {goalInputVisible && !confirmationVisible && goal !== null && (
          <div style={styles.goalInputContainer}>
            <p>Enter your new goal:</p>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleConfirmEditGoal} style={styles.letsGoButton}>Confirm</button>
            <button onClick={() => setGoalInputVisible(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        )}

        {confirmationVisible && !goalInputVisible && (
          <div style={styles.goalInputContainer}>
            <p>Goal updated to {goal} books!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "#f8c572",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  challengeInfo: {
    textAlign: "center",
    marginTop: "30px",
  },
  infoText: {
    fontSize: "18px",
  },
  goalContainer: {
    marginTop: "20px",
  },
  largeText: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "20px",
  },
  startButton: {
    backgroundColor: "#ff6e61",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  editGoalButton: {
    backgroundColor: "#ff6e61",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  goalInputContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
  input: {
    padding: "10px",
    width: "200px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  letsGoButton: {
    backgroundColor: "#ff6e61",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
  },
  inspirationalMessage: {
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2e8b57",
  },
};

export default EditReadingChallenge;
