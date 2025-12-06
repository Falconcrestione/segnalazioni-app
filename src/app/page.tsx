"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, storage } from "./lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [compiledPdf, setCompiledPdf] = useState<File | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.error("Errore posizione:", err);
        alert("Impossibile ottenere la posizione.");
      }
    );
  }, []);

  const handleSend = async () => {
    if (!compiledPdf) {
      alert("Carica il PDF compilato.");
      return;
    }
    if (!latLng) {
      alert("Posizione non disponibile.");
      return;
    }
    if (!comparto || !tipoVeicolo || !targa) {
      alert("Compila tutti i campi richiesti.");
      return;
    }

    setLoading(true);

    try {
      // Upload PDF compilato
      const pdfRef = ref(storage, `reports/${Date.now()}_report.pdf`);
      await uploadBytes(pdfRef, compiledPdf);
      const pdfUrl = await getDownloadURL(pdfRef);

      // Upload JPG
      let jpgUrl = null;
      if (jpgFile) {
        const jpgRef = ref(storage, `images/${Date.now()}_${jpgFile.name}`);
        await uploadBytes(jpgRef, jpgFile);
        jpgUrl = await getDownloadURL(jpgRef);
      }

      await addDoc(collection(db, "reports"), {
        pdf: pdfUrl,
        jpg: jpgUrl,
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        comparto,
        tipoVeicolo,
        targa,
        validated: false,
        createdAt: Timestamp.now(),
      });

      alert("Report inviato con successo!");

      setCompiledPdf(null);
      setJpgFile(null);
      setComparto("");
      setTipoVeicolo("");
      setTarga("");

    } catch (error) {
      console.error(error);
      alert("Errore durante l'invio.");
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
      padding: "1rem",
      fontFamily: "sans-serif",
      backgroundColor: "#f4f6f9"
    }}>

      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "700" }}>
        RENDICONTAZIONE CARBURANTE
      </h1>

      {/* CAMPi sopra il pulsante */}
      <div style={{ display: "flex", flexDirection: "column", width: "300px", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          value={comparto}
          onChange={(e) => setComparto(e.target.value)}
          placeholder="Comparto"
          style={inputStyle}
        />
        <input
          type="text"
          value={tipoVeicolo}
          onChange={(e) => setTipoVeicolo(e.target.value)}
          placeholder="Tipo Veicolo"
          style={inputStyle}
        />
        <input
          type="text"
          value={targa}
          onChange={(e) => setTarga(e.target.value)}
          placeholder="Targa"
          style={inputStyle}
        />
      </div>

      {/* Pulsante PDF */}
      <Link href="/compila">
        <button style={btnStyle}>✏️ Compila PDF</button>
      </Link>

      {/* Carica PDF compilato */}
      <div style={{ marginTop: "2rem" }}>
        <label style={{ fontWeight: "600" }}>Carica PDF compilato</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setCompiledPdf(e.target.files?.[0] || null)}
        />
      </div>

      {/* Carica foto JPG */}
      <div style={{ marginTop: "1rem" }}>
        <label style={{ fontWeight: "600" }}>Foto (opzionale)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setJpgFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          ...btnStyle,
          marginTop: "2rem",
          backgroundColor: loading ? "#aaa" : "#0070f3"
        }}
      >
        {loading ? "Invio in corso..." : "📤 Invia Report"}
      </button>

    </div>
  );
}

const btnStyle = {
  padding: "0.8rem 1.5rem",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};
