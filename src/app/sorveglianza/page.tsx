"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DISTRETTI } from "../lib/distretti";
import React from "react";

export default function Sorveglianza() {
  const [distretto, setDistretto] = useState("");
  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  const [kmPartenza, setKmPartenza] = useState("");
  const [kmArrivo, setKmArrivo] = useState("");

  const [compiledPdf, setCompiledPdf] = useState<File | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSend = async () => {
    if (!distretto) return alert("Seleziona il distretto");
    if (!comparto || !tipoVeicolo || !targa) return alert("Compila tutti i campi");
    if (!kmPartenza || !kmArrivo) return alert("Inserisci KM partenza e arrivo");
    if (!compiledPdf) return alert("Carica il PDF");
    if (!latLng) return alert("Posizione non disponibile");

    const kmGiornalieri = Number(kmArrivo) - Number(kmPartenza);
    if (kmGiornalieri < 0) return alert("KM arrivo non validi");

    setLoading(true);

    try {
      const pdfRef = ref(
        storage,
        `reports/sorveglianza/distretto_${distretto}/${Date.now()}_${targa}.pdf`
      );
      await uploadBytes(pdfRef, compiledPdf);
      const pdfUrl = await getDownloadURL(pdfRef);

      let jpgUrl: string | null = null;
      if (jpgFile) {
        const jpgRef = ref(
          storage,
          `images/sorveglianza/distretto_${distretto}/${Date.now()}_${jpgFile.name}`
        );
        await uploadBytes(jpgRef, jpgFile);
        jpgUrl = await getDownloadURL(jpgRef);
      }

      await addDoc(collection(db, "reports"), {
        flusso: "sorveglianza",
        distretto,
        comparto,
        tipoVeicolo,
        targa,
        kmPartenza: Number(kmPartenza),
        kmArrivo: Number(kmArrivo),
        kmGiornalieri,
        pdf: pdfUrl,
        jpg: jpgUrl,
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        validated: false,
        createdAt: Timestamp.now(),
      });

      const veicoloQuery = query(
        collection(db, "veicoli"),
        where("targa", "==", targa)
      );
      const veicoloSnap = await getDocs(veicoloQuery);
      if (!veicoloSnap.empty) {
        await updateDoc(veicoloSnap.docs[0].ref, { stato: "libero" });
      }

      alert("Report inviato e veicolo liberato");

      setDistretto("");
      setComparto("");
      setTipoVeicolo("");
      setTarga("");
      setKmPartenza("");
      setKmArrivo("");
      setCompiledPdf(null);
      setJpgFile(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'invio");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold text-center text-gray-800">
          🛡️ Sorveglianza – Invio Report
        </h2>

        {/* DOCUMENTI */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">📄 Documentazione</h3>

         <a
  href="/report_auto_fillable.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">
    ✏️ Apri PDF da compilare
  </button>
</a>


          <input
            type="file"
            accept="application/pdf"
            onChange={e => setCompiledPdf(e.target.files?.[0] || null)}
            className="file-input"
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => setJpgFile(e.target.files?.[0] || null)}
            className="file-input"
          />
        </div>

        {/* DATI VEICOLO */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">🚗 Dati Veicolo</h3>

          <select
            value={distretto}
            onChange={e => setDistretto(e.target.value)}
            className="input"
          >
            <option value="">Seleziona Distretto</option>
            {DISTRETTI.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <input className="input" placeholder="Comparto" value={comparto} onChange={e => setComparto(e.target.value)} />
          <input className="input" placeholder="Tipo Veicolo" value={tipoVeicolo} onChange={e => setTipoVeicolo(e.target.value)} />
          <input className="input" placeholder="Targa" value={targa} onChange={e => setTarga(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="number" placeholder="KM Partenza" value={kmPartenza} onChange={e => setKmPartenza(e.target.value)} />
            <input className="input" type="number" placeholder="KM Arrivo" value={kmArrivo} onChange={e => setKmArrivo(e.target.value)} />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                     text-white font-semibold py-2 rounded-lg transition active:scale-95"
        >
          {loading ? "Invio in corso..." : "📤 Invia Report"}
        </button>
      </div>
    </div>
  );
}
