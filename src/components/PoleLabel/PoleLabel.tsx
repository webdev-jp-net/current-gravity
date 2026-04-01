import { ComponentProps, FC } from 'react'

import { PoleIcon } from '@/components/PoleIcon'

import styles from './PoleLabel.module.scss'

import type { QuestionPole } from '@/type/question'

import { POLE_LABEL, POLE_DESCRIPTION } from '@/constants/model'

type PoleLabelProps = ComponentProps<'details'> & {
  pole: QuestionPole
}

export const PoleLabel: FC<PoleLabelProps> = ({ pole, ...props }) => (
  <details {...props} name="pole-label" className={[styles.poleLabel, props.className].join(' ')}>
    <summary className={styles.summary}>
      <PoleIcon className={styles.icon} variant={pole} />
      {POLE_LABEL[pole]}
    </summary>
    <div className={styles.description}>{POLE_DESCRIPTION[pole]}</div>
  </details>
)
