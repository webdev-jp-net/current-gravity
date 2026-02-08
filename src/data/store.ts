import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { type PersonalPlot } from '../components/ValueOrientationMatrix'

export type PersonalPlotGroup = {
  name: string
  personalPlotList: PersonalPlot[]
}

const STORAGE_KEY = 'current-gravity-data'

// 永続化用のアトム
export const groupAtom = atomWithStorage<PersonalPlotGroup>(STORAGE_KEY, {
  name: '新しいグループ',
  personalPlotList: [],
})

// ページ間共有のための派生アトムやアクションが必要な場合はここに追加
