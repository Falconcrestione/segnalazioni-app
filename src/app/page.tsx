"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ import Image di Next.js

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
      {/* LOGO */}
      <Image
        src="/calabriaverde.png" // ✅ path relativo a public/
        alt="Logo Calabria Verde"
        width={150}               // puoi cambiare larghezza
        height={150}              // puoi cambiare altezza
        style={{ marginBottom: "2rem" }}
      />

      <h1 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: 700 ,color:"green"}}>
        GESTIONE AUTOPARCO<br />AZIENDA CALABRIA VERDE<br/>   VEICOLI
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Link href="/sorveglianza">
          <button style={btn}>🚓REPORT SORVEGLIANZA</button>
        </Link>

        <Link href="/forestazione/richiedi">
          <button style={btn}>🌲 SETTORI VARI</button>
        </Link>

         <Link href="/gestione_mezzi">
          <button style={btn}>🚜 RICHIESTA MEZZI MECCANICI</button>
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
