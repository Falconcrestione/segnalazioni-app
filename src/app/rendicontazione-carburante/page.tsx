"use client";

import { useEffect, useMemo, useState } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Mezzo = {
  id: string;
  identificativo?: string;
  tipoMezzo?: string;
  stato?: string;
  distretto?: string | number;
  comparto?: string;
};

type Richiesta = {
  id: string;
  status?: string;
  veicoloId?: string;
  veicoloTarga?: string;
  identificativo?: string;
  tipoMezzo?: string;
  distretto?: string | number;
  comune?: string;
  sitoIntervento?: string;
  dataMissione?: any;
  assegnatoAt?: any;
  durataPresunta?: number;
  nome?: string;
};

type RigaCarburante = {
  id: number;
  data: string;
  litri: string;
  euro: string;
  ricevuta: File | null;
};

const DISTRETTI = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "sede_centrale",
];

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

export default function RendicontazioneCarburantePage() {
  const [mezzi, setMezzi] = useState<Mezzo[]>([]);
  const [richieste, setRichieste] = useState<Richiesta[]>([]);
  const [richiestaId, setRichiestaId] = useState("");
  const [distretto, setDistretto] = useState("");

  const [righe, setRighe] = useState<RigaCarburante[]>([
    {
      id: 1,
      data: new Date().toISOString().slice(0, 10),
      litri: "",
      euro: "",
      ricevuta: null,
    },
  ]);

  const [note, setNote] = useState("");
  const [caricamento, setCaricamento] = useState(true);
  const [invio, setInvio] = useState(false);
  const [messaggio, setMessaggio] = useState("");

  useEffect(() => {
    // Carica tutti i mezzi, senza filtri per distretto.
    const stopMezzi = onSnapshot(
      collection(db, "mezziMeccanici"),
      (snap) => {
        setMezzi(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Mezzo, "id">),
          }))
        );
      },
      (err) => setMessaggio(`Errore caricamento mezzi: ${err.message}`)
    );

    // Carica le richieste attualmente approvate.
    const stopRichieste = onSnapshot(
      query(
        collection(db, "richiestemezzi"),
        where("status", "==", "approvata")
      ),
      (snap) => {
        setRichieste(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Richiesta, "id">),
          }))
        );
        setCaricamento(false);
      },
      (err) => {
        setMessaggio(`Errore caricamento lavori: ${err.message}`);
        setCaricamento(false);
      }
    );

    return () => {
      stopMezzi();
      stopRichieste();
    };
  }, []);

  const lavoriDisponibili = useMemo(() => {
    return richieste
      .map((r) => {
        const mezzo = mezzi.find((m) => m.id === r.veicoloId);
        return { ...r, mezzo };
      })
      .filter((r) => {
        return Boolean(
          r.veicoloId &&
          r.mezzo &&
          r.mezzo.stato === "occupato"
        );
      });
  }, [richieste, mezzi]);

  const lavoroSelezionato = lavoriDisponibili.find(
    (r) => r.id === richiestaId
  );

  function aggiornaRiga(
    id: number,
    campo: keyof RigaCarburante,
    valore: string | File | null
  ) {
    setRighe((correnti) =>
      correnti.map((r) =>
        r.id === id ? { ...r, [campo]: valore } : r
      )
    );
  }

  function aggiungiRiga() {
    setRighe((correnti) => [
      ...correnti,
      {
        id: Math.max(0, ...correnti.map((r) => r.id)) + 1,
        data: new Date().toISOString().slice(0, 10),
        litri: "",
        euro: "",
        ricevuta: null,
      },
    ]);
  }

  function rimuoviRiga(id: number) {
    setRighe((correnti) =>
      correnti.length > 1
        ? correnti.filter((r) => r.id !== id)
        : correnti
    );
  }

  async function inviaRendicontazione(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMessaggio("");

    if (!lavoroSelezionato) {
      setMessaggio(
        "Seleziona un lavoro assegnato a un mezzo occupato."
      );
      return;
    }

    if (!distretto) {
      setMessaggio(
        "Seleziona il distretto a cui attribuire il lavoro."
      );
      return;
    }

    if (
      righe.length === 0 ||
      righe.some(
        (r) =>
          !r.data ||
          r.litri.trim() === "" ||
          r.euro.trim() === "" ||
          !Number.isFinite(Number(r.litri)) ||
          !Number.isFinite(Number(r.euro)) ||
          Number(r.litri) <= 0 ||
          Number(r.euro) < 0
      )
    ) {
      setMessaggio(
        "Per ogni rifornimento inserisci data, litri e importo in euro. I litri devono essere maggiori di zero."
      );
      return;
    }

    setInvio(true);

    try {
      const rifornimenti = [];

      for (const riga of righe) {
        let ricevuta: null | {
          nome: string;
          url: string;
          tipo: string;
        } = null;

        if (riga.ricevuta) {
          const percorso =
            `rendicontazioniMezziMeccanici/${lavoroSelezionato.id}/` +
            `${Date.now()}_${riga.id}_${riga.ricevuta.name}`;

          const fileRef = ref(storage, percorso);

          await uploadBytes(fileRef, riga.ricevuta);

          ricevuta = {
            nome: riga.ricevuta.name,
            url: await getDownloadURL(fileRef),
            tipo: riga.ricevuta.type,
          };
        }

        rifornimenti.push({
          data: riga.data,
          litri: Number(riga.litri),
          euro: Number(riga.euro),
          ricevuta,
        });
      }

      await addDoc(
        collection(db, "rendicontazioniMezziMeccanici"),
        {
          richiestaId: lavoroSelezionato.id,
          veicoloId: lavoroSelezionato.veicoloId,
          veicoloTarga:
            lavoroSelezionato.veicoloTarga ||
            lavoroSelezionato.mezzo?.identificativo ||
            "",
          identificativo:
            lavoroSelezionato.identificativo ||
            lavoroSelezionato.mezzo?.identificativo ||
            "",
          tipoMezzo:
            lavoroSelezionato.tipoMezzo ||
            lavoroSelezionato.mezzo?.tipoMezzo ||
            "",
          distretto,
          comune: lavoroSelezionato.comune || "",
          sitoIntervento: lavoroSelezionato.sitoIntervento || "",
          dataMissione: lavoroSelezionato.dataMissione || null,
          assegnatoAt: lavoroSelezionato.assegnatoAt || null,
          rifornimenti,
         totaleLitri: rifornimenti.reduce<number>(
  (tot, r) => tot + r.litri,
  0
),
          totaleEuro: rifornimenti.reduce<number>(
  (tot, r) => tot + r.euro,
  0
),
          note: note.trim(),
          stato: "inviata",
          createdAt: Timestamp.now(),
        }
      );

      setRighe([
        {
          id: 1,
          data: new Date().toISOString().slice(0, 10),
          litri: "",
          euro: "",
          ricevuta: null,
        },
      ]);

      setNote("");
      setRichiestaId("");
      setMessaggio("Rendicontazione inviata correttamente.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Errore sconosciuto";

      setMessaggio(`Errore durante l'invio: ${msg}`);
    } finally {
      setInvio(false);
    }
  }

  const stileInput: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    boxSizing: "border-box",
    background: "#fff",
    color: "#0f172a",
  };

  return (
    <main
      className="rendicontazione-page"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 24,
        color: "#172033",
      }}
    >
      <a
        href="/"
        style={{ color: "#075985", textDecoration: "none" }}
      >
        Torna alla pagina iniziale
      </a>

      <h1>Rendicontazione carburante – Mezzi meccanici</h1>

      <p style={{ color: "#475569" }}>
        Le spese sono collegate alla singola richiesta di lavoro.
        L&apos;archivio completo dei mezzi viene caricato senza filtri
        territoriali.
      </p>

      {messaggio && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: 12,
            borderRadius: 8,
            background: messaggio.startsWith("Errore")
              ? "#fee2e2"
              : "#dcfce7",
            margin: "16px 0",
          }}
        >
          {messaggio}
        </div>
      )}

      <section
        style={{
          padding: 18,
          border: "1px solid #dbe3ec",
          borderRadius: 12,
          background: "#f8fafc",
          marginBottom: 22,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Archivio mezzi</h2>
        <p>
          Mezzi caricati da tutti i distretti: <strong>{mezzi.length}</strong>
        </p>
        <p style={{ color: "#475569" }}>
          Per rendicontare vengono proposti i lavori approvati il cui
          mezzo risulta occupato.
        </p>
      </section>

      <form
        onSubmit={inviaRendicontazione}
        style={{ display: "grid", gap: 18 }}
      >
        <section
          style={{
            border: "1px solid #dbe3ec",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <h2 style={{ marginTop: 0 }}>1. Lavoro assegnato</h2>

          <label
            htmlFor="richiesta"
            style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
          >
            Seleziona mezzo / lavoro
          </label>

          <select
            id="richiesta"
            value={richiestaId}
            onChange={(e) => setRichiestaId(e.target.value)}
            required
            style={stileInput}
          >
            <option value="">-- Seleziona un lavoro in corso --</option>

            {lavoriDisponibili.map((r) => (
              <option key={r.id} value={r.id}>
                {r.mezzo?.identificativo ||
                  r.veicoloTarga ||
                  r.identificativo ||
                  r.veicoloId}
                {" — "}
                {r.mezzo?.tipoMezzo || r.tipoMezzo || "Mezzo"}
                {" — Distretto "}
                {r.distretto ?? "-"}
                {" — "}
                {r.comune || r.sitoIntervento || "Lavoro"}
              </option>
            ))}
          </select>

          {caricamento && <p>Caricamento dati…</p>}

          {!caricamento && lavoriDisponibili.length === 0 && (
            <p style={{ color: "#92400e" }}>
              Non risultano lavori approvati associati a mezzi
              con stato occupato.
            </p>
          )}

          {lavoroSelezionato && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#e0f2fe",
                borderRadius: 8,
              }}
            >
              <strong>
                {lavoroSelezionato.mezzo?.tipoMezzo ||
                  lavoroSelezionato.tipoMezzo ||
                  "Mezzo meccanico"}
              </strong>

              <div>
                Identificativo:{" "}
                {lavoroSelezionato.mezzo?.identificativo ||
                  lavoroSelezionato.veicoloTarga ||
                  "-"}
              </div>

              <div>
                Distretto della richiesta:{" "}
                {lavoroSelezionato.distretto ?? "-"}
              </div>

              <div>Comune: {lavoroSelezionato.comune || "-"}</div>

              <div>
                Data missione: {dataLocale(lavoroSelezionato.dataMissione)}
              </div>
            </div>
          )}

          <label
            htmlFor="distretto"
            style={{
              display: "block",
              fontWeight: 600,
              margin: "14px 0 6px",
            }}
          >
            Distretto a cui attribuire la rendicontazione
          </label>

          <select
            id="distretto"
            value={distretto}
            onChange={(e) => setDistretto(e.target.value)}
            required
            style={stileInput}
          >
            <option value="">-- Seleziona distretto --</option>
            {DISTRETTI.map((d) => (
              <option key={d} value={d}>
                {d === "sede_centrale" ? "Sede Centrale" : `Distretto ${d}`}
              </option>
            ))}
          </select>
        </section>

        <section
          style={{
            border: "1px solid #dbe3ec",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <h2 style={{ marginTop: 0 }}>2. Spese carburante</h2>

          {righe.map((r, index) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #dbe3ec",
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <strong>Rifornimento {index + 1}</strong>

                {righe.length > 1 && (
                  <button
                    type="button"
                    onClick={() => rimuoviRiga(r.id)}
                    style={{
                      border: 0,
                      background: "#fee2e2",
                      padding: "7px 10px",
                      borderRadius: 7,
                      cursor: "pointer",
                    }}
                  >
                    Rimuovi
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <label>
                  Data
                  <input
                    type="date"
                    value={r.data}
                    onChange={(e) =>
                      aggiornaRiga(r.id, "data", e.target.value)
                    }
                    required
                    style={stileInput}
                  />
                </label>

                <label>
                  Litri
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={r.litri}
                    onChange={(e) =>
                      aggiornaRiga(r.id, "litri", e.target.value)
                    }
                    required
                    style={stileInput}
                  />
                </label>

                <label>
                  Importo (€)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={r.euro}
                    onChange={(e) =>
                      aggiornaRiga(r.id, "euro", e.target.value)
                    }
                    required
                    style={stileInput}
                  />
                </label>

                <label>
                  Ricevuta (facoltativa)
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      aggiornaRiga(
                        r.id,
                        "ricevuta",
                        e.target.files?.[0] || null
                      )
                    }
                    style={{ ...stileInput, padding: 7 }}
                  />
                </label>
              </div>

              {r.ricevuta && (
                <small>File selezionato: {r.ricevuta.name}</small>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={aggiungiRiga}
            style={{
              padding: "10px 14px",
              border: "1px solid #0284c7",
              borderRadius: 8,
              background: "#fff",
              color: "#0369a1",
              cursor: "pointer",
            }}
          >
            + Aggiungi rifornimento
          </button>

          <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>
            Note
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{ ...stileInput, marginTop: 6 }}
              placeholder="Eventuali note sulla rendicontazione"
            />
          </label>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: "#f1f5f9",
              borderRadius: 8,
            }}
          >
            <strong>Totale inserito: </strong>
            {righe
              .reduce((tot, r) => tot + (Number(r.euro) || 0), 0)
              .toLocaleString("it-IT", {
                style: "currency",
                currency: "EUR",
              })}
            {" · "}
            {righe
              .reduce((tot, r) => tot + (Number(r.litri) || 0), 0)
              .toLocaleString("it-IT", { maximumFractionDigits: 2 })}
            {" L"}
          </div>
        </section>

        <button
          type="submit"
          disabled={invio || caricamento || !lavoroSelezionato}
          style={{
            padding: "13px 18px",
            border: 0,
            borderRadius: 9,
            background: invio ? "#94a3b8" : "#0369a1",
            color: "#fff",
            fontWeight: 700,
            cursor: invio ? "wait" : "pointer",
          }}
        >
          {invio ? "Invio in corso…" : "Invia rendicontazione"}
        </button>
      </form>

      <style jsx global>{`
        .rendicontazione-page {
          font-family: Arial, Helvetica, sans-serif !important;
          color: #17324d !important;
          line-height: 1.5;
          background: #f4f7fb;
          border-radius: 12px;
        }

        .rendicontazione-page h1 {
          color: #17365d;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          line-height: 1.25;
          font-weight: 700;
          margin: 0 0 14px;
          padding-bottom: 18px;
          border-bottom: 3px solid #1769aa;
        }

        .rendicontazione-page h2 {
          color: #17365d;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .rendicontazione-page p {
          line-height: 1.6;
        }

        .rendicontazione-page form > section,
        .rendicontazione-page > section {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 10px !important;
          padding: 24px !important;
          box-shadow: 0 2px 6px rgba(23, 50, 77, 0.05);
        }

        .rendicontazione-page label {
          color: #243b53;
          font-weight: 600;
        }

        .rendicontazione-page input,
        .rendicontazione-page select,
        .rendicontazione-page textarea {
          width: 100%;
          min-height: 44px;
          padding: 10px 12px !important;
          border: 1px solid #829ab1 !important;
          border-radius: 6px !important;
          background: #ffffff !important;
          color: #172b4d !important;
          font: inherit;
          box-sizing: border-box;
        }

        .rendicontazione-page textarea {
          min-height: 90px;
          resize: vertical;
        }

        .rendicontazione-page input:focus-visible,
        .rendicontazione-page select:focus-visible,
        .rendicontazione-page textarea:focus-visible,
        .rendicontazione-page button:focus-visible,
        .rendicontazione-page a:focus-visible {
          outline: 3px solid #ffbf47 !important;
          outline-offset: 3px;
        }

        .rendicontazione-page form > section > div {
          border-radius: 8px;
        }

        .rendicontazione-page button {
          min-height: 44px;
          border-radius: 6px !important;
          font: inherit;
          font-weight: 700;
          transition: background-color 0.15s ease;
        }

        .rendicontazione-page form > button[type="submit"] {
          background: #075a9c !important;
          color: #ffffff !important;
          padding: 14px 20px !important;
          border: 2px solid #075a9c !important;
          box-shadow: 0 2px 4px rgba(23, 50, 77, 0.12);
        }

        .rendicontazione-page form > button[type="submit"]:hover:not(:disabled) {
          background: #064578 !important;
          border-color: #064578 !important;
        }

        .rendicontazione-page button:disabled {
          cursor: not-allowed !important;
          opacity: 0.7;
        }

        .rendicontazione-page button:not(:disabled) {
          cursor: pointer;
        }

        .rendicontazione-page a {
          color: #075a9c;
          text-underline-offset: 3px;
        }

        .rendicontazione-page small {
          display: block;
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 600px) {
          .rendicontazione-page {
            padding: 16px !important;
          }

          .rendicontazione-page form > section,
          .rendicontazione-page > section {
            padding: 16px !important;
          }

          .rendicontazione-page h1 {
            font-size: 1.55rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rendicontazione-page button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
