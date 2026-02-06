import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル</title>
        <meta name="description" content="あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル" />
        <meta property="og:description" content="あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。" />
        <meta property="og:image" content="/img_ogp.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル" />
        <meta name="twitter:description" content="あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。" />
        <meta name="twitter:image" content="/img_ogp.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
