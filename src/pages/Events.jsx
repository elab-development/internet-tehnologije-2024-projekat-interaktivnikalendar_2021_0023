import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import "./Events.css";

const Events = ({ onRefresh }) => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filters, setFilters] = useState({ naziv: "", opis: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletedEventId, setDeletedEventId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const cacheKey = `events_cache_page_${page}_filters_${JSON.stringify(filters)}_perPage_${perPage}`;

  useEffect(() => {
    fetchEvents();
    fetchJoinedEvents();
    checkIfAdmin();
  }, [filters, page, perPage]);

  const checkIfAdmin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/user-details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const role = response.data.uloga_id;
      if (role === 1) setIsAdmin(true);
    } catch (err) {
      console.error("Greška pri proveri uloge:", err);
    }
  };

  const clearEventCache = () => {
    for (const key in localStorage) {
      if (key.startsWith("events_cache_page_")) {
        localStorage.removeItem(key);
      }
    }
  };

  const fetchEvents = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setEvents(parsedData.events || []);
      setTotalPages(parsedData.totalPages || 1);
      return;
    }

    axios
      .get("http://localhost:8000/api/dogadjaji", {
        params: { ...filters, page, per_page: perPage },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = {
          events: response.data.data || [],
          totalPages: response.data.last_page || 1,
        };
        setEvents(data.events);
        setTotalPages(data.totalPages);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
      });
  };

  const fetchJoinedEvents = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/dogadjaji/joined", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setJoinedEvents(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching joined events:", error);
        setJoinedEvents([]);
      });
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
      if (onRefresh) onRefresh();
      clearEventCache();
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const confirmDelete = (eventId) => {
    setEventToDelete(eventId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!eventToDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/dogadjaji/${eventToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete));
      clearEventCache();
      setDeletedEventId(eventToDelete);
      setTimeout(() => setDeletedEventId(null), 3000);
    } catch (error) {
      console.error("Greška pri brisanju događaja:", error);
    } finally {
      setShowConfirmModal(false);
      setEventToDelete(null);
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
          onChange={(e) => setFilters({ ...filters, naziv: e.target.value })}
        />
        <input
          type="text"
          name="opis"
          placeholder="Filtriraj po opisu"
          value={filters.opis}
          onChange={(e) => setFilters({ ...filters, opis: e.target.value })}
        />
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value={5}>5 po stranici</option>
          <option value={10}>10 po stranici</option>
          <option value={20}>20 po stranici</option>
        </select>
      </div>
      <div className="events-container">
        <h2>Događaji</h2>
        {deletedEventId && (
          <div className="deleted-message">Događaj je uspešno obrisan.</div>
        )}
        {events.length > 0 ? (
          events.map((event) => {
            const isJoined = joinedEvents.some((e) => e.id === event.id);
            return (
              <div key={event.id} className="event-card">
                <h3>{event.naziv}</h3>
                <p>{event.opis}</p>
                <p>
                  {new Date(event.datum_pocetka).toLocaleDateString()} - {new Date(event.datum_zavrsetka).toLocaleDateString()}
                </p>
                <div className="button-row">
                  <button onClick={() => handleJoin(event.id)} disabled={isJoined}>
                    {isJoined ? "Već ste pridruženi" : "Pridruži se"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => confirmDelete(event.id)}
                      className="delete-button"
                    >
                      Obriši događaj
                    </button>
                  )}
                </div>
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
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <h3>Da li ste sigurni da želite da obrišete događaj?</h3>
        <div className="modal-actions">
          <button onClick={handleDeleteConfirmed} className="delete-button">
            Da, obriši
          </button>
          <button onClick={() => setShowConfirmModal(false)}>
            Odustani
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Events;
