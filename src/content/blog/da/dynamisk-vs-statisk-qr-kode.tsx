export default function Article() {
  return (
    <>
      <p>
        Valget mellem statiske og dynamiske QR-koder er en af de vigtigste beslutninger
        når du implementerer QR-koder i din virksomhed. Her er en komplet sammenligning.
      </p>

      <h2>Den grundlæggende forskel</h2>
      <p>
        En <strong>statisk QR-kode</strong> indkoder destinations-URL&apos;en direkte i mønsteret.
        En <strong>dynamisk QR-kode</strong> indkoder en kort redirect-URL som du kan ændre når som helst.
      </p>

      <h2>Hvornår du skal bruge statiske koder</h2>
      <ul>
        <li>Destinationen ændrer sig aldrig (f.eks. en personlig hjemmeside-URL)</li>
        <li>Du har ikke brug for scan-tracking eller analytics</li>
        <li>Du vil have nul afhængigheder af en tredjepartsservice</li>
      </ul>

      <h2>Hvornår du skal bruge dynamiske koder</h2>
      <ul>
        <li>Destinationen kan ændre sig (kampagner, produktsider, sæsonindhold)</li>
        <li>Du har brug for scan-analytics (hvem, hvornår, hvorfra)</li>
        <li>Du trykker i stor skala og har ikke råd til genoptryk</li>
        <li>Du vil have email-varsler hvis en destination går ned</li>
      </ul>

      <h2>Prissammenligning</h2>
      <p>
        Statiske QR-koder er altid gratis — enhver generator kan oprette dem. Dynamiske
        QR-koder kræver en service til at håndtere redirect. De fleste udbydere tilbyder
        gratis planer med begrænsede koder, og betalte planer fra omkring $7/måned til
        professionelt brug.
      </p>

      <h2>Vores anbefaling</h2>
      <p>
        Hvis din QR-kode skal på noget trykt — emballage, skilte, visitkort — brug altid
        dynamisk. Muligheden for at ændre destinationen uden genoptryk er den lille månedlige
        pris værd. Til personlig eller midlertidig brug er statisk fint.
      </p>
    </>
  );
}
