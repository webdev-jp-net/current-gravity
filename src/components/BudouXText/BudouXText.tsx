import { loadDefaultJapaneseParser } from 'budoux'

const parser = loadDefaultJapaneseParser()

type Props = {
  children: string
}

export const BudouXText = ({ children }: Props) => (
  <>
    {parser.parse(children).map((segment, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i} style={{ display: 'inline-block' }}>
        {segment}
      </span>
    ))}
  </>
)
