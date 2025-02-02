import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';

const JoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://localhost:8000/api/dogadjaji/joined', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => setJoinedEvents(response.data))
    .catch(error => {
      console.error('Error fetching joined events:', error);
      if (error.response) {
        console.error('Error status', error.response.status);
        console.error('Error data', error.response.data);
      }
    });
  };

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Joined Events</h2>
        {joinedEvents.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.naziv}</h3>
            <p>{event.opis}</p>
            <p>{new Date(event.datum_pocetka).toLocaleDateString()} - {new Date(event.datum_zavrsetka).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinedEvents;