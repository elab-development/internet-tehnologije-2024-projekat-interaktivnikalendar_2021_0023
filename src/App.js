import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CalendarPage from "./pages/CalendarPage";
import Banner from "./components/Banner";
import JoinedEvents from "./pages/JoinedEvents";
import axios from "axios"; // Dodaj axios ako već nije tu

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [events, setEvents] = useState([]); // Dodali smo events state

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      fetchEvents(); // Pozivamo učitavanje događaja pri pokretanju aplikacije
    }
  }, []);

  const fetchEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    fetchEvents(); // Kada se korisnik uloguje, osveži listu događaja
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events events={events} fetchEvents={fetchEvents} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/joined-events" element={<JoinedEvents refreshEvents={fetchEvents} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {userRole === "User" && <Banner />}
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
