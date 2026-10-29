"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Rifornimento = {
  data?: string;
  litri?: number;
  euro?: number;
  ricevuta?: {
    nome?: string;
    url?: string;
    tipo?: string;
  } | null;
};

type Rendicontazione = {
  id: string;
  richiestaId?: string;
  veicoloId?: string;
  veicoloTarga?: string;
  identificativo?: string;
  tipoMezzo?: string;
  distretto?: string | number;
  comune?: string;
  sitoIntervento?: string;
  rifornimenti?: Rifornimento[];
  totaleLitri?: number;
  totaleEuro?: number;
  note?: string;
  stato?: string;
  createdAt?: any;
};

function dataLocale(value: any): string {
  if (!value) return "-";

  try {
    const d =
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value);

    return Number.isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("it-IT");
  } catch {
    return "-";
  }
}

export default function VisualizzaRendicontazioniPage() {
  const [dati, setDati] = useState<Rendicontazione[]>([]);
  const [distretto, setDistretto] = useState("tutti");
  const [mese, setMese] = useState("");
  const [ricerca, setRicerca] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [password, setPassword] = useState("");
const [accessoConsentito, setAccessoConsentito] = useState(false);
const PASSWORD_PREIMPOSTATA = "CV2026";

  useEffect(() => {
    const stop = onSnapshot(
      query(
        collection(db, "rendicontazioniMezziMeccanici"),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        setDati(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Rendicontazione, "id">),
          }))
        );
      },
      (err) => {
        setMessaggio(
          `Errore caricamento rendicontazioni: ${err.message}`
        );
      }
    );

    return () => stop();
  }, []);

  const filtrati = useMemo(() => {
    const q = ricerca.trim().toLowerCase();

    return dati.filter((d) => {
      if (
        distretto !== "tutti" &&
        String(d.distretto) !== distretto
      ) {
        return false;
      }

      if (mese) {
        const data = d.createdAt?.toDate
          ? d.createdAt.toDate()
          : d.createdAt
            ? new Date(d.createdAt)
            : null;

        if (
          !data ||
          `${data.getFullYear()}-${String(
            data.getMonth() + 1
          ).padStart(2, "0")}` !== mese
        ) {
          return false;
        }
      }

      if (
        q &&
        ![
          d.identificativo,
          d.veicoloTarga,
          d.tipoMezzo,
          d.comune,
          d.sitoIntervento,
          d.richiestaId,
        ].some((v) => String(v || "").toLowerCase().includes(q))
      ) {
        return false;
      }

      return true;
    });
  }, [dati, distretto, mese, ricerca]);

  const totaleEuro = filtrati.reduce(
    (tot, d) =>
      tot +
      (Number(d.totaleEuro) ||
        (d.rifornimenti || []).reduce(
          (sum, r) => sum + (Number(r.euro) || 0),
          0
        )),
    0
  );

  const totaleLitri = filtrati.reduce(
    (tot, d) =>
      tot +
      (Number(d.totaleLitri) ||
        (d.rifornimenti || []).reduce(
          (sum, r) => sum + (Number(r.litri) || 0),
          0
        )),
    0
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    boxSizing: "border-box",
    background: "#fff",
    color: "#0f172a",
  };

  const verificaPassword = () => {
  if (password === PASSWORD_PREIMPOSTATA) {
    setAccessoConsentito(true);
    setPassword("");
  } else {
    alert("Password non corretta");
  }
};

  if (!accessoConsentito) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #e8f5e9 0%, #f8fafc 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "36px 30px",
            boxSizing: "border-box",
            borderRadius: 18,
            background: "#ffffff",
            borderTop: "5px solid #167443",
            boxShadow: "0 12px 35px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🌿</div>
            <h1 style={{ margin: 0, color: "#166534", fontSize: 25 }}>
              Calabria Verde
            </h1>
            <p style={{ margin: "9px 0 0", color: "#64748b", fontSize: 14 }}>
              Rendicontazione mezzi meccanici
            </p>
          </div>

          <label
            htmlFor="passwordAccesso"
            style={{
              display: "block",
              marginBottom: 8,
              color: "#334155",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Password di accesso
          </label>

          <input
            id="passwordAccesso"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") verificaPassword();
            }}
            placeholder="Inserisci la password"
            autoComplete="current-password"
            style={{
              display: "block",
              width: "100%",
              padding: "13px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: 9,
              boxSizing: "border-box",
              fontSize: 16,
              outlineColor: "#167443",
            }}
          />

          <button
            type="button"
            onClick={verificaPassword}
            style={{
              width: "100%",
              marginTop: 18,
              padding: 13,
              border: "none",
              borderRadius: 9,
              background: "#167443",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ACCEDI
          </button>

          <p
            style={{
              margin: "22px 0 0",
              color: "#94a3b8",
              textAlign: "center",
              fontSize: 12,
            }}
          >
            Area riservata
          </p>
        </section>
      </main>
    );
  }

  return (
    <main

      style={{
        maxWidth: 1250,
        margin: "0 auto",
        padding: 24,
        color: "#172033",
      }}
    >
      <a
        href="/"
        style={{ color: "#075985", textDecoration: "none" }}
      >
        
      </a>

      <h1>Visualizzazione rendicontazioni – Mezzi meccanici</h1>

      <p style={{ color: "#475569" }}>
        Consulta le spese inviate, filtrando per distretto, mese,
        mezzo o richiesta di lavoro.
      </p>

      {messaggio && (
        <div
          role="alert"
          style={{
            background: "#fee2e2",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {messaggio}
        </div>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 12,
          padding: 16,
          border: "1px solid #dbe3ec",
          borderRadius: 12,
          background: "#f8fafc",
          marginBottom: 18,
        }}
      >
        <label>
          Distretto
          <select
            value={distretto}
            onChange={(e) => setDistretto(e.target.value)}
            style={inputStyle}
          >
            <option value="tutti">Tutti i distretti</option>

            {[
              "1", "2", "3", "4", "5", "6",
              "7", "8", "9", "10", "11", "sede_centrale",
            ].map((d) => (
              <option key={d} value={d}>
                {d === "sede_centrale"
                  ? "Sede Centrale"
                  : `Distretto ${d}`}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mese di invio
          <input
            type="month"
            value={mese}
            onChange={(e) => setMese(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          Cerca mezzo / lavoro
          <input
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            placeholder="Identificativo, comune, ID richiesta…"
            style={inputStyle}
          />
        </label>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: "#e0f2fe",
          }}
        >
          <div>Rendicontazioni</div>
          <strong style={{ fontSize: 26 }}>
            {filtrati.length}
          </strong>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: "#dcfce7",
          }}
        >
          <div>Totale spese</div>
          <strong style={{ fontSize: 26 }}>
            {totaleEuro.toLocaleString("it-IT", {
              style: "currency",
              currency: "EUR",
            })}
          </strong>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: "#fef3c7",
          }}
        >
          <div>Totale carburante</div>
          <strong style={{ fontSize: 26 }}>
            {totaleLitri.toLocaleString("it-IT", {
              maximumFractionDigits: 2,
            })}{" "}
            L
          </strong>
        </div>
      </section>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #dbe3ec",
          borderRadius: 10,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#075985",
                color: "#fff",
                textAlign: "left",
              }}
            >
              {[
                "Data invio",
                "Distretto",
                "Mezzo",
                "Comune / sito",
                "ID lavoro",
                "Litri",
                "Totale €",
                "Ricevute",
                "Note",
              ].map((t) => (
                <th
                  key={t}
                  style={{
                    padding: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtrati.map((d) => {
              const ricevute = (d.rifornimenti || []).filter(
                (r) => r.ricevuta?.url
              );

              const litri =
                Number(d.totaleLitri) ||
                (d.rifornimenti || []).reduce(
                  (sum, r) => sum + (Number(r.litri) || 0),
                  0
                );

              const euro =
                Number(d.totaleEuro) ||
                (d.rifornimenti || []).reduce(
                  (sum, r) => sum + (Number(r.euro) || 0),
                  0
                );

              return (
                <tr
                  key={d.id}
                  style={{ borderTop: "1px solid #e2e8f0" }}
                >
                  <td
                    style={{
                      padding: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dataLocale(d.createdAt)}
                  </td>

                  <td style={{ padding: 10 }}>
                    {d.distretto === "sede_centrale"
                      ? "Sede Centrale"
                      : d.distretto ?? "-"}
                  </td>

                  <td style={{ padding: 10 }}>
                    <strong>
                      {d.identificativo || d.veicoloTarga || "-"}
                    </strong>
                    <br />
                    <small>{d.tipoMezzo || ""}</small>
                  </td>

                  <td style={{ padding: 10 }}>
                    {d.comune || d.sitoIntervento || "-"}
                  </td>

                  <td style={{ padding: 10 }}>
                    <code>{d.richiestaId || "-"}</code>
                  </td>

                  <td style={{ padding: 10 }}>
                    {litri.toLocaleString("it-IT", {
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td
                    style={{
                      padding: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {euro.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>

                  <td style={{ padding: 10 }}>
                    {ricevute.length
                      ? ricevute.map((r, i) => (
                          <span
                            key={`${r.ricevuta?.url}-${i}`}
                          >
                            <a
                              href={r.ricevuta!.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {r.ricevuta!.tipo?.includes("pdf")
                                ? "PDF"
                                : "Apri"}
                            </a>
                            {i < ricevute.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "-"}
                  </td>

                  <td style={{ padding: 10 }}>
                    {d.note || "-"}
                  </td>
                </tr>
              );
            })}

            {!filtrati.length && (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: 20,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  Nessuna rendicontazione trovata con i filtri
                  selezionati.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#64748b", fontSize: 13, marginTop: 12 }}>
        Raccolta Firestore utilizzata:{" "}
        <code>rendicontazioniMezziMeccanici</code>
      </p>
    </main>
  );
}