import { Link } from "react-router-dom";
import React from "react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        {isAuthenticated && <li><Link to="/joined-events">Joined Events</Link></li>} {/* Dodato */}
        {isAuthenticated && <li><button onClick={onLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;