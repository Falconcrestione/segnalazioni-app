import Link from "next/link";

export default function Distretto3Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 3</h1>

      {/* MANUTENZIONE */}
      <h2>MANUTENZIONE (tagliando, rotture parti meccaniche)</h2>
      <p>Nessuna officina convenzionata presente.</p>

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
            <td>BLUE SERVICE S.r.l. – 87040, COSENZA</td>
            <td>
              <a href="tel:0984403981">0984 403981</a>
            </td>
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
            <td>PIT STOP PNEUMATICI DI BENVENUTO LUCA A. – Via Luigi Galvani 2, 87041 ACRI</td>
            <td><a href="tel:3392124903">339 212 4903</a></td>
          </tr>
          <tr>
            <td>PELLEGRINO PNEUMATICI – Via Francesco Cilea 25/27, 87041 ACRI</td>
            <td><a href="tel:3206884483">320 688 4483</a></td>
          </tr>
          <tr>
            <td>SERRA LEONARDO – Via Aldo Moro 283, 87041 ACRI</td>
            <td><a href="tel:0984452846">0984 452846</a></td>
          </tr>
          <tr>
            <td>BESIDIALE GOMME DI DE BONIS FRANCESCO – Contrada Torre Grande, 87043 BISIGNANO</td>
            <td><a href="tel:3284890849">328 489 0849</a></td>
          </tr>
        </tbody>
      </table>

      {/* ROTTURA CRISTALLI */}
      <h2 style={{ marginTop: "40px" }}>ROTTURA CRISTALLI</h2>
      <p>Nessun centro convenzionato presente.</p>

      {/* SINISTRI */}
      <h2 style={{ marginTop: "40px" }}>IN CASO DI SINISTRO / ATTI VANDALICI</h2>

      <p>
        Numero Verde:{" "}
        <strong>
          <a href="tel:800965643">800 965643</a>
        </strong>
      </p>

      <ul>
        <li>Collegarsi al sito: nemoo.aldautomotive.it/static/claims_public.html</li>
        <li>Inserire una mail (anche aziendale)</li>
        <li>Indicare targa, data evento e proseguire</li>
        <li>Completare il form con la dinamica del sinistro</li>
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