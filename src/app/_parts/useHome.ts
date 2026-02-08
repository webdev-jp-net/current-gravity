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
  const [isSaving, setIsSaving] = useState(false)
  const initialLoadHadParams = useRef(false)

  // ハイドレーションエラー対策および初期URLパラメータ解析
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameParam = urlParams.get('name')
    const plotParams = urlParams.getAll('p')

    if (nameParam || plotParams.length > 0) {
      initialLoadHadParams.current = true
      const personalPlotList: PersonalPlot[] = plotParams.map((p, index) => {
        const [displayName, ownership, consensus, diversity, identityFusion] =
          p.split(',')
        return {
          id: `url-${index}-${Date.now()}`,
          displayName: displayName || '',
          ownership: parseInt(ownership) || 0,
          consensus: parseInt(consensus) || 0,
          diversity: parseInt(diversity) || 0,
          identityFusion: parseInt(identityFusion) || 0,
        }
      })

      setGroup({
        name: nameParam || '新しいグループ',
        personalPlotList,
      })
    }

    setIsMounted(true)
  }, [setGroup])

  // 状態をURLパラメータに同期（replaceState でスクロール位置を維持）
  useEffect(() => {
    if (!isMounted) return

    const params = new URLSearchParams()
    if (group.name) {
      params.set('name', group.name)
    }

    group.personalPlotList.forEach((p) => {
      const pData = [
        p.displayName,
        p.ownership,
        p.consensus,
        p.diversity,
        p.identityFusion,
      ].join(',')
      params.append('p', pData)
    })

    const newQuery = params.toString()
    const currentQuery = window.location.search.replace(/^\?/, '')

    if (newQuery !== currentQuery) {
      const base = pathname ?? ''
      const url = newQuery ? `${base}?${newQuery}` : base
      window.history.replaceState(null, '', url)
    }
  }, [group, isMounted, pathname])

  // マウント完了後にハッシュまたは p= に応じてスクロール
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

  const handleSave = () => {
    setIsSaving(true)
    setGroup({ ...group })
    setTimeout(() => {
      setIsSaving(false)
    }, 300)
  }

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
      personalPlotList: [...group.personalPlotList, newPerson],
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
    isSaving,
    completePersonList,
    handleSave,
    addPerson,
    updatePerson,
    handleImport,
    deletePerson,
  }
}
