"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export default function RichiediVeicolo() {
  const [veicoliLiberi, setVeicoliLiberi] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [comparto, setComparto] = useState("");
  const [veicolo, setVeicolo] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      const snap = await getDocs(collection(db, "veicoli"));
      const list: any[] = [];
      snap.forEach(doc => {
        const d = doc.data();
       // if (d.stato === "libero") 
          list.push({ id: doc.id, ...d });
      });
      setVeicoliLiberi(list);
    };
    loadCars();
  }, []);

  const send = async () => {
    if (!nome || !cognome || !email || !comparto || !veicolo)
      return alert("Compila tutti i campi");

    await addDoc(collection(db, "richieste"), {
      nome,
      cognome,
      email,
      comparto,
      veicolo,
      status: "in attesa",
      createdAt: Timestamp.now(),
    });

    alert("Richiesta inviata!");
    setNome(""); setCognome(""); setEmail("");
    setComparto(""); setVeicolo("");
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "0 auto",
      marginTop: 40,
      padding: 20,
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center" }}>Richiesta Veicolo</h2>

      <div className="form">
        <input placeholder="Nome" value={nome} onChange={(e)=>setNome(e.target.value)} />
        <input placeholder="Cognome" value={cognome} onChange={(e)=>setCognome(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Comparto" value={comparto} onChange={(e)=>setComparto(e.target.value)} />

        <select value={veicolo} onChange={(e)=>setVeicolo(e.target.value)}>
          <option value="">Seleziona un veicolo</option>
          {veicoliLiberi.map(v => (
            <option key={v.id} value={v.id}
            disabled={v.stato !== "libero"}>
              {v.modello} - {v.targa} -{v.stato}
            </option>
          ))}
        </select>

        <button onClick={send}>Invia richiesta</button>
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
          cursor: pointer;
          font-weight: bold;
        }

        button:hover {
          background: #0059c9;
        }
      `}</style>
    </div>
  );
}
