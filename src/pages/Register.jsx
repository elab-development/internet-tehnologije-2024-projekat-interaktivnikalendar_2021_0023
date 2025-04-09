import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({
    ime: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    const registrationData = {
      ...form,
      uloga_id: 3, // Automatski postavi uloga_id na 3
    };

    axios.post("http://localhost:8000/api/register", registrationData)
      .then(response => {
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data.errors) {
          const mappedErrors = mapErrorsToSerbian(error.response.data.errors);
          setError(mappedErrors);
        } else {
          setError("Registracija nije uspela. Pokušajte ponovo.");
        }
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  const mapErrorsToSerbian = (errors) => {
    const errorMap = {
      "The email has already been taken.": "Email je već zauzet.",
      "The password field confirmation does not match.": "Potvrda lozinke se ne poklapa.",
      "The name field is required.": "Ime je obavezno.",
      "The password must be at least 6 characters.": "Lozinka mora imati najmanje 6 karaktera.",
      "The email field is required.": "Email je obavezan.",
      "The password field is required.": "Lozinka je obavezna.",
    };

    let mappedErrors = [];

    Object.values(errors).forEach(error => {
      if (errorMap[error]) {
        mappedErrors.push(errorMap[error]);
      } else {
        mappedErrors.push(error); 
      }
    });

    return mappedErrors.join(" ");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register Page</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Ime"
            value={form.ime}
            onChange={handleChange}
            name="ime"
          />
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
          <InputField
            type="password"
            placeholder="Confirm Your Password"
            value={form.password_confirmation}
            onChange={handleChange}
            name="password_confirmation"
          />
          <Button type="submit" text="Register" />
        </form>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>Registration Successful!</h2>
        <p>You have successfully registered. You will be redirected to the login page.</p>
        <Button type="button" text="OK" onClick={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default Register;
