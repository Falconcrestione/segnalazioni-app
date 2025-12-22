"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DISTRETTI } from "../lib/distretti";
import React from "react";

export default function Sorveglianza() {
  const [distretto, setDistretto] = useState("");
  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  const [compiledPdf, setCompiledPdf] = useState<File | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // GEOLOCALIZZAZIONE
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos =>
        setLatLng({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => alert("Impossibile ottenere la posizione")
    );
  }, []);

  // INVIO REPORT
  const handleSend = async () => {
    if (!distretto) return alert("Seleziona il distretto");
    if (!comparto || !tipoVeicolo || !targa) return alert("Compila tutti i campi");
    if (!compiledPdf) return alert("Carica il PDF");
    if (!latLng) return alert("Posizione non disponibile");

    setLoading(true);

    try {
      // Upload PDF
      const pdfRef = ref(
        storage,
        `reports/sorveglianza/distretto_${distretto}/${Date.now()}_${targa}.pdf`
      );
      await uploadBytes(pdfRef, compiledPdf);
      const pdfUrl = await getDownloadURL(pdfRef);

      // Upload JPG (opzionale)
      let jpgUrl: string | null = null;
      if (jpgFile) {
        const jpgRef = ref(
          storage,
          `images/sorveglianza/distretto_${distretto}/${Date.now()}_${jpgFile.name}`
        );
        await uploadBytes(jpgRef, jpgFile);
        jpgUrl = await getDownloadURL(jpgRef);
      }

      // Salvataggio Firestore
      await addDoc(collection(db, "reports"), {
        flusso: "sorveglianza",
        distretto,
        comparto,
        tipoVeicolo,
        targa,
        pdf: pdfUrl,
        jpg: jpgUrl,
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        validated: false,
        createdAt: Timestamp.now(),
      });

      // 🔓 LIBERA IL VEICOLO
      const veicoloQuery = query(collection(db, "veicoli"), where("targa", "==", targa));
      const veicoloSnap = await getDocs(veicoloQuery);

      if (!veicoloSnap.empty) {
        await updateDoc(veicoloSnap.docs[0].ref, { stato: "libero" });
        console.log("Veicolo liberato:", targa);
      } else {
        console.warn("Veicolo non trovato per targa:", targa);
      }

      alert("Report inviato correttamente");

      // reset campi
      setDistretto("");
      setComparto("");
      setTipoVeicolo("");
      setTarga("");
      setCompiledPdf(null);
      setJpgFile(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'invio");
    }

    setLoading(false);
  };

  return (
    <div style={container}>
      <h2>SORVEGLIANZA – INVIO REPORT</h2>

      {/* DISTRETTO */}
      <select
        value={distretto}
        onChange={e => setDistretto(e.target.value)}
        style={input}
      >
        <option value="">Seleziona Distretto</option>
        {DISTRETTI.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <input
        style={input}
        placeholder="Comparto"
        value={comparto}
        onChange={e => setComparto(e.target.value)}
      />

      <input
        style={input}
        placeholder="Tipo Veicolo"
        value={tipoVeicolo}
        onChange={e => setTipoVeicolo(e.target.value)}
      />

      <input
        style={input}
        placeholder="Targa"
        value={targa}
        onChange={e => setTarga(e.target.value)}
      />

      {/* BOTTONE COMPILA PDF */}
      <a
        href="/report_auto_fillable.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button style={btn}>✏️ Compila PDF</button>
      </a>

      <label>PDF compilato</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setCompiledPdf(e.target.files?.[0] || null)}
      />

      <label>Foto (opzionale)</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setJpgFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleSend} disabled={loading} style={btn}>
        {loading ? "Invio..." : "📤 Invia Report"}
      </button>
    </div>
  );
}

// STILI
const container: React.CSSProperties = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn: React.CSSProperties = {
  padding: 12,
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
};
