import Link from "next/link";

export default function Distretto1Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      
      <Link href="/">
        <button style={btn}>🚜 TORNA A HOME</button>
      </Link>

      <h1>Elenco Convenzionati – Distretto 11</h1>

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
            <td>OFFICINA MECCANICA FALDUTO GIUSEPPE – VIA RAVAGNESE SUPERIORE TRAVERSA NICOLO', 28, 89131, REGGIO CALABRIA</td>
            <td><a href="tel:393 336 6041">393 336 6041</a></td>
          </tr>
          <tr>
            <td>BELLè GOMME DI BELLè GIORGIO – Via Possidonea, 33, 89125, Reggio Calabria</td>
            <td><a href="tel:0965 895447">0965 895447</a></td>
          </tr>
          <tr>
            <td>G.F.MOTORI SRL – Via Giuseppe De Nava, 1, 89123, Reggio Calabria</td>
            <td><a href="tel:0965 42766">0965 42766</a></td>
          </tr>
          <tr>
            <td>FIUMANO' SERVICE DI FRANCESCO FIUMANO'  – Via Argine Destro Annunziata, 95, 89122, Reggio Calabria</td>
            <td><a href="tel:0965 650674">0965 650674</a></td>
          </tr>
          <tr>
            <td>AUTOFFICINA CRUCITTI GIUSEPPE – Via Vecchia San Sperato, 3, 89133, REGGIO CALABRIA</td>
            <td><a href="tel:0965 672284">0965 672284</a></td>
          </tr>
          <tr>
            <td>SUDAUTO SRL – Via Vecchia Pentimele, 75, 89122, REGGIO CALABRIA</td>
            <td><a href="tel:0965 48396">0965 48396</a></td>
          </tr>
           <tr>
            <td>OFFICINA MECCANICA DI SACCHETTI DOMENICO – Via Micene, 5, 89129, Reggio Calabria</td>
            <td><a href="tel:0965 593662">0965 593662</a></td>
          </tr>
           <tr>
            <td>OFFICINA MECCANICA FALDUTO GIUSEPPE –  Via Ravagnese Superiore Traversa Nicolò, 28, 89100, Reggio di Calabria</td>
            <td><a href="tel:393 336 6041">393 336 6041</a></td>
          </tr>
             <tr>
            <td>YORK AUTO VUMBACA S.P.A –  Via Arangea, ---, 89131, REGGIO CALABRIA</td>
            <td><a href="tel:0965 636035">0965 636035</a></td>
          </tr>
           <tr>
            <td>GEREMIA SPA –  Via Vecchia Provinciale, 79, 89121, REGGIO CALABRIA</td>
            <td><a href="tel: 0965 653401"> 0965 653401</a></td>
          </tr>
          <tr>
            <td>Di Stefano Auto Srl  –  Vico I Strada Sant'Antonio Ravagnese, 29, 89121, Reggio Calabria</td>
            <td><a href="tel: 0965 642436"> 0965 642436</a></td>
          </tr>
           <tr>
            <td>MARTINO VINCENZO –   Galleria Valanidi II, ---, 89134, Reggio Calabria</td>
            <td><a href="tel: 0965 644449"> 0965 644449</a></td>
          </tr>
           <tr>
            <td>AUTOCARROZZERIA F.LLI BARILLA' SRL –   Via dei Monti Traversa Calogero, 20, 89050, Reggio Calabria</td>
            <td><a href="tel:  0965 371410">  0965 371410</a></td>
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
            <td>AUTOCARROZZERIA MELIZA SNC – Via Vallone Petrara, 24, 89124, Reggio Calabria</td>
            <td><a href="tel: 0965 23921"> 0965 23921</a></td>
          </tr>
          <tr>
            <td>F.LLI CALARCO SRL – Viale Della Liberta`, 18, 89123, REGGIO CALABRIA</td>
            <td><a href="tel:0965 891021">0965 891021</a></td>
          </tr>
          <tr>
            <td>AUTOCARROZZERIA BASILE ANGELO – Via Reggio Campi II Tronco, 242, 89126, REGGIO CALABRIA</td>
            <td><a href="tel:0965332379 ">0965332379 </a></td>
          </tr>
          <tr>
            <td>SUDAUTO SRL – Via Vecchia Pentimele, 75, 89122, REGGIO CALABRIA</td>
            <td><a href="tel:0965 48396">0965 48396</a></td>
          </tr>
          <tr>
            <td>Di Stefano Auto Srl  – Via Vecchia Pentimele, 75, 89122, REGGIO CALABRIA</td>
            <td><a href="tel:0965 642436">0965 642436</a></td>
          </tr>
          <tr>
            <td>AUTOCARROZZERIA F.LLI BARILLA'SRL – Via dei Monti Traversa Calogero, 20, 89050, Reggio Calabria</td>
            <td><a href="tel:0965 371410">0965 371410</a></td>
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
            <td>POLIMENI GIUSEPPE – VIA E . CONDERA DIR . POSTORINO, 65, 89100, REGGIO CALABRIA</td>
            <td><a href="tel:0965/812933 - 3711240731">0965/812933 - 3711240731</a></td>
          </tr>
          <tr>
            <td>MASUCCI MASSIMO – VIA RAVAGNESE, snc, 89067, REGGIO CALABRIA</td>
            <td><a href="tel: 0965 643499"> 0965 643499</a></td>
          </tr>
          <tr>
            <td>PASTETTI GIOVANNI – VIALE A.MORO II TRAV.SCORDINO, , 89100, REGGIO CALABRIA</td>
            <td><a href="tel:0965 590313">0965 590313</a></td>
          </tr>
            <tr>
            <td>BELLè GOMME DI BELLè GIORGIO – Via Possidonea, 33, 89125, Reggio Calabria</td>
            <td><a href="tel:0965 895447">0965 895447</a></td>
          </tr>
            <tr>
            <td>AD PNEUMATICI –  VIA MISSORI , 13/19, 89127, REGGIO CALABRIA</td>
            <td><a href="tel:0965 895404">0965 895404</a></td>
          </tr>
            <tr>
            <td>PAVONE GOMME E REVISIONI – Via Nazionale Pentimele, 177, 89122, Reggio di Calabria</td>
            <td><a href="tel:0965 45038">0965 45038</a></td>
          </tr>
            <tr>
            <td>FIUMANO' SERVICE DI FRANCESCO FIUMANO'  – VIA ARG. DX ANNUNZIATA A, 95, 89121, REGGIO CALABRIA</td>
            <td><a href="tel:0965 650674">0965 650674</a></td>
          </tr>
            <tr>
            <td>AUTOLAVAGGIO E ASSISTENZA PNEUMATICI DI CANALE TOM  – VIA RAVAGNESE TR NICOLO', 5, 89131, REGGIO CALABRIA</td>
            <td><a href="tel:3401687483 ">3401687483 </a></td>
          </tr>
            <tr>
            <td>D'AGOSTINO ROCCO  – Via Nazionale Occhio di Pellaro, 133, 89134, Reggio Calabria</td>
            <td><a href="tel:0965/600632">0965/600632</a></td>
          </tr>
            <tr>
            <td>MALAVENDA ANTONIO – VIA CONDERA DIR.BARRECA, ---, 89126, Reggio Calabria</td>
            <td><a href="tel:0965 25024">0965 25024</a></td>
          </tr>
            <tr>
            <td>AUTOCARROZZERIA F.LLI BARILLA' SRL – Via dei Monti Traversa Calogero, 20, 89135, CATONA</td>
            <td><a href="tel:0965 371410">0965 371410</a></td>
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
            <td>CARGLASS ITALIA_BELRON ITALIA SPA – Via Amerigo Vespucci, 12, 89122, Reggio di Calabria</td>
            <td><a href="tel:02 1241 22929">02 1241 22929</a></td>
          </tr>
          <tr>
            <td>VETROCAR – Via Padova, 2a, 89129, REGGIO CALABRIA</td>
            <td><a href="tel:0965 52626">0965 52626</a></td>
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