"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import MapAIB from "./components/MapAIB";
import { doc, updateDoc } from "firebase/firestore";

export default function DashboardAIB() {
  const [mezzi, setMezzi] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const mezziSnap = await getDocs(
        collection(db, "postazioni_aib")
      );

      const reportsSnap = await getDocs(
        collection(db, "reports_aib")
      );

      setMezzi(
        mezziSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setReports(
        reportsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  const mezziFiltrati = mezzi.filter((m) =>
    `${m.identificativo_squadra}
     ${m.targa}
     ${m.comune}
     ${m.tipoMezzo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totaleLitri = reports.reduce(
    (acc, r) => acc + Number(r.litri || 0),
    0
  );

  const totaleEuro = reports.reduce(
    (acc, r) => acc + Number(r.importo || 0),
    0
  );
  const totaleKm = reports.reduce(
  (acc, r) => acc + Number(r.km || 0),
  0
);
async function sostituisciMezzo(id: string) {
  const targa = prompt("Nuova targa mezzo sostitutivo");
  const tipoMezzo = prompt("Tipo mezzo (Pick-up / Autobotte)");

  if (!targa || !tipoMezzo) return;

  await updateDoc(doc(db, "postazioni_aib", id), {
    mezzo_attivo: {
      targa,
      tipoMezzo,
    },
  });

  await loadData();
}

  return (
    <div
      style={{
        padding: 20,
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: 20,
          color: "#0070f3",
        }}
      >
        🚒 Dashboard AIB
      </h1>

      {/* CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <Card
          title="Mezzi Totali"
          value={mezzi.length}
          color="#0070f3"
        />

        <Card
          title="Reports"
          value={reports.length}
          color="#28a745"
        />

        <Card
          title="Totale Litri"
          value={totaleLitri}
          color="#fd7e14"
        />

        <Card
  title="Totale KM"
  value={totaleKm}
  color="#6f42c1"
/>

        <Card
          title="Totale €"
          value={`€ ${totaleEuro.toFixed(2)}`}
          color="#dc3545"
        />
      </div>

      {/* MAPPA */}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 15,
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: 25,
        }}
      >
        <h2>📍 Mappa Mezzi AIB</h2>

        <MapAIB mezzi={mezzi} />
      </div>

      {/* RICERCA */}

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Cerca targa, comune, squadra..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* TABELLA MEZZI */}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 15,
          marginBottom: 25,
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2>🚒 Mezzi AIB</h2>

        <div
          style={{
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#0070f3",
                  color: "#fff",
                  position: "sticky",
                  top: 0,
                }}
              >
                <th style={th}>Identificativo</th>
                <th style={th}>Targa</th>
                <th style={th}>Tipo Mezzo</th>
                <th style={th}>Comparto</th>
                <th style={th}>Distretto</th>
                <th style={th}>Comune</th>
                 <th style={th}>Azioni</th>
              </tr>
            </thead>

            <tbody>
              {mezziFiltrati.map((m) => (
                <tr key={m.id}>
                  <td style={td}>
                    {m.identificativo_squadra}
                  </td>

                 <td style={td}>
  {m.mezzo_attivo?.targa || m.targa}
</td>

<td style={td}>
  {m.mezzo_attivo?.tipoMezzo || m.tipoMezzo}
</td>

                  <td style={td}>
                    {m.comparto}
                  </td>

                  <td style={td}>
                    {m.distretto}
                  </td>

                  <td style={td}>
                    {m.comune}
                  </td>
                  <td style={td}>
        <button
          onClick={() => sostituisciMezzo(m.id)}
          style={{
            background: "orange",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Sostituisci
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

      {/* REPORTS */}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 15,
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2>⛽ Reports Carburante</h2>

        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#28a745",
                  color: "#fff",
                  position: "sticky",
                  top: 0,
                }}
              >
                <th style={th}>Data</th>
                <th style={th}>Squadra</th>
                <th style={th}>Tipo Mezzo</th>
                <th style={th}>Targa</th>
                <th style={th}>Distretto</th>
                <th style={th}>Comune</th>
                <th style={th}>€</th>
<th style={th}>Litri</th>
<th style={th}>KM</th>
<th style={th}>Foto</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={td}>
                    {r.createdAt?.toDate
                      ? r.createdAt
                          .toDate()
                          .toLocaleDateString(
                            "it-IT"
                          )
                      : "-"}
                  </td>

                  <td style={td}>
                    {r.identificativo_squadra}
                  </td>

                  <td style={td}>
                    {r.tipoMezzo}
                  </td>

                  <td style={td}>
                    {r.targa}
                  </td>

                  <td style={td}>
                    {r.distretto}
                  </td>

                  <td style={td}>
                    {r.comune}
                  </td>

                  <td style={td}>
                    € {r.importo}
                  </td>

                <td style={td}>
  {r.litri}
</td>

<td style={td}>
  {r.km}
</td>

<td style={td}>
  {r.fotoUrl ? (
                      <a
                        href={r.fotoUrl}
                        target="_blank"
                      >
                        📷 Apri
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.08)",
        borderTop: `5px solid ${color}`,
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#666",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          marginTop: 10,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const th = {
  padding: "12px",
  textAlign: "left" as const,
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};