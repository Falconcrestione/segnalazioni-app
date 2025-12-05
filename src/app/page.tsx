"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { db, storage } from "./lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [docAcquisto, setDocAcquisto] = useState("");
  const [squadra, setSquadra] = useState("");
  const [quantita, setQuantita] = useState("");
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [jpgFiles, setJpgFiles] = useState<FileList | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const jpgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.error("Errore posizione:", err);
        alert("Impossibile ottenere la posizione.");
      }
    );
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pdfFiles || pdfFiles.length === 0 || !docAcquisto.trim() || !quantita.trim() || !squadra.trim() || !latLng) {
      alert("Compila tutti i campi e seleziona almeno un file PDF.");
      return;
    }

    setLoading(true);

    try {
      const pdfUrls: string[] = [];
      const jpgUrls: string[] = [];

      // Upload PDF
      for (const file of Array.from(pdfFiles)) {
        if (file.type !== "application/pdf") {
          alert(`Il file "${file.name}" non è un PDF.`);
          setLoading(false);
          return;
        }
        const fileRef = ref(storage, `pdf/${file.name}`);
        await uploadBytes(fileRef, file);
        pdfUrls.push(await getDownloadURL(fileRef));
      }

      // Upload JPG
      if (jpgFiles) {
        for (const file of Array.from(jpgFiles)) {
          if (!file.type.startsWith("image/")) {
            alert(`Il file "${file.name}" non è un'immagine.`);
            setLoading(false);
            return;
          }
          const fileRef = ref(storage, `jpg/${file.name}`);
          await uploadBytes(fileRef, file);
          jpgUrls.push(await getDownloadURL(fileRef));
        }
      }

      await addDoc(collection(db, "locations"), {
        DocAcquisto: docAcquisto,
        squadra,
        quantita,
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        pdfUrls,
        jpgUrls,
        validated: false,
        createdAt: Timestamp.now(),
      });

      alert("Segnalazione inviata con successo!");
      setDocAcquisto("");
      setSquadra("");
      setQuantita("");
      setPdfFiles(null);
      setJpgFiles(null);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      if (jpgInputRef.current) jpgInputRef.current.value = "";

    } catch (err) {
      console.error(err);
      alert("Errore nell'invio");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f7f9fc", padding: "1rem" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem", fontWeight: "700", color: "#333", textAlign: "center" }}>
        RENDICONTAZIONE CARBURANTE FLOTTA SORVEGLIANZA IDRAULICA
      </h1>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <label style={{ fontWeight: "600", color: "#555" }}>Doc.Acquisto</label>
        <input type="text" value={docAcquisto} onChange={(e) => setDocAcquisto(e.target.value)} required style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem" }} />

        <label style={{ fontWeight: "600", color: "#555" }}>Squadra</label>
        <input type="text" value={squadra} onChange={(e) => setSquadra(e.target.value)} required style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem" }} />

        <label style={{ fontWeight: "600", color: "#555" }}>Quantità</label>
        <textarea value={quantita} onChange={(e) => setQuantita(e.target.value)} required rows={1} style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem", resize: "none", height: "40px" }} />

        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Posizione</label>
          <p style={{ marginTop: "0.25rem", color: latLng ? "#222" : "#888" }}>
            {latLng ? `Lat: ${latLng.lat.toFixed(5)}, Lng: ${latLng.lng.toFixed(5)}` : "Rilevamento posizione..."}
          </p>
        </div>

        <label style={{ fontWeight: "600", color: "#555" }}>Carica PDF (puoi selezionare più file)</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          ref={pdfInputRef}
          onChange={(e) => setPdfFiles(e.target.files)}
          required
          style={{ fontSize: "1rem" }}
        />

        <label style={{ fontWeight: "600", color: "#555" }}>Carica JPG (puoi selezionare più file)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={jpgInputRef}
          onChange={(e) => setJpgFiles(e.target.files)}
          style={{ fontSize: "1rem" }}
        />

        <button type="submit" disabled={loading} style={{
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
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#005bb5"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#0070f3"; }}
        >
          {loading ? "Invio in corso..." : "Invia"}
        </button>
      </form>
    </div>
  );
}
