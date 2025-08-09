import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {/* Favicon для современных браузеров */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Favicon для старых браузеров */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
