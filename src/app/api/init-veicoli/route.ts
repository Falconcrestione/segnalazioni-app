import { NextResponse } from "next/server";
import { db } from "../../lib/firebase"; // percorso corretto
import { collection, addDoc,  getDocs, query, where, updateDoc } from "firebase/firestore";

export async function GET() {
  const veicoli = [
    { targa: "AA001AA", modello: "Fiat Panda 1.2", comparto: "sorveglianza", distretto: 1 },
    { targa: "AA002AA", modello: "Fiat Panda 1.2", comparto: "sorveglianza", distretto: 1 },
    { targa: "AB011AB", modello: "Opel Corsa", comparto: "forestazione", distretto: 2 },
    // aggiungi qui i veicoli veri
  ];

  const veicoliCollection = collection(db, "veicoli");

  for (const veicolo of veicoli) {
    const { targa, modello, comparto, distretto } = veicolo;

    // Controllo se la targa esiste già
    const q = query(veicoliCollection, where("targa", "==", targa));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const veicoloDoc = snap.docs[0];
      await updateDoc(veicoloDoc.ref, { modello, comparto, distretto });
      console.log(`Veicolo aggiornato: ${targa}`);
    } else {
      await addDoc(veicoliCollection, { targa, modello, comparto, distretto, stato: "libero" });
      console.log(`Veicolo aggiunto: ${targa}`);
    }
  }

  return NextResponse.json({ ok: true, message: "Veicoli elaborati" });
}
