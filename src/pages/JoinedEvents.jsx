import React, { useEffect } from "react";
import axios from "axios";
import "./Events.css";

const JoinedEvents = ({ refreshFlag }) => {
  const [joinedEvents, setJoinedEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    fetchJoinedEvents();
  }, [refreshFlag]);

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/dogadjaji/joined", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJoinedEvents(response.data || []);
    } catch (error) {
      console.error("Greška pri učitavanju pridruženih događaja:", error);
      setError("Greška pri učitavanju pridruženih događaja.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/api/dogadjaji/${eventId}/leave`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJoinedEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Greška pri otkazivanju događaja:", error);
    }
  };

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Učitavanje pridruženih događaja...</p>
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Pridruženi Događaji</h2>
        {joinedEvents.length === 0 ? (
          <p>Niste se pridružili nijednom događaju.</p>
        ) : (
          joinedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.naziv}</h3>
              <p>{event.opis}</p>
              <p>
                {new Date(event.datum_pocetka).toLocaleDateString()} - {new Date(event.datum_zavrsetka).toLocaleDateString()}
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
