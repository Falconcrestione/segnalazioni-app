import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function GET() {
  const veicoli = [
    ["AA001AA", "Fiat Panda 1.2"], ["AA002AA", "Fiat Panda 1.2"],
    ["AA003AA", "Fiat Panda 4x4"], ["AA004AA", "Fiat 500L"],
    ["AA005AA", "Fiat Tipo SW"], ["AA006AA", "Fiat Tipo Berlina"],
    ["AA007AA", "Fiat Doblo"], ["AA008AA", "Fiat Doblo Cargo"],
    ["AA009AA", "Fiat Fiorino"], ["AA010AA", "Fiat Qubo"],

    ["AB011AB", "Opel Corsa"], ["AB012AB", "Opel Astra"],
    ["AB013AB", "Opel Crossland"], ["AB014AB", "Opel Mokka"],
    ["AB015AB", "Opel Combo"], ["AB016AB", "Opel Vivaro"],
    ["AB017AB", "Ford Fiesta"], ["AB018AB", "Ford Focus"],
    ["AB019AB", "Ford Transit"], ["AB020AB", "Ford Kuga"],

    ["AC021AC", "Renault Clio"], ["AC022AC", "Renault Captur"],
    ["AC023AC", "Renault Megane"], ["AC024AC", "Renault Scenic"],
    ["AC025AC", "Renault Kangoo"], ["AC026AC", "Renault Trafic"],
    ["AC027AC", "Peugeot 208"], ["AC028AC", "Peugeot 308"],
    ["AC029AC", "Peugeot Rifter"], ["AC030AC", "Peugeot Partner"],

    ["AD031AD", "Volkswagen Polo"], ["AD032AD", "Volkswagen Golf"],
    ["AD033AD", "Volkswagen Tiguan"], ["AD034AD", "Volkswagen Caddy"],
    ["AD035AD", "Volkswagen Transporter"], ["AD036AD", "Skoda Fabia"],
    ["AD037AD", "Skoda Octavia"], ["AD038AD", "Toyota Yaris"],
    ["AD039AD", "Toyota Auris"], ["AD040AD", "Toyota Corolla"],

    ["AE041AE", "Jeep Renegade"], ["AE042AE", "Suzuki Ignis"],
    ["AE043AE", "Suzuki Jimny"], ["AE044AE", "Nissan Qashqai"],
    ["AE045AE", "Nissan Juke"], ["AE046AE", "Hyundai i20"],
    ["AE047AE", "Hyundai i30"], ["AE048AE", "Kia Picanto"],
    ["AE049AE", "Kia Sportage"], ["AE050AE", "Citroën C3"]
  ];

  for (const [targa, modello] of veicoli) {
    await addDoc(collection(db, "veicoli"), {
      targa,
      modello,
      stato: "libero"
    });
  }

  return NextResponse.json({ ok: true });
}
