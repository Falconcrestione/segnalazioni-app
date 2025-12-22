"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f9",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: 700 }}>
        GESTIONE AUTOPARCO<br />AZIENDA CALABRIA VERDE
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Link href="/sorveglianza">
          <button style={btn}>🚓 SORVEGLIANZA</button>
        </Link>

        <Link href="/forestazione/richiedi">
          <button style={btn}>🌲 FORESTAZIONE</button>
        </Link>

        <a href="/dashboard.html" target="_blank" rel="noopener noreferrer">
          <button style={btn}>📊 DASHBOARD1</button>
        </a>
      </div>
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
