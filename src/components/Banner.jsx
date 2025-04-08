import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Banner.css";

const Banner = () => {
  const [reklama, setReklama] = useState(null);

  useEffect(() => {
    fetchReklama();
  }, []);

  const fetchReklama = () => {
    axios
      .get("http://localhost:8000/api/reklama")
      .then((response) => {
        setReklama(response.data);
      })
      .catch((error) => {
        console.error("Greška pri učitavanju reklame:", error);
      });
  };

  if (!reklama) {
    return null; // Ako nema reklame, ne prikazujemo ništa
  }

  // Generišemo klasu CSS-a na osnovu sadržaja reklame
  const reklamaClass = reklama.tekst.toLowerCase().replace(/\s/g, "-");

  return (
    <div className={`banner ${reklamaClass}`}>
      <a href={reklama.link} target="_blank" rel="noopener noreferrer" className="banner-text">
        {reklama.tekst}
      </a>
    </div>
  );
};

export default Banner;
