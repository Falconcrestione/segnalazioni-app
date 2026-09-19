"use client";

import Link from "next/link";

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
  const [rifornimentoKm, setRifornimentoKm] = useState("");
  const [quantitaLitri, setQuantitaLitri] = useState("");
  const [importoeuro, setImportoEuro] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");

  const [jpgFile, setJpgFile] = useState<File | null>(null);

  const [latLng, setLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
      const value = pdfFormData[field as keyof typeof pdfFormData];

      if (!value || value.toString().trim() === "") {
        alert(
          `⚠️ Campo obbligatorio Specificare: ${field} "Per i campi Buono,Manutenzione,Lavaggi, il cui dato non è disponibile inserire no, mentre per Benzina e Gasolio 0"`
        );
        return false;
      }
    }

    return true;
  };

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

  useEffect(() => {
    const savedTarga = localStorage.getItem("ultimaTarga");

    if (savedTarga) {
      setTarga(savedTarga);

      setPdfFormData((prev) => ({
        ...prev,
        targa: savedTarga,
      }));
    }
  }, []);

  useEffect(() => {
    const savedComparto = localStorage.getItem("ultimoComparto");

    if (savedComparto) {
      setComparto(savedComparto);
    }
  }, []);

  useEffect(() => {
    const savedTipoVeicolo = localStorage.getItem("ultimoTipoVeicolo");

    if (savedTipoVeicolo) {
      setTipoVeicolo(savedTipoVeicolo);

      setPdfFormData((prev) => ({
        ...prev,
        veicolo: savedTipoVeicolo,
      }));
    }
  }, []);

  useEffect(() => {
    const ultimoKmArrivo = localStorage.getItem("ultimoKmArrivo");

    if (ultimoKmArrivo) {
      setKmPartenza(ultimoKmArrivo);

      setPdfFormData((prev) => ({
        ...prev,
        kmPartenza: ultimoKmArrivo,
      }));
    }
  }, []);

  const handlePdfFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPdfFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Genera PDF lato client ---
  const generatePdf = async (): Promise<File> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

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

    page.drawText(`Ora Partenza: ${oraPartenza}`, {
      x: 50,
      y: 740,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Ora Arrivo: ${oraArrivo}`, {
      x: 50,
      y: 720,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Conducente: ${conducente}`, {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

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

    page.drawText(`KM Partenza: ${kmPartenza}`, {
      x: 50,
      y: 640,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

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

    page.drawText(`Manutenzione: ${manutenzione}`, {
      x: 50,
      y: 540,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

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
    if (!distretto) return alert("Seleziona il distretto");
    if (!comparto || !tipoVeicolo || !targa)
      return alert("Compila tutti i campi");
    if (!latLng) return alert("Posizione non disponibile");

    const kmGiornalieri =
      Number(kmArrivo) - Number(kmPartenza);

    let prossimoRifornimento = null;

    if (rifornimentoKm && quantitaLitri && kmArrivo) {
      const kmPercorsiDalPieno =
        Number(kmArrivo) - Number(rifornimentoKm);

      if (kmPercorsiDalPieno > 0) {
        const consumoMedio = 15;
        const capacitaSerbatoio = 50;

        const autonomiaStimata =
          consumoMedio * Number(quantitaLitri);

        prossimoRifornimento = Math.round(
          Number(rifornimentoKm) + autonomiaStimata
        );
      }
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
      setReceiptUrl(pdfUrl);

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
        rifornimentoKm: rifornimentoKm
          ? Number(rifornimentoKm)
          : null,
        quantitaLitri: quantitaLitri
          ? Number(quantitaLitri)
          : null,
        prossimoRifornimento,
        importoeuro: importoeuro
          ? Number(importoeuro)
          : null,
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
        await updateDoc(veicoloSnap.docs[0].ref, {
          stato: "libero",
        });
      }

      alert("Report inviato e veicolo liberato");

      localStorage.setItem("ultimoKmArrivo", kmArrivo);

      setDistretto("");
      setComparto("");
      setTipoVeicolo("");
      setTarga("");
      setRifornimentoKm("");
      setQuantitaLitri("");
      setImportoEuro("");
      setKmArrivo("");
      setJpgFile(null);

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
            style={btn}
            className="inline-flex min-h-[44px] items-center justify-center px-5 text-sm font-bold shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30"
          >
            ← Torna alla Home
          </Link>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6f82]">
              Gestione veicoli
            </p>
            <p className="text-sm font-bold text-[#17324d]">
              Sistema di sorveglianza
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
            Sorveglianza – Invio Report
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#43576b]">
            Compila i dati del veicolo, allega la documentazione richiesta
            e invia il report al sistema.
          </p>
        </div>

        {/* CARD PRINCIPALE */}
        <section
          aria-labelledby="dati-veicolo-title"
          className="overflow-hidden border border-[#d9e1e8] bg-white shadow-sm"
        >

          {/* SEZIONE DOCUMENTAZIONE */}
          <div className="border-b border-[#d9e1e8] p-5 sm:p-7">

            <div className="mb-5">
              <h2
                id="documentazione-title"
                className="text-xl font-bold text-[#17324d]"
              >
                Documentazione
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                Compila il report PDF prima di procedere con l'invio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPdfForm(true)}
              className="inline-flex min-h-[48px] w-full items-center justify-center bg-[#0066cc] px-5 py-3 text-base font-bold text-white transition hover:bg-[#004f9e] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 sm:w-auto"
            >
              Compila report PDF
            </button>

            {receiptUrl && (
              <div className="mt-5 border border-[#b7d8c0] bg-[#eef8f1] p-4">

                <p className="mb-2 text-sm font-bold text-[#245b35]">
                  Report inviato correttamente
                </p>

                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center bg-[#247a3b] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1d6330] focus:outline-none focus:ring-4 focus:ring-[#247a3b]/30"
                >
                  Scarica ricevuta PDF
                </a>

              </div>
            )}

          </div>

          {/* DATI VEICOLO */}
          <div className="p-5 sm:p-7">

            <div className="mb-6">
              <h2
                id="dati-veicolo-title"
                className="text-xl font-bold text-[#17324d]"
              >
                Dati del veicolo
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                Inserisci le informazioni relative al mezzo e alla missione.
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
                  onChange={(e) => setDistretto(e.target.value)}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                >
                  <option value="">Seleziona il distretto</option>

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
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                  placeholder="Inserisci il comparto"
                  value={comparto}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();

                    setComparto(value);

                    localStorage.setItem(
                      "ultimoComparto",
                      value
                    );
                  }}
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
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                  placeholder="Inserisci il tipo di veicolo"
                  value={tipoVeicolo}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();

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
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base uppercase text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                  placeholder="Inserisci la targa"
                  value={targa}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();

                    setTarga(value);

                    localStorage.setItem(
                      "ultimaTarga",
                      value
                    );

                    setPdfFormData((prev) => ({
                      ...prev,
                      targa: value,
                    }));
                  }}
                />
              </div>

              {/* KM */}
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
                    className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                    type="number"
                    placeholder="KM partenza"
                    value={kmPartenza}
                    onChange={(e) => {
                      const value = e.target.value;

                      setKmPartenza(value);

                      setPdfFormData((prev) => ({
                        ...prev,
                        kmPartenza: value,
                      }));
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
    className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
    type="number"
    placeholder="KM arrivo"
    value={kmArrivo}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");

      setKmArrivo(value);

      setPdfFormData((prev) => ({
        ...prev,
        kmArrivo: value,
      }));
    }}
    onBlur={() => {
      if (!kmArrivo || !kmPartenza) return;

      const partenza = Number(kmPartenza);
      const arrivo = Number(kmArrivo);

      if (
        !Number.isInteger(partenza) ||
        !Number.isInteger(arrivo)
      ) {
        return;
      }

      // KM arrivo inferiore al KM partenza
      if (arrivo < partenza) {
        alert(
          `Controlla il chilometraggio.\n\n` +
          `KM partenza: ${partenza}\n` +
          `KM arrivo: ${arrivo}\n\n` +
          `Il KM arrivo non può essere inferiore al KM di partenza.`
        );
        return;
      }

      // ==========================================
      // CONTROLLO CAMBIO NUMERO DI CIFRE
      // ==========================================

      const cifrePartenza = String(partenza).length;
      const cifreArrivo = String(arrivo).length;

      if (cifreArrivo > cifrePartenza) {
        const prossimaSoglia = Math.pow(10, cifrePartenza);

        const kmPerArrivareAllaNuovaCifra =
          prossimaSoglia - partenza;

        // Il passaggio di cifra è possibile,
        // ma se richiede almeno 300 km viene segnalato.
        if (kmPerArrivareAllaNuovaCifra >= 300) {
          alert(
            `Controlla il chilometraggio inserito.\n\n` +
            `KM partenza: ${partenza}\n` +
            `KM arrivo: ${arrivo}\n\n` +
            `Il passaggio al numero di cifre successivo ` +
            `richiederebbe ${kmPerArrivareAllaNuovaCifra} km.\n\n` +
            `Verifica che il valore inserito sia corretto.`
          );
          return;
        }
      }

      // ==========================================
      // CONTROLLO SALTO ANOMALO / ZERO IN PIÙ
      // ==========================================

      if (partenza > 0) {
        const rapporto = arrivo / partenza;

        if (rapporto >= 10) {
          alert(
            `Controlla il chilometraggio inserito.\n\n` +
            `KM partenza: ${partenza}\n` +
            `KM arrivo: ${arrivo}\n\n` +
            `Il salto di chilometraggio risulta anomalo ` +
            `rispetto al valore di partenza.`
          );
        }
      }
    }}
  />
</div>


              </div>

              {/* RIFORNIMENTO */}
              <div>
                <h3 className="mb-3 text-base font-bold text-[#17324d]">
                  Rifornimento
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                  <div>
                    <label
                      htmlFor="rifornimentoKm"
                      className="mb-2 block text-sm font-semibold text-[#43576b]"
                    >
                      Rifornimento a KM
                    </label>

                    <input
                      id="rifornimentoKm"
                      className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                      type="number"
                      placeholder="KM rifornimento"
                      value={rifornimentoKm}
                      onChange={(e) =>
                        setRifornimentoKm(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quantitaLitri"
                      className="mb-2 block text-sm font-semibold text-[#43576b]"
                    >
                      Quantità litri
                    </label>

                    <input
                      id="quantitaLitri"
                      className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                      type="number"
                      placeholder="Litri"
                      value={quantitaLitri}
                      onChange={(e) =>
                        setQuantitaLitri(e.target.value)
                      }
                    />
                  </div>

                  <div>
  <label
    htmlFor="importoeuro"
    className="mb-2 block text-sm font-semibold text-[#43576b]"
  >
    Importo in euro
  </label>

  <input
    id="importoeuro"
    className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
    type="text"
    inputMode="decimal"
    placeholder="Importo €"
    value={importoeuro}
    onChange={(e) => {
      let value = e.target.value;

      // Solo numeri e virgola
      value = value.replace(/[^0-9,]/g, "");

      // Una sola virgola
      const parti = value.split(",");

      if (parti.length > 2) {
        value = parti[0] + "," + parti.slice(1).join("");
      }

      // Massimo 2 decimali
      if (parti.length === 2) {
        value = parti[0] + "," + parti[1].slice(0, 2);
      }

      setImportoEuro(value);
    }}

    onBlur={() => {
      if (!importoeuro) return;

      const importo = Number(importoeuro.replace(",", "."));

      if (!Number.isFinite(importo) || importo <= 0) {
        alert("Controlla l'importo inserito.");
        return;
      }

      // Controllo importo palesemente anomalo
      if (importo >= 1000) {
        alert(
          `Controlla l'importo inserito.\n\nImporto: € ${importoeuro}\n\nL'importo risulta insolitamente elevato. Verifica che non ci siano zeri o cifre aggiuntive.`
        );
      }
    }}
  />
</div>

                </div>
              </div>

              {/* ALLEGATO */}
              <div>
                <label
                  htmlFor="jpgFile"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Documentazione fotografica
                </label>

                <p className="mb-3 text-sm text-[#5c6f82]">
                  Allegare un'immagine se richiesta.
                </p>

                <input
                  id="jpgFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setJpgFile(e.target.files?.[0] || null)
                  }
                  className="block min-h-[48px] w-full border border-[#8a9bab] bg-white p-2 text-sm text-[#17324d] file:mr-4 file:min-h-[36px] file:border-0 file:bg-[#e8eef3] file:px-4 file:font-semibold file:text-[#17324d] hover:file:bg-[#dbe5ed]"
                />
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

        {/* NOTA INFORMATIVA */}
        <div className="mt-5 border border-[#d9e1e8] bg-white p-4 text-sm leading-6 text-[#43576b]">
          <strong className="text-[#17324d]">
            Informazioni:
          </strong>{" "}
          compilare tutti i dati richiesti prima dell'invio.
          I campi obbligatori vengono verificati dal sistema.
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

            {/* CONTENUTO MODAL */}
            <div className="overflow-y-auto p-5 sm:p-6">

              <p className="mb-6 text-sm leading-6 text-[#43576b]">
                Inserisci tutte le informazioni necessarie per
                generare la documentazione del servizio.
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
  onChange={(e) => {
    let newValue = e.target.value;

    // Solo numeri interi per i campi KM
    if (key === "kmPartenza" || key === "kmArrivo") {
      newValue = newValue.replace(/\D/g, "");
    }

    setPdfFormData((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }}
  onBlur={() => {
    // Controllo solo sui KM del PDF
    if (key !== "kmArrivo") return;

    const partenza = Number(pdfFormData.kmPartenza);
    const arrivo = Number(pdfFormData.kmArrivo);

    if (!pdfFormData.kmPartenza || !pdfFormData.kmArrivo) {
      return;
    }

    if (
      !Number.isInteger(partenza) ||
      !Number.isInteger(arrivo)
    ) {
      return;
    }

    // KM arrivo inferiore al KM partenza
    if (arrivo < partenza) {
      alert(
        `Controlla il chilometraggio del PDF.\n\n` +
        `KM partenza: ${partenza}\n` +
        `KM arrivo: ${arrivo}\n\n` +
        `Il KM arrivo non può essere inferiore al KM di partenza.`
      );
      return;
    }

    // ==========================================
    // CONTROLLO CAMBIO NUMERO DI CIFRE
    // ==========================================

    const cifrePartenza = String(partenza).length;
    const cifreArrivo = String(arrivo).length;

    if (cifreArrivo > cifrePartenza) {
      const prossimaSoglia = Math.pow(10, cifrePartenza);

      const kmPerArrivareAllaNuovaCifra =
        prossimaSoglia - partenza;

      if (kmPerArrivareAllaNuovaCifra >= 300) {
        alert(
          `Controlla il chilometraggio del PDF.\n\n` +
          `KM partenza: ${partenza}\n` +
          `KM arrivo: ${arrivo}\n\n` +
          `Il passaggio al numero di cifre successivo ` +
          `richiederebbe ${kmPerArrivareAllaNuovaCifra} km.\n\n` +
          `Verifica che il valore inserito sia corretto.`
        );
        return;
      }
    }

    // ==========================================
    // CONTROLLO SALTO ANOMALO / ZERO IN PIÙ
    // ==========================================

    if (partenza > 0) {
      const rapporto = arrivo / partenza;

      if (rapporto >= 10) {
        alert(
          `Controlla il chilometraggio del PDF.\n\n` +
          `KM partenza: ${partenza}\n` +
          `KM arrivo: ${arrivo}\n\n` +
          `Il salto di chilometraggio risulta anomalo ` +
          `rispetto al valore di partenza.`
        );
      }
    }
  }}
  placeholder={
    key.charAt(0).toUpperCase() +
    key.slice(1)
  }
  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
  type={
    key === "data"
      ? "date"
      : key.includes("km") ||
        key === "benzina" ||
        key === "gasolio"
      ? "number"
      : key.includes("ora")
      ? "time"
      : "text"
  }
/>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* FOOTER MODAL */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#d9e1e8] bg-[#f5f6f7] p-4 sm:flex-row sm:justify-end sm:p-5">

              <button
                type="button"
                className="min-h-[48px] border border-[#6c7a88] bg-white px-5 py-3 text-base font-bold text-[#17324d] transition hover:bg-[#e8eef3] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 sm:min-w-[130px]"
                onClick={() => setShowPdfForm(false)}
              >
                Annulla
              </button>

              <button
                type="button"
                className="min-h-[48px] bg-[#247a3b] px-5 py-3 text-base font-bold text-white transition hover:bg-[#1d6330] focus:outline-none focus:ring-4 focus:ring-[#247a3b]/30 sm:min-w-[130px]"
                onClick={() => {
                  if (!validatePdfForm()) return;
                  setShowPdfForm(false);
                }}
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

const btn = {
  padding: "1rem 2rem",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: 700,
  cursor: "pointer",
};