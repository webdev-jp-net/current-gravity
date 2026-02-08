---
name: 'parts-component'
root: 'src/app'
output: '**/*'
ignore: []
questions:
  name: 'パーツコンポーネントの名前を入力:'
---

# `{{ inputs.name | pascal }}/index.ts`

```typescript
export { {{ inputs.name | pascal }} } from './{{ inputs.name | pascal }}'

```

# `{{ inputs.name | pascal }}/use{{ inputs.name | pascal }}.ts`

```typescript
export const use{{ inputs.name | pascal }} = () => {
  const hoge = '{{ inputs.name | kebab }}'

  return { hoge }
}
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```typescript
import type { FC } from 'react'

import styles from './{{ inputs.name | pascal }}.module.scss'

type {{ inputs.name | pascal }}Props = {
  className?: JSX.IntrinsicElements['div']['className']
  children?: React.ReactNode
}

export const {{ inputs.name | pascal }}: FC<{{ inputs.name | pascal }}Props> = ({ className = '', children }) => {
  const customClass = [className]
  return (
    <div className={[styles.{{ inputs.name | camel }}, ...customClass].join(' ')}>
      <p>{{ inputs.name | pascal }}</p>
      {children}
    </div>
  )
}

```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.module.scss`

```scss
@use "@/style/_variable" as *;

.{{ inputs.name | camel }} {
  //
}

```
