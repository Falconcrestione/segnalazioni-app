import { NextResponse } from "next/server";
import { db } from "../../lib/firebase"; // percorso corretto
import { collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";

export async function GET() {
  const mezziMeccanici = [
    { identificativo: "ESC-01", tipoMezzo: "Escavatore", comparto: "forestazione", distretto: 1 },
    { identificativo: "TR-01", tipoMezzo: "Trattore", comparto: "forestazione", distretto: 1 },
    { identificativo: "MOT-01", tipoMezzo: "Motosega", comparto: "sorveglianza", distretto: 2 },
    { identificativo: "ESC-02", tipoMezzo: "Escavatore", comparto: "forestazione", distretto: 2 },
    { identificativo: "TR-02", tipoMezzo: "Trattore", comparto: "forestazione", distretto: 3 },
    { identificativo: "MOT-02", tipoMezzo: "Motosega", comparto: "sorveglianza", distretto: 3 },
    { identificativo: "ESC-03", tipoMezzo: "Escavatore", comparto: "forestazione", distretto: 4 },
    { identificativo: "TR-03", tipoMezzo: "Trattore", comparto: "forestazione", distretto: 4 },
    { identificativo: "MOT-03", tipoMezzo: "Motosega", comparto: "sorveglianza", distretto: 5 },
    { identificativo: "ESC-04", tipoMezzo: "Escavatore", comparto: "forestazione", distretto: 5 },
    // aggiungi altri mezzi veri se vuoi
  ];

  const mezziCollection = collection(db, "mezziMeccanici");

  for (const mezzo of mezziMeccanici) {
    const { identificativo, tipoMezzo, comparto, distretto } = mezzo;

    // Controllo se l'identificativo esiste già
    const q = query(mezziCollection, where("identificativo", "==", identificativo));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const mezzoDoc = snap.docs[0];
      await updateDoc(mezzoDoc.ref, { tipoMezzo, comparto, distretto });
      console.log(`Mezzo aggiornato: ${identificativo}`);
    } else {
      await addDoc(mezziCollection, { identificativo, tipoMezzo, comparto, distretto, stato: "libero" });
      console.log(`Mezzo aggiunto: ${identificativo}`);
    }
  }

  return NextResponse.json({ ok: true, message: "Mezzi meccanici elaborati" });
}
