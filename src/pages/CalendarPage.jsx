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

  useEffect(() => {
    fetchEvents();
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

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setEventDetails({
      ...eventDetails,
      datum_pocetka: selectedDate.toISOString().slice(0, 10),
      datum_zavrsetka: selectedDate.toISOString().slice(0, 10),
    });
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

    axios.post('http://localhost:8000/api/dogadjaji', eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log(response.data);
      setModalOpen(false);
      fetchEvents(); // Osveži listu događaja nakon kreiranja novog događaja
    })
    .catch(error => {
      console.error('Error creating event', error);
      if (error.response) {
        console.error('Error status', error.response.status);
        console.error('Error data', error.response.data);
        // Prikaz validacionih grešaka
        if (error.response.status === 422) {
          console.error('Validation errors:', error.response.data.errors);
        }
      }
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='calendar-page'>
      
        <Calendar onChange={handleDateChange} value={date} />
        <div className='btnCreate'>
          <Button type="button" text="Create New Event" onClick={() => setModalOpen(true)}/>
        </div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div style={styles.modalHeader}>
          <h2>Create Event</h2>
          <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
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
            type="datetime-local"
            placeholder="Start Date"
            value={eventDetails.datum_pocetka}
            onChange={handleChange}
            name="datum_pocetka"
          />
          <InputField
            type="datetime-local"
            placeholder="End Date"
            value={eventDetails.datum_zavrsetka}
            onChange={handleChange}
            name="datum_zavrsetka"
          />
          <Button type="submit" text="Create Event" />
        </form>
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