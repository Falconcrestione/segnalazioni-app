import { NextResponse } from "next/server";
import { db } from "../../lib/firebase"; // percorso corretto
import { collection, addDoc,  getDocs, query, where, updateDoc } from "firebase/firestore";

export async function GET() {
  const veicoli = [
    { targa: "AA001AR", modello: "Fiat Panda 1.2", comparto: "sorveglianza", distretto: 1 },
    { targa: "AA002AW", modello: "Fiat Panda 1.2", comparto: "sorveglianza", distretto: 1 },
     {targa: "AA002AZ", modello: "y10 1.2", comparto: "sorveglianza", distretto: 1},
      {targa: "AA002AB", modello: "renault clio 1.2", comparto: "sorveglianza", distretto: 1},
       {targa: "AA002AC", modello: "renaulr captur 1.2", comparto: "sorveglianza", distretto:2},
        {targa: "AA002AD", modello: "scenic 1.2", comparto: "sorveglianza", distretto: 2},
    { targa: "AB011AE", modello: "Opel Corsa", comparto: "forestazione", distretto: 2 },
     {targa: "AA002AF", modello: "fiesta 1.2", comparto: "sorveglianza", distretto: 3},
      {targa: "AA002AG", modello: "lancia 1.2", comparto: "sorveglianza", distretto: 3},
       {targa: "AA002AH", modello: "ford 1.2", comparto: "sorveglianza", distretto: 3},
        {targa: "AA002AL", modello: "fiat 500 1.2", comparto: "sorveglianza", distretto: 4},
         {targa: "AA002AM", modello: "nissan 1.2", comparto: "sorveglianza", distretto: 4},
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
