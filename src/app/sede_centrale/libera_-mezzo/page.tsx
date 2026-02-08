"use client";

import { useState, useEffect } from "react";
import { db, storage } from "../../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Richiesta {
  id: string;
  distretto: number;
  sitoIntervento: string;
  tipoMezzo: string;
  identificativo: string;
  pdf?: string;
  veicoloId?: string;
  status: string;
}

export default function LiberaMezzo() {
  const [richiestaId, setRichiestaId] = useState<string>("");
  const [richiesta, setRichiesta] = useState<Richiesta | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // Nuovi campi
  const [gasolioLitri, setGasolioLitri] = useState<number | "">("");
  const [superficieMq, setSuperficieMq] = useState<number | "">("");
  const [operatore, setOperatore] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!richiestaId) return;
    const loadRichiesta = async () => {
      const snap = await getDoc(doc(db, "richiestemezzi", richiestaId));
      if (!snap.exists()) return;
      const data = snap.data() as Omit<Richiesta, "id">;
      setRichiesta({ id: snap.id, ...data });
    };
    loadRichiesta();
  }, [richiestaId]);

  const submitReport = async () => {
    if (!richiesta || !excelFile) {
      alert("Seleziona una richiesta e carica Excel");
      return;
    }
    try {
      const excelRef = ref(storage, `reportsExcel/${Date.now()}_${excelFile.name}`);
      await uploadBytes(excelRef, excelFile);
      const excelUrl = await getDownloadURL(excelRef);

      await addDoc(collection(db, "reportmezzi"), {
        createdAt: Timestamp.now(),
        distretto: richiesta.distretto,
        sitoIntervento: richiesta.sitoIntervento,
        tipoMezzo: richiesta.tipoMezzo,
        identificativo: richiesta.identificativo,
        pdf: richiesta.pdf || "",
        excel: excelUrl,
        gasolioLitri: gasolioLitri || 0,
        superficieMq: superficieMq || 0,
        operatore: operatore || "",
        note: note || ""
      });

      if (richiesta.veicoloId) {
        await updateDoc(doc(db, "mezziMeccanici", richiesta.veicoloId), {
          stato: "libero"
        });
      }

      await updateDoc(doc(db, "richiestemezzi", richiesta.id), {
        status: "completata"
      });

      alert("✅ Report inviato e mezzo liberato!");
      setExcelFile(null);
      setRichiesta(null);
      setRichiestaId("");
      setGasolioLitri("");
      setSuperficieMq("");
      setOperatore("");
      setNote("");
    } catch (err) {
      console.error(err);
      alert("❌ Errore invio report");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        📄 Compila Report Mezzo
      </h2>

      {/* Select Richiesta */}
      <RichiesteSelect setRichiestaId={setRichiestaId} />

      {richiesta && (
        <>
          {/* Info richiesta */}
          <div className="grid grid-cols-1 gap-4">
            <Field label="Distretto" value={String(richiesta.distretto)} />
            <Field label="Sito intervento" value={richiesta.sitoIntervento} />
            <Field label="Tipo mezzo" value={richiesta.tipoMezzo} />
            <Field label="Identificativo mezzo" value={richiesta.identificativo} />
          </div>

          {/* Nuovi campi editabili */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Field label="Gasolio (litri)" value={gasolioLitri} setValue={setGasolioLitri} type="number" />
            <Field label="Superficie lavoro (m²)" value={superficieMq} setValue={setSuperficieMq} type="number" />
            <Field label="Operatore" value={operatore} setValue={setOperatore} />
            <Field label="Note" value={note} setValue={setNote} />
          </div>

          {richiesta.pdf && (
            <div className="mt-4 text-sm text-gray-700">
              📄 PDF richiesta:{" "}
              <a
                href={richiesta.pdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Apri PDF
              </a>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carica file Excel
            </label>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-100 file:text-blue-700
                         hover:file:bg-blue-200"
            />
          </div>

          <button
            onClick={submitReport}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg
                       hover:bg-blue-700 transition"
          >
            🚀 Invia Report & Libera Mezzo
          </button>
        </>
      )}
    </div>
  );
}

// Componente di supporto
function Field({
  label,
  value,
  setValue,
  type = "text"
}: {
  label: string;
  value: any;
  setValue?: (val: any) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={setValue ? (e) => setValue(type === "number" ? Number(e.target.value) : e.target.value) : undefined}
        readOnly={!setValue}
        className="mt-1 p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
      />
    </div>
  );
}

function RichiesteSelect({ setRichiestaId }: { setRichiestaId: (id: string) => void }) {
  const [approvate, setApprovate] = useState<Richiesta[]>([]);

  useEffect(() => {
    const loadApprovate = async () => {
      const q = query(collection(db, "richiestemezzi"), where("status", "==", "approvata"));
      const snap = await getDocs(q);
      const dati: Richiesta[] = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data() as Omit<Richiesta, "id">;
        return { id: d.id, ...data };
      });
      setApprovate(dati);
    };
    loadApprovate();
  }, []);

  return (
    <select
      onChange={(e) => setRichiestaId(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none"
      defaultValue=""
    >
      <option value="" disabled>
        -- Seleziona richiesta approvata --
      </option>
      {approvate.map((r) => (
        <option key={r.id} value={r.id}>
          {r.identificativo} — {r.tipoMezzo} (Distretto {r.distretto})
        </option>
      ))}
    </select>
  );
}
