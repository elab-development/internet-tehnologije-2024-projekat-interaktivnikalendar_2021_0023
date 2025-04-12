import React, { useState } from "react";
import useFetchDogadjaji from "../hooks/useFetchDogadjaji";
import axios from "axios";
import "./Events.css";

const Events = () => {
  const [filters, setFilters] = useState({ naziv: "", opis: "" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Korišćenje custom hook-a
  const { events, joinedEvents, totalPages, loading, error } = useFetchDogadjaji(filters, page, perPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1); // Resetujemo na prvu stranicu nakon promene filtera
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleJoin = async (eventId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/dogadjaji/${eventId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  if (loading) return <p>Učitavanje događaja...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-page">
      <div className="filters">
        <input
          type="text"
          name="naziv"
          placeholder="Filtriraj po nazivu"
          value={filters.naziv}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="opis"
          placeholder="Filtriraj po opisu"
          value={filters.opis}
          onChange={handleFilterChange}
        />
        <select value={perPage} onChange={handlePerPageChange}>
          <option value={5}>5 po stranici</option>
          <option value={10}>10 po stranici</option>
          <option value={20}>20 po stranici</option>
        </select>
      </div>
      <div className="events-container">
        <h2>Događaji</h2>
        {events.length > 0 ? (
          events.map((event) => {
            const isJoined = joinedEvents.some((e) => e.id === event.id);

            return (
              <div key={event.id} className="event-card">
                <h3>{event.naziv}</h3>
                <p>{event.opis}</p>
                <p>
                  {new Date(event.datum_pocetka).toLocaleDateString()} -{" "}
                  {new Date(event.datum_zavrsetka).toLocaleDateString()}
                </p>
                <button onClick={() => handleJoin(event.id)} disabled={isJoined}>
                  {isJoined ? "Već ste pridruženi" : "Pridruži se"}
                </button>
              </div>
            );
          })
        ) : (
          <p>Nema dostupnih događaja.</p>
        )}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Prethodna
          </button>
          <span>
            Stranica {page} od {totalPages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Sledeća
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;