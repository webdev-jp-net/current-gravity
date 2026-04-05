'use client'

import { useEffect, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import { usePathname } from 'next/navigation'

import { groupAtom } from '@/data/store'

import type { PersonalPlot } from '@/type/personalPlot'

export const useHome = () => {
  const pathname = usePathname()
  const [group, setGroup] = useAtom(groupAtom)
  const [isMounted, setIsMounted] = useState(false)
  const initialLoadHadParams = useRef(false)

  /**
   * `?name` / `p=` からの復元は「まだ1件もプロットが無い」ときだけ行う。
   * survey で `groupAtom` に載せたあと `/` へ戻った初回でも、古いクエリで全置換されない（#65）。
   * 共有URL直リンクは初期 atom が空のため従来どおり復元される。
   */
  useEffect(() => {
    setGroup(current => {
      const urlParams = new URLSearchParams(window.location.search)
      const nameParam = urlParams.get('name')
      const plotParams = urlParams.getAll('p')

      if (!nameParam && plotParams.length === 0) {
        return current
      }

      if (current.personalPlotList.length > 0) {
        return current
      }

      initialLoadHadParams.current = true
      const personalPlotList: PersonalPlot[] = plotParams.map((p, index) => {
        const parts = p.split(',')
        const [displayName, ownership, consensus, diversity, identityFusion] =
          parts
        return {
          id: `url-${index}-${Date.now()}`,
          displayName: displayName || '',
          ownership: parseInt(ownership) || 0,
          consensus: parseInt(consensus) || 0,
          diversity: parseInt(diversity) || 0,
          identityFusion: parseInt(identityFusion) || 0,
          focus: parts[5] === 'focus',
        }
      })

      return {
        name: nameParam || '新しいグループ',
        personalPlotList,
      }
    })

    setIsMounted(true)
  }, [setGroup])

  // 状態をURLパラメータに同期（replaceStateでスクロール位置を維持）
  useEffect(() => {
    if (!isMounted) return

    const params = new URLSearchParams()
    if (group.name) {
      params.set('name', group.name)
    }

    group.personalPlotList.forEach((p) => {
      const parts = [
        p.displayName,
        p.ownership,
        p.consensus,
        p.diversity,
        p.identityFusion,
      ]
      if (p.focus) {
        parts.push('focus')
      }
      params.append('p', parts.join(','))
    })

    const newQuery = params.toString()
    const currentQuery = window.location.search.replace(/^\?/, '')

    if (newQuery !== currentQuery) {
      const base = pathname ?? ''
      const url = newQuery ? `${base}?${newQuery}` : base
      window.history.replaceState(null, '', url)
    }
  }, [group, isMounted, pathname])

  // マウント完了後にハッシュまたはp=に応じてスクロール
  useEffect(() => {
    if (!isMounted) return

    if (window.location.hash === '#group-editor') {
      const el = document.getElementById('group-editor')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    if (initialLoadHadParams.current) {
      initialLoadHadParams.current = false
      const el = document.getElementById('matrix')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isMounted])

  const addPerson = () => {
    const newPerson: PersonalPlot = {
      id: Date.now().toString(),
      displayName: '',
      ownership: 0,
      consensus: 0,
      diversity: 0,
      identityFusion: 0,
    }
    setGroup({
      ...group,
      personalPlotList: [newPerson, ...group.personalPlotList],
    })
  }

  const updatePerson = (
    id: string,
    field: keyof PersonalPlot,
    value: string | number
  ) => {
    setGroup({
      ...group,
      personalPlotList: group.personalPlotList.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    })
  }

  const handleImport = (id: string, csvValue: string) => {
    const values = csvValue.split(',').map((v) => parseInt(v.trim()))
    if (values.length === 4 && values.every((v) => !isNaN(v))) {
      setGroup({
        ...group,
        personalPlotList: group.personalPlotList.map((p) =>
          p.id === id
            ? {
                ...p,
                ownership: values[0],
                consensus: values[1],
                diversity: values[2],
                identityFusion: values[3],
              }
            : p
        ),
      })
    }
  }

  const deletePerson = (id: string) => {
    setGroup({
      ...group,
      personalPlotList: group.personalPlotList.filter((p) => p.id !== id),
    })
  }

  const isPersonComplete = (person: PersonalPlot): boolean => {
    return (
      person.displayName.trim() !== '' &&
      person.ownership >= -10 &&
      person.ownership <= 10 &&
      person.consensus >= -10 &&
      person.consensus <= 10 &&
      person.diversity >= -10 &&
      person.diversity <= 10 &&
      person.identityFusion >= -10 &&
      person.identityFusion <= 10
    )
  }

  const completePersonList = group.personalPlotList.filter(isPersonComplete)

  return {
    isMounted,
    group,
    setGroup,
    completePersonList,
    addPerson,
    updatePerson,
    handleImport,
    deletePerson,
  }
}
