import React from 'react';
import './Banner.css'; // Pretpostavljamo da će stilovi biti u ovoj datoteci

const Banner = () => {
  return (
    <div className="banner">
      <p>This is an advertisement banner.</p>
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">Click here for more details</a>
    </div>
  );
};

export default Banner;