import { Link, useLocation } from "react-router-dom";
import React from "react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();

  // Funkcija za formatiranje naziva (prvo slovo veliko)
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Razbij trenutnu rutu na segmente
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        {isAuthenticated && <li><Link to="/joined-events">Joined Events</Link></li>}
        {isAuthenticated && <li><button onClick={onLogout}>Logout</button></li>}
      </ul>
      {/* Breadcrumbs sekcija */}
      <div className="breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={to}>
                {isLast ? (
                  <span>{capitalize(value.replace("-", " "))}</span>
                ) : (
                  <Link to={to}>{capitalize(value.replace("-", " "))}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;