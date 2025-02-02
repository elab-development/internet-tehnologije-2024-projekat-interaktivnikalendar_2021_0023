import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:8000/api/events", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Events</h1>
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