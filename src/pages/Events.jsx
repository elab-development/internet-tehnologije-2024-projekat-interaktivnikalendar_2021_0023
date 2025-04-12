import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filters, setFilters] = useState({ naziv: "", opis: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Keš za događaje
  const cacheKey = `events_cache_page_${page}_filters_${JSON.stringify(filters)}_perPage_${perPage}`;

  useEffect(() => {
    fetchEvents();
    fetchJoinedEvents();
  }, [filters, page, perPage]);

  const fetchEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    // Proveri keš
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setEvents(parsedData.events || []);
      setTotalPages(parsedData.totalPages || 1);
      return;
    }

    // Ako nema keša, pravi API poziv
    axios
      .get("http://localhost:8000/api/dogadjaji", {
        params: { ...filters, page, per_page: perPage },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = {
          events: response.data.data || [],
          totalPages: response.data.last_page || 1,
        };
        setEvents(data.events);
        setTotalPages(data.totalPages);

        // Sačuvaj u kešu
        localStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
      });
  };

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji/joined", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setJoinedEvents(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching joined events:", error);
        setJoinedEvents([]);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);

    // Očistimo keš za trenutne filtere
    for (const key in localStorage) {
      if (key.startsWith("events_cache_page_")) {
        localStorage.removeItem(key);
      }
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);

    // Očistimo keš kada se promeni broj stavki po stranici
    for (const key in localStorage) {
      if (key.startsWith("events_cache_page_")) {
        localStorage.removeItem(key);
      }
    }
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
      fetchJoinedEvents();
      fetchEvents();

      // Očistimo keš jer je došlo do promene u podacima
      for (const key in localStorage) {
        if (key.startsWith("events_cache_page_")) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

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