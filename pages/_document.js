import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {/* Favicon для современных браузеров */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Favicon для старых браузеров */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* iOS: иконка на главный экран */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Android / PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#17181c" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
