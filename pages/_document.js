import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {/* Favicon — положи свой файл favicon.png или favicon.ico в папку /public */}
        <link rel="icon" type="image/png" href="/favicon.ico" />
        {/* Если используешь .ico: */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
