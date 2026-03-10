"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [openDistretti, setOpenDistretti] = useState(false);

  function goToTracking() {
    const password = prompt("Inserisci password Tracking");

    if (password === "tracking123") {
      router.push("/tracking1");
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

      <h1
        style={{
          marginBottom: "2rem",
          fontSize: "2rem",
          fontWeight: 700,
          color: "green",
          textAlign: "center",
        }}
      >
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

       

        {/* NUOVO BOTTONE DISTRETTI */}
        <button
          style={btn}
          onClick={() => setOpenDistretti(!openDistretti)}
        >
          🗂️ LISTA OFFICINE CONVENZIONATE
        </button>

        {openDistretti && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                style={distrettoBtn}
                onClick={() => router.push(`/distretti/${i + 1}`)}
              >
                Distretto {i + 1}
              </button>
            ))}
          </div>
        )}
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
  minWidth: "280px",
};

const distrettoBtn = {
  padding: "0.7rem 1.5rem",
  backgroundColor: "#ffffff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  minWidth: "280px",
};