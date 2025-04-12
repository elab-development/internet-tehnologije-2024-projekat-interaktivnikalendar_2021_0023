import { useState, useEffect } from "react";
import axios from "axios";

const useFetchJoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setError("Nedostaje token za autentifikaciju.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const cachedJoinedEvents = JSON.parse(localStorage.getItem("joinedEvents"));
        const cacheExpiry = localStorage.getItem("joinedEventsExpiry");

        if (cachedJoinedEvents && cacheExpiry && new Date().getTime() < cacheExpiry) {
          console.log("Koristim keširane pridružene događaje");
          setJoinedEvents(cachedJoinedEvents);
          setLoading(false);
          return;
        }

        console.log("Keš je istekao ili ne postoji. Dohvatam pridružene događaje sa servera...");
        const response = await axios.get("http://localhost:8000/api/dogadjaji/joined", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const events = response.data || [];

        // Za svaki događaj proveravamo da li postoji beleška
        const enrichedEvents = await Promise.all(
          events.map(async (event) => {
            try {
              const noteRes = await axios.get(`http://localhost:8000/api/notes/${event.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return {
                ...event,
                has_note: true,
                note_content: noteRes.data.note_content,
                note_url: noteRes.data.note_url || null,
              };
            } catch (err) {
              return {
                ...event,
                has_note: false,
                note_content: null,
                note_url: null,
              };
            }
          })
        );

        setJoinedEvents(enrichedEvents);

        localStorage.setItem("joinedEvents", JSON.stringify(enrichedEvents));
        localStorage.setItem("joinedEventsExpiry", new Date().getTime() + 3600000);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching joined events:", err);
        setError("Došlo je do greške prilikom učitavanja pridruženih događaja.");
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  return { joinedEvents, loading, error, setJoinedEvents };
};

export default useFetchJoinedEvents;
