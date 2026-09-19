
"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { DISTRETTI } from "../../lib/distretti";
import React from "react";
import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";
import Link from "next/link";

export default function Sorveglianza() {
  const [distretto, setDistretto] = useState("");
  const [comparto, setComparto] = useState("");
  const [tipoVeicolo, setTipoVeicolo] = useState("");
  const [targa, setTarga] = useState("");

  const [kmPartenza, setKmPartenza] = useState("");
  const [kmArrivo, setKmArrivo] = useState("");
  const [kmArrivoWarning, setKmArrivoWarning] = useState(false);
  const [euroWarning, setEuroWarning] = useState<number | null>(null);
  const [pdfKmArrivoWarning, setPdfKmArrivoWarning] = useState(false);

  const [rifornimenti, setRifornimenti] = useState([
    {
      km: "",
      litri: "",
      euro: "",
      foto: null as File | null,
    },
  ]);

  const [latLng, setLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const aggiungiRifornimento = () => {
    setRifornimenti((prev) => [
      ...prev,
      {
        km: "",
        litri: "",
        euro: "",
        foto: null,
      },
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
      [field]: value,
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
    passeggeri_autorizzati: "",
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

      setPdfFormData((prev) => ({
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

      setPdfFormData((prev) => ({
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

      setPdfFormData((prev) => ({
        ...prev,
        kmPartenza: ultimoKmArrivo,
      }));
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
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
      "passeggeri_autorizzati",
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
        pdfFormData[
          field as keyof typeof pdfFormData
        ];

      if (
        !value ||
        value.toString().trim() === ""
      ) {
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

  // KM partenza e KM arrivo: solo numeri interi
  if (
    name === "kmPartenza" ||
    name === "kmArrivo"
  ) {
    if (!/^\d*$/.test(value)) {
      return;
    }
  }

  setPdfFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Controllo KM arrivo
  if (name === "kmArrivo") {

    // Se uno dei due campi è vuoto,
    // non effettuare il controllo
    if (
      value === "" ||
      pdfFormData.kmPartenza === ""
    ) {
      setPdfKmArrivoWarning(false);
      return;
    }

    const partenza = Number(
      pdfFormData.kmPartenza
    );

    const arrivo = Number(value);

    // KM arrivo inferiore alla partenza
    if (arrivo < partenza) {
      setPdfKmArrivoWarning(true);
      return;
    }

    const cifrePartenza =
      String(partenza).length;

    const cifreArrivo =
      String(arrivo).length;

    // Controllo quando si passa da 4 a 5 cifre,
    // da 5 a 6 cifre, ecc.
    if (cifreArrivo > cifrePartenza) {

      const prossimaSoglia =
        Math.pow(10, cifrePartenza);

      const kmNecessari =
        prossimaSoglia - partenza;

      // Se per raggiungere la cifra successiva
      // servono almeno 300 km, mostriamo l'avviso
      if (kmNecessari >= 300) {
        setPdfKmArrivoWarning(true);
        return;
      }
    }

    // Controllo aggiuntivo:
    // il KM arrivo non può essere 10 volte
    // o più grande del KM partenza
    if (partenza > 0) {

      const rapporto =
        arrivo / partenza;

      if (rapporto >= 10) {
        setPdfKmArrivoWarning(true);
        return;
      }
    }

    setPdfKmArrivoWarning(false);
  }
};

  const generatePdf = async (): Promise<File> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font =
      await pdfDoc.embedFont(StandardFonts.Helvetica);

    const {
      veicolo,
      targa,
      data,
      oraPartenza,
      oraArrivo,
      conducente,
      passeggeri_autorizzati,
      percorso,
      kmPartenza,
      kmArrivo,
      buono,
      benzina,
      gasolio,
      manutenzione,
      lavaggi,
    } = pdfFormData;

    page.drawText(`Veicolo: ${veicolo}`, {
      x: 50,
      y: 800,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Targa: ${targa}`, {
      x: 50,
      y: 780,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Data: ${data}`, {
      x: 50,
      y: 760,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Ora Partenza: ${oraPartenza}`,
      {
        x: 50,
        y: 740,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`Ora Arrivo: ${oraArrivo}`, {
      x: 50,
      y: 720,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Conducente: ${conducente}`,
      {
        x: 50,
        y: 700,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(
      `Passeggeri autorizzati: ${passeggeri_autorizzati}`,
      {
        x: 50,
        y: 680,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`Percorso: ${percorso}`, {
      x: 50,
      y: 660,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `KM Partenza: ${kmPartenza}`,
      {
        x: 50,
        y: 640,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`KM Arrivo: ${kmArrivo}`, {
      x: 50,
      y: 620,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Buono n°: ${buono}`, {
      x: 50,
      y: 600,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Benzina L: ${benzina}`, {
      x: 50,
      y: 580,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Gasolio L: ${gasolio}`, {
      x: 50,
      y: 560,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Manutenzione: ${manutenzione}`,
      {
        x: 50,
        y: 540,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`Lavaggi: ${lavaggi}`, {
      x: 50,
      y: 520,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const pdfFile = new File(
      [new Uint8Array(pdfBytes)],
      `report_${targa}_${Date.now()}.pdf`,
      {
        type: "application/pdf",
      }
    );

    return pdfFile;
  };

  const handleSend = async () => {
    if (!distretto)
      return alert("Seleziona il distretto");

    if (!comparto || !tipoVeicolo || !targa)
      return alert("Compila tutti i campi");

    if (!latLng)
      return alert("Posizione non disponibile");

    

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
        prossimoRifornimento: prossimo,
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

        rifornimenti: rifornimentiCompleti,

        rifornimentoKm:
          rifornimentiCompleti[0]?.km || null,

        quantitaLitri:
          rifornimentiCompleti[0]?.litri || null,

        importoeuro:
          rifornimentiCompleti[0]?.euro || null,

        prossimoRifornimento:
          rifornimentiCompleti[0]
            ?.prossimoRifornimento || null,

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
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

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
          await updateDoc(docSnap.ref, {
            status: "completata",
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
            where(
              "veicoloId",
              "==",
              veicoloId
            ),
            where("status", "in", [
              "in attesa",
              "approvata",
            ])
          )
        );

        if (snap.empty) {
          const veicoloQuery = await getDocs(
            query(
              collection(db, "veicoli"),
              where("targa", "==", targa)
            )
          );

          if (!veicoloQuery.empty) {
            await updateDoc(
              veicoloQuery.docs[0].ref,
              {
                stato: "libero",
              }
            );
          }
        } else {
          const veicoloQuery = await getDocs(
            query(
              collection(db, "veicoli"),
              where("targa", "==", targa)
            )
          );

          if (!veicoloQuery.empty) {
            await updateDoc(
              veicoloQuery.docs[0].ref,
              {
                stato: "occupato",
              }
            );
          }
        }
      }

      alert(
        "Report inviato e veicolo liberato"
      );

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
          foto: null,
        },
      ]);

      setPdfFormData({
        veicolo: "",
        targa: "",
        data: "",
        oraPartenza: "",
        oraArrivo: "",
        conducente: "",
        passeggeri_autorizzati: "",
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
    <div className="min-h-screen bg-[#f5f6f7] text-[#17324d]">

      {/* HEADER */}
      <header className="border-b border-[#d9e1e8] bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center bg-[#0066cc] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#004f9e] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30"
          >
            ← Torna alla Home
          </Link>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6f82]">
              Gestione veicoli
            </p>

            <p className="text-sm font-bold text-[#17324d]">
              Sistema operativo
            </p>
          </div>

        </div>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">

        {/* TITOLO */}
        <div className="mb-8 border-l-4 border-[#0066cc] bg-white px-5 py-5 shadow-sm sm:px-7">

          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#0066cc]">
            Servizio operativo
          </p>

          <h1 className="text-2xl font-bold leading-tight text-[#17324d] sm:text-3xl">
            Settori vari – Invio Report
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#43576b]">
            Inserisci i dati del veicolo, completa la documentazione
            e registra gli eventuali rifornimenti.
          </p>

        </div>

        {/* CARD PRINCIPALE */}
        <section className="overflow-hidden border border-[#d9e1e8] bg-white shadow-sm">

          {/* DOCUMENTAZIONE */}
          <div className="border-b border-[#d9e1e8] p-5 sm:p-7">

            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#17324d]">
                Documentazione
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                Compila il report PDF prima di inviare la
                registrazione.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPdfForm(true)}
              className="inline-flex min-h-[48px] w-full items-center justify-center bg-[#0066cc] px-5 py-3 text-base font-bold text-white transition hover:bg-[#004f9e] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 sm:w-auto"
            >
              Compila PDF
            </button>

          </div>

          {/* DATI VEICOLO */}
          <div className="p-5 sm:p-7">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#17324d]">
                Dati del veicolo
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                I dati già utilizzati vengono ricordati
                automaticamente per le successive operazioni.
              </p>
            </div>

            <div className="space-y-6">

              {/* DISTRETTO */}
              <div>
                <label
                  htmlFor="distretto"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Distretto
                </label>

                <select
                  id="distretto"
                  value={distretto}
                  onChange={(e) =>
                    setDistretto(e.target.value)
                  }
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                >
                  <option value="">
                    Seleziona il distretto
                  </option>

                  {DISTRETTI.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* COMPARTO */}
              <div>
                <label
                  htmlFor="comparto"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Comparto
                </label>

                <input
                  id="comparto"
                  type="text"
                  placeholder="Inserisci il comparto"
                  value={comparto}
                  onChange={(e) => {
                    const value =
                      e.target.value.toUpperCase();

                    setComparto(value);

                    localStorage.setItem(
                      "ultimoComparto",
                      value
                    );
                  }}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* TIPO VEICOLO */}
              <div>
                <label
                  htmlFor="tipoVeicolo"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Tipo veicolo
                </label>

                <input
                  id="tipoVeicolo"
                  type="text"
                  placeholder="Inserisci il tipo di veicolo"
                  value={tipoVeicolo}
                  onChange={(e) => {
                    const value =
                      e.target.value.toUpperCase();

                    setTipoVeicolo(value);

                    localStorage.setItem(
                      "ultimoTipoVeicolo",
                      value
                    );

                    setPdfFormData((prev) => ({
                      ...prev,
                      veicolo: value,
                    }));
                  }}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* TARGA */}
              <div>
                <label
                  htmlFor="targa"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Targa
                </label>

                <input
                  id="targa"
                  type="text"
                  placeholder="Inserisci la targa"
                  value={targa}
                  onChange={(e) => {
                    const value =
                      e.target.value.toUpperCase();

                    setTarga(value);

                    localStorage.setItem(
                      "ultimaTarga",
                      value
                    );
                  }}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* CHILOMETRI */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="kmPartenza"
                    className="mb-2 block text-sm font-bold text-[#17324d]"
                  >
                    KM partenza
                  </label>

                <input
  id="kmPartenza"
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="KM partenza"
  value={kmPartenza}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setKmPartenza(value);
    }
  }}
/>
                </div>

                <div>
                  <label
                    htmlFor="kmArrivo"
                    className="mb-2 block text-sm font-bold text-[#17324d]"
                  >
                    KM arrivo
                  </label>

                <input
  id="kmArrivo"
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="KM arrivo"
  value={kmArrivo}
  onChange={(e) => {
  const value = e.target.value;

  // Solo numeri interi
  if (!/^\d*$/.test(value)) {
    return;
  }

  setKmArrivo(value);
}}

onBlur={() => {
  if (!kmArrivo || !kmPartenza) {
    return;
  }

  const partenza = Number(kmPartenza);
  const arrivo = Number(kmArrivo);

  if (!Number.isInteger(partenza) || !Number.isInteger(arrivo)) {
    return;
  }

  // KM arrivo inferiore alla partenza
  if (arrivo < partenza) {
    setKmArrivoWarning(true);
    return;
  }

  const cifrePartenza = String(partenza).length;
  const cifreArrivo = String(arrivo).length;

  // Controllo cambio numero di cifre
  if (cifreArrivo > cifrePartenza) {
    const prossimaSoglia = Math.pow(10, cifrePartenza);

    const kmPerArrivareAllaNuovaCifra =
      prossimaSoglia - partenza;

    if (kmPerArrivareAllaNuovaCifra >= 300) {
      setKmArrivoWarning(true);
      return;
    }
  }

  // Controllo rapporto anomalo
  if (partenza > 0) {
    const rapporto = arrivo / partenza;

    if (rapporto >= 10) {
      setKmArrivoWarning(true);
      return;
    }
  }

  setKmArrivoWarning(false);
}}
/>
{kmArrivoWarning && (
  <p className="mt-2 text-sm font-bold text-[#b42318]">
    ⚠️ Verifica il KM di arrivo: il valore inserito è molto
    superiore al KM di partenza. Controlla di non aver
    aggiunto una cifra in più.
  </p>
)}
                </div>

              </div>

              {/* RIFORNIMENTI */}
              <div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#17324d]">
                    Rifornimenti
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                    Inserisci ogni rifornimento effettuato durante
                    il servizio.
                  </p>
                </div>

                <div className="space-y-4">

                  {rifornimenti.map((r, index) => (

                    <div
                      key={index}
                      className="border border-[#c7d2dc] bg-[#f8fafb] p-4 sm:p-5"
                    >

                      <div className="mb-4 flex items-center justify-between border-b border-[#d9e1e8] pb-3">

                        <h3 className="font-bold text-[#17324d]">
                          Rifornimento {index + 1}
                        </h3>

                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                        {/* KM */}
                        <div>
                          <label
                            htmlFor={`rifornimento-km-${index}`}
                            className="mb-2 block text-sm font-semibold text-[#43576b]"
                          >
                            KM rifornimento
                          </label>

                          <input
                            id={`rifornimento-km-${index}`}
                            type="number"
                            placeholder="KM"
                            value={r.km}
                            onChange={(e) =>
                              updateRifornimento(
                                index,
                                "km",
                                e.target.value
                              )
                            }
                            className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                          />
                        </div>

                        {/* LITRI */}
                        <div>
                          <label
                            htmlFor={`rifornimento-litri-${index}`}
                            className="mb-2 block text-sm font-semibold text-[#43576b]"
                          >
                            Quantità litri
                          </label>

                          <input
                            id={`rifornimento-litri-${index}`}
                            type="number"
                            placeholder="Litri"
                            value={r.litri}
                            onChange={(e) =>
                              updateRifornimento(
                                index,
                                "litri",
                                e.target.value
                              )
                            }
                            className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                          />
                        </div>

                        {/* EURO */}
                        <div>
                          <label
                            htmlFor={`rifornimento-euro-${index}`}
                            className="mb-2 block text-sm font-semibold text-[#43576b]"
                          >
                            Importo euro
                          </label>

                          <input
  id={`rifornimento-euro-${index}`}
  type="text"
  inputMode="decimal"
  placeholder="Importo €"
  value={r.euro}
  onChange={(e) => {
    let value = e.target.value;

    // Accetta solo numeri e un solo separatore decimale
    if (!/^\d*[.,]?\d*$/.test(value)) {
      return;
    }

    // Converte il punto in virgola
    value = value.replace(".", ",");

    // Massimo due decimali
    const parti = value.split(",");

    if (parti.length === 2) {
      value = `${parti[0]},${parti[1].slice(0, 2)}`;
    }

    updateRifornimento(
      index,
      "euro",
      value
    );

    // Controllo durante la digitazione
    if (value === "") {
      setEuroWarning(null);
      return;
    }

    const numero = Number(
      value.replace(",", ".")
    );

    // Se il prezzo supera 1000 €, chiediamo
    // semplicemente di verificarlo.
    if (numero >= 1000) {
      setEuroWarning(index);
    } else {
      setEuroWarning(null);
    }
  }}
  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
/>
{euroWarning === index && (
  <p className="mt-2 text-sm font-bold text-[#b42318]">
    ⚠️ Verifica l'importo inserito: il prezzo sembra molto elevato.
    Controlla di non aver inserito una cifra in più.
  </p>
)}
                        </div>

                      </div>

                      {/* FOTO */}
                      <div className="mt-5">

                        <label
                          htmlFor={`rifornimento-foto-${index}`}
                          className="mb-2 block text-sm font-semibold text-[#43576b]"
                        >
                          Foto dello scontrino
                        </label>

                        <p className="mb-3 text-xs leading-5 text-[#5c6f82]">
                          La foto è richiesta quando vengono
                          compilati KM, litri e importo.
                        </p>

                        <input
                          id={`rifornimento-foto-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updateRifornimento(
                              index,
                              "foto",
                              e.target.files?.[0] || null
                            )
                          }
                          className="block min-h-[48px] w-full border border-[#8a9bab] bg-white p-2 text-sm text-[#17324d] file:mr-4 file:min-h-[36px] file:border-0 file:bg-[#e8eef3] file:px-4 file:font-semibold file:text-[#17324d] hover:file:bg-[#dbe5ed]"
                        />

                      </div>

                    </div>

                  ))}

                </div>

                {/* AGGIUNGI */}
                <button
                  type="button"
                  onClick={aggiungiRifornimento}
                  className="mt-4 min-h-[48px] w-full border-2 border-[#247a3b] bg-white px-5 py-3 text-base font-bold text-[#247a3b] transition hover:bg-[#eef8f1] focus:outline-none focus:ring-4 focus:ring-[#247a3b]/30"
                >
                  + Aggiungi rifornimento
                </button>

              </div>

              {/* INVIO */}
              <div className="border-t border-[#d9e1e8] pt-6">

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={loading}
                  className="min-h-[52px] w-full bg-[#0066cc] px-6 py-3 text-base font-bold text-white transition hover:bg-[#004f9e] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 disabled:cursor-not-allowed disabled:bg-[#6c7a88] active:translate-y-px"
                >
                  {loading
                    ? "Invio in corso..."
                    : "Invia report"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* INFORMAZIONE */}
        <div className="mt-5 border border-[#d9e1e8] bg-white p-4 text-sm leading-6 text-[#43576b]">
          <strong className="text-[#17324d]">
            Informazioni:
          </strong>{" "}
          i dati del veicolo e l'ultimo chilometraggio vengono
          mantenuti nel browser per facilitare le operazioni
          successive.
        </div>

      </main>

      {/* MODAL PDF */}
      {showPdfForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17324d]/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-dialog-title"
        >

          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border border-[#c7d2dc] bg-white shadow-2xl">

            {/* HEADER MODAL */}
            <div className="flex items-start justify-between gap-4 border-b border-[#d9e1e8] bg-[#f5f6f7] px-5 py-4 sm:px-6">

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#0066cc]">
                  Documentazione
                </p>

                <h2
                  id="pdf-dialog-title"
                  className="mt-1 text-xl font-bold text-[#17324d]"
                >
                  Compila report PDF
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowPdfForm(false)}
                aria-label="Chiudi finestra"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#8a9bab] bg-white text-xl font-bold text-[#17324d] transition hover:bg-[#e8eef3] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30"
              >
                ×
              </button>

            </div>

            {/* FORM PDF */}
            <div className="overflow-y-auto p-5 sm:p-6">

              <p className="mb-6 text-sm leading-6 text-[#43576b]">
                Compila tutti i dati richiesti per generare
                la documentazione del servizio.
              </p>

              <div className="space-y-5">

                {Object.entries(pdfFormData).map(
                  ([key, value]) => (

                    <div key={key}>

                      <label
                        htmlFor={`pdf-${key}`}
                        className="mb-2 block text-sm font-bold text-[#17324d]"
                      >
                        {key === "veicolo"
                          ? "Veicolo"
                          : key === "targa"
                          ? "Targa"
                          : key === "data"
                          ? "Data"
                          : key === "oraPartenza"
                          ? "Ora partenza"
                          : key === "oraArrivo"
                          ? "Ora arrivo"
                          : key === "conducente"
                          ? "Conducente"
                          : key === "passeggeri_autorizzati"
                          ? "Passeggeri autorizzati"
                          : key === "percorso"
                          ? "Percorso"
                          : key === "kmPartenza"
                          ? "KM partenza"
                          : key === "kmArrivo"
                          ? "KM arrivo"
                          : key === "buono"
                          ? "Buono"
                          : key === "benzina"
                          ? "Benzina"
                          : key === "gasolio"
                          ? "Gasolio"
                          : key === "manutenzione"
                          ? "Manutenzione"
                          : key === "lavaggi"
                          ? "Lavaggi"
                          : key}
                      </label>

                     <input
  id={`pdf-${key}`}
  name={key}
  value={value}
  onChange={handlePdfFormChange}
  placeholder={
    key.charAt(0).toUpperCase() +
    key.slice(1)
  }
  inputMode={
    key === "kmPartenza" ||
    key === "kmArrivo"
      ? "numeric"
      : undefined
  }
  pattern={
    key === "kmPartenza" ||
    key === "kmArrivo"
      ? "[0-9]*"
      : undefined
  }
  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
  type={
    key === "data"
      ? "date"
      : key.includes("ora")
      ? "time"
      : "text"
  }
/>
{key === "kmArrivo" &&
  pdfKmArrivoWarning && (
    <p className="mt-2 text-sm font-bold text-[#b42318]">
      ⚠️ Verifica il KM di arrivo: il valore inserito è molto
      superiore al KM di partenza. Controlla di non aver
      aggiunto una cifra in più.
    </p>
  )}

                    </div>

                  )
                )}

              </div>

            </div>

            {/* FOOTER MODAL */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#d9e1e8] bg-[#f5f6f7] p-4 sm:flex-row sm:justify-end sm:p-5">

              <button
                type="button"
                onClick={() => setShowPdfForm(false)}
                className="min-h-[48px] border border-[#6c7a88] bg-white px-5 py-3 text-base font-bold text-[#17324d] transition hover:bg-[#e8eef3] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 sm:min-w-[130px]"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!validatePdfForm()) return;

                  setShowPdfForm(false);
                }}
                className="min-h-[48px] bg-[#247a3b] px-5 py-3 text-base font-bold text-white transition hover:bg-[#1d6330] focus:outline-none focus:ring-4 focus:ring-[#247a3b]/30 sm:min-w-[130px]"
              >
                Salva
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

const container = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
};

const input = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn = {
  padding: 12,
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
};
