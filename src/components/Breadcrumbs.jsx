import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css"; // Stylization (optional)

const Breadcrumbs = () => {
  const location = useLocation();

  // Razbij trenutnu rutu na segmente
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Funkcija za formatiranje naziva (prvo slovo veliko)
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <nav className="breadcrumbs">
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
                <span>{capitalize(value.replace("-", " "))}</span> // Poslednji deo nije link
              ) : (
                <Link to={to}>{capitalize(value.replace("-", " "))}</Link> // Ostali delovi su linkovi
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;