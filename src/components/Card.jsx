import React from "react";

const Card = ({ title, description, dateStart, dateEnd }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{`Start: ${dateStart}`}</p>
      <p>{`End: ${dateEnd}`}</p>
    </div>
  );
};

export default Card;