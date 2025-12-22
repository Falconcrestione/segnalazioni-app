"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // percorso corretto
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

// TIPI
type Veicolo = {
  id: string;
  targa: string;
  modello: string;
  stato: string;
  comparto: string;
  distretto: string;
};

export default function RichiediVeicolo() {
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [comparto, setComparto] = useState("");
  const [missione, setMissione] = useState("");
  const [distretto, setDistretto] = useState("");
  const [veicoloSelezionato, setVeicoloSelezionato] = useState<Veicolo | null>(null);

  const distretti = Array.from({ length: 11 }, (_, i) => `Distretto ${i + 1}`);

  // 🔄 CARICA VEICOLI
  useEffect(() => {
    const loadCars = async () => {
      const snap = await getDocs(collection(db, "veicoli"));
      const list: Veicolo[] = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as Omit<Veicolo, "id">) });
      });
      setVeicoli(list.filter(v => v.stato === "libero"));
    };
    loadCars();
  }, []);

  // 📤 INVIO RICHIESTA
  const send = async () => {
    if (
      !nome ||
      !cognome ||
      !email ||
      !comparto ||
      !missione ||
      !distretto ||
      !veicoloSelezionato
    ) {
      return alert("Compila tutti i campi");
    }

    await addDoc(collection(db, "richieste"), {
      nome,
      cognome,
      email,
      comparto,
      missione,
      distretto,

      veicoloId: veicoloSelezionato.id,
      veicoloTarga: veicoloSelezionato.targa,
      veicoloModello: veicoloSelezionato.modello,

      status: "in attesa",
      createdAt: Timestamp.now(),
    });

    alert("Richiesta inviata!");

    // reset
    setNome("");
    setCognome("");
    setEmail("");
    setComparto("");
    setMissione("");
    setDistretto("");
    setVeicoloSelezionato(null);
  };

  // 🔍 VEICOLI FILTRATI PER DISTRETTO
  const veicoliFiltrati = veicoli.filter(
    v => v.distretto === distretto
  );

  return (
    <div style={container}>
      <h2 style={{ textAlign: "center" }}>🚗 Richiesta Veicolo</h2>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Comparto" value={comparto} onChange={e => setComparto(e.target.value)} />
      <input placeholder="Missione" value={missione} onChange={e => setMissione(e.target.value)} />

      <select value={distretto} onChange={e => setDistretto(e.target.value)}>
        <option value="">Seleziona Distretto</option>
        {distretti.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={veicoloSelezionato?.id || ""}
        onChange={e => {
          const v = veicoli.find(v => v.id === e.target.value);
          setVeicoloSelezionato(v || null);
        }}
        disabled={!distretto}
      >
        <option value="">Seleziona Veicolo</option>
        {veicoliFiltrati.map(v => (
          <option key={v.id} value={v.id}>
            {v.modello} – {v.targa} ({v.comparto})
          </option>
        ))}
      </select>

      <button onClick={send}>Invia richiesta</button>

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
        button:hover {
          background: #0059c9;
        }
      `}</style>
    </div>
  );
}

// STILI
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
