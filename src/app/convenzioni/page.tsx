export default function ConvenzioniPage() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Elenco Convenzionati</h1>

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
          <tr><td>CAR SCONTI SRLS – Via San Martino 139, Taurianova</td><td><a href="tel:0966645400">0966 645400</a></td></tr>
          <tr><td>ABM MOTORS SRL – Rizziconi</td><td><a href="tel:0966595250">0966 595250</a></td></tr>
          <tr><td>UPCAR MECCANICHE SRL – Polistena</td><td><a href="tel:0966870231">0966 870231</a></td></tr>
          <tr><td>Officine Nuovi Service – Polistena</td><td><a href="tel:0966940609">0966 940609</a></td></tr>
          <tr><td>Autofficina Scarpino – Palmi</td><td><a href="tel:0966492816">0966 492816</a></td></tr>
          <tr><td>Autofficina di Anneli G. – Gioia Tauro</td><td><a href="tel:096621551">0966 21551</a></td></tr>
          <tr><td>Autofficina Annunziata – Gioia Tauro</td><td><a href="tel:096651070">0966 51070</a></td></tr>
          <tr><td>ICAR SRL – Gioia Tauro</td><td><a href="tel:0966505810">0966 505810</a></td></tr>
          <tr><td>TOP GEAR SRL – Rosarno</td><td><a href="tel:0966500658">0966 500658</a></td></tr>
          <tr><td>ARRUZZOLO COSMA SRL – Rosarno</td><td><a href="tel:0966711315">0966 711315</a></td></tr>
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
          <tr><td>ICAR SRL – Gioia Tauro</td><td><a href="tel:096651070">0966 51070</a></td></tr>
          <tr><td>AUTOZUD DI ZAPPIA ANTONELLA – Gioia Tauro</td><td><a href="tel:0966505810">0966 505810</a></td></tr>
          <tr><td>ARRUZZOLO COSMA SRL – Rosarno</td><td><a href="tel:0966711315">0966 711315</a></td></tr>
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
          <tr><td>MAURIZIO CIANO GOMME – Taurianova</td><td><a href="tel:0966612143">0966 612143</a></td></tr>
          <tr><td>EURO PNEUS DI CIANO PASQUALE – Taurianova</td><td><a href="tel:0966611580">0966 611580</a></td></tr>
          <tr><td>MILLE MIGLIA DI MINASSI MASSIMO – Cittanova</td><td><a href="tel:0966662089">0966 662089</a></td></tr>
          <tr><td>DAG SRL – Melicucco</td><td><a href="tel:0966506681">0966 506681</a></td></tr>
          <tr><td>STIL GOMMA DI A. IANNELLI – Palmi</td><td><a href="tel:096646136">0966 46136</a></td></tr>
          <tr><td>AUTOCENTRO DI IANNELLI G. – Palmi</td><td><a href="tel:096621551">0966 21551</a></td></tr>
          <tr><td>FERDIFILIPPO ANTONINO – Palmi</td><td><a href="tel:0966505810">0966 505810</a></td></tr>
          <tr><td>L'AUTOFFICINA DI SCARFO FRANCESCO – Rosarno</td><td><a href="tel:3408990310">340 899 0310</a></td></tr>
          <tr><td>ICAR SRL – Gioia Tauro</td><td><a href="tel:096651070">0966 51070</a></td></tr>
          <tr><td>IL GOMMISTA DI MICHELE PIROMALLI – Gioia Tauro</td><td><a href="tel:0966501124">0966 501124</a></td></tr>
          <tr><td>AUTOZUD DI ZAPPIA ANTONELLA – Gioia Tauro</td><td><a href="tel:0966505810">0966 505810</a></td></tr>
          <tr><td>MALVASO SERVICE SRL – Rosarno</td><td><a href="tel:0966774545">0966 774545</a></td></tr>
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
            <td>VETROCAR – Rizziconi</td>
            <td>
              <a href="tel:0965652626">0965 652626</a> –{" "}
              <a href="mailto:reggiocalabria@vetrocar.it">
                reggiocalabria@vetrocar.it
              </a>
            </td>
          </tr>
          <tr>
            <td>CARGLASS ITALIA – Palmi</td>
            <td><a href="tel:0966473123">0966 473123</a></td>
          </tr>
        </tbody>
      </table>

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
        <li>Inserire una mail</li>
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