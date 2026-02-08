import type { Metadata } from 'next'
import '@/style/index.scss'

export const metadata: Metadata = {
  title: 'CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル',
  description: 'あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    title: 'CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル',
    description: 'あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。',
    images: ['/img_ogp.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル',
    description: 'あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。',
    images: ['/img_ogp.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="icon"
          href="/favicon-light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body>
        <div id="root">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
