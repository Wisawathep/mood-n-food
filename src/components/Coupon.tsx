import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft } from './icons'

export type Stock = 'yellow' | 'pink' | 'sky' | 'ticket'

type Props = {
  stock: Stock
  /** ป้ายมุมขวาบน เช่น "ข้อ 1 จาก 3" */
  serial: string
  /** จำนวนรูเจาะ (ความคืบหน้า): [เจาะแล้ว, ทั้งหมด] */
  punches?: [number, number]
  onBack?: () => void
  /** ซ่อนชื่อแอพตัวเล็กเมื่อคูปองมีชื่อแอพตัวใหญ่อยู่แล้ว */
  showMark?: boolean
  /** กำลังถูกฉีกออก (หลังตอบคำถามแล้ว) */
  leaving?: boolean
  children: ReactNode
  style?: CSSProperties
}

export function Coupon({ stock, serial, punches, onBack, showMark = true, leaving, children, style }: Props) {
  return (
    <article className={`coupon stock-${stock}${leaving ? ' is-leaving' : ''}`} style={style}>
      <header className="coupon-head">
        {onBack ? (
          <button type="button" className="back" onClick={onBack}>
            <ArrowLeft width={20} height={20} />
            ย้อนกลับ
          </button>
        ) : (
          showMark && <span className="wordmark-sm">Mood n Food</span>
        )}
        <div className="serial-group">
          {punches && (
            <span className="punches" role="img" aria-label={serial}>
              {Array.from({ length: punches[1] }, (_, i) => (
                <span key={i} className={i < punches[0] ? 'hole punched' : 'hole'} />
              ))}
            </span>
          )}
          <span className="serial" aria-hidden={punches ? true : undefined}>
            {serial}
          </span>
        </div>
      </header>
      {children}
    </article>
  )
}

/** รอยปรุ: เส้นประ + รอยบากที่ขอบทั้งสองข้าง */
export function Perf() {
  return <div className="perf" role="presentation" />
}

export function Stamp({ children = 'เอา!' }: { children?: ReactNode }) {
  return (
    <span className="stamp" aria-hidden>
      {children}
    </span>
  )
}
