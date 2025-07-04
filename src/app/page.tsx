// pages/index.js
"use client"
import { useState, useEffect } from "react";
import { db, storage } from "./lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [idSegnalazione, setIdSegnalazione] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [file, setFile] = useState(null);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatLng({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !idSegnalazione || !descrizione || !latLng.lat) {
      alert("Compila tutti i campi e seleziona un file PDF.");
      return;
    }

    setLoading(true);
    try {
      const fileRef = ref(storage, `pdf/${file.name}`);
      await uploadBytes(fileRef, file);
      const pdfUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, "locations"), {
        IdSegnalazione: idSegnalazione,
        descrption: descrizione,
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        pdfUrl,
        validated: false,
        createdAt: Timestamp.now()
      });

      alert("Segnalazione inviata con successo!");
      setIdSegnalazione("");
      setDescrizione("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Errore nell'invio");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Invia Segnalazione</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Segnalazione</label><br />
          <input
            type="text"
            value={idSegnalazione}
            onChange={(e) => setIdSegnalazione(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrizione</label><br />
          <textarea
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Posizione</label><br />
          <p>
            {latLng.lat && latLng.lng
              ? `Lat: ${latLng.lat}, Lng: ${latLng.lng}`
              : "Rilevamento posizione..."}
          </p>
        </div>
        <div>
          <label>Carica PDF</label><br />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Invio in corso..." : "Invia"}
        </button>
      </form>
    </div>
  );
}
