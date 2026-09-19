import { ALLERGEN_OPTIONS } from '../data/questions'
import type { Allergen, History, Prefs } from '../engine/types'

const PREFS_KEY = 'mnf:prefs'
const HISTORY_KEY = 'mnf:history'

export const RECENT_MAX = 9 // จำเมนูที่เพิ่งแสดง 3 รอบล่าสุด
export const REJECTED_MAX = 20

// localStorage อาจไม่มี (โหมดส่วนตัว, ถูกบล็อก) หรือข้อมูลอาจเสีย: พังเงียบๆ แล้วใช้ค่าว่าง
function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // เก็บไม่ได้ก็ใช้งานต่อได้ แค่ไม่จำ
  }
}

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])

const ALLERGENS: string[] = ALLERGEN_OPTIONS.map((o) => o.value)

export function loadPrefs(): Prefs {
  const v = read(PREFS_KEY) as Record<string, unknown> | null
  if (!v || typeof v !== 'object') return {}
  return {
    halal: v.halal === true,
    vegan: v.vegan === true,
    allergies: strings(v.allergies).filter((a): a is Allergen => ALLERGENS.includes(a)),
  }
}

export const savePrefs = (prefs: Prefs) => write(PREFS_KEY, prefs)

export function loadHistory(): History {
  const v = read(HISTORY_KEY) as Record<string, unknown> | null
  return {
    recent: strings(v?.recent).slice(-RECENT_MAX),
    rejected: strings(v?.rejected).slice(-REJECTED_MAX),
  }
}

export const saveHistory = (history: History) => write(HISTORY_KEY, history)
