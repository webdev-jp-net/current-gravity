---
name: 'page-component'
root: 'src/app'
output: '**/*'
ignore: []
questions:
  name: 'ページコンポーネントの名前を入力:'
---

# `{{ inputs.name | kebab }}/page.tsx`

```typescript
import { {{ inputs.name | pascal }}View } from './_parts/view'

export default async function {{ inputs.name | pascal }}Page() {
  // TODO: 必要に応じてデータ取得やサーバーアクションを実装してください
  return <{{ inputs.name | pascal }}View />
}
```

# `{{ inputs.name | kebab }}/_parts/view.tsx`

```typescript
'use client'

import type { FC } from 'react'

import styles from './page.module.scss'
import { use{{ inputs.name | pascal }} } from './use{{ inputs.name | pascal }}'

export const {{ inputs.name | pascal }}View: FC = () => {
  const { hoge } = use{{ inputs.name | pascal }}()

  return (
    <section className={styles.{{ inputs.name | camel }}} data-testid="{{ inputs.name | kebab }}">
      <p>{hoge}</p>
    </section>
  )
}
```

# `{{ inputs.name | kebab }}/_parts/use{{ inputs.name | pascal }}.ts`

```typescript
export const use{{ inputs.name | pascal }} = () => {
  const hoge = '{{ inputs.name | kebab }}'

  return { hoge }
}
```

# `{{ inputs.name | kebab }}/_parts/page.module.scss`

```scss
@use "@/style/_variable" as *;

.{{ inputs.name | camel }} {
  // TODO: スタイルを定義してください
}
```
