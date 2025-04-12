import React from "react";
import useFetchJoinedEvents from "../hooks/useFetchJoinedEvents";
import axios from "axios";
import "./Events.css";

const JoinedEvents = ({ refreshEvents }) => {
  const { joinedEvents, loading, error, setJoinedEvents } = useFetchJoinedEvents();

  const handleCancel = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/api/dogadjaji/${eventId}/leave`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log(`Otkazan događaj: ${eventId}`);
      // Osveži listu pridruženih događaja
      setJoinedEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      refreshEvents(); // Osveži listu dostupnih događaja u `Events.jsx`
    } catch (error) {
      console.error("Greška pri otkazivanju događaja:", error);
    }
  };

  if (loading) return <p>Učitavanje pridruženih događaja...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Joined Events</h2>
        {joinedEvents.length === 0 ? (
          <p>Niste se pridružili nijednom događaju.</p>
        ) : (
          joinedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.naziv}</h3>
              <p>{event.opis}</p>
              <p>
                {new Date(event.datum_pocetka).toLocaleDateString()} -{" "}
                {new Date(event.datum_zavrsetka).toLocaleDateString()}
              </p>
              <button onClick={() => handleCancel(event.id)}>Otkaži</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JoinedEvents;