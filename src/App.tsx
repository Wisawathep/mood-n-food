import { useRef, useState } from 'react'
import { InkFilter } from './components/icons'
import { MENUS } from './data/menus'
import { dietSummary, QUESTIONS } from './data/questions'
import { isAllowed, recommend } from './engine/recommend'
import type { Answers, History, Prefs as PrefsValue, Recommendation } from './engine/types'
import { loadHistory, loadPrefs, RECENT_MAX, REJECTED_MAX, saveHistory, savePrefs } from './lib/storage'
import { Prefs } from './pages/Prefs'
import { Quiz } from './pages/Quiz'
import { Result } from './pages/Result'

// ตรายางกระแทกลง แล้วค่อยฉีกคูปองออก ก่อนเปลี่ยนไปใบถัดไป
const STAMP_MS = 380
const TEAR_MS = 300

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [picks, setPicks] = useState<Recommendation[] | null>(null)
  const [prefs, setPrefs] = useState<PrefsValue>(loadPrefs)
  const [editingPrefs, setEditingPrefs] = useState(false)
  const [history, setHistory] = useState<History>(loadHistory)
  const [roll, setRoll] = useState(1)
  const [leaving, setLeaving] = useState(false)
  // ตอนเปิดแอพครั้งแรกไม่ขโมยโฟกัส; หลังผู้ใช้กดไปมาแล้วค่อยย้ายโฟกัสตามคูปองใบใหม่
  const [navigated, setNavigated] = useState(false)
  const advancing = useRef(false)

  const diet = dietSummary(prefs)

  const remember = (h: History) => {
    setHistory(h)
    saveHistory(h)
  }

  // จำเมนูที่แสดงไว้ใน recent เพื่อไม่ให้รอบถัดไป (หรือครั้งหน้าที่เปิดแอพ) ได้ซ้ำ
  const finish = (a: Answers, h: History) => {
    const next = recommend(MENUS, a, prefs, h)
    setPicks(next)
    remember({ ...h, recent: [...(h.recent ?? []), ...next.map((r) => r.menu.id)].slice(-RECENT_MAX) })
    window.scrollTo({ top: 0 })
  }

  const answer = (value: Answers[keyof Answers]) => {
    if (advancing.current) return
    const next = { ...answers, [QUESTIONS[step].key]: value } as Answers
    setAnswers(next)
    setNavigated(true)
    advancing.current = true
    const advance = () => {
      advancing.current = false
      setLeaving(false)
      if (step < QUESTIONS.length - 1) setStep(step + 1)
      else finish(next, history)
    }
    if (prefersReducedMotion()) {
      setTimeout(advance, 120)
      return
    }
    setTimeout(() => {
      setLeaving(true)
      setTimeout(advance, TEAR_MS)
    }, STAMP_MS)
  }

  const random = () => {
    setAnswers({})
    finish({}, history)
  }

  const reroll = () => {
    if (!picks) return
    setRoll(roll + 1)
    finish(answers, { ...history, rejected: [...(history.rejected ?? []), picks[0].menu.id].slice(-REJECTED_MAX) })
  }

  const promote = (index: number) => {
    if (!picks) return
    const next = [...picks]
    ;[next[0], next[index]] = [next[index], next[0]]
    setPicks(next)
    scrollTop()
  }

  const restart = () => {
    setNavigated(true)
    setPicks(null)
    setAnswers({})
    setStep(0)
    setRoll(1)
  }

  const changePrefs = (p: PrefsValue) => {
    setPrefs(p)
    savePrefs(p)
  }

  const togglePrefs = (open: boolean) => {
    setNavigated(true)
    setEditingPrefs(open)
    window.scrollTo({ top: 0 })
  }

  let screen
  if (picks) {
    screen = (
      <Result
        picks={picks}
        mood={answers.mood}
        roll={roll}
        diet={diet}
        onReroll={reroll}
        onPromote={promote}
        onRestart={restart}
      />
    )
  } else if (editingPrefs) {
    screen = (
      <Prefs
        prefs={prefs}
        available={MENUS.filter((m) => isAllowed(m, prefs)).length}
        onChange={changePrefs}
        onDone={() => togglePrefs(false)}
      />
    )
  } else {
    screen = (
      <Quiz
        question={QUESTIONS[step]}
        step={step}
        total={QUESTIONS.length}
        selected={answers[QUESTIONS[step].key]}
        leaving={leaving}
        onAnswer={answer}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
        onRandom={random}
        diet={diet}
        onEditPrefs={() => togglePrefs(true)}
        focusTitle={navigated}
      />
    )
  }

  return (
    <main className="counter">
      <InkFilter />
      {screen}
    </main>
  )
}
