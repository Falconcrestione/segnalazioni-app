"use client";

import { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error("Errore posizione:", err);
        alert("Impossibile ottenere la posizione.");
      }
    );
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !idSegnalazione.trim() || !descrizione.trim() || !latLng) {
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
      // ✅ Reset form
      setIdSegnalazione("");
      setDescrizione("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Errore nell'invio");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f7f9fc",
      padding: "1rem"
    }}>
      <h1 style={{
        marginBottom: "2rem",
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
      }}>
        Invio Schede Giornaliere
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <label style={{ fontWeight: "600", color: "#555" }}>ID Segnalazione</label>
        <input
          type="text"
          value={idSegnalazione}
          onChange={(e) => setIdSegnalazione(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />

        <label style={{ fontWeight: "600", color: "#555" }}>Descrizione</label>
        <textarea
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          required
          rows={1}
          style={{
            padding: "0.4rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "none",
            height: "40px"
          }}
        />

        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Posizione</label>
          <p style={{ marginTop: "0.25rem", color: latLng ? "#222" : "#888" }}>
            {latLng
              ? `Lat: ${latLng.lat.toFixed(5)}, Lng: ${latLng.lng.toFixed(5)}`
              : "Rilevamento posizione..."}
          </p>
        </div>

        <label style={{ fontWeight: "600", color: "#555" }}>Carica PDF</label>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          style={{ fontSize: "1rem" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: loading ? "#99c2ff" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#005bb5";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#0070f3";
          }}
        >
          {loading ? "Invio in corso..." : "Invia"}
        </button>
      </form>
    </div>
  );
}
