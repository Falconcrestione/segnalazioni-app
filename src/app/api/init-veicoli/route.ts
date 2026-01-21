import { NextResponse } from "next/server";
import { db } from "../../lib/firebase"; // percorso corretto
import { collection, addDoc,  getDocs, query, where, updateDoc } from "firebase/firestore";

export async function GET() {
  const veicoli = [
    {targa: "CS376160", modello: "Fiat Panda 4X4", comparto: "forestazione", distretto: 1 },
    {targa: "GM945SE", modello: "jEEP Renegade", comparto: "forestazione", distretto: 1 },
    {targa: "BG274WG", modello: "PANDA 4X4", comparto: "forestazione", distretto: 1},
    {targa: "GN824LC", modello: "Panda", comparto: "sorveglianza", distretto: 1},
    {targa: "GN937KW", modello: "Panda", comparto: "sorveglianza", distretto:1},
    {targa: "GN946KW", modello: "Panda", comparto: "sorveglianza", distretto: 1},
    {targa: "GN953KW", modello: "Panda", comparto: "sorveglianza", distretto: 1 },
    {targa: "GN956KW", modello: "Panda", comparto: "sorveglianza", distretto: 1},
    {targa: "GN957KW", modello: "Panda", comparto: "sorveglianza", distretto: 1},
    {targa: "BF114ZB", modello: "Panda 4x4", comparto: "forestazione", distretto: 2},
    {targa: "GN987KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN994KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN977KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN974KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN971KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN985KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 2},
    {targa: "GN940KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},
    {targa: "GN944KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},
    {targa: "GN945KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},     {targa: "GN951KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},
    {targa: "GN950KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},
    {targa: "GN932KW", modello: "fiat Panda", comparto: "sorveglianza", distretto: 3},
    {targa: "AAR072", modello: "Trattore", comparto: "forestazione", distretto: 3},
    {targa: "BS531LG", modello: "fiat Panda", comparto: "forestazione", distretto: 3},
    {targa: "GL768WX", modello: "Jeep renegae", comparto: "forestazione", distretto: 4},
    {targa: "BF118ZB", modello: "Fiat Panda 4x4", comparto: "forestazione", distretto: 4}, 
    {targa: "GN968KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4}, 
    {targa: "GN993KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN963KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN980KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN954KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN945KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN958KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GN932KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 4},
    {targa: "GL188ZX", modello: "Seat ibiza 1.0 TGI style", comparto: "forestazione", distretto: 5},
    {targa: "GL995ZJ", modello: "Fiat Tipo", comparto: "forestazione", distretto: 5},
    {targa: "BF113ZB", modello: "Panda 4x4", comparto: "forestazione", distretto: 5},
    {targa: "BF122ZB", modello: "Fiat Panda", comparto: "forestazione", distretto: 5},
    {targa: "GN991KW", modello: "Fiat Panda", comparto: "forestazione", distretto: 5},
    {targa: "ZA762CD", modello: "Land Rover", comparto: "forestazione", distretto: 5},
    {targa: "GN936KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GN935KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GN938KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},     {targa: "GN952KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GN958KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GN988KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GN970KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 6},
    {targa: "GN973KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 6},
    {targa: "ZA479NH", modello: "Land Rover", comparto: "forestazione", distretto: 6},
    {targa: "GM561PH", modello: "Seat biza 1.0 TGI", comparto: "forestazione", distretto: 7},
    {targa: "GN729KX", modello: "Fiat Panda", comparto: "forestazione", distretto: 7},
    {targa: "GN614LC", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN731KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN976KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN975KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN998KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN982KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN997KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN964KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN728KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN729KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN731KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN616LC", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN734KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN965KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN961KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GN943KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 7},
    {targa: "GL165ZX", modello: "Seat Ibiza 1.0 TGI", comparto: "forestazione", distretto: 8},
    {targa: "AP751G", modello: "Trasporter Goldoni", comparto: "forestazione", distretto: 8},
    {targa: "AP755G", modello: "Trattore Landini", comparto: "forestazione", distretto: 8},
    {targa: "ZA368HF", modello: "Land Rover", comparto: "forestazione", distretto: 8}, 
    {targa: "DV423WL", modello: "Ford Transit", comparto: "forestazione", distretto: 8},
    {targa: "GN969KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8},
    {targa: "GN979KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8}, 
    {targa: "GN966KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8}, 
    {targa: "GN981KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8},
    {targa: "GN989KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8},
    {targa: "GN992KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 8},
    {targa: "GT204GG", modello: "HYUNDAI BYON", comparto: "forestazione", distretto: 8},
    {targa: "GT408GG", modello: "HYUNDAI BYON", comparto: "forestazione", distretto: 8},
    {targa: "BF110ZB", modello: "Fiat Panda", comparto: "forestazione", distretto: 8},
    {targa: "BG275WG", modello: "Fiat Panda", comparto: "forestazione", distretto: 8}, 
    {targa: "BM966WT", modello: "Fiat Punto", comparto: "forestazione", distretto: 8},
    {targa: "DG803TM", modello: "Fiat Croma", comparto: "forestazione", distretto: 8}, 
    {targa: "ZA761CD", modello: "Land Rover", comparto: "forestazione", distretto: 9}, 
    {targa: "GN960KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 9},
    {targa: "GN962KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 9},
    {targa: "GN967KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 9},
    {targa: "GN972KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 9},
    {targa: "GN988KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 5},
    {targa: "GT208DH", modello: "HYUNDAI BAYON", comparto: "forestazione", distretto: 10}, 
    {targa: "BF116ZB", modello: "Fiat Panda", comparto: "forestazione", distretto: 10},
    {targa: "ZA788CD", modello: "Land Rover", comparto: "forestazione", distretto: 10},
    {targa: "GN959KW", modello: "Fiat Panda", comparto: "forestazione", distretto: 10},
    {targa: "GN933KW", modello: "Fiat Panda", comparto: "forestazione", distretto: 10},
    {targa: "GN955KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN948KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN949KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN941KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN942KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN947KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "GN995KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 10},
    {targa: "CC917HD", modello: "Fiat Stilo", comparto: "forestazione", distretto: 10},
    {targa: "ZA789CD", modello: "Land Rover", comparto: "forestazione", distretto: 11},
    {targa: "BF124ZB", modello: "Fiat Panda 4x4", comparto: "forestazione", distretto: 11},
    {targa: "GN939KW", modello: "Fiat Panda", comparto: "forestazione", distretto: 11},
    {targa: "GN733KX", modello: "Fiat Panda", comparto: "forestazione", distretto: 11},
     {targa: "GN996KW", modello: "Fiat Panda", comparto: "forestazione", distretto: 11},
      {targa: "GL881TR", modello: "Jeep Renegade", comparto: "forestazione", distretto: 11},
       {targa: "GN978KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 11},
        {targa: "GN990KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 11},
         {targa: "GN683KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 11},
          {targa: "GN984KW", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 11},
           {targa: "GN730KX", modello: "Fiat Panda", comparto: "sorveglianza", distretto: 11},

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
