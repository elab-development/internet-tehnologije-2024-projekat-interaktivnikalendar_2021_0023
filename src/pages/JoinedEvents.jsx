import React, { useState } from "react";
import useFetchJoinedEvents from "../hooks/useFetchJoinedEvents";
import axios from "axios";
import "./Events.css";

const JoinedEvents = ({ refreshEvents }) => {
  const { joinedEvents, loading, error, setJoinedEvents } = useFetchJoinedEvents();

  const [selectedFile, setSelectedFile] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [noteContents, setNoteContents] = useState({});

  const handleCancel = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/api/dogadjaji/${eventId}/leave`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setJoinedEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      refreshEvents();
    } catch (error) {
      console.error("Greška pri otkazivanju događaja:", error);
    }
  };

  const handleFileChange = (event, eventId) => {
    setSelectedFile((prevState) => ({
      ...prevState,
      [eventId]: event.target.files[0],
    }));
  };

  const handleUpload = async (eventId) => {
    const file = selectedFile[eventId];
    if (!file) return alert("Izaberite fajl za upload.");

    const formData = new FormData();
    formData.append("note_file", file);
    formData.append("dogadjaj_id", eventId);

    try {
      setUploading((prev) => ({ ...prev, [eventId]: true }));
      const res = await axios.post("http://localhost:8000/api/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploadStatus((prev) => ({ ...prev, [eventId]: "success" }));
      alert(res.data.message);
    } catch (err) {
      console.error("Greška pri uploadu:", err);
      setUploadStatus((prev) => ({ ...prev, [eventId]: "error" }));
      alert("Greška pri uploadu beleške.");
    } finally {
      setUploading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleViewNote = async (eventId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/notes/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNoteContents((prev) => ({ ...prev, [eventId]: res.data.note_content }));
    } catch (err) {
      console.error("Greška pri učitavanju beleške:", err);
      alert("Neuspešno čitanje beleške.");
    }
  };

  const handleDeleteNote = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/api/notes/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Beleška obrisana.");
      setUploadStatus((prev) => ({ ...prev, [eventId]: undefined }));
      setNoteContents((prev) => ({ ...prev, [eventId]: undefined }));
    } catch (err) {
      console.error("Greška pri brisanju beleške:", err);
      alert("Brisanje beleške nije uspelo.");
    }
  };

  if (loading) return <p>Učitavanje pridruženih događaja...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-page">
      <div className="events-container">
        <h2>Joined Events</h2>
        {joinedEvents.length === 0 ? (
          <p>Niste se pridružili nijednom događaju.</p>
        ) : (
          joinedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.naziv}</h3>
              <p>{event.opis}</p>
              <p>
                {new Date(event.datum_pocetka).toLocaleDateString()} - {new Date(event.datum_zavrsetka).toLocaleDateString()}
              </p>
              <div className="upload-section">
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, event.id)}
                  disabled={uploading[event.id]}
                />
                <button
                  onClick={() => handleUpload(event.id)}
                  disabled={uploading[event.id]}
                >
                  {uploading[event.id] ? "Uploadujem..." : "Upload Beleške"}
                </button>
                {uploadStatus[event.id] === "success" && (
                  <>
                    <p style={{ color: "green" }}>Beleška uspešno uploadovana!</p>
                    <button onClick={() => handleViewNote(event.id)}>Prikaži belešku</button>
                    <button onClick={() => handleDeleteNote(event.id)}>Poništi belešku</button>
                    {noteContents[event.id] && (
                      <pre className="note-preview">{noteContents[event.id]}</pre>
                    )}
                  </>
                )}
                {uploadStatus[event.id] === "error" && <p style={{ color: "red" }}>Greška pri uploadovanju.</p>}
              </div>
              <button onClick={() => handleCancel(event.id)}>Otkaži</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JoinedEvents;
