export default function Article() {
  return (
    <>
      <p>
        En QR-kode (Quick Response-kode) er en todimensionel stregkode der kan scannes
        af smartphones for at tilgå digitalt indhold. Men ikke alle QR-koder er ens.
        Den vigtigste forskel i moderne QR-brug er mellem <strong>statiske</strong> og <strong>dynamiske</strong> QR-koder.
      </p>

      <h2>Statiske QR-koder</h2>
      <p>
        En statisk QR-kode indkoder destinations-URL&apos;en direkte i mønsteret. Når den er genereret,
        kan den ikke ændres. Hvis du trykker en statisk QR-kode på 10.000 flyers og URL&apos;en
        ændres, bliver de flyers ubrugelige.
      </p>

      <h2>Dynamiske QR-koder</h2>
      <p>
        En dynamisk QR-kode peger på en kort redirect-URL som du kontrollerer. Når nogen
        scanner den, rammer de redirect-servicen først, som så videresender dem til den
        faktiske destination. Det betyder at du kan ændre hvor koden peger hen <em>når som helst</em>,
        uden at gentrykke noget.
      </p>

      <h2>Hvorfor dynamiske QR-koder er vigtige</h2>
      <ul>
        <li><strong>Fleksibilitet:</strong> Skift destination efter trykning — intet spild, ingen ekstra omkostninger.</li>
        <li><strong>Analytics:</strong> Spor hvem der scanner din kode, hvornår, hvorfra og på hvilken enhed.</li>
        <li><strong>Fejlhåndtering:</strong> Hvis en destination går ned, omdiriger til en backup med det samme.</li>
        <li><strong>Kampagnestyring:</strong> Kør A/B-tests ved at skifte destinationer midt i en kampagne.</li>
      </ul>

      <h2>Typiske brugssituationer</h2>
      <p>
        Dynamiske QR-koder bruges på tværs af brancher: produktemballage, byggeskilte,
        event-billetter, restaurantmenuer, marketingmaterialer og visitkort. Enhver situation
        hvor destinationen kan ændre sig — eller hvor tracking er værdifuldt — kalder på en dynamisk kode.
      </p>

      <h2>Kom i gang</h2>
      <p>
        Det er nemt at oprette en dynamisk QR-kode. Opret en gratis konto, indtast din
        destinations-URL, tilpas designet og download. Du kan opdatere destinationen
        når som helst fra dit dashboard.
      </p>
    </>
  );
}
