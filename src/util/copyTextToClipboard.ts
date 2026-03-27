/**
 * クリップボード書き込みの共通処理（非対応・拒否時は false）。
 * UI（alert 等）は呼び出し側に任せる。
 */
export const CLIPBOARD_COPY_UNAVAILABLE_MESSAGE =
  'お使いのブラウザではクリップボードへのコピーが制限されています。アドレスバーのURLを直接コピーしてシェアしてください。'

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
