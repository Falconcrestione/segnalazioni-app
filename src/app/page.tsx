"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

import {
  Shield,
  Trees,
  Tractor,
  MapPinned,
  History,
  BarChart3,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [openDistretti, setOpenDistretti] = useState(false);

  function goToTracking() {
    const password = prompt("Inserisci password Rendicontazione");

    if (password === "tracking123") {
      router.push("/tracking1");
    } else {
      alert("Password errata!");
    }
  }

  function goToDashboardAIB() {
    const password = prompt("Inserisci password Dashboard AIB");

    if (password === "AiB2026@") {
      router.push("/dashboard");
    } else {
      alert("Password errata!");
    }
  }

  const apriStoricoSostituzioni = () => {
    const password = prompt("Inserisci la password:");

    if (password !== "CalabriaVerde2026") {
      alert("Password errata");
      return;
    }

    window.open("/storico_sostituzioni.html", "_blank");
  };

  return (
    <main style={page}>
      <div style={container}>

        {/* =========================
            INTESTAZIONE
        ========================= */}

        <header style={header}>

          <div style={logoWrapper}>
            <Image
              src="/calabriaverde.png"
              alt="Logo Azienda Calabria Verde"
              width={120}
              height={120}
              style={logo}
              priority
            />
          </div>

          <div style={institution}>
            AZIENDA CALABRIA VERDE
          </div>

          <h1 style={title}>
            Gestione Autoparco
          </h1>

          <p style={subtitle}>
            Sistema digitale per la gestione dei veicoli aziendali
          </p>

        </header>


        {/* =========================
            LINEA DIVISORIA
        ========================= */}

        <div style={separator} aria-hidden="true" />


        {/* =========================
            CONTENUTO PRINCIPALE
        ========================= */}

        <section aria-labelledby="servizi-title">

          <h2 id="servizi-title" style={sectionTitle}>
            Servizi disponibili
          </h2>

          <p style={sectionDescription}>
            Seleziona il servizio che desideri utilizzare.
          </p>


          <nav
            aria-label="Servizi di gestione dell'autoparco"
            style={buttonsContainer}
          >

            {/* REPORT SORVEGLIANZA */}

            <Link
              href="/sorveglianza"
              style={btnBlue}
              className="agid-service-button"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <Shield size={22} strokeWidth={2} aria-hidden="true" />
                </span>

                <span style={buttonText}>
                  Report sorveglianza
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>


            {/* SETTORI VARI */}

            <Link
              href="/forestazione/richiedi"
              style={btnGreen}
              className="agid-service-button"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <Trees size={22} strokeWidth={2} aria-hidden="true" />
                </span>

                <span style={buttonText}>
                  Settori vari
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>


            {/* RICHIESTA MEZZI */}

            <Link
              href="/gestione_mezzi"
              style={btnOrange}
              className="agid-service-button"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <Tractor size={22} strokeWidth={2} aria-hidden="true" />
                </span>

                <span style={buttonText}>
                  Richiesta mezzi meccanici
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>


            {/* TRACKING GPS */}

            <button
              type="button"
              style={btnPurple}
              className="agid-service-button"
              onClick={goToTracking}
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <MapPinned
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <span style={buttonText}>
                  Rendicontazione
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </button>


            {/* STORICO */}

            <button
              type="button"
              style={btnGray}
              className="agid-service-button"
              onClick={apriStoricoSostituzioni}
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <History
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <span style={buttonText}>
                  Storico sostituzioni veicoli
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </button>


            {/* DASHBOARD 1 */}

            <a
              href="/dashboard.html"
              target="_blank"
              rel="noopener noreferrer"
              style={btnTeal}
              className="agid-service-button"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <BarChart3
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <span style={buttonText}>
                  Dashboard 1
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </a>


            {/* DASHBOARD AIB */}

            <button
              type="button"
              style={btnTeal}
              className="agid-service-button"
              onClick={goToDashboardAIB}
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <LayoutDashboard
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <span style={buttonText}>
                  Dashboard AIB
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </button>


            {/* REPORT SQUADRETTE AIB */}

            <a
              href="/reportsaib"
              target="_blank"
              rel="noopener noreferrer"
              style={btnRed}
              className="agid-service-button"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  <ClipboardList
                    size={22}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <span style={buttonText}>
                  Report squadrette AIB
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </a>


            {/* LISTA OFFICINE */}

            <button
              type="button"
              style={btnBlue}
              className="agid-service-button"
              onClick={() =>
                setOpenDistretti(!openDistretti)
              }
              aria-expanded={openDistretti}
              aria-controls="lista-distretti"
            >
              <span style={buttonContent}>
                <span style={buttonIcon}>
                  🗂️
                </span>

                <span style={buttonText}>
                  Lista officine convenzionate
                </span>

                <ChevronRight
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                  style={{
                    transform: openDistretti
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </span>
            </button>


            {/* =========================
                DISTRETTI
            ========================= */}

            {openDistretti && (
              <div
                id="lista-distretti"
                style={distrettiContainer}
                aria-label="Elenco distretti"
              >

                <p style={districtDescription}>
                  Seleziona il distretto per visualizzare
                  le officine convenzionate.
                </p>

                <div style={districtGrid}>

                  {[...Array(11)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      style={distrettoBtn}
                      className="agid-district-button"
                      onClick={() =>
                        router.push(`/distretti/${i + 1}`)
                      }
                    >
                      Distretto {i + 1}
                    </button>
                  ))}

                </div>

              </div>
            )}

          </nav>

        </section>


        {/* =========================
            PIÈ DI PAGINA
        ========================= */}

        <footer style={footer}>

          <div style={footerLine} />

          <p style={footerText}>
            Azienda Calabria Verde
          </p>

          <p style={footerSubtext}>
            Sistema Gestione Autoparco • 2026
          </p>

        </footer>

      </div>


      {/* =========================
          STILI ACCESSIBILITÀ
      ========================= */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f5f6f7;
        }

        .agid-service-button {
          text-decoration: none;
        }

        .agid-service-button:hover {
          filter: brightness(0.94);
        }

        .agid-service-button:active {
          transform: translateY(1px);
        }

        .agid-service-button:focus-visible,
        .agid-district-button:focus-visible {
          outline: 3px solid #ffcc00;
          outline-offset: 3px;
        }

        .agid-service-button:focus,
        .agid-district-button:focus {
          outline-offset: 3px;
        }

        @media (max-width: 600px) {

          body {
            background: #ffffff;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          html {
            scroll-behavior: auto;
          }

          .agid-service-button,
          .agid-district-button {
            transition: none !important;
          }

        }

      `}</style>

    </main>
  );
}


// ======================================================
// LAYOUT PRINCIPALE
// ======================================================

const page: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "32px 20px",
  background: "#f5f6f7",
  fontFamily:
    '"Titillium Web", "Segoe UI", Arial, sans-serif',
  color: "#1b1b1b",
};


// ======================================================
// CONTENITORE
// ======================================================

const container: CSSProperties = {
  width: "100%",
  maxWidth: "720px",
  background: "#ffffff",
  border: "1px solid #d9d9d9",
  padding: "40px 44px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};


// ======================================================
// HEADER
// ======================================================

const header: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};


const logoWrapper: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "22px",
};


const logo: CSSProperties = {
  objectFit: "contain",
  borderRadius: "4px",
};


const institution: CSSProperties = {
  fontSize: "17px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  color: "#006633",
  textTransform: "uppercase",
  marginBottom: "8px",
};


const title: CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.2,
  fontWeight: 700,
  color: "#1b1b1b",
};


const subtitle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: "17px",
  lineHeight: 1.5,
  color: "#4a4a4a",
  maxWidth: "560px",
};


// ======================================================
// SEPARATORE
// ======================================================

const separator: CSSProperties = {
  width: "100%",
  height: "1px",
  background: "#b3b3b3",
  margin: "32px 0",
};


// ======================================================
// SEZIONE SERVIZI
// ======================================================

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: "25px",
  lineHeight: 1.3,
  fontWeight: 700,
  color: "#1b1b1b",
};


const sectionDescription: CSSProperties = {
  margin: "7px 0 22px",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "#555555",
};


const buttonsContainer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
};


// ======================================================
// CONTENUTO PULSANTI
// ======================================================

const buttonContent: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "32px 1fr 24px",
  alignItems: "center",
  width: "100%",
  gap: "10px",
};


const buttonIcon: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "32px",
  minWidth: "32px",
};


const buttonText: CSSProperties = {
  textAlign: "left",
  lineHeight: 1.3,
};


// ======================================================
// PULSANTI
// ======================================================

const baseButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  minHeight: "58px",
  padding: "12px 18px",
  border: "2px solid transparent",
  borderRadius: "4px",
  color: "#ffffff",
  fontFamily:
    '"Titillium Web", "Segoe UI", Arial, sans-serif',
  fontSize: "17px",
  lineHeight: 1.3,
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left",
  transition:
    "filter 0.15s ease, transform 0.1s ease",
};


// Blu istituzionale
const btnBlue: CSSProperties = {
  ...baseButton,
  background: "#0059b3",
};


// Verde
const btnGreen: CSSProperties = {
  ...baseButton,
  background: "#006633",
};


// Arancione
const btnOrange: CSSProperties = {
  ...baseButton,
  background: "#b34d00",
};


// Viola
const btnPurple: CSSProperties = {
  ...baseButton,
  background: "#5b2c83",
};


// Grigio
const btnGray: CSSProperties = {
  ...baseButton,
  background: "#455a64",
};


// Teal
const btnTeal: CSSProperties = {
  ...baseButton,
  background: "#00695c",
};


// Rosso
const btnRed: CSSProperties = {
  ...baseButton,
  background: "#a62626",
};


// ======================================================
// DISTRETTI
// ======================================================

const distrettiContainer: CSSProperties = {
  width: "100%",
  padding: "20px",
  background: "#f5f6f7",
  border: "1px solid #d9d9d9",
  marginTop: "4px",
};


const districtDescription: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "#444444",
};


const districtGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
};


const distrettoBtn: CSSProperties = {
  minHeight: "48px",
  padding: "10px 12px",
  background: "#ffffff",
  border: "2px solid #0059b3",
  borderRadius: "4px",
  cursor: "pointer",
  fontFamily:
    '"Titillium Web", "Segoe UI", Arial, sans-serif',
  fontSize: "16px",
  fontWeight: 600,
  color: "#0059b3",
  transition:
    "background 0.15s ease, color 0.15s ease",
};


// ======================================================
// FOOTER
// ======================================================

const footer: CSSProperties = {
  marginTop: "36px",
  textAlign: "center",
};


const footerLine: CSSProperties = {
  width: "100%",
  height: "1px",
  background: "#d9d9d9",
  marginBottom: "18px",
};


const footerText: CSSProperties = {
  margin: 0,
  fontSize: "15px",
  fontWeight: 600,
  color: "#333333",
};


const footerSubtext: CSSProperties = {
  margin: "4px 0 0",
  fontSize: "14px",
  color: "#666666",
};

