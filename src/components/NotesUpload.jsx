import React, { useState } from "react";
import axios from "axios";

const NotesUpload = () => {
  const [file, setFile] = useState(null); // Čuva referencu na odabrani fajl
  const [uploadMessage, setUploadMessage] = useState(""); // Poruka korisniku

  // Funkcija za rukovanje promenom fajla
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Postavljanje fajla u stanje
  };

  // Funkcija za upload fajla
  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Molimo vas da izaberete fajl za upload.");
      return;
    }

    const formData = new FormData();
    formData.append("note_file", file); // Ime polja mora odgovarati backend-u

    try {
      const token = localStorage.getItem("token"); // Dohvatanje tokena

      if (!token) {
        setUploadMessage("Morate biti prijavljeni za upload.");
        return;
      }

      const response = await axios.post("http://localhost:8000/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Postavljanje zaglavlja za fajlove
          Authorization: `Bearer ${token}`, // Token za autentifikaciju
        },
      });

      // Poruka o uspešnom uploadu
      setUploadMessage(response.data.message || "Fajl uspešno uploadovan.");
    } catch (error) {
      console.error("Greška pri uploadu fajla:", error);
      setUploadMessage("Došlo je do greške prilikom upload-a.");
    }
  };

  return (
    <div>
      <h2>Upload Beleške</h2>
      <input type="file" onChange={handleFileChange} /> {/* Biranje fajla */}
      <button onClick={handleUpload}>Upload</button> {/* Upload dugme */}
      {uploadMessage && <p>{uploadMessage}</p>} {/* Poruka korisniku */}
    </div>
  );
};

export default NotesUpload;