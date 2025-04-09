import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(""); // Dodajemo state za greške
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/login", form)
      .then(response => {
        const { access_token, role, user_id } = response.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", user_id); // Čuvanje user_id u localStorage
        onLogin(role);
        navigate("/"); // Preusmeravanje na početnu stranicu nakon uspešne prijave
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data.message) {
          setError("Pogrešan email ili lozinka. Pokušajte ponovo.");
        } else {
          setError("Dogodila se greška. Molimo pokušajte ponovo.");
        }
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login Page</h1>
        {error && <p className="error-message">{error}</p>} {/* Prikazivanje greške */}
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            name="email"
          />
          <InputField
            type="password"
            placeholder="Your Password"
            value={form.password}
            onChange={handleChange}
            name="password"
          />
          <Button type="submit" text="Login" />
          <Button type="button" text="Register" onClick={() => navigate("/register")} />
        </form>
      </div>
    </div>
  );
};

export default Login;
