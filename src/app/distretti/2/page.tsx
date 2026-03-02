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
            <td>AS Motori Suriano Antonio –  Via Europa S.S.18, snc, 87032, Amantea</td>
            <td><a href="tel:0982 46257">0982 46257</a></td>
          </tr>
          
          
        </tbody>
      </table>

      {/* CARROZZERIA */}
      <h2 style={{ marginTop: "40px" }}>CARROZZERIA</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
             <tr>
            <td>ESPOSITO EBREO PASQUALE  – Via Lago Sopra Strada, --- fuscaldo</td>
            <td><a href="tel:0982618137">0982618137</a></td>
          </tr>
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
            <td>carrozzeria autofficina gullo antonio  –  Via Francesco Lattari, ---, 87024, FUSCALDO</td>
            <td><a href="tel:0982 89551">0982 89551</a></td>
          </tr>
          <tr>
            <td>VENERIO PASQUALE  – VIA STROMBOLI, 89, 87032, AMANTEA</td>
            <td><a href="tel:0982 41358">0982 41358</a></td>
          </tr>
          <tr>
            <td>F.LLI GARRITANO SNC  –  via Europa, 10, 87032, Campora San Giovanni</td>
            <td><a href="tel:0982 46457">0982 46457</a></td>
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
            <td>VETROCAR – Strada Statale 18 Tirrena Inferiore, ---, 87032, CORECA</td>
            <td><a href="tel:0984/390148">0984 390148</a></td>
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