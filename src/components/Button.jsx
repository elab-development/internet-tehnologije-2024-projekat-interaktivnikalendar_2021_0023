import React from "react";

const Button = ({ onClick, text, type }) => {
  return (
    <button onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default Button;