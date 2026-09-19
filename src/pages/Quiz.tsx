import { Fragment } from 'react'
import { Coupon, Perf, Stamp, type Stock } from '../components/Coupon'
import { Ban, Chili, Dice } from '../components/icons'
import { useFocusOn } from '../components/useFocusOn'
import type { Question } from '../data/questions'
import type { Answers } from '../engine/types'

type Value = NonNullable<Answers[keyof Answers]>

type Props = {
  question: Question
  step: number
  total: number
  selected: Value | undefined
  leaving: boolean
  onAnswer: (value: Value) => void
  onBack?: () => void
  onRandom: () => void
  /** ชื่อย่อข้อจำกัดอาหารที่เปิดอยู่ */
  diet: string[]
  onEditPrefs: () => void
  /** ย้ายโฟกัสไปที่หัวข้อคำถาม (หลังผู้ใช้กดไปมาแล้ว ไม่ใช่ตอนเปิดแอพครั้งแรก) */
  focusTitle: boolean
}

const STOCKS: Stock[] = ['yellow', 'pink', 'sky']

export function Quiz({
  question,
  step,
  total,
  selected,
  leaving,
  onAnswer,
  onBack,
  onRandom,
  diet,
  onEditPrefs,
  focusTitle,
}: Props) {
  const titleRef = useFocusOn<HTMLLegendElement>(question.key, focusTitle)
  const options = question.options as { value: Value; label: string; hint?: string }[]
  const first = step === 0

  return (
    <Coupon
      key={question.key}
      stock={STOCKS[step % STOCKS.length]}
      serial={`ข้อ ${step + 1} จาก ${total}`}
      punches={[step, total]}
      onBack={onBack}
      showMark={!first}
      leaving={leaving}
    >
      {first && (
        <>
          <div className="intro">
            <h1 className="wordmark">Mood n Food</h1>
            <p className="lede">หิวแต่คิดไม่ออก? ตอบแค่ 3 ข้อ เดี๋ยวเราเลือกให้เอง</p>
          </div>
          <Perf />
        </>
      )}

      <fieldset className="question">
        <legend className="q-title" ref={titleRef} tabIndex={-1}>
          {question.title}
        </legend>

        {question.kind === 'level' ? (
          <div className="levels">
            {options.map((o) => {
              const level = o.value as number
              const on = selected === o.value
              return (
                <button
                  key={String(o.value)}
                  type="button"
                  className="level"
                  aria-pressed={on}
                  onClick={() => onAnswer(o.value)}
                >
                  <span className="chilis">
                    {level === 0 ? (
                      <Chili filled={false} width={26} height={26} />
                    ) : (
                      Array.from({ length: level }, (_, i) => <Chili key={i} width={26} height={26} />)
                    )}
                  </span>
                  <span className="level-label">{o.label}</span>
                  {on && <Stamp />}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="stubs">
            {options.map((o, i) => {
              const on = selected === o.value
              return (
                <Fragment key={String(o.value)}>
                  {i > 0 && <Perf />}
                  <button type="button" className="stub" aria-pressed={on} onClick={() => onAnswer(o.value)}>
                    <span className="stub-text">
                      <span className="stub-label">{o.label}</span>
                      {o.hint && <span className="stub-hint">{o.hint}</span>}
                    </span>
                    {on && <Stamp />}
                  </button>
                </Fragment>
              )
            })}
          </div>
        )}
      </fieldset>

      {first && (
        <>
          <Perf />
          <button type="button" className="stub stub-quiet" onClick={onEditPrefs}>
            <Ban width={22} height={22} />
            <span className="stub-text">
              <span className="stub-label">ข้อจำกัดอาหาร</span>
              <span className="stub-hint">{diet.length > 0 ? `งด: ${diet.join(', ')}` : 'ฮาลาล วีแกน หรือแพ้อะไร บอกได้'}</span>
            </span>
          </button>
          <Perf />
          <button type="button" className="stub stub-quiet" onClick={onRandom}>
            <Dice width={22} height={22} />
            <span className="stub-label">ขี้เกียจตอบ สุ่มให้เลย</span>
          </button>
        </>
      )}
    </Coupon>
  )
}
