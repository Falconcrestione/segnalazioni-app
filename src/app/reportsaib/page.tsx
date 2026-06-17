
"use client";

import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ReportsPage() {
  const [mezzi, setMezzi] = useState<any[]>([]);

  const [distretto, setDistretto] = useState("");
  const [comune, setComune] = useState("");
  const [squadra, setSquadra] = useState("");

 const [importo, setImporto] = useState("");
const [litri, setLitri] = useState("");
const [kmPartenza, setKmPartenza] = useState("");
const [kmArrivo, setKmArrivo] = useState("");
const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    loadMezzi();
  }, []);

  async function loadMezzi() {
    const snap = await getDocs(
      collection(db, "postazioni_aib")
    );

    setMezzi(
      snap.docs.map((d) => d.data())
    );
  }

  const comuni = [
    ...new Set(
      mezzi
        .filter(
          (m) =>
            String(m.distretto) === distretto
        )
        .map((m) => m.comune)
    ),
  ];

  const squadre = mezzi.filter(
    (m) =>
      m.comune === comune &&
      String(m.distretto) === distretto
  );

  async function submit() {
    try {
      if (!distretto)
        return alert("Seleziona distretto");

      if (!comune)
        return alert("Seleziona comune");

      if (!squadra)
        return alert("Seleziona squadra");

      if (!importo)
        return alert("Inserisci importo");

      if (!litri)
        return alert("Inserisci litri");
    if (!kmPartenza)
  return alert("Inserisci KM Partenza");

if (!kmArrivo)
  return alert("Inserisci KM Arrivo");

    

      const selected = squadre.find(
        (s) =>
          s.identificativo_squadra === squadra
      );

      if (!selected)
        return alert("Squadra non trovata");

      let fotoUrl = "";

if (file) {
  const storageRef = ref(
    storage,
    `scontrini_aib/${Date.now()}_${file.name}`
  );

  await uploadBytes(storageRef, file);

  fotoUrl = await getDownloadURL(storageRef);
}

      await addDoc(
        collection(db, "reports_aib"),
        {
          createdAt: serverTimestamp(),

          identificativo_squadra:
            selected.identificativo_squadra,

          tipoMezzo:
            selected.tipoMezzo,

          targa:
            selected.targa,

          distretto:
            selected.distretto,

          comune:
            selected.comune,

         importo: Number(importo),

litri: Number(litri),

kmPartenza: Number(kmPartenza),
kmArrivo: Number(kmArrivo),
kmPercorsi: Number(kmArrivo) - Number(kmPartenza),

fotoUrl,
        }
      );

      alert("✅ Report salvato");

      setDistretto("");
      setComune("");
      setSquadra("");
      setImporto("");
      setLitri("");
     setKmPartenza("");
setKmArrivo("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio");
    }
  }

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#0070f3",
            marginBottom: "30px",
          }}
        >
          ⛽ Inserimento Report AIB
        </h1>

        {/* DISTRETTO */}

        <label>Distretto</label>

        <select
          value={distretto}
          onChange={(e) =>
            setDistretto(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            Seleziona Distretto
          </option>

          {[1,2,3,4,5,6,7,8,9,10,11].map(
            (d) => (
              <option
                key={d}
                value={d}
              >
                Distretto {d}
              </option>
            )
          )}
        </select>

        {/* COMUNE */}

        <label>Comune</label>

        <select
          value={comune}
          onChange={(e) =>
            setComune(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            Seleziona Comune
          </option>

          {comuni.map((c) => (
            <option
              key={c}
              value={c}
            >
              {c}
            </option>
          ))}
        </select>

        {/* SQUADRA */}

        <label>
          Identificativo Squadra
        </label>

        <select
          value={squadra}
          onChange={(e) =>
            setSquadra(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            Seleziona Squadra
          </option>

          {squadre.map((s) => (
            <option
              key={
                s.identificativo_squadra
              }
              value={
                s.identificativo_squadra
              }
            >
              {s.identificativo_squadra}
              {" - "}
              {s.targa}
            </option>
          ))}
        </select>

        {/* IMPORTO */}

        <label>Importo (€)</label>

        <input
          type="number"
          value={importo}
          onChange={(e) =>
            setImporto(e.target.value)
          }
          style={inputStyle}
        />

        {/* LITRI */}

        <label>Litri</label>

        <input
          type="number"
          value={litri}
          onChange={(e) =>
            setLitri(e.target.value)
          }
          style={inputStyle}
        />
       <label>KM Partenza</label>

<input
  type="number"
  value={kmPartenza}
  onChange={(e) =>
    setKmPartenza(e.target.value)
  }
  style={inputStyle}
/>

<label>KM Arrivo</label>

<input
  type="number"
  value={kmArrivo}
  onChange={(e) =>
    setKmArrivo(e.target.value)
  }
  style={inputStyle}
/>

        {/* FOTO */}

        <label>Scontrino</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
          style={{
            marginTop: 10,
            marginBottom: 20,
          }}
        />

        {file && (
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt=""
              style={{
                width: 200,
                borderRadius: 8,
              }}
            />
          </div>
        )}

        <button
          onClick={submit}
          style={{
            width: "100%",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            padding: "14px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Salva Report
        </button>
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};