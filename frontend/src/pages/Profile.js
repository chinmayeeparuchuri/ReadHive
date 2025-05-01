import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const styles = {
  pageContainer: {
    backgroundColor: "#f8c572",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    backgroundColor: "#f8c572",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    height: "100vh",
    textAlign: "center",
  },
  username: {
    fontSize: "18px",
    marginTop: "20px",
  },
  section: {
    marginTop: "20px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#ff6e61",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  progressBar: {
    width: "100%",
    marginTop: "10px",
  },
  previousChallenges: {
    marginTop: "20px",
  },
};

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div style={styles.pageContainer}>Loading...</div>;
  if (!user) return <div style={styles.pageContainer}>User not found</div>;

  const currentChallenge = user.bookChallenge?.[currentYear];
  const previousYears = Object.keys(user.bookChallenge || {}).filter(
    (year) => parseInt(year) !== currentYear
  );

  return (
  <>
    <Navbar />
    <div style={styles.pageContainer}>
      <div style={styles.profileContainer}>
        <h2>{user.username}'s Profile</h2>
        <p style={styles.username}>Email: {user.email}</p>

        <div style={styles.section}>
          <h3>Favorite Genres</h3>
          <p>
            {user.favoriteGenres && user.favoriteGenres.length > 0
              ? user.favoriteGenres.join(", ")
              : "Not yet selected"}
          </p>
        </div>

        <div style={styles.section}>
          <h3>Reading Challenge ({currentYear})</h3>
          {currentChallenge ? (
            <>
              <p>Current Goal: {currentChallenge} books</p>
              <button
                style={styles.button}
                onClick={() =>
                  navigate(`/readingchallenge/${userId}/${currentYear}`)
                }
              >
                Go to Current Reading Challenge
              </button>
            </>
          ) : (
            <p>
              Current year reading challenge not yet started. Go to "Edit
              Reading Challenge" to start it.
            </p>
          )}
        </div>

        <div style={styles.previousChallenges}>
          <h4>Previous Reading Challenges</h4>
          {previousYears.length > 0 ? (
            previousYears.map((year) => (
              <button
                key={year}
                style={styles.button}
                onClick={() =>
                  navigate(`/readingchallenge/${userId}/${year}`)
                }
              >
                {year}
              </button>
            ))
          ) : (
            <p>No prior challenges found</p>
          )}
        </div>

        <div style={styles.section}>
          <button
            style={styles.button}
            onClick={() => navigate(`/editprofile/${userId}`)}
          >
            Edit Profile
          </button>
          <button
            style={styles.button}
            onClick={() => navigate(`/editreadingchallenge/${userId}`)}
          >
            Edit Reading Challenge
          </button>
        </div>
      </div>
    </div>
  </>
);
};

export default Profile;
