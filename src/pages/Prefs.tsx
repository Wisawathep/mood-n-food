import { Fragment } from 'react'
import { Coupon, Perf, Stamp } from '../components/Coupon'
import { useFocusOn } from '../components/useFocusOn'
import { ALLERGEN_OPTIONS, DIET_DISCLAIMER, DIET_OPTIONS } from '../data/questions'
import type { Allergen, Prefs as PrefsValue } from '../engine/types'

type Props = {
  prefs: PrefsValue
  /** จำนวนเมนูที่ยังเลือกได้ภายใต้ข้อจำกัดนี้ */
  available: number
  onChange: (prefs: PrefsValue) => void
  onDone: () => void
}

type Row = { id: string; label: string; hint?: string; on: boolean; toggle: () => void }

export function Prefs({ prefs, available, onChange, onDone }: Props) {
  const titleRef = useFocusOn<HTMLHeadingElement>('prefs')
  const allergies = prefs.allergies ?? []
  const toggleAllergy = (a: Allergen) =>
    onChange({ ...prefs, allergies: allergies.includes(a) ? allergies.filter((x) => x !== a) : [...allergies, a] })

  const groups: { title: string; rows: Row[] }[] = [
    {
      title: 'วิถีการกิน',
      rows: DIET_OPTIONS.map((o) => ({
        id: o.key,
        label: o.label,
        hint: o.hint,
        on: prefs[o.key] === true,
        toggle: () => onChange({ ...prefs, [o.key]: !prefs[o.key] }),
      })),
    },
    {
      title: 'แพ้อาหาร',
      rows: ALLERGEN_OPTIONS.map((o) => ({
        id: o.value,
        label: o.label,
        hint: o.hint,
        on: allergies.includes(o.value),
        toggle: () => toggleAllergy(o.value),
      })),
    },
  ]

  return (
    <Coupon stock="sky" serial={`เหลือ ${available} จาน`} onBack={onDone}>
      <div className="intro">
        <h1 className="q-title q-title-flow" ref={titleRef} tabIndex={-1}>
          มีอะไรที่กินไม่ได้ไหม?
        </h1>
        <p className="lede">เลือกได้หลายข้อ เมนูที่มีของพวกนี้จะไม่โผล่มาเลย จำไว้ให้ในเครื่องนี้ด้วย</p>
      </div>

      {groups.map((g) => (
        <Fragment key={g.title}>
          <Perf />
          <fieldset className="pref-group">
            <legend className="group-title">{g.title}</legend>
            {g.rows.map((r, i) => (
              <Fragment key={r.id}>
                {i > 0 && <Perf />}
                <button type="button" className="stub stub-compact" aria-pressed={r.on} onClick={r.toggle}>
                  <span className="stub-text">
                    <span className="stub-label">{r.label}</span>
                    {r.hint && <span className="stub-hint">{r.hint}</span>}
                  </span>
                  {r.on && <Stamp>งด</Stamp>}
                </button>
              </Fragment>
            ))}
          </fieldset>
        </Fragment>
      ))}

      <Perf />
      <div className="pref-foot">
        <p className="fine-print">{DIET_DISCLAIMER}</p>
        <button type="button" className="btn btn-primary" onClick={onDone}>
          เสร็จแล้ว ไปเลือกมู๊ดกัน
        </button>
      </div>
    </Coupon>
  )
}
