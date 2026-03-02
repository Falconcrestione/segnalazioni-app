import Link from "next/link";

export default function Distretto1Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 6 </h1>

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
            <td>OPPIDO GIUSEPPE  –  Via Giosuè Carducci, 19, 88900, Crotone</td>
            <td><a href="tel:0962/26172">0962/26172</a></td>
          </tr>
           <tr>
            <td>violauto srl –  SS106, km 242, 88900, Crotone</td>
            <td><a href="tel:0962 946239">0962 946239</a></td>
          </tr>
          <tr>
            <td>MOTOR DRIVE STORE AUTOMOBILI SRL –  Via Enrico Mattei, 41, 88900, Crotone</td>
            <td><a href="TEL:0962 938797">0962 938797</a></td>
          </tr>
          
        </tbody>
      </table>

      {/* CARROZZERIA */}
      <h2 style={{ marginTop: "40px" }}>CARROZZERIA</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
            <tr>
            <td>Carrozzeria Borrelli Santo Borrell –  Via Mario Nicoletta, 117, 88900, CROTONE</td>
            <td><a href="tel:0962 26952">0962 26952</a></td>
          </tr>
           <tr>
            <td>AUTOCARROZZERIA LUZZARO RODOLFO –  Via del Gesù, 9, 88900, CROTONE</td>
            <td><a href="tel:0962 900975">0962 900975</a></td>
          </tr>
           <tr>
            <td>violauto srl –  SS106, km 242, 88900, Crotone</td>
            <td><a href="tel:0962 946239">0962 946239</a></td>
          </tr>
          <tr>
            <td>MOTOR DRIVE STORE AUTOMOBILI SRL –  Via Enrico Mattei, 41, 88900, Crotone</td>
            <td><a href="tel:0962 938797">0962 938797</a></td>
          </tr>
          <tr></tr>
        </thead>
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
            <td>MICHELE CHIARELLI PNEUMATICI SRL –  Traversa II Nicoletta Mario, 2, 88900, Crotone</td>
            <td><a href="tel:0962 962268">0962 962268</a></td>
          </tr>
          <tr>
            <td>RAIMONDO PIETRO  – VIA XXV APRILE, 87, 88900, CROTONE</td>
            <td><a href="tel:0962 21838">0962 21838</a></td>
          </tr>
          <tr>
            <td>GIERRE PNEUMATICI – Via Mario Nicoletta, 184, 88900, CROTONE</td>
            <td><a href="tel:0962 21364">0962 21364</a></td>
          </tr>
           <tr>
            <td>MICHELE CHIARELLI PNEUMATICI SRL – Via Federico Fellini, 6, 88900, Crotone</td>
            <td><a href="tel :0962 962268">0962 962268</a></td>
          </tr>
           <tr>
            <td>CICCARELLI GIUSEPPE – Via Enrico Mattei, 25, 88900, CROTONE</td>
            <td><a href="tel :0962 930288">0962 930288</a></td>
          </tr>
           <tr>
            <td>PNEUS GOMME SERVICE SRL – Rotonda Loc Passovecchio, ---, 88900, CROTONE</td>
            <td><a href="tel :0962 930528">0962 930528</a></td>
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
            <td>VETROCAR – Via Mario Nicoletta, 117, 88900, CROTONEV</td>
            <td><a href="tel:0962 26952">0962 26952</a></td>
          </tr>
           <tr>
            <td>CARGLASS ITALIA_BELRON ITALIA SPA – Via Mario Nicoletta, 216, 88900, Crotone</td>
            <td><a href="tel:392 249 9174">392 249 9174</a></td>
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