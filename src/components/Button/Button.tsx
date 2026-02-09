import { FC, ReactNode, ComponentProps } from 'react'

import styles from './Button.module.scss'

type ButtonProps = ComponentProps<'button'> & {
  children: ReactNode
  size?: 'full' | 'liquid' | 'icon'
  variant?: 'minor' | 'basic' | 'accent' | 'link'
}

export const Button: FC<ButtonProps> = ({ variant = 'basic', size = 'liquid', ...props }) => {
  const customClass = [props.className]
  customClass.push(styles[`--${variant}`])
  customClass.push(styles[`--${size}`])
  return (
    <button {...props} className={[styles.button, ...customClass].join(' ')}>
      {props.children}
    </button>
  )
}
