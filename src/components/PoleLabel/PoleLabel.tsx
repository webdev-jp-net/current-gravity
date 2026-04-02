'use client'

import { ComponentProps, FC, useId } from 'react'

import { BookOpen } from 'lucide-react'

import { PoleIcon } from '@/components/PoleIcon'

import styles from './PoleLabel.module.scss'

import type { QuestionPole } from '@/type/question'

import { POLE_LABEL, POLE_DESCRIPTION } from '@/constants/model'

type PoleLabelProps = ComponentProps<'span'> & {
  pole: QuestionPole
  /** falseのときPoleIconを非表示にする（デフォルト: true） */
  icon?: boolean
  /** trueのとき説明ポップオーバーを表示するトリガーボタンを表示する */
  withDescription?: boolean
}

export const PoleLabel: FC<PoleLabelProps> = ({ pole, icon = true, withDescription = false, ...props }) => {
  const uid = useId()
  const anchorName = `--pole-label-${uid.replace(/:/g, '')}`
  const popoverId = `pole-description-${uid.replace(/:/g, '')}`

  return (
    <>
      <span {...props} className={[styles.poleLabel, props.className].join(' ')}>
        {icon && <PoleIcon className={styles.icon} variant={pole} />}
        {POLE_LABEL[pole]}
        {withDescription && (
          <button
            type="button"
            className={styles.trigger}
            popoverTarget={popoverId}
            style={{ anchorName } as React.CSSProperties}
            aria-label={`${POLE_LABEL[pole]}の説明`}
          >
            <BookOpen className={styles.triggerIcon} />
          </button>
        )}
      </span>
      {withDescription && (
        <div
          id={popoverId}
          popover="auto"
          className={styles.description}
          style={{ positionAnchor: anchorName } as React.CSSProperties}
        >
          {POLE_DESCRIPTION[pole]}
        </div>
      )}
    </>
  )
}
