"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RichiediVeicolo() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comparto, setComparto] = useState("");
  const [dataMissione, setDataMissione] = useState("");
  const [missione, setMissione] = useState("");
  const [distretto, setDistretto] = useState("");

  // Carica dati salvati al primo avvio
  useEffect(() => {
    const nomeSalvato = localStorage.getItem("nome");
    const emailSalvata = localStorage.getItem("email");
    const compartoSalvato = localStorage.getItem("comparto");
    const distrettoSalvato = localStorage.getItem("distretto");

    if (nomeSalvato) setNome(nomeSalvato);
    if (emailSalvata) setEmail(emailSalvata);
    if (compartoSalvato) setComparto(compartoSalvato);
    if (distrettoSalvato) setDistretto(distrettoSalvato);
  }, []);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("comparto", comparto);
  }, [comparto]);

  useEffect(() => {
    localStorage.setItem("distretto", distretto);
  }, [distretto]);

  const distretti = Array.from(
    { length: 11 },
    (_, i) => `Distretto ${i + 1}`
  );

  const send = async () => {
    if (
      !nome ||
      !email ||
      !comparto ||
      !dataMissione ||
      !missione ||
      !distretto
    ) {
      return alert("Compila tutti i campi");
    }

    if (!navigator.geolocation) {
      return alert("Geolocalizzazione non supportata");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const numeroDistretto = Number(
          distretto.replace("Distretto ", "")
        );

        await addDoc(collection(db, "richieste"), {
          nome,
          email,
          comparto,
          dataMissione: Timestamp.fromDate(
            new Date(dataMissione)
          ),
          missione,
          distretto: numeroDistretto,
          status: "in attesa",
          createdAt: Timestamp.now(),
          latitudine: lat,
          longitudine: lng,
        });

        alert("Richiesta inviata correttamente");

        // svuota solo i campi che cambiano ad ogni richiesta
        setDataMissione("");
        setMissione("");
      },
      () => alert("Impossibile ottenere la posizione")
    );
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
              Richiesta mezzo
            </p>
          </div>

        </div>
      </header>

      {/* CONTENUTO */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">

        {/* TITOLO */}
        <div className="mb-8 border-l-4 border-[#0066cc] bg-white px-5 py-5 shadow-sm sm:px-7">

          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#0066cc]">
            Servizio operativo
          </p>

          <h1 className="text-2xl font-bold leading-tight text-[#17324d] sm:text-3xl">
            Richiesta Veicolo
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#43576b]">
            Inserisci i dati della richiesta e indica la data e
            la missione per la quale è necessario il veicolo.
          </p>

        </div>

        {/* FORM */}
        <section
          aria-labelledby="richiesta-veicolo-title"
          className="overflow-hidden border border-[#d9e1e8] bg-white shadow-sm"
        >

          <div className="p-5 sm:p-7">

            <div className="mb-6">
              <h2
                id="richiesta-veicolo-title"
                className="text-xl font-bold text-[#17324d]"
              >
                Dati della richiesta
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#5c6f82]">
                I dati anagrafici e organizzativi già inseriti
                vengono ricordati automaticamente dal dispositivo.
              </p>
            </div>

            <div className="space-y-5">

              {/* NOME */}
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Nome e Cognome
                </label>

                <input
                  id="nome"
                  type="text"
                  placeholder="Inserisci nome e cognome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Inserisci l'indirizzo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
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
                  onChange={(e) => setComparto(e.target.value)}
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* DATA */}
              <div>
                <label
                  htmlFor="dataMissione"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Data della missione
                </label>

                <input
                  id="dataMissione"
                  type="date"
                  value={dataMissione}
                  onChange={(e) =>
                    setDataMissione(e.target.value)
                  }
                  className="min-h-[48px] w-full border border-[#8a9bab] bg-white px-3 py-3 text-base text-[#17324d] outline-none transition focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

              {/* MISSIONE */}
              <div>
                <label
                  htmlFor="missione"
                  className="mb-2 block text-sm font-bold text-[#17324d]"
                >
                  Missione
                </label>

                <textarea
                  id="missione"
                  placeholder="Descrivi brevemente la missione"
                  value={missione}
                  onChange={(e) => setMissione(e.target.value)}
                  rows={4}
                  className="w-full resize-y border border-[#8a9bab] bg-white px-3 py-3 text-base leading-6 text-[#17324d] outline-none transition placeholder:text-[#66798b] focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/20"
                />
              </div>

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

                  {distretti.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* AZIONI */}
              <div className="border-t border-[#d9e1e8] pt-6">

                <button
                  type="button"
                  onClick={send}
                  className="min-h-[52px] w-full bg-[#0066cc] px-6 py-3 text-base font-bold text-white transition hover:bg-[#004f9e] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 active:translate-y-px"
                >
                  Invia richiesta veicolo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/forestazione1/libera_veicolo"
                    )
                  }
                  className="mt-4 min-h-[52px] w-full bg-[#247a3b] px-6 py-3 text-base font-bold text-white transition hover:bg-[#1d6330] focus:outline-none focus:ring-4 focus:ring-[#247a3b]/30 active:translate-y-px"
                >
                  Invia report / Libera veicolo
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
          nome, email, comparto e distretto vengono salvati
          localmente nel browser per facilitare le richieste
          successive.
        </div>

      </main>

    </div>
  );
}

const container = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

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
