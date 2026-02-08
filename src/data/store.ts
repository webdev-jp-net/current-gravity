import { atomWithStorage } from 'jotai/utils'

import type { PersonalPlot } from '@/type/personalPlot'

export type PersonalPlotGroup = {
  name: string
  personalPlotList: PersonalPlot[]
}

const STORAGE_KEY = 'current-gravity-data'

// 永続化用のatom
export const groupAtom = atomWithStorage<PersonalPlotGroup>(STORAGE_KEY, {
  name: '新しいグループ',
  personalPlotList: [],
})

// ページ間共有のための派生atomやactionが必要な場合はここに追加
