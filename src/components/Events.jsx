import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Početak useEffect");

  useEffect(() => {
    console.log("useEffect se izvršava"); // Proverite da li se useEffect poziva
    const token = localStorage.getItem('token');
    console.log("Token:", token);
    const cachedEvents = JSON.parse(localStorage.getItem('events'));
    const cacheExpiry = localStorage.getItem('eventsExpiry');

    if (cachedEvents && cacheExpiry && new Date().getTime() < cacheExpiry) {
      // Ako postoji validan keš, koristimo ga
      setEvents(cachedEvents);
      setLoading(false);
    } else {
      // Ako keš ne postoji ili je istekao, šaljemo zahtev na backend
      axios.get("http://localhost:8000/api/events", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          console.log("API Response:", response.data);
          setEvents(response.data);

          // Čuvamo podatke u LocalStorage sa vremenom isteka
          localStorage.setItem('events', JSON.stringify(response.data));
          localStorage.setItem('eventsExpiry', new Date().getTime() + 3600000); // 1 sat
          setLoading(false);
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Došlo je do greške prilikom učitavanja događaja.");
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <p>Učitavanje događaja...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {console.log("Rendering Events component")}
      <h1>Događaji</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.start_date).toLocaleString()} - {new Date(event.end_date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;