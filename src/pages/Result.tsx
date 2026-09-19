import { useEffect, useState } from 'react'
import { Coupon, Perf } from '../components/Coupon'
import { Check, MapPin, Reroll, Share } from '../components/icons'
import { useFocusOn } from '../components/useFocusOn'
import { DIET_DISCLAIMER } from '../data/questions'
import type { Mood, Recommendation } from '../engine/types'
import { shareText, type ShareResult } from '../lib/share'

type Props = {
  picks: Recommendation[]
  mood: Mood | undefined
  roll: number
  /** ชื่อย่อข้อจำกัดอาหารที่เปิดอยู่ */
  diet: string[]
  onReroll: () => void
  onPromote: (index: number) => void
  onRestart: () => void
}

const SHARE_LABEL: Record<ShareResult | 'idle', string> = {
  idle: 'ชวนเพื่อนไปกิน',
  shared: 'ชวนเพื่อนไปกิน',
  cancelled: 'ชวนเพื่อนไปกิน',
  copied: 'คัดลอกแล้ว ไปวางในแชทได้เลย',
  failed: 'แชร์ไม่ได้ ลองอีกทีนะ',
}

const INTRO: Record<Mood | 'random', string> = {
  stressed: 'เครียดมาใช่มะ งั้นจัดจานนี้ไป',
  tired: 'เหนื่อยมาเหรอ เอานี่ไปฟื้นแรงก่อน',
  heal: 'มาๆ เดี๋ยวฮีลใจให้',
  bored: 'เบื่อๆ ใช่ไหม ลองอันนี้ดู',
  random: 'สุ่มมาให้แล้ว ไม่ต้องคิดเลย',
}

// เอาวงเล็บออกแต่เก็บคำไว้ เช่น "(เจ)" → "เจ" จะได้เจอร้านเจ
const mapsUrl = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name.replace(/[()]/g, ''))}`

export function Result({ picks, mood, roll, diet, onReroll, onPromote, onRestart }: Props) {
  const [main, ...backups] = picks
  const { menu, reasons } = main
  // ผลใหม่ทุกครั้ง (สุ่มใหม่/สลับเมนู) ให้โฟกัสชื่อเมนู เพื่อให้ screen reader อ่านจานใหม่
  const titleRef = useFocusOn<HTMLHeadingElement>(`${menu.id}-${roll}`)
  // ผลการแชร์ผูกกับเมนู: เปลี่ยนเมนูแล้วป้ายกลับเป็นปกติเอง
  const [shared, setShared] = useState<{ id: string; result: ShareResult } | null>(null)
  const shareState = shared?.id === menu.id ? shared.result : 'idle'

  // ข้อความ "คัดลอกแล้ว" ค้างไว้สักครู่แล้วกลับเป็นปกติ
  useEffect(() => {
    if (shareState !== 'copied' && shareState !== 'failed') return
    const t = setTimeout(() => setShared(null), 2500)
    return () => clearTimeout(t)
  }, [shareState])

  const share = async () => {
    const result = await shareText(`ไปกิน${menu.name}กันป่ะ ${menu.emoji}\n${menu.blurb}`)
    setShared({ id: menu.id, result })
  }

  return (
    <>
      <Coupon key={`${menu.id}-${roll}`} stock="ticket" serial={`บัตรคิว ใบที่ ${roll}`}>
        <section className="ticket">
          <p className="ticket-intro">{INTRO[mood ?? 'random']}</p>
          <div className="dish">
            <span className="plate" aria-hidden>
              {menu.emoji}
            </span>
            <h1 className="dish-name" ref={titleRef} tabIndex={-1}>
              {menu.name}
            </h1>
            <p className="dish-blurb">{menu.blurb}</p>
          </div>

          {reasons.length > 0 && (
            <div className="reasons">
              <h2 className="reasons-title">ทำไมต้องจานนี้</h2>
              <ul>
                {reasons.map((r) => (
                  <li key={r}>
                    <Check width={18} height={18} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="actions">
            <a className="btn btn-primary" href={mapsUrl(menu.name)} target="_blank" rel="noreferrer">
              <MapPin width={20} height={20} />
              หาร้านแถวนี้
            </a>
            <button type="button" className="btn btn-line" onClick={onReroll}>
              <Reroll width={20} height={20} />
              ไม่เอา สุ่มใหม่
            </button>
            <button type="button" className="btn btn-quiet" onClick={share}>
              {shareState === 'copied' ? <Check width={20} height={20} /> : <Share width={20} height={20} />}
              <span aria-live="polite">{SHARE_LABEL[shareState]}</span>
            </button>
          </div>

          {diet.length > 0 && (
            <p className="fine-print diet-note">
              <strong>งด: {diet.join(', ')}</strong> · {DIET_DISCLAIMER}
            </p>
          )}
        </section>

        {backups.length > 0 && (
          <>
            <Perf />
            <section className="backups" aria-labelledby="backups-title">
              <h2 id="backups-title" className="backups-title">
                หรือจะเอา
              </h2>
              {backups.map((b, i) => (
                <button key={b.menu.id} type="button" className="backup" onClick={() => onPromote(i + 1)}>
                  <span className="backup-emoji" aria-hidden>
                    {b.menu.emoji}
                  </span>
                  <span className="backup-name">{b.menu.name}</span>
                  <span className="backup-cta">เอาอันนี้</span>
                </button>
              ))}
            </section>
          </>
        )}
      </Coupon>

      <button type="button" className="restart" onClick={onRestart}>
        ตอบใหม่ตั้งแต่ต้น
      </button>
    </>
  )
}
