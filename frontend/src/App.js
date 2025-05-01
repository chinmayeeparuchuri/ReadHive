import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from './context/AuthContext';
import Layout from "./components/Layout"; 
import Search from "./pages/Search";
import ResultsPage from "./pages/ResultsPage";
import BookDetailPage from "./pages/BookDetailPage";
import MyBooks from './pages/MyBooks';
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ReadingChallenge from "./pages/ReadingChallenge";
import EditReadingChallenge from "./pages/EditReadingChallenge";
import Browse from "./pages/Browse";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages - no layout */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/profile/:userID" element={<Profile />} />
          <Route path="/editprofile/:userID" element={<EditProfile />} />
          <Route path="/readingchallenge/:userId/:year" element={<ReadingChallenge />} />
          <Route path="/editreadingchallenge/:userId" element={<EditReadingChallenge />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/mybooks/:userId" element={<MyBooks />} />  

          {/* Protected or main pages - with layout */}
          <Route path="/home/:userId" element={
            <Layout>
              <Home />
            </Layout>
          } />

          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
