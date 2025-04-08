import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css"; // ili "../event.css" ako se nalazi direktno u src

const Events = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchJoinedEvents(); // Učitaj pridružene događaje pri pokretanju
  }, []);

  const fetchEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji/joined", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setJoinedEvents(response.data || []);
      })
      .catch((error) => console.error("Error fetching joined events:", error));
  };

  const handleJoin = async (eventId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/dogadjaji/${eventId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      console.log("Pridruženi događaju:", eventId);
      fetchJoinedEvents(); // Osveži listu pridruženih događaja
      fetchEvents(); // Osveži dugme "Pridruži se"
    } catch (error) {
      console.error("Greška pri pridruživanju događaju:", error);
    }
  };

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Events</h2>
        {events.map((event) => {
          const isJoined = joinedEvents.some((e) => e.id === event.id); // Proveri da li je korisnik već pridružen

          return (
            <div key={event.id} className="event-card">
              <h3>{event.naziv}</h3>
              <p>{event.opis}</p>
              <p>
                {new Date(event.datum_pocetka).toLocaleDateString()} -{" "}
                {new Date(event.datum_zavrsetka).toLocaleDateString()}
              </p>
              <button onClick={() => handleJoin(event.id)} disabled={isJoined}>
                {isJoined ? "Već ste pridruženi" : "Pridruži se"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;