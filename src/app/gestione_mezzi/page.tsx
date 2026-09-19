"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f6f7",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#17324d",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #d9e1e8",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <Image
            src="/calabriaverde.png"
            alt="Logo Calabria Verde"
            width={90}
            height={90}
            style={{
              objectFit: "contain",
            }}
          />

          <div>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#5c6f82",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Azienda Calabria Verde
            </p>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#17324d",
              }}
            >
              Gestione Autoparco
            </p>
          </div>
        </div>
      </header>

      {/* CONTENUTO */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "56px 24px 70px",
        }}
      >
        {/* TITOLO */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d9e1e8",
            borderLeft: "5px solid #0066cc",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#0066cc",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Servizi operativi
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.7rem, 4vw, 2.5rem)",
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#17324d",
            }}
          >
            Gestione Autoparco
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#43576b",
            }}
          >
            Azienda Calabria Verde – Mezzi Meccanici
          </p>
        </div>

        {/* SERVIZI */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d9e1e8",
            padding: "30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#17324d",
            }}
          >
            Servizi disponibili
          </h2>

          <p
            style={{
              margin: "0 0 24px",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#5c6f82",
            }}
          >
            Seleziona il servizio che desideri utilizzare.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {/* RICHIESTA MEZZO */}
            <Link
              href="/richiesta-mezzo_meccanico"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={btn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#004f9e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066cc";
                }}
              >
                🚜
                <span>Richiesta mezzo</span>
              </button>
            </Link>

            {/* INVIA REPORT */}
            <Link
              href="/sede_centrale/libera_-mezzo"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={btn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#004f9e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066cc";
                }}
              >
                📄
                <span>Invia report</span>
              </button>
            </Link>

            {/* DASHBOARD */}
            <a
              href="/dashboard1.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={btn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#004f9e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066cc";
                }}
              >
                📊
                <span>Dashboard</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #d9e1e8",
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#5c6f82",
          }}
        >
          Azienda Calabria Verde
        </p>
      </footer>
    </main>
  );
}

const btn = {
  width: "100%",
  minHeight: "58px",
  padding: "14px 20px",
  backgroundColor: "#0066cc",
  color: "#ffffff",
  border: "2px solid #0066cc",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "background-color 0.2s ease",
};
