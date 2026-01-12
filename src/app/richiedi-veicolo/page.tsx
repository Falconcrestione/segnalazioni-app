"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RichiediVeicolo() {
  const router = useRouter();

  const [veicoliLiberi, setVeicoliLiberi] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [comparto, setComparto] = useState("");
  const [missione, setMissione] = useState("");
  const [veicolo, setVeicolo] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      const snap = await getDocs(collection(db, "veicoli"));
      const list: any[] = [];
      snap.forEach(doc => {
        const d = doc.data();
        list.push({ id: doc.id, ...d });
      });
      setVeicoliLiberi(list);
    };
    loadCars();
  }, []);

  const send = async () => {
    if (!nome || !cognome || !email || !comparto || !missione || !veicolo) {
      alert("Compila tutti i campi");
      return;
    }

    await addDoc(collection(db, "richieste"), {
      nome,
      cognome,
      email,
      comparto,
      missione,
      veicolo,
      status: "in attesa",
      createdAt: Timestamp.now(),
    });

    alert("Richiesta inviata!");

    setNome("");
    setCognome("");
    setEmail("");
    setComparto("");
    setMissione("");
    setVeicolo("");
  };

  return (
    <div style={container}>
      <h2 style={{ textAlign: "center" }}>🚗 Richiesta Veicolo</h2>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Comparto" value={comparto} onChange={e => setComparto(e.target.value)} />
      <input placeholder="Missione" value={missione} onChange={e => setMissione(e.target.value)} />

      <select value={veicolo} onChange={e => setVeicolo(e.target.value)}>
        <option value="">Seleziona un veicolo</option>
        {veicoliLiberi.map(v => (
          <option key={v.id} value={v.id} disabled={v.stato !== "libero"}>
            {v.modello} – {v.targa} ({v.stato})
          </option>
        ))}
      </select>

      <button onClick={send}>Invia richiesta</button>

      {/* ✅ QUESTO È IL BOTTONE CHE PRIMA NON SI VEDEVA */}
      <button
        onClick={() => router.push("/forestazione1/libera_veicolo")}
        style={{
          marginTop: 16,
          padding: 12,
          background: "#28a745",
          color: "white",
          borderRadius: 6,
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        📄 Invia report / Libera veicolo
      </button>
    </div>
  );
}

/* STILI */
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

