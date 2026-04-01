'use client'

import { ComponentProps, FC, useId } from 'react'

import { PoleIcon } from '@/components/PoleIcon'

import styles from './PoleLabel.module.scss'

import type { QuestionPole } from '@/type/question'

import { POLE_LABEL, POLE_DESCRIPTION } from '@/constants/model'

type PoleLabelProps = ComponentProps<'button'> & {
  pole: QuestionPole
}

export const PoleLabel: FC<PoleLabelProps> = ({ pole, ...props }) => {
  const uid = useId()
  const anchorName = `--pole-label-${uid.replace(/:/g, '')}`
  const popoverId = `pole-description-${uid.replace(/:/g, '')}`

  return (
    <>
      <button
        type="button"
        {...props}
        className={[styles.poleLabel, props.className].join(' ')}
        popoverTarget={popoverId}
        style={{ anchorName, ...props.style } as React.CSSProperties}
      >
        <PoleIcon className={styles.icon} variant={pole} />
        {POLE_LABEL[pole]}
      </button>
      <div
        id={popoverId}
        popover="auto"
        className={styles.description}
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        {POLE_DESCRIPTION[pole]}
      </div>
    </>
  )
}
