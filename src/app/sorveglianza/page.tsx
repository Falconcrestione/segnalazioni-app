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
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Sorveglianza() {
  const [distretto, setDistretto] = useState("");
  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  const [kmPartenza, setKmPartenza] = useState("");
  const [kmArrivo, setKmArrivo] = useState("");

  const [jpgFile, setJpgFile] = useState<File | null>(null);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Modal e dati PDF ---
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [pdfFormData, setPdfFormData] = useState({
    veicolo: "",
    targa: "",
    data: "",
    oraPartenza: "",
    oraArrivo: "",
    conducente: "",
    percorso: "",
    kmPartenza: "",
    kmArrivo: "",
    buono: "",
    benzina: "",
    gasolio: "",
    manutenzione: "",
    lavaggi: "",
  });

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

  const handlePdfFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPdfFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Genera PDF lato client ---
  const generatePdf = async (): Promise<File> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { veicolo, targa, data, oraPartenza, oraArrivo, conducente,
      percorso, kmPartenza, kmArrivo, buono, benzina, gasolio, manutenzione, lavaggi } = pdfFormData;

    page.drawText(`Veicolo: ${veicolo}`, { x: 50, y: 800, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Targa: ${targa}`, { x: 50, y: 780, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Data: ${data}`, { x: 50, y: 760, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Ora Partenza: ${oraPartenza}`, { x: 50, y: 740, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Ora Arrivo: ${oraArrivo}`, { x: 50, y: 720, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Conducente: ${conducente}`, { x: 50, y: 700, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Percorso: ${percorso}`, { x: 50, y: 680, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`KM Partenza: ${kmPartenza}`, { x: 50, y: 660, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`KM Arrivo: ${kmArrivo}`, { x: 50, y: 640, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Buono n°: ${buono}`, { x: 50, y: 620, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Benzina L: ${benzina}`, { x: 50, y: 600, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Gasolio L: ${gasolio}`, { x: 50, y: 580, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Manutenzione: ${manutenzione}`, { x: 50, y: 560, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Lavaggi: ${lavaggi}`, { x: 50, y: 540, size: 12, font, color: rgb(0, 0, 0) });

    // --- FIX TypeScript: creo un Uint8Array nuovo compatibile ---
    const pdfBytes = await pdfDoc.save();
    const pdfFile = new File([new Uint8Array(pdfBytes)], `report_${targa}_${Date.now()}.pdf`, { type: "application/pdf" });
    return pdfFile;
  };

  const handleSend = async () => {
    if (!distretto) return alert("Seleziona il distretto");
    if (!comparto || !tipoVeicolo || !targa) return alert("Compila tutti i campi");
    if (!latLng) return alert("Posizione non disponibile");

    const kmGiornalieri = Number(kmArrivo) - Number(kmPartenza);
    if (kmGiornalieri < 0) return alert("KM arrivo non validi");

    setLoading(true);

    try {
      // Genero PDF lato client
      const pdfFile = await generatePdf();

      const pdfRef = ref(
        storage,
        `reports/sorveglianza/distretto_${distretto}/${Date.now()}_${targa}.pdf`
      );
      await uploadBytes(pdfRef, pdfFile);
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

      // Reset stati
      setDistretto("");
      setComparto("");
      setTipoVeicolo("");
      setTarga("");
      setKmPartenza("");
      setKmArrivo("");
      setJpgFile(null);
      setPdfFormData({
        veicolo: "",
        targa: "",
        data: "",
        oraPartenza: "",
        oraArrivo: "",
        conducente: "",
        percorso: "",
        kmPartenza: "",
        kmArrivo: "",
        buono: "",
        benzina: "",
        gasolio: "",
        manutenzione: "",
        lavaggi: "",
      });

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
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            onClick={() => setShowPdfForm(true)}
          >
            ✏️ Compila PDF
          </button>
        </div>

        {/* MODAL PDF FORM */}
        {showPdfForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-3 overflow-auto max-h-[90vh]">
              <h3 className="text-lg font-bold text-center">Compila Report</h3>

              {Object.entries(pdfFormData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handlePdfFormChange}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="input w-full"
                  type={key.includes("km") || key === "benzina" || key === "gasolio" ? "number" : "text"}
                />
              ))}

              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-400 text-white py-2 px-4 rounded"
                  onClick={() => setShowPdfForm(false)}
                >
                  ❌ Annulla
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded"
                  onClick={() => setShowPdfForm(false)}
                >
                  💾 Salva
                </button>
              </div>
            </div>
          </div>
        )}

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

          <input
            type="file"
            accept="image/*"
            onChange={e => setJpgFile(e.target.files?.[0] || null)}
            className="file-input"
          />
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
