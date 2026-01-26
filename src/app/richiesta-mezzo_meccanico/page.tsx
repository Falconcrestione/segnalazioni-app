"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function RichiediVeicolo() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [sitoIntervento, setSitoIntervento] = useState("");
  const [dataMissione, setDataMissione] = useState("");
  const [durataPresunta, setDurataPresunta] = useState("");
  const [distretto, setDistretto] = useState("");

  const [mezzi, setMezzi] = useState<any[]>([]);
  const [mezzoId, setMezzoId] = useState("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const distretti = Array.from({ length: 11 }, (_, i) => `Distretto ${i + 1}`);

  /* 🔄 CARICA MEZZI */
  useEffect(() => {
    if (!distretto) {
      setMezzi([]);
      setMezzoId("");
      return;
    }

    const loadMezzi = async () => {
      const numeroDistretto = Number(distretto.replace("Distretto ", ""));

      const q = query(
        collection(db, "mezziMeccanici"),
        where("distretto", "==", numeroDistretto),
        where("stato", "==", "libero")
      );

      const snap = await getDocs(q);

      setMezzi(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    loadMezzi();
  }, [distretto]);

  /* 📤 INVIO */
  const send = async () => {
    if (
      !nome ||
      !email ||
      !sitoIntervento ||
      !dataMissione ||
      !durataPresunta ||
      !distretto
    ) {
      return alert("Compila tutti i campi");
    }

    if (!mezzoId) return alert("Seleziona un mezzo meccanico");
    if (!navigator.geolocation)
      return alert("Geolocalizzazione non supportata");

    let pdfUrl = "";
    if (pdfFile) {
      const pdfRef = ref(storage, `richiestePDF/${Date.now()}_${pdfFile.name}`);
      await uploadBytes(pdfRef, pdfFile);
      pdfUrl = await getDownloadURL(pdfRef);
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const numeroDistretto = Number(distretto.replace("Distretto ", ""));

        const mezzo = mezzi.find(m => m.id === mezzoId);
        if (!mezzo) return alert("Mezzo non valido");

        await addDoc(collection(db, "richiestemezzi"), {
          nome,
          email,
          sitoIntervento,
          dataMissione: Timestamp.fromDate(new Date(dataMissione)),
          durataPresunta: Number(durataPresunta),
          distretto: numeroDistretto,
          mezzoId: mezzo.id,
          identificativo: mezzo.identificativo,
          tipoMezzo: mezzo.tipoMezzo,
          status: "in attesa",
          createdAt: Timestamp.now(),
          latitudine: lat,
          longitudine: lng,
          pdf: pdfUrl,
        });

        await updateDoc(doc(db, "mezziMeccanici", mezzo.id), {
          stato: "occupato",
        });

        alert("Richiesta inviata correttamente");

        setNome("");
        setEmail("");
        setSitoIntervento("");
        setDataMissione("");
        setDurataPresunta("");
        setDistretto("");
        setMezzoId("");
        setPdfFile(null);
      },
      () => alert("Impossibile ottenere la posizione")
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🚜 Richiesta Mezzo Meccanico
        </h2>

        <input
          className="input"
          placeholder="Nome e Cognome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Sito di intervento"
          value={sitoIntervento}
          onChange={e => setSitoIntervento(e.target.value)}
        />

        <input
          className="input"
          type="date"
          value={dataMissione}
          onChange={e => setDataMissione(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Durata presunta (giorni)"
          value={durataPresunta}
          onChange={e => setDurataPresunta(e.target.value)}
        />

        <select
          className="input"
          value={distretto}
          onChange={e => setDistretto(e.target.value)}
        >
          <option value="">Seleziona Distretto</option>
          {distretti.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={mezzoId}
          onChange={e => setMezzoId(e.target.value)}
        >
          <option value="">Seleziona Mezzo Meccanico</option>
          {mezzi.map(m => (
            <option key={m.id} value={m.id}>
              {m.tipoMezzo} – {m.identificativo}
            </option>
          ))}
        </select>

        <input
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          type="file"
          accept="application/pdf"
          onChange={e => setPdfFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={send}
          className="w-full bg-blue-600 hover:bg-blue-700
                     text-white font-semibold py-2 rounded-lg
                     transition active:scale-95"
        >
          📤 Invia richiesta
        </button>
      </div>
    </div>
  );
}
