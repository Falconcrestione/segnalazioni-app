import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export async function GET() {
  let aggiornati = 0;

  /* ================== RICHIESTE ================== */
  const richiesteSnap = await getDocs(collection(db, "richieste"));

  for (const r of richiesteSnap.docs) {
    const data = r.data() as {
      distretto?: number;
      veicoloId?: string;
    };

    // già corretto
    if (typeof data.distretto === "number") continue;
    if (!data.veicoloId) continue;

    const vSnap = await getDoc(doc(db, "veicoli", data.veicoloId));
    if (!vSnap.exists()) continue;

    const veicoloData = vSnap.data() as { distretto?: number };
    if (typeof veicoloData.distretto !== "number") continue;

    await updateDoc(r.ref, {
      distretto: veicoloData.distretto,
    });

    aggiornati++;
  }

  /* ================== REPORT ================== */
  const reportsSnap = await getDocs(collection(db, "reports"));

  for (const r of reportsSnap.docs) {
    const data = r.data() as {
      distretto?: number;
      targa?: string;
    };

    if (typeof data.distretto === "number") continue;
    if (!data.targa) continue;

    const vQuery = await getDocs(
      query(collection(db, "veicoli"), where("targa", "==", data.targa))
    );

    if (vQuery.empty) continue;

    const veicoloData = vQuery.docs[0].data() as { distretto?: number };
    if (typeof veicoloData.distretto !== "number") continue;

    await updateDoc(r.ref, {
      distretto: veicoloData.distretto,
    });

    aggiornati++;
  }

  return NextResponse.json({
    ok: true,
    message: `Migrazione completata. Documenti aggiornati: ${aggiornati}`,
  });
}
