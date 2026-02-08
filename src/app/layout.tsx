import type { Metadata } from "next";
import "@/styles/index.scss";

export const metadata: Metadata = {
  title: "CURRENT GRAVITY（カレントグラビティ） - 価値志向プロファイリングモデル",
  description:
    "あなたやチームのプロファイリングモデル。責任の引き受け方、関係の持ち方の地図。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div id="root">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
