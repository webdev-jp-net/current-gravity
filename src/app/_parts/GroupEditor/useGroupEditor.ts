'use client'

import { useState, useCallback, type DragEvent } from 'react'

import { useAtomValue } from 'jotai'

import { groupAtom, type PersonalPlotGroup } from '@/data/store'

import { CLIPBOARD_COPY_UNAVAILABLE_MESSAGE, copyTextToClipboard } from '@/util/copyTextToClipboard'

/**
 * トップページでグループ状態を復元できる共有 URL（useHome の replaceState と同形式）。
 * 参照は本フックのみのためモジュール内に閉じる。
 */
function buildHomeShareUrlFromGroup(group: PersonalPlotGroup): string {
  const params = new URLSearchParams()
  if (group.name) {
    params.set('name', group.name)
  }
  group.personalPlotList.forEach(p => {
    const parts: (string | number)[] = [
      p.displayName,
      p.ownership,
      p.consensus,
      p.diversity,
      p.identityFusion,
    ]
    if (p.focus) {
      parts.push('f')
    }
    params.append('p', parts.join(','))
  })
  const qs = params.toString()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return qs ? `${origin}/?${qs}` : `${origin}/`
}

export const useGroupEditor = (onMovePerson: (fromIndex: number, toIndex: number) => void) => {
  const [isShared, setIsShared] = useState(false)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const group = useAtomValue(groupAtom)

  const handleShare = useCallback(() => {
    void copyTextToClipboard(buildHomeShareUrlFromGroup(group)).then(ok => {
      if (ok) {
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      } else {
        alert(CLIPBOARD_COPY_UNAVAILABLE_MESSAGE)
      }
    })
  }, [group])

  const handleDragStart = useCallback((e: DragEvent<HTMLElement>, index: number) => {
    // 既定のドラッグ画像はハンドル要素（グリップアイコン）だけになるため、行全体に差し替える
    const row = e.currentTarget.closest('tr')
    if (row) {
      e.dataTransfer.setDragImage(row, 0, 0)
    }
    setDraggingIndex(index)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (index: number) => {
      if (draggingIndex !== null) {
        onMovePerson(draggingIndex, index)
      }
      setDraggingIndex(null)
    },
    [draggingIndex, onMovePerson]
  )

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null)
  }, [])

  return { isShared, handleShare, handleDragStart, handleDragOver, handleDrop, handleDragEnd }
}
