import { useState, useEffect } from "react";
import axios from "axios";

const useFetchDogadjaji = (filters, page, perPage) => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      setError("Nedostaje token za autentifikaciju.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Provera keša
        const cachedEvents = JSON.parse(localStorage.getItem("events"));
        const cacheExpiry = localStorage.getItem("eventsExpiry");

        if (cachedEvents && cacheExpiry && new Date().getTime() < cacheExpiry) {
          // Ako keš postoji i nije istekao
          console.log("Koristim keširane događaje");
          setEvents(cachedEvents.events || []);
          setJoinedEvents(cachedEvents.joinedEvents || []);
          setTotalPages(cachedEvents.totalPages || 1);
          setLoading(false);
          return;
        }

        // Ako keš ne postoji ili je istekao, šaljemo zahteve na backend
        console.log("Keš je istekao ili ne postoji. Dohvatam podatke sa servera...");

        // Dohvatanje događaja
        const eventsResponse = await axios.get("http://localhost:8000/api/dogadjaji", {
          params: { ...filters, page, per_page: perPage },
          headers: { Authorization: `Bearer ${token}` },
        });
        const joinedResponse = await axios.get("http://localhost:8000/api/dogadjaji/joined", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Postavljanje podataka
        setEvents(eventsResponse.data.data || []);
        setTotalPages(eventsResponse.data.last_page || 1);
        setJoinedEvents(joinedResponse.data || []);

        // Keširanje podataka
        localStorage.setItem(
          "events",
          JSON.stringify({
            events: eventsResponse.data.data || [],
            joinedEvents: joinedResponse.data || [],
            totalPages: eventsResponse.data.last_page || 1,
          })
        );
        localStorage.setItem("eventsExpiry", new Date().getTime() + 3600000); // 1 sat

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Došlo je do greške prilikom učitavanja podataka.");
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, page, perPage]);

  return { events, joinedEvents, totalPages, loading, error };
};

export default useFetchDogadjaji;