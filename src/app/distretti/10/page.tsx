import Link from "next/link";

export default function Distretto1Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 10</h1>

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
            <td>AUTO ALBANESE SRL – Via delle Americhe 42, 89048 Siderno</td>
            <td><a href="tel:0964347935">0964 347935</a></td>
          </tr>
          <tr>
            <td>AUTOSANFILIPPO GROUP SRL – Contrada Badea 33, 89040 Gerace</td>
            <td><a href="tel:0964356388">0964 356388</a></td>
          </tr>
          <tr>
            <td>Centro Assistenza Auto 2000 – Via Taranto 1, 89034 Bovalino</td>
            <td><a href="tel:3282915110">328 291 5110</a></td>
          </tr>
          <tr>
            <td>YORK AUTO VUMBACA S.R.L. – Strada Statale 106, Locri</td>
            <td><a href="tel:096429376">0964 29376</a></td>
          </tr>
          <tr>
            <td>AZ CAR SERVICE di Andrea Zucco – Contrada Riposo, Locri</td>
            <td><a href="tel:0964390639">0964 390639</a></td>
          </tr>
          <tr>
            <td>CELESTINO GOMME SNC – Via Cristoforo Colombo SNC, Locri</td>
            <td><a href="tel:096429186">0964 29186</a></td>
          </tr>
        </tbody>
      </table>

      {/* CARROZZERIA */}
      <h2 style={{ marginTop: "40px" }}>CARROZZERIA</h2>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Officina</th>
            <th>Contatti</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>YORK AUTO VUMBACA S.R.L. – Strada Statale 106, Locri</td>
            <td><a href="tel:096429376">0964 29376</a></td>
          </tr>
          <tr>
            <td>AZ CAR SERVICE di Andrea Zucco – Contrada Riposo, Locri</td>
            <td><a href="tel:0964390639">0964 390639</a></td>
          </tr>
        </tbody>
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
            <td>CENTRO GOMME DI ALI' MARIO – Strada Torre Vecchia, 89046 Marina di Gioiosa Ionica</td>
            <td><a href="tel:3881473651">388 147 3651</a></td>
          </tr>
          <tr>
            <td>FRANCO GOMME DI FRANCO FRANCESCO – Via Dromo 7, 89034 Bovalino Marina</td>
            <td><a href="tel:096461468">0964 61468</a></td>
          </tr>
          <tr>
            <td>CELESTINO GOMME SNC – Via Cristoforo Colombo SNC, Locri</td>
            <td><a href="tel:096429186">0964 29186</a></td>
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
            <td>CARGLASS ITALIA – Via Carrera, 89048 Siderno</td>
            <td><a href="tel:09641900716">0964 1900716</a></td>
          </tr>
          <tr>
            <td>VETROCAR – Contrada Marità, 89048 Siderno</td>
            <td><a href="tel:0964380545">0964 380545</a></td>
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