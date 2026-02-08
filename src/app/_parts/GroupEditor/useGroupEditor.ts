'use client'

import { useState, useCallback } from 'react'

export const useGroupEditor = () => {
  const [isShared, setIsShared] = useState(false)

  const handleShare = useCallback(() => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard.writeText(window.location.href)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    } else {
      alert(
        'お使いのブラウザではクリップボードへのコピーが制限されています。アドレスバーのURLを直接コピーしてシェアしてください。'
      )
    }
  }, [])

  return { isShared, handleShare }
}
