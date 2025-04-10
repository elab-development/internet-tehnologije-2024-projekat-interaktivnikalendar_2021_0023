import React, { useState, useEffect } from "react";
import axios from "axios";

const JoinedEvents = ({ refreshEvents }) => {
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji/joined", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setJoinedEvents(response.data || []);
      })
      .catch((error) => console.error("Error fetching joined events:", error));
  };

  const handleCancel = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/api/dogadjaji/${eventId}/leave`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log(`Otkazan događaj: ${eventId}`);
      fetchJoinedEvents(); // Osveži listu pridruženih događaja
      refreshEvents(); // Osveži listu dostupnih događaja u `Events.jsx`
    } catch (error) {
      console.error("Greška pri otkazivanju događaja:", error);
    }
  };

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
