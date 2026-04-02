'use client'

import { useState, useCallback } from 'react'

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
    const pData = [p.displayName, p.ownership, p.consensus, p.diversity, p.identityFusion].join(',')
    params.append('p', pData)
  })
  const qs = params.toString()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return qs ? `${origin}/?${qs}` : `${origin}/`
}

export const useGroupEditor = () => {
  const [isShared, setIsShared] = useState(false)
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

  return { isShared, handleShare }
}
