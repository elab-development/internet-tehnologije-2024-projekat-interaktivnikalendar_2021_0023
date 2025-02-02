import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchJoinedEvents();
  }, []);

  const fetchEvents = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://localhost:8000/api/dogadjaji', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => setEvents(response.data))
    .catch(error => {
      console.error('Error fetching events:', error);
      if (error.response) {
        console.error('Error status', error.response.status);
        console.error('Error data', error.response.data);
      }
    });
  };

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

  const handleJoin = (eventId) => {
    axios.put(`http://localhost:8000/api/dogadjaji/${eventId}/join`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      console.log('Pridruženi događaju:', response.data);
      fetchJoinedEvents(); // Osveži listu pridruženih događaja nakon pridruživanja
    })
    .catch(error => {
      console.error('Error joining event:', error);
      if (error.response) {
        console.error('Error status', error.response.status);
        console.error('Error data', error.response.data);
      }
    });
};

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Events</h2>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.naziv}</h3>
            <p>{event.opis}</p>
            <p>{new Date(event.datum_pocetka).toLocaleDateString()} - {new Date(event.datum_zavrsetka).toLocaleDateString()}</p>
            <button 
              onClick={() => handleJoin(event.id)} 
              disabled={event.joined}
            >
              {event.joined ? 'Pridruženi' : 'Pridruži se'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;