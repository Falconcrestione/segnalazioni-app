import Link from "next/link";

export default function Distretto4Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 5</h1>

      <p>Pagina in costruzione.</p>

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