"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { db, storage } from "./lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [idSegnalazione, setIdSegnalazione] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatLng({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Errore nel rilevamento posizione:", err);
          alert("Impossibile ottenere la posizione.");
        }
      );
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !file ||
      !idSegnalazione.trim() ||
      !descrizione.trim() ||
      !latLng
    ) {
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
        createdAt: Timestamp.now(),
      });

      alert("Segnalazione inviata con successo!");
      setIdSegnalazione("");
      setDescrizione("");
      setFile(null);
      setLatLng(null);
    } catch (err) {
      console.error(err);
      alert("Errore nell'invio");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
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
        <div style={{ marginTop: "1rem" }}>
          <label>Descrizione</label><br />
          <textarea
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Posizione</label><br />
          <p>
            {latLng
              ? `Lat: ${latLng.lat}, Lng: ${latLng.lng}`
              : "Rilevamento posizione..."}
          </p>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Carica PDF</label><br />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Invio in corso..." : "Invia"}
        </button>
      </form>
    </div>
  );
}
