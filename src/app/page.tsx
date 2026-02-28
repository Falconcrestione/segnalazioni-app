"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function goToTracking() {
    const password = prompt("Inserisci password Tracking");

    if (password === "tracking123") {
      router.push("/tracking");
    } else {
      alert("Password errata!");
    }
  }

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
      <Image
        src="/calabriaverde.png"
        alt="Logo Calabria Verde"
        width={150}
        height={150}
        style={{ marginBottom: "2rem" }}
      />

      <h1 style={{
        marginBottom: "2rem",
        fontSize: "2rem",
        fontWeight: 700,
        color:"green"
      }}>
        GESTIONE AUTOPARCO<br />
        AZIENDA CALABRIA VERDE<br />
        VEICOLI
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <Link href="/sorveglianza">
          <button style={btn}>🚓 REPORT SORVEGLIANZA</button>
        </Link>

        <Link href="/forestazione/richiedi">
          <button style={btn}>🌲 SETTORI VARI</button>
        </Link>

        <Link href="/gestione_mezzi">
          <button style={btn}>🚜 RICHIESTA MEZZI MECCANICI</button>
        </Link>

        <button style={btn} onClick={goToTracking}>
          📍 TRACKING GPS
        </button>

        <a href="/dashboard.html" target="_blank" rel="noopener noreferrer">
          <button style={btn}>📊 DASHBOARD1</button>
        </a>

        <a href="/convenzioni" target="_blank" rel="noopener noreferrer">
          <button style={btn}>📊 LISTA OFFICINE CONVENZIONATE</button>
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