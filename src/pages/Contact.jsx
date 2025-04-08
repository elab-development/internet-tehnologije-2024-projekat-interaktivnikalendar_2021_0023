import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role"); // Dohvati ulogu korisnika iz localStorage
    setUserRole(role);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post("http://localhost:8000/api/contact", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Vaša poruka je uspešno poslata!");
      setForm({ name: "", email: "", message: "" }); // Reset forme
    } catch (error) {
      setErrorMessage("Došlo je do greške pri slanju poruke.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Kontakt</h1>

      {/* Prikaz forme samo za Admin i Premium korisnike */}
      {(userRole === "Admin" || userRole === "Premium") ? (
        <div className="contact-form">
          <h2>Pošaljite poruku</h2>
          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Vaše ime" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Vaš email" value={form.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Vaša poruka" value={form.message} onChange={handleChange} required />
            <button type="submit">Pošalji</button>
          </form>
        </div>
      ) : (
        <p className="no-access">Nemate dozvolu za slanje poruka.</p>
      )}

      {/* FAQ Sekcija */}
      <div className="faq-section">
        <h2>Često postavljana pitanja</h2>
        <details>
          <summary>Kako da se prijavim na događaj?</summary>
          <p>Kliknite na dugme "Pridruži se" pored događaja i bićete registrovani.</p>
        </details>
        <details>
          <summary>Kako da otkažem prijavu?</summary>
          <p>Na stranici "Joined Events" kliknite na dugme "Otkaži".</p>
        </details>
        <details>
          <summary>Kako da kontaktiram podršku?</summary>
          <p>Možete koristiti ovu kontakt formu ili nas pozvati na +381 64 123 4567.</p>
        </details>
      </div>

      {/* Google Maps Lokacija */}
      <div className="location-section">
  <h2>Naša lokacija</h2>
  <iframe
    title="Naša lokacija"
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11315.2!2d20.460204!3d44.815403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aa5a6a9b4d1%3A0x94b719b073b7b1db!2zUGxhbmV0YSBTcG9ydCwgQmVvZ3JhZCwgU2VyYmlqYQ!5e0!3m2!1ssr!2srs!4v1700000000000!5m2!1ssr!2srs"
    width="100%"
    height="300"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
  ></iframe>
</div>


    </div>
  );
};

export default Contact;
