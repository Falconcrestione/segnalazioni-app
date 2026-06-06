"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DISTRETTI } from "../../lib/distretti";
import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Sorveglianza() {
  const [distretto, setDistretto] = useState("");
  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  const [kmPartenza, setKmPartenza] = useState("");
  const [kmArrivo, setKmArrivo] = useState("");
 const [rifornimenti, setRifornimenti] = useState([
  {
    km: "",
    litri: "",
    euro: "",
    foto: null as File | null
  }
]);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const aggiungiRifornimento = () => {

  setRifornimenti(prev => [
    ...prev,
    {
      km: "",
      litri: "",
      euro: "",
      foto: null
    }
  ]);
};

const updateRifornimento = (
  index: number,
  field: string,
  value: any
) => {

  const updated = [...rifornimenti];

  updated[index] = {
    ...updated[index],
    [field]: value
  };

  setRifornimenti(updated);
};

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

  const savedTarga =
    localStorage.getItem("ultimaTarga");

  if (savedTarga) {

    setTarga(savedTarga);

    setPdfFormData(prev => ({
      ...prev,
      targa: savedTarga,
    }));
  }

}, []);
useEffect(() => {

  const savedComparto =
    localStorage.getItem("ultimoComparto");

  if (savedComparto) {
    setComparto(savedComparto);
  }

}, []);
useEffect(() => {

  const savedTipoVeicolo =
    localStorage.getItem("ultimoTipoVeicolo");

  if (savedTipoVeicolo) {

    setTipoVeicolo(savedTipoVeicolo);

    setPdfFormData(prev => ({
      ...prev,
      veicolo: savedTipoVeicolo,
    }));
  }

}, []);
useEffect(() => {

  const ultimoKmArrivo =
    localStorage.getItem("ultimoKmArrivo");

  if (ultimoKmArrivo) {

    setKmPartenza(ultimoKmArrivo);

    setPdfFormData(prev => ({
      ...prev,
      kmPartenza: ultimoKmArrivo,
    }));
  }

}, []);

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

const validatePdfForm = () => {

  const requiredFields = [
    "veicolo",
    "targa",
    "data",
    "oraPartenza",
    "oraArrivo",
    "conducente",
    "kmPartenza",
    "kmArrivo",
    "percorso",
    "buono",
    "benzina",
    "gasolio",
    "manutenzione",
    "lavaggi",
  ];

  for (const field of requiredFields) {

    const value =
      pdfFormData[field as keyof typeof pdfFormData];

    if (!value || value.toString().trim() === "") {

      alert(
        `⚠️ Campo obbligatorio: ${field}
Per Buono, Manutenzione e Lavaggi inserire NO.
Per Benzina e Gasolio inserire 0`
      );

      return false;
    }
  }

  return true;
};

const handlePdfFormChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const { name, value } = e.target;

  setPdfFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
  const generatePdf = async (): Promise<File> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
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

    const pdfBytes = await pdfDoc.save();
    const pdfFile = new File([new Uint8Array(pdfBytes)], `report_${targa}_${Date.now()}.pdf`, { type: "application/pdf" });
    return pdfFile;
  };

  const handleSend = async () => {
    if (!distretto) return alert("Seleziona il distretto");
    if (!comparto || !tipoVeicolo || !targa) return alert("Compila tutti i campi");
    if (!latLng) return alert("Posizione non disponibile");
    // ✅ Foto obbligatoria se il rifornimento è compilato
for (const r of rifornimenti) {
  const haKm = r.km !== "";
  const haLitri = r.litri !== "";
  const haEuro = r.euro !== "";

  if (haKm && haLitri && haEuro && !r.foto) {
    return alert(
      "⚠️ Devi aggiungere la foto dello scontrino."
    );
  }
}

    const kmGiornalieri =
  Number(kmArrivo) - Number(kmPartenza);

const rifornimentiCompleti = [];

for (const r of rifornimenti) {

  let fotoUrl = null;

  // upload foto
  if (r.foto) {

    const fotoRef = ref(
      storage,
      `images/rifornimenti/distretto_${distretto}/${Date.now()}_${r.foto.name}`
    );

    await uploadBytes(fotoRef, r.foto);

    fotoUrl = await getDownloadURL(fotoRef);
  }

  let prossimo = null;

  if (r.km && r.litri) {

    const consumoMedio = 15;

    const autonomiaStimata =
      consumoMedio * Number(r.litri);

    prossimo = Math.round(
      Number(r.km) + autonomiaStimata
    );
  }

  rifornimentiCompleti.push({
    km: Number(r.km),
    litri: Number(r.litri),
    euro: Number(r.euro),
    foto: fotoUrl,
    prossimoRifornimento: prossimo
  });
}
if (kmGiornalieri < 0)
  return alert("KM arrivo non validi");

    setLoading(true);

    try {

  if (!validatePdfForm()) {

    setLoading(false);
    return;
  }

  // Genero PDF lato client
  const pdfFile = await generatePdf();
      const pdfRef = ref(
        storage,
        `reports/sorveglianza/distretto_${distretto}/${Date.now()}_${targa}.pdf`
      );
      await uploadBytes(pdfRef, pdfFile);
      const pdfUrl = await getDownloadURL(pdfRef);

     
        

      await addDoc(collection(db, "reports"), {
  flusso: "sorveglianza",
  distretto,
  comparto,
  tipoVeicolo,
  targa,

  kmPartenza: Number(kmPartenza),
  kmArrivo: Number(kmArrivo),
  kmGiornalieri,

  // ✅ nuovo sistema
rifornimenti: rifornimentiCompleti,

// ✅ compatibilità dashboard
rifornimentoKm:
  rifornimentiCompleti[0]?.km || null,

quantitaLitri:
  rifornimentiCompleti[0]?.litri || null,

importoeuro:
  rifornimentiCompleti[0]?.euro || null,

prossimoRifornimento:
  rifornimentiCompleti[0]?.prossimoRifornimento || null,

jpg:
  rifornimentiCompleti[0]?.foto || null,

  pdf: pdfUrl,
  
        latitudine: latLng.lat,
        longitudine: latLng.lng,
        validated: false,
        createdAt: Timestamp.now(),
      });

      // 🔎 1. Trova richiesta attiva di oggi
const start = new Date();
start.setHours(0,0,0,0);

const end = new Date();
end.setHours(23,59,59,999);

const richiesteSnap = await getDocs(
  query(
    collection(db, "richieste"),
    where("veicoloTarga", "==", targa),
    where("status", "==", "approvata")
  )
);

let veicoloId = null;

for (const docSnap of richiesteSnap.docs) {
  const r = docSnap.data();

  if (!r.dataMissione) continue;

  const d = r.dataMissione.toDate();

  if (d >= start && d <= end) {
    // ✅ missione di oggi trovata
    await updateDoc(docSnap.ref, {
      status: "completata"
    });

    veicoloId = r.veicoloId;
    break;
  }
}
// 🔄 2. aggiorna stato veicolo automaticamente
if (veicoloId) {

  const snap = await getDocs(
    query(
      collection(db, "richieste"),
      where("veicoloId", "==", veicoloId),
      where("status", "in", ["in attesa", "approvata"])
    )
  );

  if (snap.empty) {
    // 🟢 nessuna missione → libero
    const veicoloQuery = await getDocs(
      query(collection(db, "veicoli"), where("targa", "==", targa))
    );

    if (!veicoloQuery.empty) {
      await updateDoc(veicoloQuery.docs[0].ref, {
        stato: "libero"
      });
    }
  } else {
    // 🔴 ci sono altre missioni
    const veicoloQuery = await getDocs(
      query(collection(db, "veicoli"), where("targa", "==", targa))
    );

    if (!veicoloQuery.empty) {
      await updateDoc(veicoloQuery.docs[0].ref, {
        stato: "occupato"
      });
    }
  }
}

      alert("Report inviato e veicolo liberato");
      localStorage.setItem(
  "ultimoKmArrivo",
  kmArrivo
);

      // Reset
      setDistretto("");
      setComparto("");
      setTipoVeicolo("");
      setTarga("");
      setKmPartenza("");
      setKmArrivo("");
     setRifornimenti([
  {
    km: "",
    litri: "",
    euro: "",
    foto: null
  }
]);
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
    <div style={container}>
      <h2>SETTORI VARI – INVIO REPORT</h2>

      <h3>Documentazione</h3>

      <button style={btn} onClick={() => setShowPdfForm(true)}>✏️ Compila PDF</button>

      {/* MODAL PDF FORM */}
      {showPdfForm && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 350, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3 style={{ textAlign: "center" }}>Compila Report</h3>
            {Object.entries(pdfFormData).map(([key, value]) => (
              <input
                key={key}
                name={key}
                value={value}
                onChange={handlePdfFormChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                style={input}
             type={
  key === "data"
    ? "date"
    : key.includes("ora")
    ? "time"
    : "text"
}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <button style={{ ...btn, background: "#aaa" }} onClick={() => setShowPdfForm(false)}>❌ Annulla</button>
             <button
  style={{ ...btn, background: "#28a745" }}
  onClick={() => {

    if (!validatePdfForm()) return;

    setShowPdfForm(false);

  }}
>
  💾 Salva
</button>
            </div>
          </div>
        </div>
      )}

      

      <h3>Dati Veicolo</h3>

      <select value={distretto} onChange={e => setDistretto(e.target.value)} style={input}>
        <option value="">Seleziona Distretto</option>
        {DISTRETTI.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

     <input
  style={input}
  placeholder="Comparto"
  value={comparto}
  onChange={e => {

    const value = e.target.value.toUpperCase();

    setComparto(value);

    localStorage.setItem(
      "ultimoComparto",
      value
    );

  }}
/>
     <input
  style={input}
  placeholder="Tipo Veicolo"
  value={tipoVeicolo}
  onChange={e => {

    const value =
      e.target.value.toUpperCase();

    setTipoVeicolo(value);

    localStorage.setItem(
      "ultimoTipoVeicolo",
      value
    );

    // aggiorna PDF
    setPdfFormData(prev => ({
      ...prev,
      veicolo: value,
    }));

  }}
/>
      <input
  style={input}
  placeholder="Targa"
  value={targa}
  onChange={e => {

    const value = e.target.value.toUpperCase();

    setTarga(value);

    // salva nel browser
    localStorage.setItem("ultimaTarga", value);

  }}
/>

      <input style={input} type="number" placeholder="KM Partenza" value={kmPartenza} onChange={e => setKmPartenza(e.target.value)} />
      <input style={input} type="number" placeholder="KM Arrivo" value={kmArrivo} onChange={e => setKmArrivo(e.target.value)} />
     <h3>Rifornimenti</h3>

{rifornimenti.map((r, index) => (

  <div
    key={index}
    style={{
      border: "1px solid #ccc",
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      display: "grid",
      gap: "10px"
    }}
  >

    <input
      style={input}
      type="number"
      placeholder="Rifornimento a KM"
      value={r.km}
      onChange={e =>
        updateRifornimento(
          index,
          "km",
          e.target.value
        )
      }
    />

    <input
      style={input}
      type="number"
      placeholder="Quantità Litri"
      value={r.litri}
      onChange={e =>
        updateRifornimento(
          index,
          "litri",
          e.target.value
        )
      }
    />

    <input
      style={input}
      type="number"
      placeholder="Importo Euro"
      value={r.euro}
      onChange={e =>
        updateRifornimento(
          index,
          "euro",
          e.target.value
        )
      }
    />

    <input
      type="file"
      accept="image/*"
      onChange={e =>
        updateRifornimento(
          index,
          "foto",
          e.target.files?.[0] || null
        )
      }
    />

  </div>
))}

<button
  type="button"
  style={{
    ...btn,
    background: "#28a745"
  }}
  onClick={aggiungiRifornimento}
>
  ➕ Aggiungi Rifornimento
</button>
      <button onClick={handleSend} disabled={loading} style={btn}>
        {loading ? "Invio..." : "📤 Invia Report"}
      </button>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn: React.CSSProperties = {
  padding: 12,
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
};
