"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

// TIPI
type Veicolo = {
  id: string;
  targa: string;
  modello: string;
  stato: string;
  comparto: string;
  distretto: number;
};

export default function RichiediVeicolo() {
  const router = useRouter();
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
        const data = doc.data() as any;
        if (typeof data.distretto === "number") {
          list.push({ id: doc.id, ...data });
        }
      });
      setVeicoli(list.filter(v => v.stato === "libero"));
    };
    loadCars();
  }, []);

  // 🔍 VEICOLI FILTRATI PER DISTRETTO
  const veicoliFiltrati = veicoli.filter(v => {
    if (!distretto) return false;
    const numeroDistretto = Number(distretto.replace("Distretto ", ""));
    return v.distretto === numeroDistretto;
  });

  // 📤 INVIO RICHIESTA CON GEOLOCALIZZAZIONE
  const send = async () => {
    if (!nome || !cognome || !email || !comparto || !missione || !distretto || !veicoloSelezionato) {
      return alert("Compila tutti i campi");
    }

    if (!navigator.geolocation) {
      return alert("Geolocalizzazione non supportata dal browser.");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const numeroDistretto = Number(distretto.replace("Distretto ", ""));

        await addDoc(collection(db, "richieste"), {
          nome,
          cognome,
          email,
          comparto,
          missione,
          distretto: numeroDistretto,
          veicoloId: veicoloSelezionato.id,
          veicoloTarga: veicoloSelezionato.targa,
          veicoloModello: veicoloSelezionato.modello,
          status: "in attesa",
          createdAt: Timestamp.now(),
          latitudine: lat,
          longitudine: lng,
        });

        alert("Richiesta inviata con posizione!");

        // reset form
        setNome("");
        setCognome("");
        setEmail("");
        setComparto("");
        setMissione("");
        setDistretto("");
        setVeicoloSelezionato(null);
      },
      () => {
        alert("Non è stato possibile ottenere la posizione.");
      }
    );
  };

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

      <div>
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
      </div>

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
