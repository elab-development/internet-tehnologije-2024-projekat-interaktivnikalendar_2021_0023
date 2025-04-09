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
  const [joinedEvents, setJoinedEvents] = useState([]); // Čuva pridružene događaje
  const [selectedEvent, setSelectedEvent] = useState(null); // Čuva selektovani događaj za prikaz detalja

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

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);

    // Proveravamo da li postoji događaj za odabrani datum
    const event = joinedEvents.find(
      (event) =>
        new Date(event.datum_pocetka).toDateString() === selectedDate.toDateString()
    );

    if (event) {
      // Ako postoji događaj, postavljamo ga kao selektovani događaj
      setSelectedEvent(event);
    } else {
      // Ako ne postoji događaj, otvaramo modal za kreiranje novog događaja
      setEventDetails({
        naziv: '',
        opis: '',
        datum_pocetka: selectedDate.toLocaleDateString('en-CA'), // Koristimo 'en-CA' za format "YYYY-MM-DD"
        datum_zavrsetka: '', // Datum završetka ostavljamo prazan
      });
      setSelectedEvent(null); // Resetujemo selektovani događaj
    }

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
      korisnik_id: 1, // Uvek postavi korisnik_id na 1
    };

    axios
      .post('http://localhost:8000/api/dogadjaji', eventData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setModalOpen(false);
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error creating event', error);
        if (error.response) {
          console.error('Error status', error.response.status);
          console.error('Error data', error.response.data);
        }
      });
  };

  const handleCreateNewEvent = () => {
    // Resetujemo formu za kreiranje novog događaja
    setEventDetails({
      naziv: '',
      opis: '',
      datum_pocetka: '',
      datum_zavrsetka: '',
    });
    setSelectedEvent(null); // Resetujemo selektovani događaj
    setModalOpen(true);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isStartDate = joinedEvents.some(
        (event) =>
          new Date(event.datum_pocetka).toDateString() === date.toDateString()
      );
      return isStartDate ? 'joined-event' : null;
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null); // Resetujemo selektovani događaj
  };

  return (
    <div className="calendar-page">
      <h1>CALENDAR</h1>
      <Calendar
        onChange={handleDateClick}
        value={date}
        tileClassName={tileClassName}
      />
      <div className="btnCreate">
        <Button
          type="button"
          text="Create New Event"
          onClick={handleCreateNewEvent} // Otvaramo modal za kreiranje novog događaja
        />
      </div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        {selectedEvent ? (
          // Prikaz detalja selektovanog događaja
          <div>
            <h2>Detalji događaja</h2>
            <p><strong>Naziv:</strong> {selectedEvent.naziv}</p>
            <p><strong>Opis:</strong> {selectedEvent.opis}</p>
            <p><strong>Početak:</strong> {new Date(selectedEvent.datum_pocetka).toLocaleDateString()}</p>
            <p><strong>Kraj:</strong> {new Date(selectedEvent.datum_zavrsetka).toLocaleDateString()}</p>
          </div>
        ) : (
          // Forma za kreiranje novog događaja
          <div>
            <div style={styles.modalHeader}>
              <h2>Create Event</h2>
              <button style={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <InputField
                type="text"
                placeholder="Event Name"
                value={eventDetails.naziv}
                onChange={handleChange}
                name="naziv"
              />
              <InputField
                type="text"
                placeholder="Description"
                value={eventDetails.opis}
                onChange={handleChange}
                name="opis"
              />
              <InputField
                type="date"
                placeholder="Start Date"
                value={eventDetails.datum_pocetka}
                onChange={handleChange}
                name="datum_pocetka"
              />
              <InputField
                type="date"
                placeholder="End Date"
                value={eventDetails.datum_zavrsetka}
                onChange={handleChange}
                name="datum_zavrsetka"
              />
              <Button type="submit" text="Create Event" />
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

export default CalendarPage;