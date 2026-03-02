import Link from "next/link";

export default function Distretto1Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 1 </h1>

      {/* MANUTENZIONE */}
      <h2>MANUTENZIONE (tagliando, rotture parti meccaniche)</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Officina</th>
            <th>Contatti</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>D'aquila Srls  –  CS, Italia, , 87075, TREBISACCE</td>
            <td><a href="tel:0981489665">0981 489665</a></td>
          </tr>
           <tr>
            <td>LONGO SRL Trebisacce –  via dell'Agricoltura, 61,87012, Castrovillari</td>
            <td><a href="tel:0981 51520">0981 51520</a></td>
          </tr>
          <tr>
            <td>PALERMO SNC DI PALERMO D. –  VIA NAZIONALE S.S. 92, 92, 87076, VILLAPIANA SCALO</td>
            <td><a href="tel:0981 59012">0981 59012</a></td>
          </tr>
          
        </tbody>
      </table>

      {/* CARROZZERIA */}
      <h2 style={{ marginTop: "40px" }}>CARROZZERIA</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        
      </table>

      {/* GOMMISTA */}
      <h2 style={{ marginTop: "40px" }}>GOMMISTA</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Officina</th>
            <th>Contatti</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TRICARICO GOMME SNC  –  VIA SELLARO III TRAV P.I.P, 00870, CASTROVILLARI</td>
            <td><a href="tel:0981 491963">0981 491963</a></td>
          </tr>
          <tr>
            <td>DI GAETANI GOMME SRLS  – VIA POLLINO, 91,87012, CASTROVILLARI</td>
            <td><a href="tel:0981 27287">0981 27287</a></td>
          </tr>
          <tr>
            <td>PORPIGLIA DOMENICO – VIA M. CALVOSA, 2, 87012,CASTROVILLARI</td>
            <td><a href="tel:096429186">0964 29186</a></td>
          </tr>
           <tr>
            <td>PALERMO SNC DI PALERMO D. – VIA NAZIONALE S.S. 92, 92, 87076, VILLAPIANA SCALO</td>
            <td><a href="tel :0981 59012">0981 59012</a></td>
          </tr>
        </tbody>
      </table>

      {/* ROTTURA CRISTALLI */}
      <h2 style={{ marginTop: "40px" }}>ROTTURA CRISTALLI</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Centro</th>
            <th>Contatti</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VETROCAR – VIALE DEL LAVORO, 171, 87012, CASTROVILLARI</td>
            <td><a href="tel:0981420099">0981 420099</a></td>
          </tr>
          
        </tbody>
      </table>

      {/* SINISTRI */}
      <h2 style={{ marginTop: "40px", color: "red" }}>
        IN CASO DI SINISTRO / ATTI VANDALICI
      </h2>

      <p>
        <strong>
          Numero Verde: <a href="tel:800965643">800 965643</a>
        </strong>
      </p>

      <ul>
        <li>Collegarsi al sito: nemoo.aldautomotive.it/static/claims_public.html</li>
        <li>Inserire una mail (anche aziendale)</li>
        <li>Indicare targa, data evento e proseguire</li>
        <li>Completare il form con la dinamica del sinistro</li>
        <li>Il sistema invierà mail con codice e resoconto</li>
        <li>In caso di atti vandalici serve denuncia autorità</li>
        <li>In caso di sinistro con controparte serve CID</li>
        <li>In caso di bisogno di auto sostitutiva contattare il numero verde</li>
        <li>In caso di richiesta assistenza stradale contattare il numero verde</li>
      </ul>

    </div>
  );
}

const btn = {
  padding: "1rem 2rem",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: 700,
  cursor: "pointer",
};