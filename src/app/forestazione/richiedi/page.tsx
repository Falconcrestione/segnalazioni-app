"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RichiediVeicolo() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comparto, setComparto] = useState("");
  const [dataMissione, setDataMissione] = useState("");
  const [missione, setMissione] = useState("");
  const [distretto, setDistretto] = useState("");

  const distretti = Array.from({ length: 11 }, (_, i) => `Distretto ${i + 1}`);

  const send = async () => {
    if (!nome || !email || !comparto || !dataMissione || !missione || !distretto) {
      return alert("Compila tutti i campi");
    }

    if (!navigator.geolocation) {
      return alert("Geolocalizzazione non supportata");
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const numeroDistretto = Number(distretto.replace("Distretto ", ""));

        await addDoc(collection(db, "richieste"), {
          nome,
          email,
          comparto,
          dataMissione: Timestamp.fromDate(new Date(dataMissione)),
          missione,
          distretto: numeroDistretto,
          status: "in attesa",
          createdAt: Timestamp.now(),
          latitudine: lat,
          longitudine: lng,
        });

        alert("Richiesta inviata correttamente");

        setNome("");
        setEmail("");
        setComparto("");
        setDataMissione("");
        setMissione("");
        setDistretto("");
      },
      () => alert("Impossibile ottenere la posizione")
    );
  };

  return (
    <div style={container}>
      <h2 style={{ textAlign: "center" }}>🚗 Richiesta Veicolo</h2>

      <input placeholder="Nome e Cognome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Comparto" value={comparto} onChange={e => setComparto(e.target.value)} />

      {/* 📅 CALENDARIO */}
      <input
        type="date"
        value={dataMissione}
        onChange={e => setDataMissione(e.target.value)}
      />

      <input placeholder="Missione" value={missione} onChange={e => setMissione(e.target.value)} />

      <select value={distretto} onChange={e => setDistretto(e.target.value)}>
        <option value="">Seleziona Distretto</option>
        {distretti.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <button onClick={send}>Invia richiesta veicolo</button>

      <button
        onClick={() => router.push("/forestazione1/libera_veicolo")}
        style={{
          marginTop: 12,
          background: "#28a745",
          color: "white",
          padding: 12,
          borderRadius: 6,
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        📄 Invia report / Libera veicolo
      </button>

      <style jsx>{`
        input, select {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
