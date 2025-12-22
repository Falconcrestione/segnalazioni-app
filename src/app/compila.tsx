"use client";

import React from "react";
import Link from "next/link";

export default function Compila() {
  return (
    <div style={container}>
      <h2>Compila PDF</h2>

      {/* Embed del PDF */}
      <div style={{ flex: 1, width: "100%" }}>
        <iframe
          src="/report_auto_fillable.pdf"
          style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}
        ></iframe>
      </div>

      {/* Bottone per tornare alla pagina Sorveglianza */}
      <Link href="/sorveglianza">
        <button style={btn}>⬅️ Torna</button>
      </Link>
    </div>
  );
}

// STILI
const container: React.CSSProperties = {
  maxWidth: 800,
  margin: "40px auto",
  padding: 20,
  background: "#fff",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const btn: React.CSSProperties = {
  padding: 12,
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: 10,
};
