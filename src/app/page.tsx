"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, storage } from "./lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
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
    if (!compiledPdf) return alert("Carica il PDF compilato.");
    if (!latLng) return alert("Posizione non disponibile.");
    if (!comparto || !tipoVeicolo || !targa) return alert("Compila tutti i campi richiesti.");

    setLoading(true);

    try {
      // --- Upload PDF ---
      const pdfRef = ref(storage, `reports/${Date.now()}_report.pdf`);
      await uploadBytes(pdfRef, compiledPdf);
      const pdfUrl = await getDownloadURL(pdfRef);

      // --- Upload JPG opzionale ---
      let jpgUrl: string | null = null;
      if (jpgFile) {
        const jpgRef = ref(storage, `images/${Date.now()}_${jpgFile.name}`);
        await uploadBytes(jpgRef, jpgFile);
        jpgUrl = await getDownloadURL(jpgRef);
      }

      // --- Salva report in Firestore ---
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

      // --- Trova il veicolo tramite targa e aggiorna stato ---
      const veicoloQuery = query(collection(db, "veicoli"), where("targa", "==", targa));
      const veicoloSnap = await getDocs(veicoloQuery);
      if (!veicoloSnap.empty) {
        const veicoloDoc = veicoloSnap.docs[0];
        await updateDoc(veicoloDoc.ref, { stato: "libero" });
        console.log("Veicolo aggiornato a libero:", veicoloDoc.id);
      } else {
        console.warn("Veicolo non trovato per la targa:", targa);
      }

      alert("Report inviato con successo!");

      // --- Reset campi ---
      setCompiledPdf(null);
      setJpgFile(null);
      setComparto("");
      setTipoVeicolo("");
      setTarga("");

    } catch (error) {
      console.error("Errore durante l'invio:", error);
      alert("Errore durante l'invio del report.");
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem", fontFamily: "sans-serif", backgroundColor: "#f4f6f9" }}>

      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "700" }}>RENDICONTAZIONE CARBURANTE</h1>

      {/* Campi dati */}
      <div style={{ display: "flex", flexDirection: "column", width: "300px", gap: "1rem", marginBottom: "2rem" }}>
        <input type="text" value={comparto} onChange={(e) => setComparto(e.target.value)} placeholder="Comparto" style={inputStyle} />
        <input type="text" value={tipoVeicolo} onChange={(e) => setTipoVeicolo(e.target.value)} placeholder="Tipo Veicolo" style={inputStyle} />
        <input type="text" value={targa} onChange={(e) => setTarga(e.target.value)} placeholder="Targa" style={inputStyle} />
      </div>

      {/* Link per compilare PDF */}
      <Link href="/compila">
        <button style={btnStyle}>✏️ Compila PDF</button>
      </Link>

      {/* Carica PDF compilato */}
      <div style={{ marginTop: "2rem" }}>
        <label style={{ fontWeight: "600" }}>Carica PDF compilato</label>
        <input type="file" accept="application/pdf" onChange={(e) => setCompiledPdf(e.target.files?.[0] || null)} />
      </div>

      {/* Carica foto JPG */}
      <div style={{ marginTop: "1rem" }}>
        <label style={{ fontWeight: "600" }}>Foto (opzionale)</label>
        <input type="file" accept="image/*" onChange={(e) => setJpgFile(e.target.files?.[0] || null)} />
      </div>

      <button onClick={handleSend} disabled={loading} style={{ ...btnStyle, marginTop: "2rem", backgroundColor: loading ? "#aaa" : "#0070f3" }}>
        {loading ? "Invio in corso..." : "📤 Invia Report"}
      </button>
      <br/>
    <Link href="/richiedi-veicolo">
        <button style={btnStyle}>✏️ RICHIEDI VEICOLO</button>
      </Link>
      
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
