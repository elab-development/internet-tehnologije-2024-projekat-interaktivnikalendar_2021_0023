import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import InputField from './InputField';
import Button from './Button';
import axios from 'axios';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    naziv: '',
    opis: '',
    datum_pocetka: '',
    datum_zavrsetka: ''
  });

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setEventDetails({
      ...eventDetails,
      datum_pocetka: selectedDate,
      datum_zavrsetka: selectedDate
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setEventDetails({
      ...eventDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datum je pocetka: "+ eventDetails.datum_pocetka);
    axios.post('http://your-laravel-app.test/api/dogadjaji', eventDetails, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log(response.data);
      setModalOpen(false);
      // Optionally, refresh events or notify user
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Create Event</h2>
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

export default CalendarComponent;