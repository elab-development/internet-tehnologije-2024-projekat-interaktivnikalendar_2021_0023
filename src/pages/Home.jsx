import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Interactive Calendar</h1>
        <p>Organize your events and stay on top of your schedule with our interactive calendar.</p>
      </header>
      <main className="home-main">
        <section className="feature">
          <h2>Interactive Calendar</h2>
          <p>Our interactive calendar helps you easily manage your events, set reminders, and stay organized.</p>
          <Link to="/calendar" className="feature-link">View Calendar</Link>
        </section>
        <section className="feature">
          <h2>Manage Your Events</h2>
          <p>Keep track of your upcoming events, appointments, and meetings with ease.</p>
          <Link to="/events" className="feature-link">View Events</Link>
        </section>
      </main>
    </div>
  );
};

export default Home;