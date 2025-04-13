import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import axios from 'axios';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    naziv: '',
    opis: '',
    datum_pocetka: '',
    datum_zavrsetka: '',
  });
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ulogaId, setUlogaId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchJoinedEvents();
    fetchUserRole();
  }, []);

  const clearEventCache = () => {
    for (const key in localStorage) {
      if (key.startsWith("events_cache_page_")) {
        localStorage.removeItem(key);
      }
    }
  };

  const fetchEvents = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .get('http://localhost:8000/api/dogadjaji', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  };

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .get('http://localhost:8000/api/dogadjaji/joined', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setJoinedEvents(response.data))
      .catch((error) => console.error('Error fetching joined events:', error));
  };

  const fetchUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios
      .get('http://localhost:8000/api/user-details', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userUlogaId = response.data.uloga_id;
        setUlogaId(userUlogaId);
      })
      .catch((error) => console.error('Error fetching user role:', error));
  };

  const handleDateClick = (selectedDate) => {
    const event = joinedEvents.find(
      (event) =>
        new Date(event.datum_pocetka).toDateString() === selectedDate.toDateString()
    );

    if (event) {
      setSelectedEvent(event);
      setModalOpen(true);
      return;
    }

    if (ulogaId !== 1) {
      console.warn('User is not Admin. Cannot create new event.');
      return;
    }

    setDate(selectedDate);
    setEventDetails({
      naziv: '',
      opis: '',
      datum_pocetka: selectedDate.toLocaleDateString('en-CA'),
      datum_zavrsetka: '',
    });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setEventDetails({
      ...eventDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const eventData = {
      ...eventDetails,
      korisnik_id: 1,
    };

    axios
      .post('http://localhost:8000/api/dogadjaji', eventData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setModalOpen(false);
        clearEventCache();
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error creating event', error);
      });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-page">
      <h1>CALENDAR</h1>
      <Calendar
        onChange={handleDateClick}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const isStartDate = joinedEvents.some(
              (event) =>
                new Date(event.datum_pocetka).toDateString() === date.toDateString()
            );
            return isStartDate ? 'joined-event' : null;
          }
        }}
      />
      {ulogaId === 1 && (
        <div className="btn-create">
          <Button
            type="button"
            text="Create New Event"
            onClick={() => {
              setEventDetails({
                naziv: '',
                opis: '',
                datum_pocetka: '',
                datum_zavrsetka: '',
              });
              setSelectedEvent(null);
              setModalOpen(true);
            }}
          />
        </div>
      )}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={handleCloseModal}>
          {selectedEvent ? (
            <div>
              <h2>Detalji događaja</h2>
              <p><strong>Naziv:</strong> {selectedEvent.naziv}</p>
              <p><strong>Opis:</strong> {selectedEvent.opis}</p>
              <p><strong>Početak:</strong> {selectedEvent.datum_pocetka}</p>
              <p><strong>Kraj:</strong> {selectedEvent.datum_zavrsetka}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <InputField
                type="text"
                placeholder="Naziv događaja"
                value={eventDetails.naziv}
                onChange={handleChange}
                name="naziv"
              />
              <InputField
                type="text"
                placeholder="Opis"
                value={eventDetails.opis}
                onChange={handleChange}
                name="opis"
              />
              <InputField
                type="date"
                value={eventDetails.datum_pocetka}
                onChange={handleChange}
                name="datum_pocetka"
              />
              <InputField
                type="date"
                value={eventDetails.datum_zavrsetka}
                onChange={handleChange}
                name="datum_zavrsetka"
              />
              <Button type="submit" text="Kreiraj događaj" />
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CalendarPage;
